FROM node:8

# Add app with cached layer for node_modules
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /home/node/app
RUN cp -a /tmp/node_modules /home/node/app

ENV npm_config_unsafe_perm true

ADD . /home/node/app

RUN cd /home/node/app && npm run build-all-production

HEALTHCHECK --interval=15s --timeout=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 8081
WORKDIR /home/node/app
ENV NODE_ENV production
ENV NODE_PATH /home/node/app/build
# TODO remove
ENV APP_SECRET xxxyyyzzz
CMD ["npm", "start"]
