import GraphqlService from 'app/services/GraphqlService';
import { Registry } from './registry';

export default function(registry: Registry) {
  const { logger, store } = registry;
  return new GraphqlService({ store, logger });
}
