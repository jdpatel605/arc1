import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types';
import { useAlert } from 'react-alert'
import Image from '../../common/Image';
import { getAllOwnerUsersRequest, changeAdminUserRoleRequest } from '../../../store/actions';
import { CloseProfileIcon, ChevronUpIcon } from "../../../utils/Svg";
import TruncationText from "../../common/TruncationText";
import {Helper} from './../../../utils/helper';
import SingleProfile from "../../profile/SingleProfile";
import EmptyUser from './EmptyUser';
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\user\\OwenrshipModal.jsx";
const Str = require('string');

const OwnershipModal = props => {
  const dispatch = useDispatch();
  const { ownerListLoading, ownerList, ownerListPageInfo, orgDetail } = useSelector(({user}) => user);
  const [ListPageNumber, setListPageNumber] = useState(1);
  const [sortOrder, setSortOrder] = useState('name');
  const [searchText, setSearch] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModalFlag, setSuccessModal] = useState(false);
  const [newOwner, setNewOwner] = useState({});
  const alert = useAlert()
  
  // Reset search when modal is loaded
  useEffect(() => {
    if(props.showModal === true) {
      searchMembers('');
    }
  }, [props.showModal]);

  const searchMembers = (search) => {
    setSearch(search);
    setListPageNumber(1);
    const data = { search: search, page: 1, order: sortOrder}
    dispatch(getAllOwnerUsersRequest(data));
  }
   
  const observer = useRef()
  const lastListElementRef = useCallback(node => {
    try {
      if(ownerListLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(ListPageNumber < ownerListPageInfo.total_pages) {
            setListPageNumber(ListPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastListElementRef'})
    }
  }, [ownerListLoading])

  useEffect(() => {
    if(props.showModal === true) {
      if(props.search !== '') {
        const data = {search: searchText, page: ListPageNumber, order: sortOrder}
        dispatch(getAllOwnerUsersRequest(data));
      }
      else {
        const data = {page: ListPageNumber, order: sortOrder}
        dispatch(getAllOwnerUsersRequest(data));
      }
    }
  }, [ListPageNumber]);

    const resetModal = () => {
        setSearch("");
        setListPageNumber(1);
        setNewOwner({})
    }
    
    const selectAsOwner = (user) => {
        setNewOwner(user)
    }
    
    const transferOwnerShip = () => {
        if(!newOwner.identifier){
            alert.error('Please select user to give ownership.')
            return false
        }
        dispatch(changeAdminUserRoleRequest({user_id: newOwner.identifier, role: 'owner'}))
        props.onHideModal(false)
        
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
          Assign New Org Owner
      </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-invite-group">
        <p className="assign-admin-heading">Assign a new Org Owner. The current Owner will become an Admin by default.</p>
        <div className="full-search-box ui-widget ">
          <input type="text" value={searchText} onChange={(e) => searchMembers(e.target.value)} className="txt-search" id="txt-search" placeholder=" Search for users " />
        </div>

        {/* Loop through members */}
        {ownerList && ownerList.length > 0 &&
        <>
          <div className="invite-heading">
            <h4>{orgDetail.name}</h4>
            <p>({ownerListPageInfo?.total_entries} Members) {ChevronUpIcon}</p>
          </div>
          <div className="member-list-data admin-panel">
            {ownerList.map((item, key) =>
              <div key={key} className="member-info admin-part" ref={lastListElementRef}>
                <SingleProfile name={item.name} from="admin" detail={orgDetail.name} avatarUrl={item.avatar_url} userId={item.identifier} />
                
                <div className="communication">
                  {item.status !== 'invited' &&
                  <span onClick={() => selectAsOwner(item)} className={`btn btn-round ${newOwner.identifier === item.identifier ? 'btn-blue' : ( newOwner.identifier ? 'btn-gray' : 'btn-green' ) }` }>Assign Owner</span>
                  }
                </div>
              </div>
            )
            }
          </div>
        </>
        }
        {ownerList && ownerList.length == 0 &&
        <>
          <div className="invite-heading">
            <h4>{orgDetail.name}</h4>
            <p>(0 Members) {ChevronUpIcon}</p>
          </div>
          <div className="member-list-data admin-panel">
            <div className="member-info admin-part">
              <p className="m-0 text-center w-100">No member found</p>
            </div>
          </div>
        </>
        }
      </Modal.Body>
      <Modal.Footer className="">
        <a className={`btn `} onClick={() => props.onHideModal(false)} >Cancel </a>
        
        <button type="button" className={`btn md-box btn-medium ${newOwner.identifier ? 'btn-green' : 'btn-gray'}`}
          onClick={() => transferOwnerShip()} >Transfer Ownership </button>
      </Modal.Footer>
    </Modal>
        
  )
}
OwnershipModal.propTypes = {
   currentOwnerUser: PropTypes.object,
   onHideModal: PropTypes.func,
   showModal: PropTypes.bool,
};
OwnershipModal.defaultProps = {
  search: '',
  showModal: false,
  currentOwnerUser: {},
};
export default OwnershipModal;
