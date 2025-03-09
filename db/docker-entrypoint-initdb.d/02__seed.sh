#!/bin/bash
set -e

echo "Starting data seeding..."

function traverse {
	local root file
	for root in "$@"; do
		for file in "$root"/*; do
			if [[ -d $file ]]; then
				traverse "$file"
			else
				echo "Processing seed file: $file"

				filename=$(basename -- "$file")
				filename_without_ext=${filename%.*}
				
				# Extract table name from filename (assuming format "number__table_name")
				IFS='__' read -r version table_name <<< "$filename_without_ext"

				# Remove leading underscore (if any) from the table name
				table_name=$(echo "$table_name" | sed 's/^_//')

				# Read JSON content from file
				json_content=$(cat "$file")
				
				psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "
				INSERT INTO $table_name OVERRIDING SYSTEM VALUE
				SELECT * FROM json_populate_recordset(NULL::$table_name, '$json_content')
				"
			fi
		done
	done
}

traverse /seed-data

echo "Initial data seeding completed."
