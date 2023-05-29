import React, { useState, useEffect, useRef, useCallback } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'
import { useDispatch, useSelector } from 'react-redux';
import { groupCallInviteMemberRequest, groupDetailsRequest } from '../../store/actions/group';
import { eventParticipantsListReset, eventParticipantsListRequest, inviteEventParticipantsRequest, updateEventParticipantsList } from "../../store/actions";
import SingleProfile from "../profile/SingleProfile";
import { ChevronDownIcon } from "../../utils/Svg";
import { Logger } from './../../utils/logger';

var searchParticipantsDelay;

const fileLocation = "src\\components\\groupcall\\InviteToGroupModal.jsx";

const InviteToGroupModal = props => {

  const { parent } = props
  const dispatch = useDispatch();
  const [searchText, setSearch] = useState("");
  const [inviteToGuest, setInvitationToGuest] = useState(false);
  const [organizationId, setOrganizationId] = useState(null);
  const [homeOrganizationId, setHomeOrganizationId] = useState(null);
  const { current: eventDetails, eventParticipantsLoading, eventParticipantsPageInfo, eventParticipantInviteFlag, eventParticipantsList } = useSelector(({ events }) => events);
  const { profile }  = useSelector(({user}) => user);
  const { groupDetails, inviteRes } = useSelector(({ group }) => group);
  const [page, setPage] = useState(1);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

  const isGuest = localStorage.getItem('guestUser')
  const htmlElRef = useRef(null)
  
  useEffect(() => {
    if(props.showModal) {
      htmlElRef.current.focus()
      setSearch('')
      setPage(1);
      dispatch(eventParticipantsListReset({}));
    }
  }, [props.showModal]);  
  
  // hook for user profile
  useEffect(() => {
    if(Object.keys(profile).length){
//        console.log('userProfile', profile)
        const orgId = profile.organizations && profile.organizations.entries.length ? profile.organizations.entries[0].identifier : null
        setHomeOrganizationId(orgId)
    }
  }, [profile]);  
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
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:searchText' })
    }

  }, [searchText]);

  // Hook for invite member host
  useEffect(() => {

    try {
      if(eventDetails.name) {
        const hostType = eventDetails.host_type === 'group' ? 'group' : (eventDetails.host_type === 'user' ? 'user' : 'organization');
        const hostIdentifier = eventDetails.host.identifier;
        if(hostType === 'organization') {
          setOrganizationId(hostIdentifier)
        }else if(hostType === 'user'){
            setOrganizationId(homeOrganizationId)
        } else {
          // Dispatch group extended API
          if(!isGuest) {
            dispatch(groupDetailsRequest({ group_id: hostIdentifier }));
          }
        }
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:eventDetails' })
    }

  }, [eventDetails]);

  // Hook to get group organization identifer
  useEffect(() => {

    try {
      if(groupDetails.name) {
        const hostIdentifier = groupDetails.organization.identifier;
        setOrganizationId(hostIdentifier)
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:groupDetails' })
    }

  }, [groupDetails]);

  // Hook to get invitation response
  useEffect(() => {
    try {
      if(inviteRes.flag === 1) {
        props.alert.success('The invitation has been sent.')
      } else if(inviteRes.flag === 0) {
        props.alert.error('The invitation has failed.')
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:inviteRes' })
    }
  }, [inviteRes]);


  const inviteMember = e => {
    try {
      e.preventDefault();
      adhocInviteToEvent(searchText)
      setSearch("");
      setInvitationToGuest(false);
      props.onClickModal(false);
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'inviteMember' })
    }
  }

  const inviteParticipant = identifier => {
    adhocInviteToEvent(identifier)
  }

  const adhocInviteToEvent = identifier => {
    try {
      parent.event[parent.activeEventId].push('attendee:invite:adhoc', { identifier: identifier })
                        .receive("ok", resp => { props.alert.success('The invitation has been sent.'); updateMemberStatus(identifier) })
                        .receive("error", resp => { props.alert.error('The invitation has failed.') })
                        .receive("timeout", () => console.log("Networking issue. Still waiting... for user id ", identifier));
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'adhocInviteToEvent' })
    }
  }
  
  const updateMemberStatus = identifier => {
        let updatedList = [];
        let subscriptionStatus = 'member'
        updatedList = eventParticipantsList.map(data => data.identifier === identifier ? { ...data, subscription_status: subscriptionStatus } : data);
        dispatch(updateEventParticipantsList(updatedList));
  }
  
  const inviteParticipantOLD = (identifier, type = 'invite') => {
    const payload = {
      event_id: eventDetails.identifier,
      identifier
    };

    dispatch(inviteEventParticipantsRequest({
      type,
      data: payload
    }));

  }

  const searchMembers = (search) => {
    try {
      setSearch(search);

      if(!isGuest && organizationId) {
        // Clear the timeout
        clearTimeout(searchParticipantsDelay);

        // Reinitialize the callback with page number 1
        search = search.trim();
        searchParticipantsDelay = setTimeout(() => {
          const { identifier } = eventDetails;
          const payload = {
            host: 'organization',
            host_id: organizationId,
            event_id: identifier,
            page: 1,
            search
          };
          setPage(1);
          dispatch(eventParticipantsListReset({}));
          dispatch(eventParticipantsListRequest(payload));
        }, 700);
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'searchMembers' })
    }
  }

  // Hook, when event participant invited or cancelled
  useEffect(() => {
    try {
      const { flag, type, identifier } = eventParticipantInviteFlag
      if(flag === 1) {
        let updatedList = [];
        let subscriptionStatus = null
        if(type === 'invite') {
          subscriptionStatus = 'member';
        }
        updatedList = eventParticipantsList.map(data => data.identifier === identifier ? { ...data, subscription_status: subscriptionStatus } : data);
        dispatch(updateEventParticipantsList(updatedList));

      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:eventParticipantInviteFlag' })
    }
  }, [eventParticipantInviteFlag]);

  useEffect(() => {
    try {
      if(page > 1) {
        const { identifier } = eventDetails;
        dispatch(eventParticipantsListRequest({
          host: 'organization',
          host_id: organizationId,
          event_id: identifier,
          page,
          search: searchText
        }));
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:page' })
    }
  }, [page]);

  const observer = useRef();
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
    try {
      if(page < eventParticipantsPageInfo.total_pages) {
        setPage(page + 1);
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'nextPageParticipants' })
    }
  }

  return (
    <Modal size="lg" show={ props.showModal } onHide={ () => props.onHideModal(false) } aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Header>
        <div className="back-btn">
          <span className="cursor-pointer" onClick={ () => props.onClickModal(false) }>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#FFF" fillRule="evenodd" d="M20 11L7.83 11 13.42 5.41 12 4 4 12 12 20 13.41 18.59 7.83 13 20 13z" />
            </svg>
          </span>
        </div>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Invite to Meeting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="full-search-box no-bg-after ui-widget">
          <input ref={htmlElRef} type="text" value={ searchText } onChange={ (e) => searchMembers(e.target.value) } className="txt-search" id="txt-search" placeholder="Type here to invite users..." />
          { inviteToGuest && <a href="#" onClick={ inviteMember } className="btn btn-round btn-green btn-invited text-white">+ Invite</a> }
        </div>
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
                        <Dropdown.Item onClick={ () => inviteParticipant(member.identifier) } className="img-close clr-red">Cancel Invite</Dropdown.Item>
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
              <label className="pr-3">Type member name or a valid email (i.e. “andrew@gmail.com”) or a mobile number in order to invite someone.</label>
            </div>
          }
        </div>
      </Modal.Body>
    </Modal>
  )

}
export default InviteToGroupModal;
