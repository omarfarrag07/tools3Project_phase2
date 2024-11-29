# Step 1: Use the official PostgreSQL image as a base image
FROM postgres:13-alpine

# Step 2: Set environment variables for database creation
ENV POSTGRES_USER=omar
ENV POSTGRES_PASSWORD=12345678
ENV POSTGRES_DB=app_base

# Step 3: Optionally copy custom initialization scripts
# This will copy any SQL scripts into the /docker-entrypoint-initdb.d folder.
# If you have custom initialization scripts, place them in the 'init' directory
# in your project folder and copy them into the container.

# COPY ./db/init /docker-entrypoint-initdb.d/

# Step 4: Expose the database port
EXPOSE 5432
