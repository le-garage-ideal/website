import React from 'react';
import specStyles from  './spec.module.scss';

const POWER_MAX = 1200; // max 1200hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 20; // max 1kg/hp else overflow

export default function Spec({power, weight, officialWeight}) {

  const theWeight = weight ? weight : officialWeight;

  const ratio = Math.round((theWeight * 10) / power) / 10;

  const barPowerStyle = {
    width: `${power * 100 / POWER_MAX}%`
  };

  const barWeightStyle = {
    width: `${theWeight * 100 / WEIGHT_MAX}%`
  };

  const barRatioStyle = {
    width: `${ratio * 100 / RATIO_MAX}%`
  };

  return (
    <article className={ specStyles.card }>
      <section className={ specStyles.bars }>
        <div className={ specStyles.barTitle }><legend>Puissance</legend><span><span className={ specStyles.power }>{ power }</span>hp</span></div>
        <div className={ [specStyles.bar, specStyles.barPower].join(' ') } style={barPowerStyle}></div>
        <div className={ specStyles.barTitle }><legend>Poids { weight ? 'constaté' : 'officiel' }</legend><span><span className={ specStyles.weight }>{ theWeight }</span>kg</span></div>
        <div className={ [specStyles.bar, specStyles.barWeight].join(' ') } style={barWeightStyle}></div>
        <div className={ specStyles.barTitle }><legend>Rapport</legend><span><span className={ specStyles.ratio }>{ ratio }</span>kg/hp</span></div>
        <div className={ [specStyles.bar, specStyles.barRatio].join(' ') } style={barRatioStyle}></div>
        <legend>
          Source :&nbsp;<a href="http://weightcars-fr.com">weightcars-fr.com</a>
        </legend>
      </section>
    </article>
  );
}


