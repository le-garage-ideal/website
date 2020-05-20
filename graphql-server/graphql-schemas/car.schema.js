import { gql } from 'apollo-server';

export default gql`
  type Car {
    id: ID!
    variant: String!
    power: Int!
    officialWeight: Int!
    weight: Int!
    options: String!
    startDate: String!
    model: Model!
  }

  extend type Query {
    car(id: ID!): Car!
    cars: [Car!]!
  }
`;