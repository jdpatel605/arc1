import React from 'react'

export default class Text extends React.Component {

  render() {
    const { color } = this.props

    let colorClass = color ? `clr-${color}` : ''

    const style = {}

    return (
      <div className={`text ${colorClass}`} style={style}>{this.props.children}</div>
    )
  }

}
