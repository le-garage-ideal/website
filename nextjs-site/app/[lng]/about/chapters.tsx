"use client";
import aboutStyles from './about.module.scss';

export const Chapters = ({ i18n }: { i18n: { [s: string]: string } }) => {
  return (
    <>
      <div className={aboutStyles.sentence}>{ i18n['pages.about.first_chapter']}</div>
      <div className={aboutStyles.sentence}>{ i18n['pages.about.second_chapter']}</div>
      <div className={aboutStyles.sentence}>{ i18n['pages.about.third_chapter']}</div>
    </>
  );
};
