# Dockerfile for Next.js Frontend

# 1. Base Image: Use the official Node.js image
FROM node:18-alpine AS base

# 2. Build Stage: Build the Next.js application
FROM base AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# 3. Production Stage: Create a minimal image for running the app
FROM base AS runner

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Set the NEXT_TELEMETRY_DISABLED environment variable
ENV NEXT_TELEMETRY_DISABLED 1

# Command to run the application
CMD ["node", "server.js"]
