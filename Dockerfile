# Set image from base on offical node lts
ARG VERSION=18-bullseye-slim
FROM node:$VERSION

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build app
RUN yarn build

# Expose the listening port
EXPOSE 3000

# Run yarn start script when container starts
CMD yarn start
