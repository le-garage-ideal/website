import Uri from 'jsuri';
import { useTranslation} from 'next-i18next';
import specStyles from './spec.module.scss';
import { Car } from '../../../types/car';
const POWER_MAX = 1200; // max 1200hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 20; // max 1kg/hp else overflow
const PRICE_MAX = 500000; // max 500k€ else overflow

type SpecProps = {
  car: Car;
  imageUrl?: string;
};
export default async function Spec({ car, imageUrl }: SpecProps) {
  const { t: i18n } = useTranslation();
  console.log('1');
  
  const { power, weight, officialWeight } = car;
  console.log('2');

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

  // Price
  console.log('3');

  const price = await fetchPrice(car ? `${car?.model.brand} ${car.variant}${` year ${car.startYear}` ?? ""}` : undefined);
  console.log('4', price);
  const barPriceStyle = price ? {
    width: `${(price * 100) / PRICE_MAX}%`,
  } : undefined;
  console.log('5');


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
        { price && (
          <>
            <div className={specStyles.barTitle}>
            <legend>{i18n('components.spec.price')}</legend>
            <span>
              <span>{price}</span>
              €
            </span>
            </div><div className={[specStyles.bar, specStyles.barPrice].join(' ')} style={barPriceStyle} />
          </>
        )}
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

async function fetchPrice(model: string | undefined): Promise<number | undefined> {
  if (model) {
    const storedPrice = localStorage.getItem(model);
    if (storedPrice) {
      console.log('price from storage');
      return parseFloat(storedPrice);
    } else {
      console.log('fetching price');
      const response = await fetch(process.env.NEXT_PUBLIC_AI_BASE_API_URL as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model }),
      });
      const data = await response.json();
      localStorage.setItem(model, data.price);
      return data.price;  
    }
  } else {
    return undefined
  }
}

