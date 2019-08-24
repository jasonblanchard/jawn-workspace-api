import { createConnection } from 'app/services/MongoService';

export default function() {
  const dbURL = process.env.MONGO_USERNAME ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/jawn` : `mongodb://${process.env.MONGO_HOST}:27017/${process.env.DB_NAME}`;
  const db = createConnection(dbURL);

  // https://github.com/Automattic/mongoose/issues/5169#issuecomment-314983113
  db.on('error', err => {
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
      console.log(new Date(), String(err)); // eslint-disable-line no-console

      // Wait for a bit, then try to connect again
      setTimeout(() => {
        console.log('Retrying first connect...'); // eslint-disable-line no-console
        db.openUri(dbURL).catch(() => {});
        // Why the empty catch?
        // Well, errors thrown by db.open() will also be passed to .on('error'),
        // so we can handle them there, no need to log anything in the catch here.
        // But we still need this empty catch to avoid unhandled rejections.
      }, 20 * 1000);
    } else {
      // Some other error occurred.  Log it.
      console.error(new Date(), String(err)); // eslint-disable-line no-console
    }
  });

  db.once('open', () => {
    console.log('Connection to db established.'); // eslint-disable-line no-console
  });

  return db;
}
