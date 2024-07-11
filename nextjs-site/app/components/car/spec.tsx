'use client';
import Uri from 'jsuri';
import specStyles from './spec.module.scss';
import { Car } from '../../../types/car';
const POWER_MAX = 1200; // max 1200hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 20; // max 1kg/hp else overflow

type SpecProps = {
  car: Car;
  price: number;
  barPriceStyle: any;
  imageUrl?: string;
  i18nArray: { [s:string]: string };
};
export default function Spec({ car, price, barPriceStyle, imageUrl, i18nArray }: SpecProps) {
  const { power, weight, officialWeight } = car;

  const theWeight = weight || officialWeight;

  const theWeightLabel = weight
    ? i18nArray['components.spec.observed_weight']
    : i18nArray['components.spec.official_weight'];

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

  const powerUnit = i18nArray['components.spec.hp'];

  return (
      <section className={specStyles.specContainer}>
        <div className={specStyles.barTitle}>
          <legend>{ i18nArray['components.spec.power'] }</legend>
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
          <legend>{ i18nArray['components.spec.ratio'] }</legend>
          <span>
            <span>{ratio}</span>
            { `kg/${powerUnit}` }
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barRatio].join(' ')} style={barRatioStyle} />
        { price && (
          <>
            <div className={specStyles.barTitle}>
            <legend>{i18nArray['components.spec.price']}</legend>
            <span>
              <span>{price}</span>
              €
            </span>
            </div><div className={[specStyles.bar, specStyles.barPrice].join(' ')} style={barPriceStyle} />
          </>
        )}
        <legend>
          Source :&nbsp;
          <a className={specStyles.link} href="http://weightcars-fr.com">weightcars-fr.com</a>
        </legend>
        {typeof imageOrigin === 'string' && (
          <legend>
            Photo :&nbsp;
            <a href={`http://${imageOrigin}`}>{imageOrigin}</a>
          </legend>
        )}
      </section>
  );
}
