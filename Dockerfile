# Use a lightweight Node.js base image for building the Angular app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build -- --output-path=dist

# Use the official NGINX base image
FROM nginx:stable-alpine

# Copy the NGINX configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080 for the application
EXPOSE 8080

# Use non-root user for running NGINX
USER nginx

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
