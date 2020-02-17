
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schemas from './graphql-schemas';
import resolvers from './graphql-resolvers';

import { Brand, Model, Car } from './mongodb.schema';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      return {
        models: {
          Car,
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(5000, () => {
  mongoose.connect('mongodb://uepch5uqblw5mad6k1x1:BN5Ufr4twpbJqZjdshDr@bmbu7ynqra11rqi-mongodb.services.clever-cloud.com:27017/bmbu7ynqra11rqi');
});

