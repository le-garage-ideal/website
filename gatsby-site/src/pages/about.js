import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'gatsby-plugin-intl';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import aboutStyles from './about.module.scss';

const About = ({ location, intl }) => (
  <Layout uri={location.href}>
    <SEO
      uri={location.href}
      location={location.pathname}
      title={intl.formatMessage({ id: 'pages.about.meta.title' })}
      description={intl.formatMessage({ id: 'pages.about.meta.description' })}
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
      <p className={aboutStyles.sentence}>{ intl.formatMessage({ id: 'pages.about.first_chapter' })}</p>
      <p className={aboutStyles.sentence}>{ intl.formatMessage({ id: 'pages.about.second_chapter' })}</p>
      <p className={aboutStyles.sentence}>{ intl.formatMessage({ id: 'pages.about.third_chapter' })}</p>
      <p className={aboutStyles.sentence}>
        { intl.formatMessage({ id: 'pages.about.fourth_chapter' }) }
        <a href="mailto:contact@perfect-garage.org">contact@perfect-garage.org</a>
      </p>
    </section>
  </Layout>
);

About.propTypes = {
  location: PropTypes.string.isRequired,
  intl: PropTypes.func.isRequired,
};

export default injectIntl(About);
