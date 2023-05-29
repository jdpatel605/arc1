import React from "react";
import PropTypes from 'prop-types';

const PhoneFormat = props => {

  const number = props.number.replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s/g, '');
  const numberCount = number.length;
  
  return (
    <a href="#" className="phncall">
      {numberCount === 10 ? `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}` : ''}
      {numberCount === 12 ? `(${number.slice(2, 5)}) ${number.slice(5, 8)}-${number.slice(8, 12)}` : ''}
      {numberCount === 13 ? `(${number.slice(3, 6)}) ${number.slice(6, 9)}-${number.slice(9, 13)}` : ''}
    </a>
  )
}

PhoneFormat.propTypes = {
  number: PropTypes.string,
};
PhoneFormat.defaultProps = {
  number: '',
};

export default PhoneFormat;
