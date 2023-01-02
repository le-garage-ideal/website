import React from 'react';

import { injectIntl } from 'gatsby-plugin-react-intl';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import aboutStyles from './about.module.scss';

const About = ({ location, intl }) => (
  <Layout uri={location.href}>
    <SEO
      uri={location.href}
      location={location.pathname}
      title={i18n['pages.about.meta.title']}
      description={i18n['pages.about.meta.description']}
    />
    <section
      className="paragraph"
      style={{
        minWidth: '300px',
        width: '70vw',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '50px',
        padding: '30px',
      }}
    >
      <p className={aboutStyles.sentence}>{ i18n['pages.about.first_chapter']}</p>
      <p className={aboutStyles.sentence}>{ i18n['pages.about.second_chapter']}</p>
      <p className={aboutStyles.sentence}>{ i18n['pages.about.third_chapter']}</p>
      <p className={aboutStyles.sentence}>
        { i18n['pages.about.fourth_chapter'] }
        <a href="mailto:contact@perfect-garage.org">contact@perfect-garage.org</a>
      </p>
    </section>
  </Layout>
);

About.propTypes = {
  location: string;
  intl: () => void;
};

export default injectIntl(About);
