import React from "react";
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import Brands from "../components/brands";
import Layout from "../components/layout";
import SEO from "../components/seo/seo";
import './bulma-theme.scss';
import { schema } from '../constants';

export default ({pageResources, location}) => {
    const uri = new Uri(location.href);
    return (
        <Layout>
            <SEO title="Marques" description="Sélectionnez une marque de voiture" />
            <Brands data={pageResources.json.data[schema + 'Brands'].edges}
                onBrandSelect={brandName => {
                    uri.setPath(`/models/${brandName}`);
                    window.location.href = uri.toString();
                }} />
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
