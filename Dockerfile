# BookWork Frontend Production Docker Image
# Production-ready SvelteKit application with Node.js adapter
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files and install them
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the SvelteKit app for production using adapter-node
RUN npm run build

# Stage 2: Create the final, minimal production image
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sveltekit -u 1001

# Copy built application
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=builder --chown=sveltekit:nodejs /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules


# Switch to non-root user
USER sveltekit

# Expose the port the app runs on
EXPOSE 80

# Environment variable for the Node server
ENV NODE_ENV=production
ENV VITE_ENABLE_MOCK_DATA=true
ENV PORT=80

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Command to start the application using adapter-node
CMD ["node", "build/index.js"]