import React from 'react'

import Text from './Text'

export default class Button extends React.Component {

  render() {
    const { onClick, size, transparent, type } = this.props
    let { height, textColor, weight } = this.props

    height = height ? height : '50px'
    weight = weight ? weight : '156px'
    textColor = textColor ? textColor : 'default'

    let style = {
      height: height,
      width:  weight
    }

    let sizeClass  = 'btn-medium'
    let colorClass = 'btn-info'

    if(size == 'x-large') {
      sizeClass = "btn-x-large"
    } else if(size == 'large') {
      sizeClass = "btn-large"
    } else if(size == 'small') {
      sizeClass = "btn-small"
    } else if(size == 'x-small') {
      sizeClass = "btn-x-small"
    }

    if(type == 'danger') {
      colorClass = transparent ? "btn-secondary-danger" : "btn-danger"
      textColor = transparent ? "danger" : textColor
    } else if(type == 'warn') {
      colorClass = transparent ? "btn-secondary-warn" : "btn-warn"
      textColor = transparent ? "warn" : textColor
    } else if(type == 'cancel') {
      colorClass = "btn-cancel"
      textColor = transparent ? "cancel" : textColor
    } else if(type == 'debug') {
      colorClass = "btn-debug"
      textColor = transparent ? "cancel" : textColor
    }

    return (
      <button className={`btn ${colorClass} ${sizeClass}`} onClick={onClick} style={style}>
        <Text color={textColor}>
          {this.props.children}
        </Text>
      </button>
    )
  }

}
