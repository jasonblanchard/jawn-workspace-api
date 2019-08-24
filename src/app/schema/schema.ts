import { makeExecutableSchema } from 'graphql-tools';

import EntryService from 'app/services/EntryService';
import { EntryEntityInputParams } from 'app/services/EntryConnector';

const typeDefs = `
  type Entry {
    id: ID!,
    text: String!
    timeCreated: String!
    timeUpdated: String
  }

  input EntryInput {
    text: String!
  }

  type Query {
    entries(since: String, before: String): [Entry]
  }

  type Mutation {
    updateEntry(id: ID!, input: EntryInput): Entry
    createEntry(input: EntryInput): Entry
    deleteEntry(id: ID!): Entry
  }
`;

interface ParentParams {
  userId: string
}

interface Context {
  userId: string
  services: {
    entryService: EntryService
  }
}

const resolvers = {
  Query: {
    entries: (_parent: ParentParams, args: { since: string, before: string }, context: Context) => {
      const { since, before } = args;
      return context.services.entryService.listByUser(context.userId, { since, before });
    }
  },
  Mutation: {
    updateEntry: (_parent: ParentParams, args: { id: string, input: EntryEntityInputParams }, context: Context) => {
      return context.services.entryService.update(args.id, args.input, context.userId);
    },
    createEntry: (_parent: ParentParams, args: { input: EntryEntityInputParams }, context: Context) => {
      return context.services.entryService.create(args.input, context.userId);
    },
    deleteEntry: (_parent: ParentParams, args: { id: string }, context: Context) => {
      return context.services.entryService.delete(args.id, context.userId);
    },
  },
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
