#!/bin/bash

# Step 1: Stop any running containers
echo "Stopping any running containers..."
docker compose down

# Step 2: Build the containers
echo "Building Docker containers..."
docker compose build

# Step 3: Start the containers
echo "Starting Docker containers..."
docker compose up --build -d

# Step 4: Check container statuses
echo "Checking container statuses..."
docker ps

# Step 5: Check container statuses
echo "Checking container statuses..."
docker ps


# Step 5: Check all containers statuses 
echo "Checking all container statuses..."
docker ps -a

# Step 6: Logs 
echo "Displaying logs for all containers..."
docker compose logs -f
