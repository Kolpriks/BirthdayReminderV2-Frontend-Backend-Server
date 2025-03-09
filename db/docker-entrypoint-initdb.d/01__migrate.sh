#!/bin/bash
set -e

echo "Starting migration process..."

# Create schema_migrations table if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-'EOF'
	CREATE TABLE IF NOT EXISTS schema_migrations (
		migration VARCHAR(255) PRIMARY KEY,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		description TEXT NOT NULL,
		applied_by TEXT NOT NULL
	);
EOF

# Process each SQL file in the migrations folder (sorted by name)
for file in /migrations/*.sql; do
  	migration_name=$(basename "$file")
  
  	# Extract description: remove first 3 digits, first "__", and ".sql"
  	description=$(echo "$migration_name" | sed -E 's/^[0-9]{3}__//; s/\.sql$//')

  	applied_by="$POSTGRES_USER"  # Use the correct database user
  
  	# Check if the migration has already been applied
  	applied=$(psql -t -A --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
    	-c "SELECT 1 FROM schema_migrations WHERE migration = '$migration_name'")
  
	if [ -z "$applied" ]; then
		echo "Applying migration: $migration_name"
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$file"
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
		-c "INSERT INTO schema_migrations (migration, description, applied_by) VALUES ('$migration_name', '$description', '$applied_by')"
	else
		echo "Migration $migration_name is already applied."
	fi
done

echo "Migration process completed successfully."
