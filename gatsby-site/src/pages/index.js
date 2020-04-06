import React from "react";
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import Layout from "../components/layout";
import './bulma-theme.scss';
import { schema } from '../constants';
import { SelectedCar } from '../components/car/selected-car';

export default ({location}) => {

    const uri = new Uri(location.href);

    // if edit=X parameter, save car to carX parameter
    const editParam = uri.getQueryParamValue('edit');
    const carParam = uri.getQueryParamValue('car');
    if (editParam && carParam) {
        uri.replaceQueryParam(`car${editParam}`, carParam);
    }
    uri.deleteQueryParam('edit');
    uri.deleteQueryParam('car');

    // take parameters as 1st choice for cars, else localStorage
    let car1Param = uri.getQueryParamValue('car1') || localStorage.getItem('car1') || "b46d3a43-b8c3-523d-baf8-8a2cd16f37e5";
    let car2Param = uri.getQueryParamValue('car2') || localStorage.getItem('car2') || "a852fd0d-79ee-5fab-8ea6-078751a00ae8";
    let car3Param = uri.getQueryParamValue('car3') || localStorage.getItem('car3') || "b77be811-c52e-5e41-a1ed-0572988503ac";
    
    // save to localStorage
    localStorage.setItem('car1', car1Param);
    localStorage.setItem('car2', car2Param);
    localStorage.setItem('car3', car3Param);

    uri.setPath(`/garage/${car1Param}/${car2Param}/${car3Param}`);
    window.location.href = uri.toString();
}
