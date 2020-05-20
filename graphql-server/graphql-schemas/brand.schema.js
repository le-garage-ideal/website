import { gql } from 'apollo-server';

export default gql`
  type Brand {
    id: ID!
    name: String!
  }

  extend type Query {
    brand(id: ID!): Brand!
    brands: [Brand!]!
  }
`;