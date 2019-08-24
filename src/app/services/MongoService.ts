import mongoose, { Connection } from 'mongoose';

export interface MongoStore extends Connection {}

export function createConnection(dbURL: string) {
    return mongoose.createConnection(dbURL);
}