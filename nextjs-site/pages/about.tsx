import { useContext } from 'react';

import { Layout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import aboutStyles from './about.module.scss';
import { useRouter } from 'next/router';
import { useLocation } from '../app/hooks/useLocation';
import { I18nContext } from '../functions/i18n';

type AboutProps = {
  i18n: any;
};
const About = ({ i18n }: AboutProps) => {
  const location = useLocation();
  const title = i18n['pages.about.meta.title'];
  return (
    <I18nContext.Provider value={ i18n }>
      <Layout uri={location} title={title}>
        <SEO
          uri={location}
          title={title}
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
    </I18nContext.Provider>
  );
};

export default About;
