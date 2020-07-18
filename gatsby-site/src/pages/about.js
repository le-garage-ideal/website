import React from 'react';
import Layout from '../components/layout';

const About = () => {
    return (
        <Layout>
            <section className="paragraph"
                style={{minWidth: '300px', width: '70vw', display: 'flex', flexDirection: 'column', alignItems: 'center',
                alignSelf: 'center', margin: 'auto', padding: '30px' }}>
            <p>
                Ce site vous permet de créer votre garage idéal en choisissant vos 3 voitures de sport préférées,<br />
                et pouvoir les partager sur les réseaux sociaux.<br />
                Seulement 3 voitures car comme beaucoup de chose, c'est avec des contraintes que les choses deviennent intéressantes! 
            </p>
            <p>
                J'ai créé ce site car je suis passionné de sport automobile.<br />
                Il n'y aura jamais aucune pub, aucune source de profit liée à ce site.<br />
                Si vous aimez aussi, n'hésitez pas à le faire connaitre.<br />
                Si vous avez des suggestions, vous pouvez me contacter par mail : <a href="mailto:contact@perfect-garage.org">contact@perfect-garage.org</a><br />
            </p>
            <p style={{fontSize: 'small', fontStyle: 'italic', marginTop: '50px'}}>
                Mentions obligatoires : site hébergé par o2switch.com. Aucun cookie ni aucune donnée personnelle ne sont utilisés.
            </p>
            </section>
        </Layout>
    );
};

export default About;
