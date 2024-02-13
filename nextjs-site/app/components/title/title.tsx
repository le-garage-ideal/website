import { motion } from 'framer-motion';
import titleStyles from './title.module.scss';

export const Title = ({ i18n }: { i18n: { [s: string]: string } }) => {
  const titleAnimation = {
    backgroundImage: [
      'linear-gradient(to right, #EEE, #666, #444)',
      'linear-gradient(to right, #666, #EEE, #666)',
      'linear-gradient(to right, #666, #666, #EEE)',
      'linear-gradient(to right, #CCC, #EEE, #CCC)',
    ],
  };

  const titleTransition = {
    duration: 1,
    ease: 'easeInOut',
  };

  return (
    <div className={[titleStyles.titleContainer, 'badge'].join(' ')}>
      <h1 className={[titleStyles.title].join(' ')}>
        <motion.div
          className={titleStyles.chromeText}
          animate={titleAnimation}
          transition={titleTransition}
        >
          { i18n['components.title.title'] }
        </motion.div>
      </h1>
      <h4 className={titleStyles.subTitle}>{ i18n['components.title.subtitle'] }</h4>
    </div>
  );
};
