import React, { useState } from 'react';
import carStyles from './selected-car.module.scss';

const POWER_MAX = 1000; // max 1000hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 1; // max 1kg/hp else overflow

export function SelectedCar({ id, variant, power, weight, startYear, endYear, brand, model, imageUrl }) {

  const [display, setDisplay] = useState(false);

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
    <article className={carStyles.card}>

      <div href={imageUrl} className={carStyles.imageLink} style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
      </div>

      <div className={carStyles.carSummary + ' dropdown is-hoverable'}>
        <h3 className="dropdown-trigger" aria-controls={'dropdown-' + id}>
          <span>{brand}</span>&nbsp;
            <span className={carStyles.name}>{variant}</span>&nbsp;
            <span className={carStyles.startYear}>{years}</span>
        </h3>
        <section className={carStyles.bars + ' dropdown-menu'} id={'dropdown-' + id}>
          <div className={carStyles.bars + ' dropdown-content'}>
            <div className={carStyles.bars + ' dropdown-item'}>
              <div className={carStyles.barTitle}><legend>Weight</legend><span><span className={carStyles.weight}>{weight}</span>kg</span></div>
              <div className={[carStyles.bar, carStyles.barWeight].join(' ')} style={barWeightStyle}></div>
              <div className={carStyles.barTitle}><legend>Power</legend><span><span className={carStyles.power}>{power}</span>hp</span></div>
              <div className={[carStyles.bar, carStyles.barPower].join(' ')} style={barPowerStyle}></div>
              <div className={carStyles.barTitle}><legend>Ratio</legend><span><span className={carStyles.ratio}>{ratio}</span>kg/hp</span></div>
              <div className={[carStyles.bar, carStyles.barRatio].join(' ')} style={barRatioStyle}></div>
            </div>
          </div>
        </section>
      </div>

    </article >
  );
}


