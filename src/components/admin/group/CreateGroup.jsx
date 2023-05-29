import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from './../../spinner';
import Image from './../../common/Image';
import ImageSize from './../../common/ImageSize';
import {organizationListRequest} from './../../../store/actions/group';
import {adminGroupListRequest, adminGroupDetailsRequest, adminGroupDetailsSuccess, createAdminGroupRequest, updateAdminGroupRequest, adminGroupListUpdate} from './../../../store/actions';
import ImageCrop from "../../common/ImageCrop";
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\group\\CreateGroup.jsx";

const CreateGroup = props => {
  const dispatch = useDispatch();
  const defaultOrganizationId = localStorage.getItem("admin_identifier");
  const defaultOrganizationName = localStorage.getItem("admin_name");
  const {orgList} = useSelector(({group}) => group);
  const {adminGroupList, adminGroupDetails, groupCreateFlag, groupCreateLoading, groupCreateError, updateGrpFlag, updateGrpFlagLoading, updateGrpError, updateGrpSuccess} = useSelector(({adminGroup}) => adminGroup);
  const [uniqueGroup, setUniqueGroup] = useState(null);
  const [imageData, setImageData] = useState({preview: '', binaryData: ''});
  const [editData, setEditData] = useState({group_id: '', affiliation_mode: '', status: '', visibility: ''});
  const [invalidImage, setInvalidImage] = useState('d-none');
  const [invalidImageSize, setInvalidImageSize] = useState('d-none');
  const [invalidImageDimensions, setInvalidImageDimensions] = useState('d-none');
  const [validForm, setValidForm] = useState(false);
  const [imageCropModal, setImageCropModal] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [imageDataSize, setImageDataSize] = useState('');
  const [imageDataValid, setImageDataValid] = useState(false);
  const [organizationData, setOrganizationData] = useState([]);
  const [groupError, setGroupErrors] = useState({});
  const [secutiryValue, setSecutiryValue] = useState({groupName_input: false, groupDescription_input: false});
  const [values, setGroupValues] = useState({});
  const [defaultOrg, setDefaultOrg] = useState([]);
  const [organizationName, setOrganizationName] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    dispatch(organizationListRequest());
  }, []);

  // Hook, Create group
  useEffect(() => {
    try {
      if(orgList && orgList.eventData && orgList.eventData.entries.length > 0) {
        const cutomvalue = orgList.eventData.entries.map(item => {
          return {label: item.name, value: item.identifier}
        });
        setOrganizationData(cutomvalue);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:orgList'})
    }
  }, [orgList]);

  const onImageChange = (event) => {
    if(event.target.files && event.target.files[0]) {
      const tempSize = event.target.files[0].size;
      const imgsize = tempSize / 1024;
      const type = event.target.files[0].type;
      const imgType = type.split('/').pop();
      // Check image extension
      if(imgType !== 'jpeg' && imgType !== 'jpg' && imgType !== 'png' && imgType !== 'gif') {
        setInvalidImage("");
        setInvalidImageSize("d-none");
        setInvalidImageDimensions("d-none")
      } else if(imgsize > 500) {
        setInvalidImageSize("");
        setInvalidImage("d-none");
        setInvalidImageDimensions("d-none")
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageDataSize(e.target.result);
          setImageDataValid(true);
        };
        const binaryData = event.target.files[0]
        reader.readAsDataURL(binaryData);
        setInvalidImage("d-none");
        setInvalidImageSize("d-none");
        setInvalidImageDimensions("d-none")
      }
    }
  }

  const handleOnLoaded = imageDimenstions => {
    var dimensions = imageDimenstions;
    if(dimensions.width > 1200) {
      setInvalidImage("d-none");
      setInvalidImageSize("d-none");
      setInvalidImageDimensions("");
    }
    else if(imageDataValid) {
      setImageDataValid(false);
      setCropImage(imageDataSize);
      setImageCropModal(true);
    }
  }

  // Hook, Create group
  useEffect(() => {
    // Success
    try {
      if(groupCreateFlag === 1) {
        setGroupValues({organizationId: '', groupName: '', groupDescription: ''});
        setSecutiryValue({groupName_input: false, groupDescription_input: false})
        setImageData({preview: ''});
        const payload = {organizationId: defaultOrganizationId, search: '', page: 1, order: 'name'}
        dispatch(adminGroupListRequest(payload));
        props.hide(false);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:groupCreateFlag'})
    }
  }, [groupCreateFlag]);

  // Hook, Update group
  useEffect(() => {
    try {
      if(updateGrpFlag === 1) {
        const { identifier, name, description, avatar_url } = updateGrpSuccess;
        const updatedList = adminGroupList.map(data => data.identifier === identifier ? { ...data, name: name, avatar_url } : data);
        dispatch(adminGroupListUpdate(updatedList));
        setGroupValues({organizationId: '', groupName: '', groupDescription: ''});
        setSecutiryValue({groupName_input: false, groupDescription_input: false})
        setImageData({preview: ''});
        dispatch(adminGroupDetailsSuccess(({
          ...adminGroupDetails, name, description, avatar_url
        })));
        props.hide(false);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:updateGrpFlag'})
    }
  }, [updateGrpFlag]);

  useEffect(() => {
    if(props.is_edit) {
      setEditData({
        group_id: props.editData.identifier,
        affiliation_mode: props.editData.affiliation_mode,
        status: props.editData.status,
        visibility: props.editData.visibility,
      });
      setGroupValues({
        organizationId: defaultOrganizationId,
        groupName: props.editData.name,
        groupDescription: props.editData.description
      })
      setOrganizationName(defaultOrganizationName);
      setDefaultOrg({label: defaultOrganizationName, value: defaultOrganizationId});
      setIsDisabled(true);
      if(props.editData.avatar_url) {
        setImageData({preview: props.editData.avatar_url});
      }
      setValidForm(true);
    }
    else {
      setEditData({group_id: '', affiliation_mode: '', status: '', visibility: ''});
      setGroupValues({organizationId: '', groupName: '', groupDescription: ''});
      setSecutiryValue({groupName_input: false, groupDescription_input: false})
      setImageData({preview: ''});
      setOrganizationName(defaultOrganizationName);
      setDefaultOrg({label: defaultOrganizationName, value: defaultOrganizationId});
      setGroupValues({organizationId: defaultOrganizationId, groupName: '', groupDescription: ''});
      setIsDisabled(true);
      setValidForm(false);
    }
  }, [props.is_edit, props.editData]);

  // Hook, Duplicate group name
  useEffect(() => {
    try {
      if(groupCreateError.message) {
        if(groupCreateError.message === "name has already been taken") {
          setUniqueGroup('Group name has already been taken');
        } else {
          setUniqueGroup(null);
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:groupCreateError'})
    }
  }, [groupCreateError]);

  // Show update group error
  useEffect(() => {
    try {
      if(updateGrpError.message) {
        if(updateGrpError.message === "name has already been taken") {
          setUniqueGroup('Group name has already been taken');
        } else {
          setUniqueGroup(null);
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:updateGrpError'})
    }
  }, [updateGrpError]);

  const selectedOrg = React.useRef(null);
  const handelCreateGroup = data => {
    setInvalidImage("d-none");
    setInvalidImageSize("d-none");
    setInvalidImageDimensions("d-none")
    setUniqueGroup(null);
    const formData = new FormData();
    formData.append('organization_id', values.organizationId);
    formData.append('name', values.groupName);
    formData.append('description', values.groupDescription);
    formData.append('affiliation_mode', editData.affiliation_mode);
    formData.append('status', editData.status);
    formData.append('visibility', editData.visibility);
    formData.append('image', imageData.binaryData);
    formData.append('image_preview', imageData.preview);
    if(editData.group_id !== '') {
      formData.append('group_id', editData.group_id);
      dispatch(updateAdminGroupRequest(formData));
    } else {
      dispatch(createAdminGroupRequest(formData));
    }
  }

  // Reset group details when modal displayed
  const resetGroupDetails = () => {
    setImageData({preview: '', binaryData: ''});
  }

  const validateGroup = (valuesGroup) => {
    var isValid = true;
    var pErrors = {};
    if(valuesGroup.organizationId === '') {
      pErrors.organizationId = 'Organization name is required';
      isValid = false;
    }
    else if(secutiryValue.groupName_input && valuesGroup.groupName === '') {
      pErrors.groupName = 'Group name is required';
      isValid = false;
    }
    /* else if(secutiryValue.groupDescription_input && valuesGroup.groupDescription === '') {
      pErrors.groupDescription = 'Group details is required';
      isValid = false;
    } */
    if(valuesGroup.groupName === '') {
      isValid = false;
    }
    /* else if(valuesGroup.groupDescription === '') {
      isValid = false;
    } */
    if(isValid) {
      setValidForm(true);
    }
    else {
      setValidForm(false);
    }
    return pErrors;
  }

  const handleGroupChange = (event) => {
    values[event.target.name] = event.target.value.trim();
    if(event.target.value) {
      secutiryValue[`${event.target.name}_input`] = true;
    }
    setGroupErrors(validateGroup(values));
  };

  const changeOrganization = (selected) => {
    setDefaultOrg(selected);
    setOrganizationName(selected.label);
    values['organizationId'] = selected.value;
    setGroupErrors(validateGroup(values));
  }

  const focusOrganization = value => {
    if(organizationName === '') {
      setOrganizationName(' ');
    }
  }
  
  const focusOutOrganization = value => {
    if(organizationName.trim() === '') {
      setOrganizationName('');
    }
  }

  const resetModal = () => {
    setUniqueGroup(null);
  }

  const onCropCompleted = blobData => {
    const formData = new FormData()
    formData.append('image', blobData);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(preValues => ({...preValues, preview: e.target.result}));
    };
    const binaryData = formData.get('image');
    reader.readAsDataURL(blobData);
    setImageData(preValues => ({...preValues, binaryData}));
    onCropCancelled();
  }

  const onCropCancelled = () => {
    setImageCropModal(false);
    imageRef.current.value = null;
    setImageDataSize("");
  }

  const hideCreateModel = (e) => {
    setInvalidImage("d-none");
    setInvalidImageSize("d-none");
    setInvalidImageDimensions("d-none")
    setSecutiryValue({groupName_input: false, groupDescription_input: false})
    setGroupErrors([]);
    props.hide(false);
  }

  return (
    <>
      <Modal size="lg" show={props.show} backdrop="static"
        onExited={() => resetModal()} onHide={hideCreateModel}
        aria-labelledby="example-modal-sizes-title-lg" onExit={resetGroupDetails} >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
            {editData.group_id !== '' ? 'Edit' : 'Create'} Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="upload-img-info">
            <div className="upload-img">
              <div className="file-upload">
                <input type="file" name="" ref={imageRef} className="img-upload-btn" id="img-upload-btn" onChange={(e) => onImageChange(e)} />
              </div>
              <div className="img-upload" onClick={() => imageRef.current.click()}>
                <Image size="group" src={imageData.preview} altText="Group" />
                <ImageSize size="group" src={imageDataSize} onLoaded={handleOnLoaded} altText="Group" />
              </div>
            </div>
            <div className="img-data">
              <h5>Group Profile Photo</h5>
              <p>Upload a group photo or default to your personal profile image.</p>
            </div>
          </div>
          <div className="errorbox">
            <span className={`text-error ${invalidImage}`}>Please select only .jpg, .jpeg, .png and .gif file.</span>
            <span className={`text-error ${invalidImageSize}`}>Upload file size limit is maximum 500kb.</span>
            <span className={`text-error ${invalidImageDimensions}`}>Upload file dimension limit is maximum 1200px.</span>
          </div>
          <div className="form-data">
            <form className="form-sec">
              <div className="form-group orglist-box">
                <div className="orglist-box-option">
                  <Dropdown className={`${defaultOrg?.label ? 'activedropdown' : ''}`}>
                    <Dropdown.Toggle as="a" className={`btn ${isDisabled ? 'disabled-dropdown' : ''}`}>
                      {defaultOrg?.label ? defaultOrg.label : ''}
                    </Dropdown.Toggle>
                    {!isDisabled &&
                    <Dropdown.Menu>
                      {organizationData.length > 0 && organizationData.map((v, k) => {
                          return (
                            <Dropdown.Item disabled={isDisabled} className="checkbox" key={k} onClick={() => changeOrganization(v)}>
                              <input type="checkbox" readOnly={true} className="checkbox-input" checked={defaultOrg?.value === v.value ? true : false} />
                              <label className="checkbox-lable">{v.label}</label>
                            </Dropdown.Item >
                          )
                        })
                      }
                    </Dropdown.Menu>
                    }
                    <label className="txt-label">Organization Name</label>
                  </Dropdown>
                  {/* <div className="bg-black-500" style={{'zIndex': '1'}}>
                    <Select
                      // menuIsOpen={true}
                      isDisabled={isDisabled}
                      isSearchable={true}
                      value={defaultOrg}
                      onChange={changeOrganization}
                      onMenuOpen={focusOrganization}
                      onMenuClose={focusOutOrganization}
                      options={organizationData}
                      placeholder=""
                    />
                    <label className={organizationName ? 'top-5' : ''}>Organization Name</label>
                  </div> */}
                  {groupError.organizationId && (<span className="text-error">{groupError.organizationId}</span>)}
                </div>
              </div>
              <div className="form-group">
                <div className={`bg-black-500 ${uniqueGroup && 'err-div'}`}>
                  <input type="text" name="groupName" className="form-control" required defaultValue={values.groupName}
                    onKeyUp={(e) => handleGroupChange(e)} onChange={(e) => handleGroupChange(e)} maxLength="64" />
                  <label className="txt-label">Group Name</label>
                  {groupError.groupName && (<span className="text-error">{groupError.groupName}</span>)}
                  {(uniqueGroup && !groupError.groupName) && <span className="text-error">{uniqueGroup}</span>}
                </div>
              </div>
              <div className="form-group">
                <div className="bg-black-500">
                  <textarea className="form-control groupDescription" name="groupDescription"
                    required onKeyUp={(e) => handleGroupChange(e)} onChange={(e) => handleGroupChange(e)} cols="30" rows="10" placeholder=""
                    maxLength="500" defaultValue={values.groupDescription}></textarea>
                  <label className="txt-label">Group Description</label>
                  {groupError.groupDescription && (<span className="text-error">{groupError.groupDescription}</span>)}
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <button type="button" className="btn bg-black-900 md-box btn-medium clr-white" onClick={hideCreateModel}>Cancel</button>
          <button type="button" className={`btn btn-green md-box btn-medium ${!validForm && 'btn-gray-500'}`}
            onClick={handelCreateGroup}
            disabled={!validForm || groupCreateLoading || updateGrpFlagLoading}>Continue {(groupCreateLoading || updateGrpFlagLoading) && <Spinner />} </button>
        </Modal.Footer>
      </Modal>
      <ImageCrop
        image={cropImage}
        show={imageCropModal}
        onCropCompleted={onCropCompleted}
        onCropCancelled={onCropCancelled}
      />
    </>
  );
}
CreateGroup.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  editData: PropTypes.object,
  is_edit: PropTypes.bool,
};
CreateGroup.defaultProps = {
  show: false,
  organizationId: '',
  editData: {},
  is_edit: false,
};
export default CreateGroup;
