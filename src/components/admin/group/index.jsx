import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import ContentHeader from './contentHeader';
import ContentAllGroup from './contentAllGroup';
import Loader from '../../Loader';
import CreateGroup from "./CreateGroup";
import {adminEditGroupDetailsRequest} from '../../../store/actions';

import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\group\\index.jsx";

const Index = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const activeClass = 'nav-link active';
  const {loadingAdmGrp, editGroupDetails} = useSelector(({adminGroup}) => adminGroup);
  const [componentLoad, setComponentLoad] = useState(false);
  const [search, setSearch] = useState('');
  const [createGroupShow, setCreateGroupShow] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const searchArc = (item) => {
    setSearch(item);
  }

  const showCreateGroupBox = (event) => {
    setCreateGroupShow(event);
    setEditData({})
    setIsEdit(false)
  }

  const showEditGroup = (gID) => {
    setIsEdit(true);
    dispatch(adminEditGroupDetailsRequest(gID));
  }
  
  useEffect(() => {
    try {
      if (editGroupDetails && editGroupDetails.name) {
        setEditData(editGroupDetails);
        setCreateGroupShow(true);
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:editGroupDetails' })
    }
  }, [editGroupDetails]);

  return (
    <div className="content-sec">
      <div className="scroll" id="main-content" style={{'scrollBehavior': 'smooth'}}>
        <div className="container-fluid">
          <Loader visible={loadingAdmGrp} />
          <ContentHeader searchArc={searchArc} showCreateGroupBox={showCreateGroupBox}/>
          <div className="page-contain">
            <div className="tab-section">
              <div className="tab-content align-items-start headers pr-0">
                <div className="card tab-pane active">
                  <div className="collapse show">
                    <ContentAllGroup search={search} editGroup={showEditGroup}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CreateGroup
            show={createGroupShow}
            hide={showCreateGroupBox}
            editData={editData}
            is_edit={isEdit}
          />
        </div>
      </div>
    </div>
  )
}
export default Index;
