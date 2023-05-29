import React from 'react'

import Button from './Button'
import Text from './Text'

export default class SecondaryButton extends React.Component {

  render() {
    return (
      <Button {...this.props} transparent={true} />
    )
  }

}
