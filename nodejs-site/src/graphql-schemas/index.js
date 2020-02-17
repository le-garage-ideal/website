import carSchema from './car.schema';
import modelSchema from './model.schema';
import brandSchema from './brand.schema';
import { gql } from 'apollo-server';

const linkSchema = gql`
  type Query {
    _: Boolean
  }
`;

export default [linkSchema, carSchema, modelSchema, brandSchema];