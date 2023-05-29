import React, {useState, useEffect, useRef, useCallback} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import {inviteMemberEventRequest, eventParticipantsListReset, eventParticipantsListRequest, inviteGroupEventRequest, updateEventParticipantsList} from "../../../store/actions";
import {ArrowBackIcon, ChevronDownIcon} from './../../../utils/Svg';
import SingleProfile from "../../profile/SingleProfile";
import InviteModelMessage from './../../common/InviteModelMessage';
import {Logger} from './../../../utils/logger';

var searchParticipantsDelay;
const fileLocation = "src\\components\\events\\InviteToEventModal.jsx";

const InviteToEventModal = props => {

  const dispatch = useDispatch();
  const [searchText, setSearch] = useState("");
  const [inviteToGuest, setInvitationToGuest] = useState(false);
  const [page, setPage] = useState(1);

  const {
    eventParticipantsList, eventParticipantsPageInfo, eventParticipantsLoading
  } = useSelector(({events}) => events);

  const {inviteGrpEventSuccess, inviteGrpEventFlag} = useSelector(({adminGroup}) => adminGroup);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

  // Hook for member list
  useEffect(() => {
    try {
      const isEmail = validateEmail(searchText);
      const isPhone = validatePhone(searchText);
      if(isEmail === true || isPhone === true) {
        setInvitationToGuest(true);
      } else {
        setInvitationToGuest(false);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
    }
  }, [searchText])

  const searchMembers = (search) => {
    try {
      setSearch(search);

      // Clear the timeout
      clearTimeout(searchParticipantsDelay);

      // Reinitialize the callback with page number 1
      search = search.trim();
      searchParticipantsDelay = setTimeout(() => {
        const {identifier, host_type, host_identifier} = props.event;
        const payload = {
          host: host_type,
          host_id: host_identifier,
          event_id: identifier,
          page: 1,
          search
        };
        setPage(1);
        dispatch(eventParticipantsListReset({}));
        dispatch(eventParticipantsListRequest(payload));
      }, 700);
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'searchMembers'})
    }

  }

  useEffect(() => {
    if(page > 1) {
      const {identifier, host_type, host_identifier} = props.event;
      dispatch(eventParticipantsListRequest({
        host: host_type,
        host_id: host_identifier,
        event_id: identifier,
        page,
        search: searchText
      }));
    }
  }, [page]);

  const inviteMember = e => {

    e.preventDefault();
    const payload = {
      identifier: searchText.trim(),
      eventId: props.event.identifier,
      method: 'post'
    }
    dispatch(inviteMemberEventRequest(payload));
    setSearch("");
    setInvitationToGuest(false);
  }

  const observer = useRef()
  const lastParticipantElementRef = useCallback(node => {
    try {
      if(eventParticipantsLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          nextPageParticipants();
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastParticipantElementRef'})
    }
  }, [eventParticipantsLoading])

  const nextPageParticipants = () => {
    if(page < eventParticipantsPageInfo.total_pages) {
      setPage(page + 1);
    }
  }

  const inviteParticipant = (identifier, type = 'invite') => {
    const payload = {
      event_id: props.event.identifier,
      recursion: props.event.recursion_identifier,
      event_type: props.event.type,
      identifier
    };

    dispatch(inviteGroupEventRequest({
      type,
      data: payload
    }));
  }

  // Hook, when event participant invited or cancelled
  useEffect(() => {
    try {
      console.log(inviteGrpEventSuccess);
      console.log(inviteGrpEventFlag);
      const {type, identifier} = inviteGrpEventSuccess
      if(inviteGrpEventFlag === 1) {
        let updatedList = [];
        let subscriptionStatus = null
        if(type === 'invite') {
          subscriptionStatus = 'invited';
        }
        updatedList = eventParticipantsList.map(data => data.identifier === identifier ? {...data, subscription_status: subscriptionStatus} : data);
        dispatch(updateEventParticipantsList(updatedList));

      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteGrpEventSuccess'})
    }
  }, [inviteGrpEventSuccess]);

  const handelResetModal = () => {
    dispatch(eventParticipantsListReset({}));
    setSearch("");
    setInvitationToGuest(false);
    setPage(1);
  }

  return (
    <Modal size="lg" backdrop="static" show={props.show} onExiting={handelResetModal} onHide={() => props.hideModal()} aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Header>
        <div className="back-btn">
          <span className="cursor-pointer" onClick={() => props.hideModal()}>
            {ArrowBackIcon}
          </span>
        </div>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Invite to Event
      </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{marginBottom: '-65px'}}>
        <div className="full-search-box no-bg-after ui-widget">
          <input type="text" value={searchText} onChange={(e) => searchMembers(e.target.value)} className="txt-search" id="txt-search" placeholder="Type here to invite users..." />
          {inviteToGuest && <a href="#/" onClick={inviteMember} className="btn btn-round btn-green btn-invited text-white">+ Invite</a>}
        </div>
        <div className="member-list-data">
          {
            eventParticipantsList.map((member, key) =>
              <div key={key} className="member-info" ref={(key + 1) === eventParticipantsList.length ? lastParticipantElementRef : null}>
                <SingleProfile name={member.name} avatarUrl={member.avatar_url} userId={member.identifier} />
                <div className="communication">
                  {
                    member.subscription_status === null &&
                    <span onClick={() => inviteParticipant(member.identifier)} className="btn btn-round btn-green btn-invited">+ Invite</span>
                  }
                  {
                    member.subscription_status === 'member' &&
                    <span className="btn btn-round btn-gray btn-invited btn-click">Member</span>
                  }
                  {
                    member.subscription_status === 'invited' &&
                    <Dropdown>
                      <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                        Invited{ChevronDownIcon}
                      </Dropdown.Toggle>
                      <Dropdown.Menu alignRight="true" className="option-menu">
                        <Dropdown.Item onClick={() => inviteParticipant(member.identifier, 'cancel')} className="img-close clr-red">Cancel Invite</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                </div>
              </div>
            )
          }
          {
            eventParticipantsList.length === 0 &&
            <div className="col-sm-12 pl-4 pr-4">
              <InviteModelMessage />
            </div>
          }
        </div>
      </Modal.Body>
    </Modal>
  )

}
InviteToEventModal.propTypes = {
  show: PropTypes.bool,
  hideModal: PropTypes.func,
  eventId: PropTypes.string
}
InviteToEventModal.defaultProps = {
  show: false,
  eventId: '',
};
export default InviteToEventModal;
