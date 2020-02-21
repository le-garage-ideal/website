import React from 'react';
import carStyles from  './car.module.scss';

const POWER_MAX = 1000; // max 1000hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 1; // max 1kg/hp else overflow

export default function Car({id, variant, power, weight, startYear, endYear, brand, model, imageUrl}) {

  const ratio = Math.round(RATIO_MAX * power * 100 / weight);

  const barPowerStyle = {
    width: `${power * 100 / POWER_MAX}%`
  };

  const barWeightStyle = {
    width: `${weight * 100 / WEIGHT_MAX}%`
  };

  const barRatioStyle = {
    width: `${ratio}%`
  };

  const years = `(${startYear}${endYear ? ' - ' + endYear : ''})`;

  return (
    <article className={ carStyles.card }>
      <h3><span className={ carStyles.brand }>{brand}</span>&nbsp;<span className={ carStyles.model }>{model}</span></h3>
      <a href={imageUrl} className={ carStyles.imageLink }>
        <img alt="car" src={imageUrl} />
      </a>
      <details className={ carStyles.carDetails }>
        <summary className={ carStyles.carSummary }>
          <span className={ carStyles.name }>{ variant }</span>&nbsp;
          <span className={ carStyles.startYear }>{ years }</span>
        </summary>
        <section className={ carStyles.bars }>
          <div className={ carStyles.barTitle }><legend>Weight</legend><span><span className={ carStyles.weight }>{ weight }</span>kg</span></div>
          <div className={ [carStyles.bar, carStyles.barWeight].join(' ') } style={barWeightStyle}></div>
          <div className={ carStyles.barTitle }><legend>Power</legend><span><span className={ carStyles.power }>{ power }</span>hp</span></div>
          <div className={ [carStyles.bar, carStyles.barPower].join(' ') } style={barPowerStyle}></div>
          <div className={ carStyles.barTitle }><legend>Ratio</legend><span><span className={ carStyles.ratio }>{ ratio }</span>kg/hp</span></div>
          <div className={ [carStyles.bar, carStyles.barRatio].join(' ') } style={barRatioStyle}></div>
        </section>
      </details>
    </article>
  );
}


