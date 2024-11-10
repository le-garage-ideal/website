import { I18nParamsType } from '../../../types/i18n';
import { useTranslation } from '../../i18n';
import aboutStyles from './about.module.scss';

export default async function About({ params }: I18nParamsType) {
  const { lng } = await params;
  const { t: i18n } = await useTranslation(lng, 'common');

  return (
    <section
      className={aboutStyles.paragraph}
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
  );
}

// SEO metadata
export async function generateMetadata() {
  // const title = i18n?.t('pages.about.meta.title');
  // const description = i18n?.t('pages.about.meta.description');
  return {
    title: 'toto',
    description: 'tata',
  }
}
