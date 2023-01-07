import React, { useContext } from 'react';
import Uri from 'jsuri';
import { useTranslation} from 'next-export-i18n';
import specStyles from './spec.module.scss';
const POWER_MAX = 1200; // max 1200hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 20; // max 1kg/hp else overflow

type SpecProps = {
  power?: number;
  weight?: number;
  officialWeight?: number;
  imageUrl?: string;
};
const Spec = ({
  power, weight, officialWeight, imageUrl
}: SpecProps) => {
  const { t: i18n } = useTranslation();

  const theWeight = weight || officialWeight;

  const theWeightLabel = weight
    ? i18n('components.spec.observed_weight')
    : i18n('components.spec.official_weight');

  const ratio = theWeight && power ? Math.round((theWeight * 10) / power) / 10 : undefined;

  const barPowerStyle = power ? {
    width: `${(power * 100) / POWER_MAX}%`,
  } : undefined;

  const barWeightStyle = theWeight ? {
    width: `${(theWeight * 100) / WEIGHT_MAX}%`,
  } : undefined;

  const barRatioStyle = ratio ? {
    width: `${(ratio * 100) / RATIO_MAX}%`,
  } : undefined;

  const imageUri = new Uri(imageUrl);
  const imageOrigin = imageUri?.host;

  const powerUnit = i18n('components.spec.hp');

  return (
      <section className={specStyles.specContainer}>
        <div className={specStyles.barTitle}>
          <legend>{ i18n('components.spec.power') }</legend>
          <span>
            <span>{power}</span>
            { powerUnit }
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barPower].join(' ')} style={barPowerStyle} />
        <div className={specStyles.barTitle}>
          <legend>{ theWeightLabel}</legend>
          <span>
            <span>{theWeight}</span>
            kg
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barWeight].join(' ')} style={barWeightStyle} />
        <div className={specStyles.barTitle}>
          <legend>{ i18n('components.spec.ratio') }</legend>
          <span>
            <span>{ratio}</span>
            { `kg/${powerUnit}` }
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barRatio].join(' ')} style={barRatioStyle} />
        <legend>
          Source :&nbsp;
          <a href="http://weightcars-fr.com">weightcars-fr.com</a>
        </legend>
        {typeof imageOrigin === 'string' && (
          <legend>
            Photo :&nbsp;
            <a href={`http://${imageOrigin}`}>{imageOrigin}</a>
          </legend>
        )}
      </section>
  );
};

export default Spec;
