import Uri from 'jsuri';
import React from 'react';
import Layout from "../components/layout";
import SEO from "../components/seo/seo";
import { Title } from "../components/title/title";
import { motion } from 'framer-motion';
import './bulma-theme.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import indexStyles from './index.module.scss';
import { carLabels } from "../constants";

export default class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = { uri: this.props.location.href, car1: null, car2: null, car3: null, isTitleVisible: false };
    }

    componentDidMount() {
    
        const uri = new Uri(this.state.uri);

        // if edit=X parameter, save car to carX parameter
        const editParam = uri.getQueryParamValue('edit');
        const carParam = uri.getQueryParamValue('car');
        if (editParam && carParam) {
            uri.replaceQueryParam(`car${editParam}`, carParam);
            localStorage.setItem(`car${editParam}`, carParam);
        }
        uri.deleteQueryParam('edit');
        uri.deleteQueryParam('car');

        // add missing params + save state
        const newState = {...this.state};
        for (let i = 1; i <= 3; i++) {
            if (!uri.getQueryParamValue(`car${i}`)) {
                uri.addQueryParam(`car${i}`, localStorage.getItem(`car${i}`));
            }
            newState[`car${i}`] = uri.getQueryParamValue(`car${i}`);
        }
        newState.uri = uri.toString();
        this.setState(newState);

        setTimeout(() => {
            this.setState({ isTitleVisible: true });
          }, 1000);
    }


    render() {

        const editCar = index => {
            const uri = new Uri(this.state.uri);
            uri.setPath('/browse');
            uri.addQueryParam('edit', index);
            window.location.href = uri.toString();
        };

        const transform = (carUrl, index) => {
            const classCar = [indexStyles.car];
            if (index === 2) {
                classCar.push(indexStyles.car2);
            }
            if (carUrl) {
                classCar.push(indexStyles.withCar);
            } else {
                classCar.push(indexStyles.noCar);
            }
            const id = `frame-${index}`;
            const title = carLabels[index-1];
            const thumbnail = carUrl ? (
                <motion.iframe id={id} title={title} className={indexStyles.iframe} src={`/car/${carUrl}`}
                        initial="hidden" animate="visible" 
                        variants={{ hidden: { scale: 0.1 }, visible: { scale: 1 }}}
                        transition={{ duration: 3}}>
                </motion.iframe>
            ) : (
                <div className={indexStyles.noCarThumbnail}>?</div>
            );
            return (
                <div className={classCar.join(' ')}>
                    <div className={indexStyles.iconButtonContainer}>
                        <button className={indexStyles.iconButton + " icon-button"} onClick={() => editCar(index)}>
                            <FontAwesomeIcon icon="edit" />
                        </button>
                    </div>                    
                    {thumbnail}
                    <div className={[indexStyles.carLabelContainer, 'container', 'is-full'].join(' ')}>
                        <span className={[indexStyles.carLabel, 'badge'].join(' ')}>{ title }</span>
                    </div>                    
                </div>
            );

        };

        const car1 = transform(this.state.car1, 1);
        const car2 = transform(this.state.car2, 2);
        const car3 = transform(this.state.car3, 3);

        return (
            <Layout location={this.props.location.href}>
                <SEO location={this.props.location.pathname} title="Accueil" description="Créez et partagez votre garage idéal en 3 voitures de sport" />
                <Title />
                <article className={indexStyles.carsContainer}>
                    {car1} {car2} {car3}
                </article>
            </Layout>
        );
    }
}
