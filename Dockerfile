###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development
# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV DEVELOPMENT
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn

# Bundle app source
COPY --chown=node:node . .

# Use the backend user from the image (instead of the root user)
USER backend

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=backend:backend package*.json ./

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=backend:backend --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=backend:backend . .

# Set NODE_ENV environment variable
ENV NODE_ENV production
# Run the build command which creates the production bundle
# This ensures that the node_modules directory is as optimized as possible.
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline
USER backend

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --chown=backend:backend --from=build /usr/src/app/package.json ./package.json
COPY --chown=backend:backend --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=backend:backend --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD ["yarn" ,"start:prod"] 