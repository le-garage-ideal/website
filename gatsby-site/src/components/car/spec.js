import React from 'react';
import specStyles from  './spec.module.scss';

const POWER_MAX = 1200; // max 1200hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 1; // max 1kg/hp else overflow

export default function Spec({power, weight}) {

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

  return (
    <article className={ specStyles.card }>
      <section className={ specStyles.bars }>
        <div className={ specStyles.barTitle }><legend>Weight</legend><span><span className={ specStyles.weight }>{ weight }</span>kg</span></div>
        <div className={ [specStyles.bar, specStyles.barWeight].join(' ') } style={barWeightStyle}></div>
        <div className={ specStyles.barTitle }><legend>Power</legend><span><span className={ specStyles.power }>{ power }</span>hp</span></div>
        <div className={ [specStyles.bar, specStyles.barPower].join(' ') } style={barPowerStyle}></div>
        <div className={ specStyles.barTitle }><legend>Ratio</legend><span><span className={ specStyles.ratio }>{ ratio }</span>kg/hp</span></div>
        <div className={ [specStyles.bar, specStyles.barRatio].join(' ') } style={barRatioStyle}></div>
        <legend>
          Source :&nbsp;<a href="http://weightcars-fr.com">weightcars-fr.com</a>
        </legend>
      </section>
    </article>
  );
}


