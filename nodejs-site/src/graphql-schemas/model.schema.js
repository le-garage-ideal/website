import { gql } from 'apollo-server';

export default gql`
  type Model {
    id: ID!
    name: String!
    brand: Brand!
  }

  extend type Query {
    model(id: ID!): Model!
    models: [Model!]!
  }
`;