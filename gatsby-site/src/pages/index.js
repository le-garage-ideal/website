import Uri from 'jsuri';
import './bulma-theme.scss';

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
    let car1Param = uri.getQueryParamValue('car1') || localStorage.getItem('car1') || "5e4c011c1050a45c707d9c11";
    let car2Param = uri.getQueryParamValue('car2') || localStorage.getItem('car2') || "5e4c011c1050a45c707d9c45";
    let car3Param = uri.getQueryParamValue('car3') || localStorage.getItem('car3') || "5e4c011c1050a45c707d9d0b";
    
    // save to localStorage
    localStorage.setItem('car1', car1Param);
    localStorage.setItem('car2', car2Param);
    localStorage.setItem('car3', car3Param);

    uri.setPath(`/garage`);
    uri.addQueryParam('car1', car1Param);
    uri.addQueryParam('car2', car2Param);
    uri.addQueryParam('car3', car3Param);
    window.location.href = uri.toString();
}
