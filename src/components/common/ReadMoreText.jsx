import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
const Str = require('string');

const ReadMoreText = ({content = "", limit = 100, linkClass = ""}) => {

  const [text, setText] = useState("");
  const [readMoreFlag, setReadMoreFlag] = useState(true);
  const [showReadMoreLink, setShowReadMoreLink] = useState(false);

  useEffect(() => {
    if(content) {
      setText(Str(content).truncate(limit).s);
      setReadMoreFlag(true);
      if(content.length > limit) {
        setShowReadMoreLink(true);
      }
    } else {
      setText("");
      setReadMoreFlag(false);
    }
  }, [content, limit]);

  const displayMoreText = () => {
    if(content) {
      setText(content);
      setReadMoreFlag(false);
    }
  }
  const displayLessText = () => {
    if(content) {
      setText(Str(content).truncate(limit).s);
      setReadMoreFlag(true);
    }
  }

  return (
    <>
      {text}
      {' '}
      {
        showReadMoreLink &&
        (
          readMoreFlag
            ? <span className={`readmoretxt ${linkClass} `} onClick={displayMoreText} >Read more</span>
            : <span className={`readmoretxt ${linkClass} `} onClick={displayLessText} >&nbsp;Read less</span>
        )
      }
    </>
  )
}

ReadMoreText.propTypes = {
  content: PropTypes.string,
  limit: PropTypes.number,
  linkClass: PropTypes.string,
};
ReadMoreText.defaultProps = {
  content: '',
  limit: 100,
  linkClass: '',
};

export default ReadMoreText;
