import express from "express";
import { MongoStore } from 'app/services/MongoService';
import EntryService from 'app/services/EntryService';
import EntryConnector from 'app/services/EntryConnector';
import LoggerService from 'app/services/LoggerService';
import schema from 'app/schema/schema';

export default class GraphqlService {
  private store: MongoStore;
  private logger: LoggerService;

  constructor({ store, logger }: { store: MongoStore, logger: LoggerService}) {
    this.store = store;
    this.logger = logger;
  }

  handleRequest = (request: express.Request) => {
    const entryService = new EntryService({
      connector: new EntryConnector({ store: this.store, logger: this.logger }),
    });

    return {
      schema,
      context: {
        userId: request.accessTokenPayload && request.accessTokenPayload.uesrUuid,
        services: {
          entryService,
        },
      },
    };
  }
}
