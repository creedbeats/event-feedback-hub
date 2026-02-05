FROM node:22-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0

# Start development server
CMD ["npm", "run", "dev"]
