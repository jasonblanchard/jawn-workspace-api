import { MongoStore } from 'app/services/MongoService';
import { Application } from 'express';
import GraphqlService from 'app/services/GraphqlService';
import LoggerService from 'app/services/LoggerService';

export interface Registry {
    graphqlService: GraphqlService
    logger: LoggerService
    store: MongoStore
    server: Application
}
