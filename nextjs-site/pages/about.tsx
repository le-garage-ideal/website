import { useTranslation} from 'next-i18next';
import { FullLayout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import aboutStyles from './about.module.scss';
import { useLocation } from '../app/hooks/useLocation';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const About = () => {
  const {location} = useLocation();
  const { t: i18n } = useTranslation();
  const title = i18n('pages.about.meta.title');
  return (
    <FullLayout uri={location}>
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
        <div className={aboutStyles.sentence}>{ i18n('pages.about.first_chapter')}</div>
        <div className={aboutStyles.sentence}>{ i18n('pages.about.second_chapter')}</div>
        <div className={aboutStyles.sentence}>{ i18n('pages.about.third_chapter')}</div>
      </section>
    </FullLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  }
}

export default About;
