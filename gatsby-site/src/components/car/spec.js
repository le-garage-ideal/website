import React from 'react';
import Uri from 'jsuri';
import PropTypes from 'prop-types';
import { useIntl } from 'gatsby-plugin-intl';
import specStyles from './spec.module.scss';
import { extractHostname } from '../../functions/url';

const POWER_MAX = 1200; // max 1200hp, else overflow
const WEIGHT_MAX = 2500; // max 2500kg, else overflow
const RATIO_MAX = 20; // max 1kg/hp else overflow

const Spec = ({
  power, weight, officialWeight, imageUrl,
}) => {
  const intl = useIntl();

  const theWeight = weight || officialWeight;

  const theWeightLabel = weight
    ? intl.formatMessage({ id: 'components.spec.observed_weight' })
    : intl.formatMessage({ id: 'components.spec.official_weight' });

  const ratio = Math.round((theWeight * 10) / power) / 10;

  const barPowerStyle = {
    width: `${(power * 100) / POWER_MAX}%`,
  };

  const barWeightStyle = {
    width: `${(theWeight * 100) / WEIGHT_MAX}%`,
  };

  const barRatioStyle = {
    width: `${(ratio * 100) / RATIO_MAX}%`,
  };

  const imageUri = new Uri(imageUrl);
  const imageOrigin = extractHostname(imageUri.uriParts.host);

  const powerUnit = intl.formatMessage({ id: 'components.spec.hp' });

  return (
    <article className={specStyles.card}>
      <section className={specStyles.bars}>
        <div className={specStyles.barTitle}>
          <legend>{ intl.formatMessage({ id: 'components.spec.power' }) }</legend>
          <span>
            <span className={specStyles.power}>{power}</span>
            { powerUnit }
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barPower].join(' ')} style={barPowerStyle} />
        <div className={specStyles.barTitle}>
          <legend>{ theWeightLabel}</legend>
          <span>
            <span className={specStyles.weight}>{theWeight}</span>
            kg
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barWeight].join(' ')} style={barWeightStyle} />
        <div className={specStyles.barTitle}>
          <legend>{ intl.formatMessage({ id: 'components.spec.ratio' }) }</legend>
          <span>
            <span className={specStyles.ratio}>{ratio}</span>
            { `kg/${powerUnit}` }
          </span>
        </div>
        <div className={[specStyles.bar, specStyles.barRatio].join(' ')} style={barRatioStyle} />
        <legend>
          Source :&nbsp;
          <a href="http://weightcars-fr.com">weightcars-fr.com</a>
        </legend>
        {imageOrigin && (
          <legend>
            Photo :&nbsp;
            <a href={`http://${imageOrigin}`}>{imageOrigin}</a>
          </legend>
        )}
      </section>
    </article>
  );
};

Spec.propTypes = {
  power: PropTypes.number.isRequired,
  weight: PropTypes.number,
  officialWeight: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
};

Spec.defaultProps = {
  weight: null,
  imageUrl: null,
};

export default Spec;
