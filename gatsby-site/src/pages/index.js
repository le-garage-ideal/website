import React from "react";
import { graphql } from 'gatsby';
import Brands from "../components/brands";
import Layout from "../components/layout";
import './bulma-theme.scss';
import { schema } from '../constants';

export default (data) => {

    return (
        <Layout>
            <Brands data={data.pageResources.json.data[schema + 'Brands'].edges}
                onBrandSelect={brandName => window.location = '/models/' + brandName} />
        </Layout>
    );
};

export const query = graphql`query {
    allMongodbBmbu7Ynqra11RqiBrands {
        edges {
            node {
                name,
                image
            }
        }
    }
}`;
