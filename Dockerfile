FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV DATABASE_URL=/app/data/atlas.db

# Start the application
CMD ["node", ".output/server/index.mjs"]
