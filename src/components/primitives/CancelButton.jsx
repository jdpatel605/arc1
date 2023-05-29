import React from 'react'

import Button from './Button'
import Text from './Text'

export default class CancelButton extends React.Component {

  render() {
    const text = this.props.children ? this.props.children : "Cancel"

    return (
      <Button {...this.props} transparent={true} type="cancel">
        {text}
      </Button>
    )
  }

}
