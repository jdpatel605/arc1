import React from "react";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';

const EmptyTag = () => {
   return <></>
}
const InternalList = ({inviteValue, inviteKey, isMargin, parent, state}) => {
   return (
           <div className={classNames({"setting-opt ": true, "mb-0 ml-1": isMargin})} key={`first-breakout-${inviteKey}`}>
                <div>
                    <h5><a href="#">{inviteValue.user_name}</a></h5>
                    <p>Breakout Invite</p>
                </div>
                <div>
                    <a className="btn rounded-circle bg-black" href="#">
                        <Svg.RejectButton/>
                    </a>
                    <a className="btn rounded-circle btn-green" href="#">
                        <Svg.AcceptButton/>
                    </a>
                </div>
            </div>
        )
}
InternalList.propTypes = {
  inviteValue: PropTypes.object.isRequired,
  inviteKey: PropTypes.number.isRequired,
  isMargin: PropTypes.bool.isRequired,
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};
const BreakoutInvitationList = ({parent, state}) => {
    return (
        <div className="waiting-list">
        {
            Object.keys(state.breakoutInvitations).length > 0 &&  Object.keys(state.breakoutInvitations).map((v, k) => {
                if(k <= 1){
                    v = state.breakoutInvitations[v]
                    return(
                            <InternalList inviteValue={v} inviteKey={k} parent={parent} state={state} isMargin={true} key={k}></InternalList>
                        )
                }else{
                    return <EmptyTag key={k}></EmptyTag>
                }
            })
        }
        {
        Object.keys(state.breakoutInvitations).length > 2 &&
        <a className={classNames({"btn btn-round bg-black-500 setting-btn btn-click": true, 'btn-close': state.breakoutDropdown})} href="#" onClick={() => parent.showBreakoutList()} >
            +{Object.keys(state.breakoutInvitations).length - 2} More
            <svg xmlns="https://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23">
                <path fill="#FFF" fillRule="evenodd"
                    d="M17.651 6.531L11.152 13.03 4.653 6.531 3.438 7.746 11.152 15.461 18.866 7.746z"
                    transform="translate(0 .28)" />
            </svg>
        </a>
        }
        <div className={classNames({"option-menu setting-dropdown": true, "show": state.breakoutDropdown})} >
        {
        Object.keys(state.breakoutInvitations).length > 2 && Object.keys(state.breakoutInvitations).map((v , k) => {
            v = state.breakoutInvitations[v]
            if(k > 1){
                return(
                    <InternalList inviteValue={v} inviteKey={k} parent={parent} state={state} isMargin={false}></InternalList>
                )
            }else{
                return <EmptyTag key={k}></EmptyTag>
            }
        })
        }
        </div>
    </div>
        )
}

BreakoutInvitationList.propTypes = {
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};

export default BreakoutInvitationList;
