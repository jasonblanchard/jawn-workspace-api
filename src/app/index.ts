import bootstrap from 'app/bootstrap';
import environment from 'dotenv';

environment.config();

const LOG_TAG = 'entrypoint';

const registry = bootstrap();
const { logger, server } = registry;

logger.debug('>>> STARTING <<<', LOG_TAG);

const port = process.env.PORT || 8081;
server.listen(port, () => {
  logger.debug(`running on port ${port}`, LOG_TAG);
});
