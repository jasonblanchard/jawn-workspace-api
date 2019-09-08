const environment = require('dotenv');
const gralphql = require('graphql-request');
const jwt = require('jsonwebtoken');

environment.config();

const baseUrl = `${process.env.SERVICE_BASE_URL}/graphql`;

const token = jwt.sign({ uesrUuid: 'abc-123' }, process.env.JWT_SECRET);

const client = new gralphql.GraphQLClient(baseUrl, {
  headers: {
    authorization: `Bearer ${token}`,
  },
});

describe('app', () => {
  it('creates entries', async () => {
    const query = `
      mutation createEntry($input: EntryInput) {
        entry: createEntry(input: $input) {
          id
          text
          timeUpdated
          timeCreated
        }
      }
    `;

    const variables = {
      input: {
        text: 'This is a test',
      },
    };

    const response = await client.request(query, variables);
    expect(response.entry.text).toEqual('This is a test');
    expect(response.entry.id).toMatch(/.+/);
    expect(response.entry.timeCreated).toMatch(/.+/);
  });

  it('updates entries', async () => {
    const createQuery = `
      mutation createEntry($input: EntryInput) {
        entry: createEntry(input: $input) {
          id
          text
          timeUpdated
          timeCreated
        }
      }
    `;

    const variables = {
      input: {
        text: 'This is a test',
      },
    };

    const { entry } = await client.request(createQuery, variables);
    expect(entry.text).toEqual('This is a test');

    const updateQuery = `
      mutation updateEntry($id: ID!, $input: EntryInput){
        entry: updateEntry(id: $id, input: $input) {
          id
          text
          timeUpdated
        }
      }
    `;

    const updateVariables = {
      id: entry.id,
      input: {
        text: 'updated',
      },
    };

    const { entry: updatedEntry } = await await client.request(updateQuery, updateVariables);
    expect(updatedEntry.text).toEqual('updated');
    expect(updatedEntry.timeUpdated).toMatch(/.+/);
  });

  it('lists entries', async () => {
    const createQuery = `
      mutation createEntry($input: EntryInput) {
        entry: createEntry(input: $input) {
          id
          text
          timeUpdated
          timeCreated
        }
      }
    `;

    const variables = {
      input: {
        text: 'This is a test',
      },
    };

    const { entry } = await client.request(createQuery, variables);

    const getQuery = `{
      entries {
        id
        text
        timeCreated
        timeUpdated
      }
    }`;

    const { entries } = await client.request(getQuery);
    const returnedEntry = entries.find(e => e.id === entry.id);
    expect(returnedEntry.id).toEqual(entry.id);
  });

  describe('lists entries constrained by since', () => {
    it('when since is in the past', async () => {
      const createQuery = `
        mutation createEntry($input: EntryInput) {
          entry: createEntry(input: $input) {
            id
            text
            timeUpdated
            timeCreated
          }
        }
      `;

      const variables = {
        input: {
          text: 'This is a test',
        },
      };

      const { entry } = await client.request(createQuery, variables);

      const getQuery = `
        query workspacePageQuery($since: String!) {
          entries(since: $since) {
            id
            text
            timeCreated
            timeUpdated
          }
        }
      `;

      const getVariables = {
        since: '2018-01-01T05:00:00.000Z',
      };

      const { entries } = await client.request(getQuery, getVariables);
      const returnedEntry = entries.find(e => e.id === entry.id);
      expect(returnedEntry.id).toEqual(entry.id);
    });

    it('when since is in the future', async () => {
      const createQuery = `
        mutation createEntry($input: EntryInput) {
          entry: createEntry(input: $input) {
            id
            text
            timeUpdated
            timeCreated
          }
        }
      `;

      const variables = {
        input: {
          text: 'This is a test',
        },
      };

      await client.request(createQuery, variables);

      const getQuery = `
        query workspacePageQuery($since: String!) {
          entries(since: $since) {
            id
            text
            timeCreated
            timeUpdated
          }
        }
      `;

      const getVariables = {
        since: '2999-01-01T05:00:00.000Z',
      };

      const { entries } = await client.request(getQuery, getVariables);
      expect(entries.length).toEqual(0);
    });
  });

  it('deletes entries', async () => {
    const createQuery = `
      mutation createEntry($input: EntryInput) {
        entry: createEntry(input: $input) {
          id
          text
          timeUpdated
          timeCreated
        }
      }
    `;

    const variables = {
      input: {
        text: 'This is a test',
      },
    };

    const { entry } = await client.request(createQuery, variables);

    const deleteQuery = `
      mutation deleteEntry($id: ID!) {
        entry: deleteEntry(id: $id) {
          id
        }
      }
    `;

    const deleteVariables = {
      id: entry.id,
    };

    const { entry: deletedEntry } = await client.request(deleteQuery, deleteVariables);
    expect(deletedEntry.id).toEqual(entry.id);
  });
});
