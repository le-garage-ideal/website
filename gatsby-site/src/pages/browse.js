import React from "react";
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import './bulma-theme.scss';
import { schema } from '../constants';
import { Layout } from "../components/layout";
import { SEO } from "../components/seo/seo";
import Brands from "../components/brands";

export default ({data, location}) => {
    console.log(data[schema + 'Brands'].edges[0]);
    const uri = new Uri(location.href);
    return (
        <Layout>
            <SEO location={location.pathname} title="Marques" description="Sélectionnez une marque de voiture" />
            <Brands data={data[schema + 'Brands'].edges}
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
