FROM node:8.16.0-jessie AS base

ENV APP_HOME /usr/src/app/
ENV PROD_DEPS /usr/src/deps/prod/
RUN useradd -ms /bin/bash docker

FROM base AS build

USER docker

COPY --chown=docker:docker package.json package-lock.json $PROD_DEPS
WORKDIR $PROD_DEPS
RUN npm ci --production

COPY --chown=docker:docker package.json package-lock.json $APP_HOME
WORKDIR $APP_HOME
RUN npm ci

COPY --chown=docker:docker src $APP_HOME/src/
COPY --chown=docker:docker tsconfig.json $APP_HOME
RUN npm run build:production

FROM build as test

USER docker

COPY --chown=docker:docker tests $APP_HOME/tests
COPY --chown=docker:docker jest.config.js $APP_HOME

WORKDIR $APP_HOME

FROM base as release

USER docker

ENV NODE_PATH $APP_HOME/build

COPY --from=build --chown=docker:docker $PROD_DEPS/node_modules $APP_HOME/node_modules/
COPY --from=build --chown=docker:docker $APP_HOME/build $APP_HOME/build
COPY --from=build --chown=docker:docker $APP_HOME/package.json $APP_HOME/package.json

WORKDIR $APP_HOME

CMD ["npm", "start", "--production"]

# # Add app with cached layer for node_modules
# ADD package.json /tmp/package.json
# ADD package-lock.json /tmp/package-lock.json
# RUN cd /tmp && npm install
# RUN mkdir -p /home/node/app
# RUN cp -a /tmp/node_modules /home/node/app

# ENV npm_config_unsafe_perm true

# ADD . /home/node/app

# RUN cd /home/node/app && npm run build-all-production

# HEALTHCHECK --interval=15s --timeout=10s --retries=3 \
#   CMD curl -f http://localhost/health || exit 1

# EXPOSE 8081
# WORKDIR /home/node/app
# ENV NODE_ENV production
# ENV NODE_PATH /home/node/app/build
# # TODO remove
# ENV APP_SECRET xxxyyyzzz
# CMD ["npm", "start"]
