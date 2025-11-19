# Use Node 16+ as specified in challenge requirements
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the development server
# Note: webpack-dev-server needs host 0.0.0.0 to be accessible from outside the container
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
