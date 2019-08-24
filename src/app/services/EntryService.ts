import EntryConnector, { EntryEntityInputParams, ListByUserInputParams } from 'app/services/EntryConnector'

// TODO: Error handling.
export default class EntryService {
  private connector: EntryConnector;

  constructor({ connector }: { connector: EntryConnector }) {
    this.connector = connector;
  }

  listByUser(userId: string, options?: ListByUserInputParams) {
    return this.connector.listByUser(userId, options);
  }

  create(params: EntryEntityInputParams, userId: string) {
    return this.connector.create(params, userId);
  }

  update(id: string, params: EntryEntityInputParams, userId:string) {
    return this.connector.update(id, params, userId);
  }

  delete(id:string, userId:string) {
    return this.connector.delete(id, userId);
  }
}
