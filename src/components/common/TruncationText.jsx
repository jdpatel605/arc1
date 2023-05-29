import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
const Str = require('string');

const TruncationText = ({content = "", limit = 35, linkClass = ""}) => {

  const [text, setText] = useState("");

  useEffect(() => {
    if(content) {
      setText(Str(content).truncate(limit).s);
    } else {
      setText("");
    }
  }, [content, limit])

  return (
    <>
      {text}
    </>
  )
}

TruncationText.propTypes = {
  content: PropTypes.string,
  limit: PropTypes.number,
  linkClass: PropTypes.string,
};
TruncationText.defaultProps = {
  content: '',
  limit: 35,
  linkClass: '',
};

export default TruncationText;
