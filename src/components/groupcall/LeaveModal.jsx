import React from 'react'

import { CancelButton, HeaderText, PrimaryButton, SecondaryButton, Text } from '../primitives'

export default class LeaveModal extends React.Component {

  render() {
    const { onCancelClick, onEndClick, onLeaveClick } = this.props

    console.log(onCancelClick)
    return (
      <div className="modal2-wrapper">
        <div className="modal2">
          <div className="center">
            <HeaderText size='x-small'>Leave or End Event?</HeaderText>
            <div className="modal2-body">
              <Text>
                Ending the event will end the event for everyone. Leaving the event will allow others to continue meeting.
              </Text>
            </div>
          </div>
          <div className="modal2-actions">
            <CancelButton onClick={onCancelClick} />
            <SecondaryButton type='danger' onClick={onLeaveClick}>
              Leave Event
            </SecondaryButton>
            <PrimaryButton type='danger' onClick={onEndClick}>
              End Event
            </PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

}
