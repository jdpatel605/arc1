import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

const AlertTemplate = ({ style, options, message, close }) => {

  const divStyle= {
      backgroundColor: "rgb(25, 28, 32)",
      color: "white",
      padding: "10px",
      textTransform: "none",
      borderRadius: "8px",
      boxShadow: "rgba(0, 0, 0, 0.03) 0px 2px 2px 2px",
      width: "355px",
      boxSizing: "border-box",
      margin: "10px", 
      pointerEvents: "all"
  }
  const innerDivStyle= {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderRadius: "2px",
      paddingLeft: "10px",
      borderLeft: "solid",
      paddingTop: "5px",
      paddingBottom: "5px"
  }
  
  const buttonStyle = {
      marginLeft: "20px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: "rgb(255, 255, 255)"
  }
  const textStyle = {
    width: "262px",
    marginLeft: "10px",
    fontSize: "16px",
    fontWeight: "normal",
    lineHeight: "1.38",
    letterSpacing: "0.75px",
  }
  
  return (
    <div className="alert-sec" style={{...style,...divStyle}}>
        <div style={{...innerDivStyle, borderColor: options.type === 'info' ? '#2E9AFE' : ( options.type === 'success' ? '#18b99a' : '#fe5444' ) }}>
            {options.type === 'info' && <img src="/images/icon-information.svg" />}
            {options.type === 'success' && <img src="/images/ui-icons-check.svg" />}
            {options.type === 'error' && <img src="/images/ui-icon-error.svg" />}
            <span style={textStyle}>{message}</span>
        
            <button style={buttonStyle} onClick={close}>
                <img src="/images/icon-close.png" />
            </button>
        </div>
    </div>
  )
}

AlertTemplate.propTypes = {
  message: PropTypes.string,
};
AlertTemplate.defaultProps = {
  message: '',
};

export default AlertTemplate;
