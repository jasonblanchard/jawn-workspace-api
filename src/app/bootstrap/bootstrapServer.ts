import { graphqlExpress } from 'apollo-server-express';
import { Registry } from 'app/bootstrap/registry';
import bodyParser from 'body-parser';
import Boom from 'boom';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import expressJwt from 'express-jwt';
import morgan from 'morgan';
import path from 'path';
import TokenUtils from 'app/utils/TokenUtils';

const LOG_TAG = 'app';
const BUILD_PATH = '../../../client/build';
const NODE_ENV = process.env.NODE_ENV || 'development';

export default function(registry: Registry) {
  const jwtSecret = process.env.JWT_SECRET; // TODO: Bootstrap this separately
  const {
    graphqlService,
    logger
  } = registry;

  logger.debug('\n>>> BOOTSTRAPPING APP <<<<\n', LOG_TAG);

  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use('/static', express.static(path.join(__dirname, BUILD_PATH + '/static')));
  app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(expressJwt({
    secret: jwtSecret || '',
    requestProperty: 'accessTokenPayload',
    getToken: request => {
      return TokenUtils.parseAuthorizationHeader(request.headers.authorization);
    },
    credentialsRequired: true,
  }).unless({
    path: ['/health'],
  }));

  app.get('/health', (_request, response) => {
    return response.json({ ok: true });
  });

  app.use('/graphql', graphqlExpress((request: Request) => graphqlService.handleRequest(request)));

  app.use('/*', (_request, _response, next) => {
    next(Boom.notFound());
  });

  app.use((error: Boom, _request: Request, response: Response, _next: any) => {
    if (error.name === 'UnauthorizedError') {
      error = Boom.unauthorized();
    }
    error = error.isBoom ? error : Boom.boomify(error);
    error.reformat();
    logger.error({ error, stack: error.stack }, LOG_TAG);
    const output = error.output;
    return response.status(output.statusCode).set(output.headers).json(output.payload);
  });

  return app;
}
