import { useTranslation} from 'next-export-i18n';
import { FullLayout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import aboutStyles from './about.module.scss';
import { useLocation } from '../app/hooks/useLocation';
export const carLabels = (file: any, index: any): any => file[`label_${index}`];
const About = () => {
  const location = useLocation();
  const { t: i18n } = useTranslation();
  const title = i18n('pages.about.meta.title');
  return (
    <FullLayout uri={location} title={title}>
      <SEO
        uri={location}
        title={title}
        description={i18n('pages.about.meta.description')}
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
        <p className={aboutStyles.sentence}>{ i18n('pages.about.first_chapter')}</p>
        <p className={aboutStyles.sentence}>{ i18n('pages.about.second_chapter')}</p>
        <p className={aboutStyles.sentence}>{ i18n('pages.about.third_chapter')}</p>
        <p className={aboutStyles.sentence}>
          { i18n('pages.about.fourth_chapter') }
          <a href="mailto:contact@perfect-garage.org">contact@perfect-garage.org</a>
        </p>
      </section>
    </FullLayout>
  );
};

export default About;
