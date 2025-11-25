#!/bin/bash
set -e

# Create the database and user if they don't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Grant all privileges to the user for auth_service
    GRANT ALL PRIVILEGES ON DATABASE auth_service TO taskly_user;
    
    -- Create task_service_db if it doesn't exist and grant privileges
    CREATE DATABASE task_service_db;
    GRANT ALL PRIVILEGES ON DATABASE task_service_db TO taskly_user;
    
    -- Ensure the user can create tables
    ALTER USER taskly_user CREATEDB;
EOSQL

echo "Database initialization completed."