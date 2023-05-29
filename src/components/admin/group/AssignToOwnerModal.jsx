import React, {useState, useEffect, useRef, useCallback} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import { useAlert } from 'react-alert';
import {detailsGroupMemberListRequest, detailsGroupMemberListUpdate, assignNewGroupOwnerRequest} from '../../../store/actions';
import {ChevronUpIcon, CloseProfileIcon} from "../../../utils/Svg";
import SingleProfile from "../../profile/SingleProfile";
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\group\\InviteToGroupModal.jsx";

const InviteToGroupModal = props => {
  const alert = useAlert()
  const dispatch = useDispatch();
  const adminName = localStorage.getItem("admin_name");
  const [ownerIdentifier, setOwnerIdentifier] = useState("");
  const [searchText, setSearch] = useState("");
  const {detailsMemLoading, detailsMemList, detailsMemPageInfo, loadingOwnerGrp, OwnerGrpFlag, OwnerGrpSuccess, OwnerGrpError} = useSelector(({adminGroup}) => adminGroup);
  const [pageNumber, setPageNumber] = useState(1);
  const [newOwner, setNewOwner] = useState({});

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => Number.isInteger(parseInt(phone)) && phone.length >= 12;

  // Reset invitation when modal is loaded
  useEffect(() => {
    // dispatch(resetMemberInvitation());
    if(props.showModal === true) {
      searchMembers('');
    }
  }, [props.showModal]);

  const searchMembers = (search) => {
    setSearch(search);
    setPageNumber(1);
    const data = {id: props.groupData.identifier, search: search, page: 1}
    dispatch(detailsGroupMemberListRequest(data));
  }

  const observer = useRef()
  const lastInviteMemberElementRef = useCallback(node => {
    try {
      if(detailsMemLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          nextPageMembers();
        }
      })
      if(observer.current && node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastInviteGroupMemberElementRef'})
    }
  }, [detailsMemLoading])

  // Set next page
  const nextPageMembers = () => {
    if(pageNumber < detailsMemPageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }

  useEffect(() => {
    if(pageNumber > 1) {
      const data = {id: props.groupData.identifier, search: searchText, page: pageNumber}
      dispatch(detailsGroupMemberListRequest(data));
    }
  }, [pageNumber]);

  const selectAsOwner = (user) => {
    setNewOwner(user)
  }

  const assignGroupOwner = () => {
    if(!newOwner.identifier){
      alert.error('Please select user to give ownership.')
      return false
    }
    else if(newOwner.identifier === ownerIdentifier) {
      alert.error('The specified user is already the group owner.')
      return false
    }
    const identifier = newOwner.identifier;
    const payload = {
      group_id: props.groupData.identifier,
      identifier
    }
    dispatch(assignNewGroupOwnerRequest(payload));
  }

  useEffect(() => {
    try {
      if(OwnerGrpFlag === 1) {
        const {identifier, role, oldRole} = OwnerGrpSuccess;
        const updatedList = detailsMemList.map(data => data.identifier === identifier ? {...data, role} : data);
        const newUpdatedList = updatedList.map(data => data.identifier === ownerIdentifier ? {...data, role : 'admin'} : data);
        dispatch(detailsGroupMemberListUpdate(newUpdatedList));
        if(props.updateOnParent){
           OwnerGrpSuccess.user = newOwner
           OwnerGrpSuccess.group_id = props.groupData.identifier
           props.updateOnParentData(OwnerGrpSuccess) 
        }
        props.onHideModal(false);
      }
      else if(OwnerGrpFlag === 2) {
        const {message} = OwnerGrpError;
        if(message && message?.message !== '') {
          alert.error(message?.message)
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:OwnerGrpFlag'})
    }
  }, [OwnerGrpFlag])
  
  useEffect(() => {
    try {
      if(detailsMemList && detailsMemList.length > 0) {
        var newOwnerIdentifier = detailsMemList.map(item => {
          if(item.role === 'owner') {
            return item.identifier
          }
        });
        newOwnerIdentifier = newOwnerIdentifier.filter(function( element ) {
          return element !== undefined;
        });
        setOwnerIdentifier(newOwnerIdentifier[0]);
      } 
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:detailsMemList'})
    }
  }, [detailsMemList])

  const [copiedText, setCopiedText] = useState("Copy");
  const onCopy = identifier => {
    setCopiedText('Copied!');
  }

  const resetModal = () => {
    setOwnerIdentifier("");
    setSearch("");
    setPageNumber(1);
    setNewOwner({})
  }

  return (
    <Modal size="lg" show={props.showModal} backdrop="static" onExited={() => resetModal()} onHide={() => props.onHideModal(false)} aria-labelledby="example-modal-sizes-title-lg" className="invite-assign-modal">
      <Modal.Header>
        <div className="back-btn">
          <a href="#" onClick={() => props.onHideModal(false)}>
            {CloseProfileIcon}
          </a>
        </div>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Assign New Group Owner
      </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-invite-group">
        <p className="assign-admin-heading">Assign a new Group Owner. The current Owner will become an Admin by default.</p>
        <div className="full-search-box ui-widget ">
          <input type="text" value={searchText} onChange={(e) => searchMembers(e.target.value)} className="txt-search" id="txt-search" placeholder=" Search for users " />
        </div>

        {/* Loop through members */}
        {detailsMemList && detailsMemList.length > 0 &&
        <>
          <div className="invite-heading">
            <h4>{props.groupData.name}</h4>
            <p>({detailsMemPageInfo?.total_entries} Members) {ChevronUpIcon}</p>
          </div>
          <div className="member-list-data admin-panel">
            {detailsMemList.map((data, key) =>
              <div key={key} className="member-info admin-part" ref={lastInviteMemberElementRef}>
                <SingleProfile name={data.name} avatarUrl={data.avatar_url} userId={data.identifier} detail={props.groupData.name} from='admin'/>
                <div className="communication">
                  {data.status === 'invited' &&
                    <span className="btn btn-round btn-gray btn-invited">Invited</span>
                  }
                  {data.status !== 'invited' &&
                  <span onClick={() => selectAsOwner(data)} className={`btn btn-round ${newOwner.identifier === data.identifier ? 'btn-blue' : ( newOwner.identifier ? 'btn-gray' : 'btn-green' ) }` }>Assign Owner</span>
                  }
                </div>
              </div>
            )
            }
          </div>
        </>
        }
        {detailsMemList && detailsMemList.length == 0 &&
        <>
          <div className="invite-heading">
            <h4>{props.groupData.name}</h4>
            <p>(0 Members) {ChevronUpIcon}</p>
          </div>
          {!detailsMemLoading &&
          <div className="member-list-data admin-panel">
            <div className="member-info admin-part">
              <p className="m-0 text-center w-100">No member found</p>
            </div>
          </div>
          }
        </>
        }
      </Modal.Body>
      <Modal.Footer className="admin-member-list-close d-flex justify-content-center">
        {/* <button type="button" className={`btn btn-green md-box btn-medium`}
          onClick={() => props.onHideModal(false)} >Done </button> */}

        <a className={`btn mr-5`} onClick={() => props.onHideModal(false)} >Cancel </a>
        <button type="button" className={`btn btn-green md-box btn-medium ${newOwner.identifier ? 'btn-green' : 'btn-gray pt-2 pb-2'}`}
          onClick={() => assignGroupOwner()} >Transfer Ownership </button>
      </Modal.Footer>
    </Modal>
  )
}
InviteToGroupModal.propTypes = {
  showModal: PropTypes.bool,
  updateOnParent: PropTypes.bool,
  groupData: PropTypes.object,
  onHideModal: PropTypes.func,
};
InviteToGroupModal.defaultProps = {
  showModal: false,
  groupData: {},
  updateOnParent: false,
};
export default InviteToGroupModal;
