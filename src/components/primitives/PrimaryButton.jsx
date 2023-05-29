import React from 'react'

import Button from './Button'
import Text from './Text'

export default class PrimaryButton extends React.Component {

  render() {
    const { onClick, size, type } = this.props
    let { height, weight } = this.props

    return (
      <Button {...this.props} />
    )
  }

}
