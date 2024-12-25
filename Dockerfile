# Use a lightweight Node.js base image for building the Angular app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install the Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

FROM nginx:stable-alpine

# Set permissions for NGINX configuration
RUN mkdir -p /tmp/nginx && chmod -R 777 /etc/nginx

# Copy the NGINX configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

# Use non-root user for running NGINX
USER nginx

# Run the Angular app using 'ng serve'
CMD ["ng", "serve", "--host", "0.0.0.0"]
