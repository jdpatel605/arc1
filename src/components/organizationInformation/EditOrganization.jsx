import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import Select from 'react-select';
import Spinner from '../spinner';
import {Logger} from '../../utils/logger';
import UserImage from './../common/UserImage';
import ImageSize from './../common/ImageSize';
import ImageCrop from './../common/ImageCrop';
import {updateOrganizationRequest, getStateListRequest, getCountryRequest} from "../../store/actions";

const fileLocation = "src\\components\\organizationInformation\\EditOrganization.jsx";
const defaultValidation = {
  name: "", description: "", main_phone_number: "", email: "", give_url: ""
};

const EditOrganization = props => {
  const dispatch = useDispatch();
  const {country} = useSelector(({profile}) => profile);
  const {currentOrg, updateFlag, updateFlagLoading, stateList, editOrgError} = useSelector(({organization}) => organization);
  const [editError, setEditError] = useState('');
  const [editOrganization, setEditOrganization] = useState([]);
  const [validForm, setValidForm] = useState(false);
  const [organizationDetails, setOrganizationDetails] = useState({});
  const [validationErrors, setValidationErrors] = useState(defaultValidation);
  const [values, setGroupValues] = useState({});
  const [invalidImage, setInvalidImage] = useState('d-none');
  const [invalidImageSize, setInvalidImageSize] = useState('d-none');
  const [invalidImageDimensions, setInvalidImageDimensions] = useState('d-none');
  const [imageCropModal, setImageCropModal] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [imageDataSize, setImageDataSize] = useState('');
  const [imageDataValid, setImageDataValid] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/images/original.jpg');
  const [binaryData, setBinaryData] = useState([]);
  const [stateListData, setStateListData] = useState([]);
  const [stateRefresh, setStateRefresh] = useState(false);
  const [defaultStateData, defaultState] = useState([]);
  const [stateSelect, setStateSelect] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countrySel, selectedCountry] = useState('');
  const [defaultCountryData, defaultCountry] = useState([]);
  const [countryListData, countryList] = useState([]);

  const [BBInvalidImage, setBBInvalidImage] = useState('d-none');
  const [BBInvalidImageSize, setBBInvalidImageSize] = useState('d-none');
  const [BBInvalidImageDimensions, setBBInvalidImageDimensions] = useState('d-none');
  const [BBImageDataSize, setBBImageDataSize] = useState('');
  const [BBImageDataValid, setBBImageDataValid] = useState(false);
  const [BBCropImage, setBBCropImage] = useState('');
  const [BBImageCropModal, setBBImageCropModal] = useState(false);
  const [BBSelectedImage, setBBSelectedImage] = useState('/images/original.jpg');
  const [BBBinaryData, setBBBinaryData] = useState([]);

  const imageRef = useRef(null);
  const bbImageRef = useRef(null);

  useEffect(() => {
    if(currentOrg && currentOrg.name) {
      setOrganizationDetails({
        name: (currentOrg.name || ""),
        description: (currentOrg.description || ""),
        email: (currentOrg.email || ""),
        give_url: (currentOrg.give_url || ""),
        additional_link: (currentOrg.additional_link || ""),
        subname: (currentOrg?.subname || ""),
        address: (currentOrg?.address?.street || ""),
        postalcode: (currentOrg?.address?.postalcode || ""),
        city: (currentOrg?.address?.city || ""),
        state: (currentOrg?.address?.state || ""),
        country: (currentOrg?.country?.alpha3 || ""),
        country_code: (currentOrg?.country?.dialing_prefix || ""),
        // main_phone_number: currentOrg?.main_phone_number ? currentOrg?.main_phone_number.replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s/g, '') : '',
        main_phone_number: currentOrg?.main_phone_number ? currentOrg?.main_phone_number.length === 13 ? currentOrg?.main_phone_number.slice(3) : currentOrg?.main_phone_number.slice(2) : '',
        visibility: (currentOrg.visibility || "public"),
      });
      delete currentOrg?.country?.flag_image_url;
      defaultCountry([currentOrg?.country]);
      onHandleSearch(currentOrg?.country?.name);
      dispatch(getStateListRequest(currentOrg?.country?.alpha3));
      setStateSelect(currentOrg?.address?.state);
      setSelectedImage(currentOrg.avatar_url);
      setBBSelectedImage(currentOrg.billboard_url);
      setEditOrganization(currentOrg)
    }
  }, [currentOrg]);

  useEffect(() => {
    if(stateList) {
      if(!stateRefresh) {
        const tempStateValue = stateList.map(item => {
          if(currentOrg?.address?.state === item.value) {
            return {label: item.text, value: item.value}
          }
        });
        const stateValue = tempStateValue.filter(function( element ) {
          return element !== undefined;
        });
        defaultState(stateValue[0]);
      }
      const cutomvalue = stateList.map(item => {
        return {label: item.text, value: item.value}
      });
      setStateListData(cutomvalue);
    }
  }, [stateList]);

  const changeState = (selected) => {
    console.log(selected);
    defaultState(selected);
    setStateSelect(selected.label);
    const updatedValues = {...organizationDetails, ['state']: selected.value};
    setOrganizationDetails(updatedValues)
  }

  const inputChangeState = (value) => {
    if(stateSelect === '') {
      const updatedValues = {...organizationDetails, ['state']: ''};
      setOrganizationDetails(updatedValues)
      setStateSelect(value);
    }
  }

  const focusState = value => {
    if(stateSelect === '') {
      setStateSelect(' ');
    }
  }

  const focusOutState = value => {
    if(stateSelect.trim() === '') {
      setStateSelect('');
    }
  }

  useEffect(() => {
    countryList(country);
    setIsLoading(false);
  }, [country]);

  const onHandleSearch = (term) => {
    setIsLoading(true);
    var data = {search: term};
    dispatch(getCountryRequest(data));
    selectedCountry(term);
  }

  /* const inputCountry = (term) => {
    const updatedValues = {...organizationDetails, ['country']: term};
    setOrganizationDetails(updatedValues)
  } */

  const changeCountry = (selected) => {
    console.log('callllllllllllllllll')
    if(selected.length) {
      defaultState([]);
      dispatch(getStateListRequest(selected[0]['alpha3']));
      selectedCountry(selected[0]['alpha3']);
      organizationDetails['country'] = selected[0]['alpha3'];
      const updatedValues = {...organizationDetails, ['state']: '', ['country_code']: selected[0]['dialing_prefix']};
      setOrganizationDetails(updatedValues)
      setStateSelect('');
      setStateListData([]);
      setStateRefresh(true);
    } else {
      selectedCountry('');
      const updatedValues = {...organizationDetails, ['country']: '', ['country_code']: ''};
      setOrganizationDetails(updatedValues)
    }
  }

  useEffect(() => {
    // Success
    setEditError('');
    try {
      if(updateFlag === 2) {
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:updateFlag'})
    }
  }, [updateFlag]);
  
  useEffect(() => {
    try {
      if(editOrgError) {
        setEditError(editOrgError.message)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:editOrgError'})
    }
  }, [editOrgError]);

  const handelUpdateOrganization = data => {
    const formData = new FormData();
    const addressArray = {
      city: organizationDetails.city,
      postalcode: organizationDetails.postalcode,
      state: organizationDetails.state,
      street: organizationDetails.address
    }
    formData.append('org_image', binaryData);
    formData.append('org_BBimage', BBBinaryData);
    formData.append('additional_link', organizationDetails.additional_link);
    formData.append('address', organizationDetails.address);
    formData.append('city', organizationDetails.city);
    formData.append('postalcode', organizationDetails.postalcode);
    formData.append('state', organizationDetails.state);
    formData.append('country', organizationDetails.country);
    formData.append('country_code', organizationDetails.country_code);
    formData.append('description', organizationDetails.description);
    formData.append('email', organizationDetails.email);
    formData.append('give_url', organizationDetails.give_url);
    formData.append('main_phone_number', organizationDetails.main_phone_number);
    formData.append('name', organizationDetails.name);
    formData.append('subname', organizationDetails.subname);
    formData.append('visibility', organizationDetails.visibility);
    dispatch(updateOrganizationRequest({
      id: props.id,
      data: formData
    }));
  }

  // Update state
  const updateStateValue = (event) => {
    const {name, value} = event.target;
    const updatedValues = {...organizationDetails, [name]: value};
    setOrganizationDetails(updatedValues)
  };

  // Validate Organization details
  useEffect(() => {
    let errorsCount = 0;
    // Organization name
    if(!organizationDetails.name) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, name: "Organization name is required"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, name: ""}));
    }

    // Email
    const emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!organizationDetails.email) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, email: "Email Address is required"}));
    } else if(!emailTest.test(organizationDetails.email)) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, email: "Email Address is invalid"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, email: ""}));
    }

    // Url
    if(!organizationDetails.give_url) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, give_url: "Url is required"}));
    } else if(!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(organizationDetails.give_url)) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, give_url: "Url is not valid"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, give_url: ""}));
    }

    // Address
    if(!organizationDetails.address) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, address: "Address is required"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, address: ""}));
    }

    // Postalcode
    if(!organizationDetails.postalcode) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, postalcode: "Postal code is required"}));
    } else if(!/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(organizationDetails.postalcode)) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, postalcode: "Only alphanumeric allow"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, postalcode: ""}));
    }
    
    // city
    if(!organizationDetails.city) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, city: "City is required"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, city: ""}));
    }

    // state
    if(!organizationDetails.state) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, state: "State/Province is required"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, state: ""}));
    }

    // country
    if(!organizationDetails.country) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, country: "Country is required"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, country: ""}));
    }

    // Phone number
    var newPhone = organizationDetails.main_phone_number;
    if(organizationDetails.main_phone_number && organizationDetails.main_phone_number.length !== 10) {
      var newPhone = organizationDetails.main_phone_number.replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s/g, '');
    }
    if(!organizationDetails.main_phone_number) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, main_phone_number: "Phone Number is required"}));
    } else if(newPhone.length < 10) {
      errorsCount++;
      setValidationErrors(prevProps => ({...prevProps, main_phone_number: "Phone Number is invalid"}));
    } else {
      setValidationErrors(prevProps => ({...prevProps, main_phone_number: ""}));
    }

    if(errorsCount === 0) {
      setValidForm(true);
    }
    else {
      setValidForm(false);
    }

  }, [organizationDetails])

  const resetModal = () => {

  }

  const hideOrgSection = (e) => {
    props.hide(false);
  }

  const beforeMaskedValueChange = (newState, oldState, userInput) => {
    var {value} = newState;
    var selection = newState.selection;
    var cursorPosition = selection ? selection.start : null;

    // keep minus if entered by user
    if(value.endsWith('-') && userInput !== '-' && !organizationDetails.main_phone_number.endsWith('-')) {
      if(cursorPosition === value.length) {
        cursorPosition--;
        selection = {start: cursorPosition, end: cursorPosition};
      }
      value = value.slice(0, -1);
    }

    return {value, selection};
  }

  const displayErrorMessage = data => {
    if(typeof data === 'object') {
      return <span className="text-error">{data.message}</span>
    } else {
      return <span className="text-error">{data}</span>
    }
  }

  const onImageChange = (event) => {
    if(event.target.files && event.target.files[0]) {
      var tempSize = event.target.files[0].size;
      var imgsize = tempSize / 1024;
      var type = event.target.files[0].type;
      var imgType = type.split('/').pop();

      if(imgType !== 'jpeg' && imgType !== 'jpg' && imgType !== 'png' && imgType !== 'gif') {
        setInvalidImage("");
        setInvalidImageSize("d-none");
        setInvalidImageDimensions("d-none")
      }
      else if(imgsize > 500) {
        setInvalidImageSize("");
        setInvalidImage("d-none");
        setInvalidImageDimensions("d-none")
      }
      else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageDataSize(e.target.result);
          setImageDataValid(true);
        };
        const binaryImageData = event.target.files[0]
        reader.readAsDataURL(binaryImageData);
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

  const onCropCompleted = blobData => {
    const formData = new FormData()
    formData.append('image', blobData);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    const binaryImageData = formData.get('image');
    reader.readAsDataURL(blobData);
    setBinaryData(binaryImageData);
    onCropCancelled();
  }

  const onCropCancelled = () => {
    setImageCropModal(false);
    imageRef.current.value = null;
    setImageDataSize("");
  }

  // BB image
  const onBBImageChange = (event) => {
    if(event.target.files && event.target.files[0]) {
      var tempSize = event.target.files[0].size;
      var imgsize = tempSize / 1024;
      var type = event.target.files[0].type;
      var imgType = type.split('/').pop();

      if(imgType !== 'jpeg' && imgType !== 'jpg' && imgType !== 'png' && imgType !== 'gif') {
        setBBInvalidImage("");
        setBBInvalidImageSize("d-none");
        setBBInvalidImageDimensions("d-none")
      }
      else if(imgsize > 500) {
        setBBInvalidImageSize("");
        setBBInvalidImage("d-none");
        setBBInvalidImageDimensions("d-none")
      }
      else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBBImageDataSize(e.target.result);
          setBBImageDataValid(true);
        };
        const binaryImageData = event.target.files[0]
        reader.readAsDataURL(binaryImageData);
        setBBInvalidImage("d-none");
        setBBInvalidImageSize("d-none");
        setBBInvalidImageDimensions("d-none")
      }
    }
  }

  const handleOnBBLoaded = imageDimenstions => {
    var dimensions = imageDimenstions;
    if(dimensions.width > 1200) {
      setBBInvalidImage("d-none");
      setBBInvalidImageSize("d-none");
      setBBInvalidImageDimensions("");
    }
    else if(BBImageDataValid) {
      setBBImageDataValid(false);
      setBBCropImage(BBImageDataSize);
      setBBImageCropModal(true);
    }
  }

  const onBBCropCompleted = blobData => {
    const formData = new FormData()
    formData.append('image', blobData);

    const reader = new FileReader();
    reader.onload = (e) => {
      setBBSelectedImage(e.target.result);
    };
    const binaryImageData = formData.get('image');
    reader.readAsDataURL(blobData);
    setBBBinaryData(binaryImageData);
    onBBCropCancelled();
  }

  const onBBCropCancelled = () => {
    setBBImageCropModal(false);
    imageRef.current.value = null;
    setBBImageDataSize("");
  }

  return (
    <div className="col-lg-7 mt-4 mb-4">
      {editOrganization.name &&
        <div className="right-panal" style={{'paddingTop': '0'}}>
          <div className="mob-space">
            <div className="row">
              <div className="col-lg-6">
                <div className="upload-img-info">
                  <div className="upload-img">
                    <div className="file-upload top-right">
                      <input type="file" ref={imageRef} className="img-upload-btn" id="img-upload-btn" onChange={(e) => {onImageChange(e);}} />
                    </div>
                    <div className="img-upload img-110" onClick={() => imageRef.current.click()}>
                      <UserImage src={selectedImage} name="avatar_url" className="extra-large" altText="Organization" />
                      <ImageSize src={imageDataSize} onLoaded={handleOnLoaded} altText="Organization" />
                    </div>
                  </div>
                </div>
                <div className="errorbox">
                  <span className={`text-error ${invalidImage}`}>Please select only .jpg, .jpeg, .png and .gif file.</span>
                  <span className={`text-error ${invalidImageSize}`}>Upload file size limit is maximum 500kb.</span>
                  <span className={`text-error ${invalidImageDimensions}`}>Upload file dimension limit is maximum 1200px.</span>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="upload-img-info billboard-image">
                  <div className="upload-img">
                    <div className="file-upload top-right">
                      <input type="file" ref={bbImageRef} className="img-upload-btn" id="img-bb-upload-btn" onChange={(e) => {onBBImageChange(e);}} />
                    </div>
                    <div className="img-upload img-110 bbOrg" onClick={() => bbImageRef.current.click()}>
                      <UserImage src={BBSelectedImage} name="avatar_url" className="extra-large" altText="Billboard" />
                      <ImageSize src={BBImageDataSize} onLoaded={handleOnBBLoaded} altText="Billboard" />
                    </div>
                  </div>
                </div>
                <div className="errorbox">
                  <span className={`text-error ${BBInvalidImage}`}>Please select only .jpg, .jpeg, .png and .gif file.</span>
                  <span className={`text-error ${BBInvalidImageSize}`}>Upload file size limit is maximum 500kb.</span>
                  <span className={`text-error ${BBInvalidImageDimensions}`}>Upload file dimension limit is maximum 1200px.</span>
                </div>
              </div>

            </div>

            <div className="row mt-4">
              <div className="col-lg-6">
                <h6 className="clr-white">Organization Details</h6>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="text" className={`form-control ${validationErrors.name && 'error'}`}
                      id="name" name="name"
                      defaultValue={organizationDetails.name} onKeyUp={updateStateValue} />
                    <label htmlFor="name" className="txt-label">Org Name</label>
                  </div>
                  {validationErrors.name && displayErrorMessage(validationErrors.name)}
                </div>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <textarea type="text" className={`form-control ${validationErrors.description && 'error'}`}
                      id="description" name="description" maxLength="500" defaultValue={organizationDetails.description}
                      style={{height: "76px"}}
                      onChange={updateStateValue}></textarea>
                    <label htmlFor="description" className="txt-label">Bio (Optional)</label>
                  </div>
                  {validationErrors.description && displayErrorMessage(validationErrors.description)}
                </div>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="email" className={`form-control ${validationErrors.email && 'error'}`}
                      id="email" name="email"
                      defaultValue={organizationDetails.email} onChange={updateStateValue} />
                    <label htmlFor="email" className="txt-label">Email Address</label>
                  </div>
                  {validationErrors.email && displayErrorMessage(validationErrors.email)}
                </div>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="text" className={`form-control ${validationErrors.give_url && 'error'}`}
                      id="give_url" name="give_url"
                      defaultValue={organizationDetails.give_url} onChange={updateStateValue} />
                    <label htmlFor="give_url" className="txt-label">Website</label>
                  </div>
                  {validationErrors.give_url && displayErrorMessage(validationErrors.give_url)}
                </div>
                {/* <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="text" className={`form-control`}
                      id="additional_link" name="additional_link"
                      defaultValue={organizationDetails.additional_link} onChange={updateStateValue} />
                    <label htmlFor="additional_link" className="txt-label">Additional Link (Optional)</label>
                  </div>
                </div> */}
              </div>
              <div className="col-lg-6">
                <h6 className="clr-white">Location Information</h6>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="text" className="form-control"
                      id="subname" name="subname"
                      defaultValue={organizationDetails.subname} onChange={updateStateValue} />
                    <label htmlFor="subname" className="txt-label">Branch/Location Name (Optional)</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="text" className={`form-control ${validationErrors.address && 'error'}`}
                      id="address" name="address"
                      defaultValue={organizationDetails.address} onChange={updateStateValue} />
                    <label htmlFor="address" className="txt-label">Address</label>
                  </div>
                  {validationErrors.address && displayErrorMessage(validationErrors.address)}
                </div>
                <div className="form-group">
                  <div className="bg-black-600 bg-focus">
                    <input type="text" className={`form-control ${validationErrors.city && 'error'}`}
                      id="city" name="city"
                      defaultValue={organizationDetails.city} onChange={updateStateValue} />
                    <label htmlFor="city" className="txt-label">City</label>
                  </div>
                  {validationErrors.city && displayErrorMessage(validationErrors.city)}
                </div>
                <div className="form-group">
                  <div id="countryList" className="bg-black-600 bg-focus" style={{overflow: 'visible', 'zIndex': 1}}>
                    <AsyncTypeahead
                      labelKey={option => `${option.name}`}
                      id="country"
                      name="country"
                      isLoading={isLoading}
                      onSearch={onHandleSearch}
                      options={countryListData}
                      placeholder=""
                      className={`${validationErrors.country && 'err-div'}`}
                      renderMenuItemChildren={(option) => (
                        option.name
                      )}
                      onChange={selected => changeCountry(selected)}
                      defaultSelected={defaultCountryData}
                    />
                    <label className={countrySel ? 'top-5' : ''}>Country</label>
                    {validationErrors.country && displayErrorMessage(validationErrors.country)}
                  </div>
                </div>
                <div className="form-group responsive-col form-group-resize">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="bg-black-600 bg-focus">
                        <Select
                          // menuIsOpen={true}
                          // ref={refTimezone}
                          isSearchable={true}
                          value={defaultStateData}
                          onChange={changeState}
                          onInputChange={inputChangeState}
                          onMenuOpen={focusState}
                          onMenuClose={focusOutState}
                          options={stateListData}
                          placeholder=""
                        />
                        {/* <input type="text" className={`form-control ${validationErrors.state && 'error'}`}
                        id="state" name="state"
                        defaultValue={organizationDetails.state} onChange={updateStateValue} /> */}
                        <label htmlFor="state" className={stateSelect ? 'top-5' : ''}>State/Province</label>
                      </div>
                      {validationErrors.state && displayErrorMessage(validationErrors.state)}
                    </div>
                    <div className="col-sm-6">
                      <div className="bg-black-600 bg-focus">
                        <input type="text" className={`form-control ${validationErrors.postalcode && 'error'}`}
                          id="postalcode" name="postalcode" maxLength='7'
                          defaultValue={organizationDetails.postalcode} onChange={updateStateValue} />
                        <label htmlFor="postalcode" className="txt-label">Zip/Postal Code</label>
                      </div>
                      {validationErrors.postalcode && displayErrorMessage(validationErrors.postalcode)}
                    </div>
                  </div>
                </div>
                <h6 className="clr-white">Phone Number</h6>
                <div className="form-group responsive-col form-group-resize">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="bg-black-600 bg-focus">
                        <input type="text" className={`form-control ${validationErrors.country_code && 'error'}`}
                          id="country_code" name="country_code" readOnly
                          value={organizationDetails.country_code} onChange={updateStateValue} />
                        <label htmlFor="country_code" className="txt-label">Country Code</label>
                      </div>
                      {validationErrors.country_code && displayErrorMessage(validationErrors.country_code)}
                    </div>
                    <div className="col-sm-6">
                      <div className="bg-black-600 bg-focus">
                        <InputMask mask="(999) 999-9999" className={`form-control ${validationErrors.main_phone_number && 'error'}`}
                          name="main_phone_number"
                          maskChar={null}
                          value={organizationDetails.main_phone_number}
                          onChange={(e) => updateStateValue(e)}
                          beforeMaskedValueChange={beforeMaskedValueChange}
                        />
                        <label htmlFor="main_phone_number" className="txt-label">Phone Number</label>
                      </div>
                      {validationErrors.main_phone_number && displayErrorMessage(validationErrors.main_phone_number)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-12 text-right">
                {editError !== '' &&
                  <div className={`error-sec m-1 msg-error`}>
                    <p className="error">{editError}</p>
                  </div>
                }
                <button type="button" className="btn bg-black-900 md-box btn-medium clr-white mr-3" onClick={hideOrgSection}>Cancel</button>
                <button type="button" className={`btn btn-green md-box btn-medium ${!validForm && 'btn-gray-500'}`}
                  onClick={handelUpdateOrganization}
                  disabled={!validForm || updateFlagLoading}
                >Save changes {(updateFlagLoading) && <Spinner />} </button>
              </div>
            </div>
          </div>
          <ImageCrop
            image={cropImage}
            show={imageCropModal}
            onCropCompleted={onCropCompleted}
            onCropCancelled={onCropCancelled}
          />
          <ImageCrop
            image={BBCropImage}
            show={BBImageCropModal}
            cropShape="rectangle"
            onCropCompleted={onBBCropCompleted}
            onCropCancelled={onBBCropCancelled}
          />
        </div>
      }
    </div>
  );
}

export default EditOrganization;
