import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { EventContext } from '../EventContext';
import { useDispatch, useSelector } from "react-redux";
import { eventParticipantsListRequest, eventParticipantsListReset, inviteEventParticipantsRequest, updateEventParticipantsList } from './../../../store/actions/eventActions';
import { SearchIcon, ChevronDownIcon } from "../../../utils/Svg";
import SingleProfile from "../../profile/SingleProfile";
import { Logger } from './../../../utils/logger';

var searchEventParticipantsDelay;
const fileLocation = "src\\components\\events\\EventModalsPages\\EventModalMainPage.jsx";

const EventParticipantsPage = () => {

  const dispatch = useDispatch();
  const {
    eventParticipantsList, eventDetail, eventParticipantsPageInfo, eventParticipantsLoading, eventParticipantInviteFlag
  } = useSelector(({ events }) => events);
  const { eventDetails,  editEventId, handleHideEventModal, activeTab } = useContext(EventContext);
  const [participantsSearch, setParticipantsSearch] = useState("");
  const [inviteToGuest, setInvitationToGuest] = useState(false);
  const [page, setPage] = useState(1);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => Number.isInteger(parseInt(phone)) && phone.length >= 12;
  const htmlElRef = useRef(null)

  useEffect(() => {
    if(activeTab === 'eventParticipants') {
      setTimeout(() => {
        htmlElRef.current.focus()
      }, 1000);
    }
  }, [activeTab])
  // Hook for member list
  useEffect(() => {

    setParticipantsSearch("");

    // Clear the timeout
    clearTimeout(searchEventParticipantsDelay);

    // Reinitialize the callback with page number 1
    const search = "";
    searchEventParticipantsDelay = setTimeout(() => {
      setPage(1);
      dispatch(eventParticipantsListReset({}));
      dispatch(eventParticipantsListRequest({
        host: eventDetails.eventGroupHost.hostType,
        host_id: eventDetails.eventGroupHost.id,
        event_id: editEventId,
        page: 1,
        search
      }));
    }, 700)

  }, [])

  // Hook for member list
  useEffect(() => {
    const isEmail = validateEmail(participantsSearch);
    const isPhone = validatePhone(participantsSearch);
    if(isEmail === true || isPhone === true) {
      setInvitationToGuest(true);
    } else {
      setInvitationToGuest(false);
    }
  }, [participantsSearch])

  const handleSearchParticipants = e => {
    try {
      const { value } = e.target;
      setParticipantsSearch(value);

      // Clear the timeout
      clearTimeout(searchEventParticipantsDelay);

      // Reinitialize the callback with page number 1
      const search = value.trim();
      searchEventParticipantsDelay = setTimeout(() => {
        setPage(1);
        dispatch(eventParticipantsListReset({}));
        dispatch(eventParticipantsListRequest({
          host: eventDetails.eventGroupHost.hostType,
          host_id: eventDetails.eventGroupHost.id,
          event_id: editEventId,
          page: 1,
          search
        }));
      }, 700)
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'handleSearchParticipants' })
    }

  }

  useEffect(() => {
    if(page > 1) {
      dispatch(eventParticipantsListRequest({
        host: eventDetails.eventGroupHost.hostType,
        host_id: eventDetails.eventGroupHost.id,
        event_id: editEventId,
        page,
        search: participantsSearch
      }));
    }
  }, [page]);

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
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'lastParticipantElementRef' })
    }
  }, [eventParticipantsLoading])

  const nextPageParticipants = () => {
    if(page < eventParticipantsPageInfo.total_pages) {
      setPage(page + 1);
    }
  }

  const inviteParticipant = (identifier, type = 'invite') => {
    dispatch(inviteEventParticipantsRequest({
      type,
      data: {
        event_id: editEventId,
        recursion: eventDetail.recursion_identifier,
        identifier
      }
    }));
  }

  const inviteToGuestParticipant = () => {
    inviteParticipant(participantsSearch);
    setParticipantsSearch("");
  }

  // Hook, when event participant invited or cancelled
  useEffect(() => {
    try {
      const { flag, type, identifier } = eventParticipantInviteFlag
      if(flag === 1) {
        let updatedList = [];
        let subscriptionStatus = null
        if(type === 'invite') {
          subscriptionStatus = 'invited';
        }
        updatedList = eventParticipantsList.map(data => data.identifier === identifier ? { ...data, subscription_status: subscriptionStatus } : data);
        dispatch(updateEventParticipantsList(updatedList));

      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [eventParticipantInviteFlag])

  return (
    <div id="eventParticipants" className={ `card tab-pane fade ${activeTab === 'eventParticipants' && 'active show'}` } role="tabpanel" aria-labelledby="tab-screen-B">
      <div className="card-header" role="tab" id="screen-heading-B">
        <h5 className="mb-0">
          <a className="collapsed" data-toggle="collapse" href="#collapse-B" aria-expanded="false" aria-controls="collapse-B">
            Event Participants
          </a>
        </h5>
      </div>
      <div id="screen-B" className="collapse" data-parent="#content" role="tabpanel" aria-labelledby="screen-heading-B">
        <div>
          <p className="mt-3">Invite Participants</p>
          <div className="search-box mw-100 serach-btn-first">
            <input ref={htmlElRef} type="text" value={ participantsSearch } onChange={ handleSearchParticipants } className="search bg-black-500 w-100" placeholder="Search for users " />
            { inviteToGuest && <a href="#/" onClick={ () => inviteToGuestParticipant() } className="btn btn-round btn-green btn-invited text-white">+ Invite</a> }
            <a className="btn-search" href="#/">{ SearchIcon }</a>
          </div>
          <div className="accordion mt-3" id="accordionExample">
            <div className="member-list-data">
              {
                eventParticipantsList.map((member, key) =>
                  <div key={ key } className="member-info" ref={ (key + 1) === eventParticipantsList.length ? lastParticipantElementRef : null }>
                    <SingleProfile name={ member.name } avatarUrl={ member.avatar_url } userId={ member.identifier } />
                    <div className="communication">
                      {
                        member.subscription_status === null &&
                        <span onClick={ () => inviteParticipant(member.identifier) } className="btn btn-round btn-green btn-invited">+ Invite</span>
                      }
                      {
                        member.subscription_status === 'member' &&
                        <span className="btn btn-round btn-gray btn-invited btn-click">Member</span>
                      }
                      {
                        member.subscription_status === 'invited' &&
                        <Dropdown>
                          <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                            Invited{ ChevronDownIcon }
                          </Dropdown.Toggle>
                          <Dropdown.Menu alignRight="true" className="option-menu">
                            {/* <Dropdown.Item onClick={() => inviteParticipant(member.identifier)} className="img-resend-invite">Resend Invite</Dropdown.Item> */ }
                            <Dropdown.Item onClick={ () => inviteParticipant(member.identifier, 'cancel') } className="img-close clr-red">Cancel Invite</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      }
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="btn-sec pb-0 pt-3 pl-2 pr-2">
          <span className="btn btn-medium md-box btn-black clr-white" onClick={ () => handleHideEventModal() }>Close</span>
          {/* <button onClick={() => handleHideEventModal()} type="button" className="btn btn-medium md-box btn-submit btn-green">Submit</button> */ }
        </div>
      </div>
    </div>
  );
}

export default EventParticipantsPage;
