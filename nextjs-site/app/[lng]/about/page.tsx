import { I18nParamsType } from '../../../types/i18n';
import { useTranslation } from '../../i18n';
import { Chapters } from './chapters';

export default async function About({ params: { lng } }: I18nParamsType) {
  const { t: i18n } = await useTranslation(lng, 'common');

  const i18nArray = {
    'pages.about.first_chapter': i18n('This is the first chapter'),
    'pages.about.second_chapter': i18n('This is the second chapter'),
    'pages.about.third_chapter': i18n('This is the third chapter'),
  };

  return (
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
      <Chapters i18n={i18nArray} />
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
