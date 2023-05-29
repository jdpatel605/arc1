import React from 'react'

import Text from './Text'

export default class HeaderText extends React.Component {

  render() {
    const { size } = this.props
    let { color } = this.props
    let style = {}

    color = color ? color : 'header-default'
    const colorClass = `clr-${color}`

    let Tag = "div"

    if(size == 'x-large') {
      Tag = "h1"
    } else if(size == 'large') {
      Tag = "h2"
    } else if(size == 'medium') {
      Tag = "h3"
    } else if(size == 'small') {
      Tag = "h4"
    } else if(size == 'x-small') {
      Tag = "h5"
    }

    return (
      <Tag className={colorClass} style={style}><Text {...this.props} /></Tag>
    )
  }

}
