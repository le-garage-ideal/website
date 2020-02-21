import React, { useState } from "react";
import { graphql } from 'gatsby';
import Brand from "../components/brand/brand";
import Layout from "../components/layout";
import './bulma-theme.scss';

export const schema = 'allMongodbBmbu7Ynqra11Rqi';

export default (data) => {

    const [selectedBrand, setSelectedBrand] = useState(null);

    const brandNodes = data.pageResources.json.data[schema + 'Brands'].edges;
    const brandComponents = brandNodes.map(({ node: brand }) => {
        return (
            <Brand key={brand.id}
                id={brand.id}
                name={brand.name}
                image={brand.image}
                onClick={() => setSelectedBrand(brand)}
                selected={selectedBrand && selectedBrand.id === brand.id}>
            </Brand>
        )
    });



    return (
        <Layout>
            <ul className="brand-content">
                <div className="field">
                    <p className="control has-text-dark has-icons-right">
                        <input className="input" type="text" />
                        <span className="icon is-right">
                            <i className="fas fa-filter"></i>
                        </span>
                    </p>
                </div>
                {brandComponents}
            </ul>
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
