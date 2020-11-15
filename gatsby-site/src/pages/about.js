import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import aboutStyles from './about.module.scss';

const About = ({ location }) => (
  <Layout uri={location.href}>
    <SEO location={location.pathname} title="A propos" description="A propos du site" />
    <section
      className="paragraph"
      style={{
        minWidth: '300px',
        width: '70vw',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        margin: 'auto',
        padding: '30px',
      }}
    >
      <p className={aboutStyles.sentence}>
        Ce site vous permet de créer votre garage idéal en choisissant vos 3 voitures de sport préférées
        et de les partager sur les réseaux sociaux.
      </p>
      <p className={aboutStyles.sentence}>
        Pourquoi seulement trois ? Comme dans la vraie vie, pour se contraindre à choisir...
      </p>
      <p className={aboutStyles.sentence}>
        J&apos;ai créé ce site car je suis passionné de sport automobile.
        Il n&apos;y aura jamais aucune pub, aucune source de profit liée à ce site.
        Si vous l&apos;aimez, n&apos;hésitez pas à le faire connaître!
      </p>
      <p className={aboutStyles.sentence}>
        Enfin, si vous avez des suggestions, vous pouvez me contacter par mail :
        <a href="mailto:contact@perfect-garage.org">contact@perfect-garage.org</a>
      </p>
    </section>
  </Layout>
);

About.propTypes = {
  location: PropTypes.string.isRequired,
};

export default About;
