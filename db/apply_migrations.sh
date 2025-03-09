#!/bin/bash
set -e

echo "Starting migrations..."

# Ensure schema_migrations table exists with additional fields
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-'EOF'
	CREATE TABLE IF NOT EXISTS schema_migrations (
		migration VARCHAR(255) PRIMARY KEY,
		description TEXT NOT NULL,
		applied_by TEXT NOT NULL,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
EOF

# Get current user
APPLIED_BY=$(whoami)

# Process each SQL file in the migrations directory
for file in /migrations/*.sql; do
	migration_name=$(basename "$file")
	
	# Extract description (removing leading numbers and underscores)
	description=$(echo "$migration_name" | sed -E 's/^[0-9]+__//; s/.sql$//')

	# Check if migration has already been applied
	applied=$(psql -t -A --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "SELECT 1 FROM schema_migrations WHERE migration = '$migration_name'")

	if [ -z "$applied" ]; then
		echo "Applying migration: $migration_name"
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$file"
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "INSERT INTO schema_migrations (migration, description, applied_by) VALUES ('$migration_name', '$description', '$APPLIED_BY')"
	else
		echo "Migration $migration_name is already applied."
	fi
done

echo "All pending migrations have been applied successfully."
