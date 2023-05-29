import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {Typeahead, AsyncTypeahead} from 'react-bootstrap-typeahead';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Spinner from "../spinner";
import UserImage from '../common/UserImage';
import ImageSize from '../common/ImageSize';
import InputMask from 'react-input-mask';
import ImageCrop from "../common/ImageCrop";
import ConfirmOTP from "./confirmOTP";
import Switch from "react-switch";

import {getProfileUsingHook} from '../../store/actions/user';
import {
    getProfileRequest, getCountryRequest, getTimezoneRequest, updateProfileRequest,
    updatePasswordRequest, updatePhoneRequest, updateEmailRequest
} from '../../store/actions';

const SubContentProfileUpdate = () => {
    const dispatch = useDispatch();
    const {profile, country, timezone, updateFlagLoading,
        updatePassFlagLoading, updatePassword, errorPasswordMessage, profileErrorMessage,
        updateProfile, updatePhoneFlagLoading, errorPhoneMessage, updatePhone, updateEmailFlagLoading,
        errorEmailMessage, updateEmail
    } = useSelector(({profile}) => profile);
    const [componentLoad, setComponentLoad] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('images/original.jpg');
    const [binaryData, setBinaryData] = useState([]);
    const [countrySel, selectedCountry] = useState('');
    const [defaultCountryData, defaultCountry] = useState([]);
    const [countryListData, countryList] = useState([]);
    const [timezoneSel, selectedTimezone] = useState('');
    const [defaultTimzoneData, defaultTimezone] = useState([]);
    const [timezoneListData, timezoneList] = useState([]);
    const [user, setUser] = useState([]);
    const [showCurrPassword, setShowCurrPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [invalidImage, setInvalidImage] = useState('d-none');
    const [invalidImageSize, setInvalidImageSize] = useState('d-none');
    const [invalidImageDimensions, setInvalidImageDimensions] = useState('d-none');
    const [imageCropModal, setImageCropModal] = useState(false);
    const [cropImage, setCropImage] = useState('');
    const [imageDataSize, setImageDataSize] = useState('');
    const [imageDataValid, setImageDataValid] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isText, setIsText] = useState(false);
    const [isPush, setIsPush] = useState(false);

    const btnGray = 'btn-gray-500';
    const [btnClass, setProfileClass] = useState(btnGray);
    const [disabled, setProfileDisabled] = useState('disabled');
    const [values, setProfileValues] = useState({});
    const [errors, setProfileErrors] = useState({});
    const [profileUpdateErrors, setProfileUpdateErrors] = useState(false);

    const [btnClassEmail, setEmailClass] = useState(btnGray);
    const [disabledEmail, setEmailDisabled] = useState('disabled');
    const [valueEmail, setEmailValues] = useState({});
    const [errorEmail, setEmailErrors] = useState({});
    const [updateEmailErrors, setUpdateEmailErrors] = useState(false);
    const [duplicateEmail, setDuplicateEmail] = useState('');

    const [btnClassPass, setPassClass] = useState(btnGray);
    const [disabledPass, setPassDisabled] = useState('disabled');
    const [valuesPass, setPassValues] = useState({curr_password: '', password: '', con_password: ''});
    const [secutiryValue, setSecutiryValue] = useState({password_input: false, con_password_input: false});
    const [errorsPass, setPassErrors] = useState({});
    const [updateErrors, setUpdateErrors] = useState(false);
    const [currentPassErrorClass, setCurrentPassErrorClass] = useState('');

    const [btnClassPhone, setPhoneClass] = useState(btnGray);
    const [disabledPhone, setPhoneDisabled] = useState('disabled');
    const [valuesPhone, setPhoneValues] = useState();
    const [errorsPhone, setPhoneErrors] = useState({});
    const [updatePhoneErrors, setUpdatePhoneErrors] = useState(false);
    const [currentPhoneErrorClass, setCurrentPhoneErrorClass] = useState('');
    const [isShowConfirmModel, showConfirmModel] = useState(false);
    const [oldPhoneValues, setOldPhoneValues] = useState('');
    const imageRef = useRef(null);

    useEffect(() => {
        dispatch(getProfileRequest());
    }, [])

    useEffect(() => {
        if(profileErrorMessage && profileUpdateErrors === '') {
            setProfileUpdateErrors(profileErrorMessage);
        }
    }, [profileErrorMessage])

    useEffect(() => {
        if(updateProfile.message) {
            getProfileUsingHook(dispatch)
        }
    }, [updateProfile])

    useEffect(() => {
        setIsEmail(false);
        setIsText(false);
        setIsPush(false);
        setUser(profile)
        if(profile && profile.country) {
            setSelectedImage(profile.avatar_url)
            delete profile.country.flag_image_url;
            defaultCountry([profile.country]);
            selectedCountry(profile.country.alpha3);
            if(profile.time_zone) {
                defaultTimezone({'label': profile.time_zone.text, 'value': profile.time_zone.value});
                selectedTimezone(profile.time_zone.text);
                getTimezone(profile.country.alpha3)
            }
            onHandleSearch(profile.country.name);
            const userData = {
                'name': profile.name,
                'bio': profile.bio ? profile.bio : '',
                'country': profile.country.alpha3,
                'time_zone': profile.time_zone ? profile.time_zone.value : '',
                'birth_date': profile.date_of_birth ? profile.date_of_birth : new Date(),
            }
            const emailData = {
                'email': profile.email
            }
            const phoneData = {
                'country_code': profile.country.dialing_prefix,
                'phone_number': profile.mobile_phone_number.length === 13 ? profile.mobile_phone_number.slice(3) : profile.mobile_phone_number.slice(2),
            }
            profile.notification_methods.map(data => {
                if(data === 'email') {
                    setIsEmail(true)
                }
                if(data === 'push') {
                    setIsPush(true)
                }
                if(data === 'sms') {
                    setIsText(true)
                }
            })
            if(profile.date_of_birth) {
                setStartDate(new Date(profile.date_of_birth));
            }
            else {
                setStartDate(null);
            }
            setProfileValues(userData);
            setPhoneValues(phoneData);
            setOldPhoneValues(phoneData.phone_number);
            setEmailValues(emailData);
            setProfileErrors(validateProfile(userData));
            // setPhoneErrors(validatePhone(phoneData));
            setEmailErrors(validateEmail(emailData));
            setComponentLoad(true);
        }
    }, [profile]);

    useEffect(() => {
        countryList(country);
        setIsLoading(false);
    }, [country]);

    useEffect(() => {
        if(timezone.time_zones && timezone.time_zones.length > 0) {
            const cutomvalue = timezone.time_zones.map(item => {
                return {label: item.text, value: item.value}
            });
            timezoneList(cutomvalue);
        }
        else {
            timezoneList([]);
        }

    }, [timezone]);

    const getTimezone = (term) => {
        var data = {search: term};
        dispatch(getTimezoneRequest(data));
        selectedCountry(term);
    }

    const onHandleSearch = (term) => {
        setIsLoading(true);
        var data = {search: term};
        dispatch(getCountryRequest(data));
        selectedCountry(term);
    }

    const refTimezone = React.createRef();
    const changeCountry = (selected) => {
        if(selected.length) {
            getTimezone(selected[0]['alpha3'])
            selectedCountry(selected[0]['alpha3']);
            values['country'] = selected[0]['alpha3'];
            valuesPhone['country_code'] = selected[0]['dialing_prefix'];
            values['time_zone'] = '';
            // refTimezone.current.clear()
            selectedTimezone('');
            timezoneList([]);
            defaultTimezone([]);
            setProfileErrors(validateProfile(values));
        } else {
            selectedCountry('');
            values['country'] = '';
            valuesPhone['country_code'] = '';
            setProfileErrors(validateProfile(values));
        }
    }

    const changeTimezone = (selected) => {
        defaultTimezone(selected);
        selectedTimezone(selected.label);
        values['time_zone'] = selected.value;
        setProfileErrors(validateProfile(values));
    }

    const inputChangeTimzone = (value) => {
        if(timezoneSel === '') {
            values['time_zone'] = '';
            selectedTimezone(value);
            setProfileErrors(validateProfile(values));
        }
    }

    const focusTimezone = value => {
        if(timezoneSel === '') {
            selectedTimezone(' ');
        }
    }

    const focusOutTimezone = value => {
        if(timezoneSel.trim() === '') {
            selectedTimezone('');
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

    const validateProfile = (valuesProfile) => {
        setProfileUpdateErrors('');
        setDuplicateEmail('');
        var isValid = true;
        var pErrors = {};

        if(valuesProfile.name === '') {
            pErrors.name = 'First name is required';
            isValid = false;
        }
        else if(!/^[a-zA-Z\s]*$/.test(valuesProfile.name)) {
            pErrors.name = 'First name is invalid';
            isValid = false;
        }
        if(valuesProfile.country === '') {
            pErrors.country = 'Country is required';
            isValid = false;
        }
        if(valuesProfile.time_zone === '') {
            pErrors.time_zone = 'Timezone is required';
            isValid = false;
        }
        if(valuesProfile.birth_date === '') {
            pErrors.birth_date = 'Birthdate is required';
            isValid = false;
        }
        if(isValid) {
            setProfileClass('btn-green');
            setProfileDisabled('')
        }
        else {
            setProfileClass(btnGray);
            setProfileDisabled('disabled')
        }
        return pErrors;
    };

    const handleProfileSubmit = () => {
        setProfileErrors(validateProfile(values));
        localStorage.setItem('time_zone', values.time_zone);
        var newDate = '';
        if(startDate) {
            var newDate = moment(startDate).format('YYYY-MM-DD');
        }
        const formData = new FormData()
        formData.append('user_id', localStorage.getItem('identifier'));
        formData.append('country', values.country);
        formData.append('name', values.name);
        formData.append('bio', values.bio);
        formData.append('timezone', values.time_zone);
        formData.append('birth_date', newDate);
        formData.append('image', binaryData);
        formData.append('email_noti', isEmail);
        formData.append('push_noti', isPush);
        formData.append('text_noti', isText);
        dispatch(updateProfileRequest(formData));
    };

    const handleProfileChange = (event) => {
        values[event.target.name] = event.target.value.trim();
        setProfileErrors(validateProfile(values));
    };

    const changeNotification = (name, checked) => {
        if(name === 'email_notification') {
            setIsEmail(checked)
        }
        if(name === 'push_notification') {
            setIsPush(checked)
        }
        if(name === 'text_notification') {
            setIsText(checked)
        }
    };

    const selectBirthDate = (date) => {
        setStartDate(date);
        values['birth_date'] = date;
    };

    const beforeMaskedValueChange = (newState, oldState, userInput) => {
        var {value} = newState;
        var selection = newState.selection;
        var cursorPosition = selection ? selection.start : null;

        // keep minus if entered by user
        if(value.endsWith('-') && userInput !== '-' && !valuesPhone.phone_number.endsWith('-')) {
            if(cursorPosition === value.length) {
                cursorPosition--;
                selection = {start: cursorPosition, end: cursorPosition};
            }
            value = value.slice(0, -1);
        }

        return {
            value,
            selection
        };
    }

    useEffect(() => {
        if(updateEmailErrors === '') {
            setUpdateEmailErrors(errorEmailMessage)
            if(errorEmailMessage.message === 'email has already been taken') {
                setDuplicateEmail('error');
            }
            setTimeout(() => {
                setUpdateEmailErrors(false);
            }, 5000);
        }
    }, [errorEmailMessage])

    useEffect(() => {
        if(updateEmail) {
            setUpdatePhoneErrors('');
            getProfileUsingHook(dispatch)
        }
    }, [updateEmail])

    const validateEmail = (valuesEmail) => {
        setUpdateEmailErrors('');
        setDuplicateEmail('');
        var isValid = true;
        var pErrors = {};

        if(valuesEmail.email === '') {
            pErrors.email = 'Email address is required';
            isValid = false;
        } else if(!/^[a-zA-Z]{1}[a-zA-Z0-9._-]+@[a-zA-Z]+.[a-zA-Z]{2,4}/.test(valuesEmail.email)) {
            pErrors.email = 'Email address is invalid';
            isValid = false;
        }
        if(isValid) {
            setEmailClass('btn-green');
            setEmailDisabled('')
        }
        else {
            setEmailClass(btnGray);
            setEmailDisabled('disabled')
        }
        return pErrors;
    };

    const handleEmailSubmit = (event) => {
        setEmailErrors(validateEmail(valueEmail));
        const data = {email: valueEmail.email};
        dispatch(updateEmailRequest(data));
    };

    const handleEmailChange = (event) => {
        valueEmail[event.target.name] = event.target.value.trim();
        setEmailErrors(validateEmail(valueEmail));
    };

    const inputCurrPassword = React.useRef(null);
    const inputPassword = React.useRef(null);
    const inputConPassword = React.useRef(null);
    useEffect(() => {
        if(componentLoad && updatePassword) {
            setUpdateErrors(updatePassword);
            inputCurrPassword.current.value = "";
            inputPassword.current.value = "";
            inputConPassword.current.value = "";
            setPassValues({curr_password: '', password: '', con_password: ''})
            setSecutiryValue({password_input: false, con_password_input: false})
            setCurrentPassErrorClass('');
            setTimeout(() => {
                setUpdateErrors(false);
            }, 5000);
        }
    }, [updatePassword])

    useEffect(() => {
        if(updateErrors === '') {
            setUpdateErrors(errorPasswordMessage);
            if(errorPasswordMessage) {
                setCurrentPassErrorClass('error')
            }
        }
    }, [errorPasswordMessage])

    const validatePass = (passValues) => {
        var passErrors = {};
        setUpdateErrors('');
        setCurrentPassErrorClass('')
        if(passValues.curr_password === '') {
            passErrors.curr_password = 'Current password is required';
        } else if(passValues.curr_password && passValues.curr_password.length > 16) {
            passErrors.curr_password = 'Current password cannot exceed 16 characters';
        } else if(secutiryValue.password_input && passValues.password === '') {
            passErrors.password = 'New Password is required';
        } else if(passValues.password && passValues.password.length < 8) {
            passErrors.password = 'New password must be at least 8 characters';
        } else if(passValues.password && passValues.password !== '' && !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(passValues.password)) {
            passErrors.password = 'Must contain 1 lower, 1 upper, 1 special char and 1 digit';
        } else if(passValues.password && passValues.password.length > 16) {
            passErrors.password = 'New password cannot exceed 16 characters';
        } else if(secutiryValue.con_password_input && passValues.con_password === '') {
            passErrors.con_password = 'Confirm Password is required';
        } else if(passValues.con_password && passValues.password !== passValues.con_password) {
            passErrors.con_password = 'Password does not match';
        } else if(passValues.con_password && passValues.con_password.length > 16) {
            passErrors.password = 'Confirm password cannot exceed 16 characters';
        }

        // Enable-Disable button
        var errorCount = 0;
        if(passValues.curr_password === '') {
            errorCount++;
        }
        if(!passValues.password) {
            errorCount++;
        }
        if(passValues.password && passValues.password.length < 8) {
            errorCount++;
        }
        if(passValues.password && passValues.password.length > 16) {
            errorCount++;
        }
        if(passValues.password && passValues.password !== '' && !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(passValues.password)) {
            errorCount++;
        }
        if(!passValues.con_password) {
            errorCount++;
        }
        if(passValues.con_password && passValues.password !== passValues.con_password) {
            errorCount++;
        }
        if(errorCount === 0) {
            setPassClass('btn-green');
            setPassDisabled('')
        }
        else {
            setPassClass(btnGray);
            setPassDisabled('disabled')
        }

        return passErrors;
    };

    const handlePassSubmit = (event) => {
        setPassErrors(validatePass(valuesPass));
        var data = {current_password: valuesPass.curr_password, password: valuesPass.password, password_confirmation: valuesPass.con_password};
        dispatch(updatePasswordRequest(data));
    };

    const handlePassChange = (event) => {
        valuesPass[event.target.name] = event.target.value.trim();
        secutiryValue[`${event.target.name}_input`] = true;
        setPassErrors(validatePass(valuesPass));
    };

    const handleCheckbox = (name, event) => {
        if(name === 'showCurrPassword') {
            setShowCurrPassword(event.target.checked);
        } else if(name === 'showPassword') {
            setShowPassword(event.target.checked);
        } else {
            setShowCPassword(event.target.checked);
        }
    }

    useEffect(() => {
        if(componentLoad && updatePhone) {
            setUpdatePhoneErrors('');
            showConfirmModel(true);
        }
    }, [updatePhone])

    useEffect(() => {
        if(updatePhoneErrors === '') {
            setUpdatePhoneErrors(errorPhoneMessage);
            if(errorPhoneMessage) {
                setCurrentPhoneErrorClass('error')
            }
            setTimeout(() => {
                setUpdatePhoneErrors('');
            }, 5000);
        }
    }, [errorPhoneMessage])

    const validatePhone = (phoneValues) => {
        var phnErrors = {};
        setUpdatePhoneErrors('');
        setCurrentPhoneErrorClass('')
        var isValid = true;
        var phoneNumber = '';
        if(phoneValues.phone_number) {
            phoneNumber = phoneValues.phone_number.replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s/g, '');
        }
        if(phoneValues.country_code === '') {
            phnErrors.country_code = 'Country code is required';
            isValid = false;
        } else if(!/^[+]{1}[0-9 ()]+$/.test(phoneValues.country_code)) {
            phnErrors.country_code = 'Country code is invalid';
            isValid = false;
        }
        if(phoneNumber === '') {
            phnErrors.phone_number = 'Phone Number is required';
            isValid = false;
        }
        else if(phoneNumber.length < 10) {
            phnErrors.phone_number = 'Phone Number is invalid';
            isValid = false;
        }
        if(oldPhoneValues === phoneNumber) {
            isValid = false;
        }
        if(isValid) {
            setPhoneClass('btn-green');
            setPhoneDisabled('')
        }
        else {
            setPhoneClass(btnGray);
            setPhoneDisabled('disabled')
        }
        return phnErrors;
    };

    const handlePhoneSubmit = (event) => {
        setPhoneErrors(validatePhone(valuesPhone));
        setOldPhoneValues(valuesPhone.phone_number.replace(/[- )(]/g, ''));
        const fullNumber = valuesPhone.country_code + valuesPhone.phone_number.replace(/[- )(]/g, '');
        const data = {mobile: fullNumber};
        dispatch(updatePhoneRequest(data));
    };

    const handlePhoneChange = (event) => {
        valuesPhone[event.target.name] = event.target.value.trim();
        setPhoneErrors(validatePhone(valuesPhone));
    };

    const showConfirnBox = (event) => {
        showConfirmModel(event);
    }

    const textPassHide = 'txtpass-hidden';
    const textPass = 'txtpass';
    const cutomvalue = [{
        'name': "Chicago",
        'offset': "-06:00",
        'text': "Chicago (-06:00)",
        'value': "America/Chicago"
    }];
    return (
        <div>
            {user.name &&
                <div className="mob-space">
                    <div className="upload-img-info">
                        <div className="upload-img">
                            <div className="file-upload top-right">
                                <input type="file" ref={imageRef} className="img-upload-btn" id="img-upload-btn" onChange={(e) => {onImageChange(e);}} />
                            </div>
                            <div className="img-upload img-110" onClick={() => imageRef.current.click()}>
                                <UserImage src={selectedImage} name={values.name} className="extra-large" altText="User" />
                                <ImageSize src={imageDataSize} onLoaded={handleOnLoaded} altText="Group" />
                            </div>
                        </div>
                    </div>
                    <div className="errorbox">
                        <span className={`text-error ${invalidImage}`}>Please select only .jpg, .jpeg, .png and .gif file.</span>
                        <span className={`text-error ${invalidImageSize}`}>Upload file size limit is maximum 500kb.</span>
                        <span className={`text-error ${invalidImageDimensions}`}>Upload file dimension limit is maximum 1200px.</span>
                    </div>
                    <div className="row mt-4">
                        <div className="col-lg-6">
                            <h5 className="clr-white">Personal Information</h5>
                            <form noValidate>
                                <div className="form-group">
                                    <div className="bg-black-600 bg-focus">
                                        <input type="text" className={`form-control ${errors.name && 'error'}`}
                                            id="name" name="name" required
                                            defaultValue={values.name} onChange={(e) => handleProfileChange(e)} />
                                        <label htmlFor="name" className="txt-label">First Name</label>
                                    </div>
                                    {errors.name && (<span className="text-error">{errors.name}</span>)}
                                </div>
                                <div className="form-group">
                                    <div className="bg-black-600 bg-focus">
                                        <textarea type="text" className={`form-control ${errors.bio && 'error'}`}
                                            id="bio" name="bio" maxLength="500" required defaultValue={values.bio}
                                            onChange={(e) => handleProfileChange(e)}></textarea>
                                        <label htmlFor="bio" className="txt-label">Bio</label>
                                    </div>
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
                                            className={`${errors.country && 'err-div'}`}
                                            renderMenuItemChildren={(option) => (
                                                option.name
                                            )}
                                            onChange={selected => changeCountry(selected)}
                                            defaultSelected={defaultCountryData}
                                        />
                                        <label className={countrySel ? 'top-5' : ''}>Country</label>
                                        {errors.country && (<span className="text-error">{errors.country}</span>)}
                                    </div>
                                </div>
                                <div className="form-group row responsive-col">
                                    <div className="col-sm-6">
                                        <div className="bg-black-600 bg-focus">
                                            {/* <Typeahead
                                                ref={refTimezone}
                                                labelKey={option => `${option.text}`}
                                                id="time_zone"
                                                name="time_zone"
                                                onInputChange={inputChangeTimzone}
                                                options={timezoneListData ? timezoneListData : cutomvalue}
                                                className={`${errors.time_zone && 'err-div'}`}
                                                renderMenuItemChildren={(option) => (
                                                    option.text
                                                )}
                                                onChange={selected => changeTimezone(selected)}
                                                defaultSelected={defaultTimzoneData}
                                            /> */}
                                            <Select
                                                // menuIsOpen={true}
                                                // ref={refTimezone}
                                                isSearchable={true}
                                                value={defaultTimzoneData}
                                                onChange={changeTimezone}
                                                onInputChange={inputChangeTimzone}
                                                onMenuOpen={focusTimezone}
                                                onMenuClose={focusOutTimezone}
                                                options={timezoneListData}
                                                placeholder=""
                                            />
                                            <label className={timezoneSel ? 'top-5' : ''}>Timezone</label>
                                        </div>
                                        {errors.time_zone && (<span className="text-error">{errors.time_zone}</span>)}
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="bg-black-600 bg-focus">
                                            <DatePicker name="birth_date" className="form-control"
                                                dateFormat="yyyy/MM/dd" selected={startDate} maxDate={new Date()}
                                                onChange={date => selectBirthDate(date)} showMonthDropdown showYearDropdown />
                                            <label className={startDate ? 'top-5' : ''}>Date of Birth</label>
                                        </div>
                                        {errors.birth_date && (<span className="text-error">{errors.birth_date}</span>)}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <h5 className="clr-white">Notifications</h5>
                                    <div className="notification-box">
                                        <p>Email</p>
                                        <Switch
                                            onChange={(e) => changeNotification('email_notification', e)}
                                            checked={isEmail}
                                            handleDiameter={18}
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                            offColor="#212529"
                                            onColor="#0f9279"
                                            offHandleColor="#454b52"
                                            onHandleColor="#18b99a"
                                            boxShadow="none"
                                            activeBoxShadow="none"
                                            height={25}
                                            width={40}
                                            className="react-switch"
                                        />
                                    </div>
                                    <div className="notification-box">
                                        <p>Text</p>
                                        <Switch
                                            onChange={(e) => changeNotification('text_notification', e)}
                                            checked={isText}
                                            handleDiameter={18}
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                            offColor="#212529"
                                            onColor="#0f9279"
                                            offHandleColor="#454b52"
                                            onHandleColor="#18b99a"
                                            boxShadow="none"
                                            activeBoxShadow="none"
                                            height={25}
                                            width={40}
                                            className="react-switch"
                                        />
                                    </div>
                                    <div className="notification-box">
                                        <p>Push</p>
                                        <Switch
                                            onChange={(e) => changeNotification('push_notification', e)}
                                            checked={isPush}
                                            handleDiameter={18}
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                            offColor="#212529"
                                            onColor="#0f9279"
                                            offHandleColor="#454b52"
                                            onHandleColor="#18b99a"
                                            boxShadow="none"
                                            activeBoxShadow="none"
                                            height={25}
                                            width={40}
                                            className="react-switch"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    {profileUpdateErrors &&
                                        <div className={`error-sec m-1 msg-${profileUpdateErrors.type}`}>
                                            <p className="error" >{profileUpdateErrors.message}</p>
                                        </div>
                                    }
                                    <button type="button" className={`btn btn-medium btn-submit ${btnClass}`}
                                        disabled={disabled} style={{margin: 'auto 5px'}}
                                        onClick={handleProfileSubmit}>Save Changes {updateFlagLoading && <Spinner />}</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-6">
                            <h5 className="clr-white">Email</h5>
                            <form>
                                <div className="form-group">
                                    <div className="bg-black-600 bg-focus">
                                        <input type="email" className={`form-control ${errorEmail.email && 'error'} ${duplicateEmail}`}
                                            id="email" name="email" required defaultValue={valueEmail.email}
                                            onChange={(e) => handleEmailChange(e)} />
                                        <label htmlFor="email" className="txt-label">Email Address</label>
                                    </div>
                                    {errorEmail.email && (<span className="text-error">{errorEmail.email}</span>)}
                                </div>
                                <div className="form-group">
                                    {updateEmailErrors &&
                                        <div className={`error-sec m-1 msg-${updateEmailErrors.type}`}>
                                            <p className="error" >{updateEmailErrors.message}</p>
                                        </div>
                                    }
                                    <button type="button" className={`btn btn-medium btn-submit ${btnClassEmail}`}
                                        disabled={disabledEmail} style={{margin: 'auto 5px'}}
                                        onClick={handleEmailSubmit}>Update Email {updateEmailFlagLoading && <Spinner />}</button>
                                </div>
                            </form>
                            <h5 className="clr-white">Phone Number</h5>
                            <form>
                                <div className="form-group row responsive-col">
                                    <div className="col-sm-6">
                                        <div className="bg-black-600 bg-focus">
                                            <input type="text"
                                                className={`form-control ${errorsPhone.country_code && 'error'}`} id="country_code" name="country_code" required
                                                value={valuesPhone.country_code} onChange={(e) => handlePhoneChange(e)} readOnly />
                                            <label htmlFor="country_code" className="txt-label">Country Code</label>
                                        </div>
                                        {errorsPhone.country_code && (<span className="text-error">{errorsPhone.country_code}</span>)}
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="bg-black-600 bg-focus">
                                            <InputMask mask="(999) 999-9999"
                                                className={`form-control ${errorsPhone.phone_number && 'error'} ${currentPhoneErrorClass}`}
                                                name="phone_number" maskChar={null} value={valuesPhone.phone_number}
                                                onChange={(e) => handlePhoneChange(e)} beforeMaskedValueChange={beforeMaskedValueChange} />
                                            <label htmlFor="phone_number" className="txt-label">Phone Number</label>
                                        </div>
                                        {errorsPhone.phone_number && (<span className="text-error">{errorsPhone.phone_number}</span>)}
                                    </div>
                                </div>
                                <div className="form-group">
                                    {updatePhoneErrors &&
                                        <div className={`error-sec m-1 msg-${updatePhoneErrors.type}`}>
                                            <p className="error" >{updatePhoneErrors.message}</p>
                                        </div>
                                    }
                                    <button type="button" className={`btn btn-medium btn-submit ${btnClassPhone}`}
                                        disabled={disabledPhone} style={{margin: 'auto 5px'}}
                                        onClick={handlePhoneSubmit}>Update Phone {updatePhoneFlagLoading && <Spinner />}</button>
                                </div>
                            </form>
                            <h5 className="clr-white">Security Information</h5>
                            <form>
                                <div className="form-group">
                                    <div className={`bg-black-600 bg-focus form-pass ${showCurrPassword ? textPassHide : textPass} ${errorsPass.curr_password && 'error'} ${currentPassErrorClass}`}>
                                        <input ref={inputCurrPassword} type={showCurrPassword ? 'text' : 'password'}
                                            className={`form-control ${showCurrPassword ? textPassHide : textPass} ${errorsPass.curr_password && 'error'} ${currentPassErrorClass}`}
                                            id="curr_password" name="curr_password" required
                                            defaultValue={valuesPass.curr_password} onChange={(e) => handlePassChange(e)} />
                                        <label htmlFor="curr_password" className="txt-label">Current password</label>
                                        <input type="checkbox" className="txticon" name="chkpass" id="chkpass3" onClick={(e) => handleCheckbox('showCurrPassword', e)} />
                                    </div>
                                    {errorsPass.curr_password && (<span className="error-sec">{errorsPass.curr_password}</span>)}
                                </div>
                                <div className="form-group">
                                    <div className={`bg-black-600 bg-focus form-pass ${showPassword ? textPassHide : textPass} ${errorsPass.password && 'error'}`}>
                                        <input ref={inputPassword} type={showPassword ? 'text' : 'password'}
                                            className={`form-control ${showPassword ? textPassHide : textPass} ${errorsPass.password && 'error'}`}
                                            id="password" name="password" required defaultValue={valuesPass.password}
                                            onChange={(e) => handlePassChange(e)} />
                                        <label htmlFor="password" className="txt-label">New Password</label>
                                        <input type="checkbox" className="txticon" name="chkpass" id="chkpass2" onClick={(e) => handleCheckbox('showPassword', e)} />
                                    </div>
                                    {errorsPass.password && (<span className="error-sec">{errorsPass.password}</span>)}
                                </div>
                                <div className="form-group">
                                    <div className={`bg-black-600 bg-focus form-pass ${showCPassword ? textPassHide : textPass} ${errorsPass.con_password && 'error'}`}>
                                        <input ref={inputConPassword} type={showCPassword ? 'text' : 'password'}
                                            className={`form-control ${showCPassword ? textPassHide : textPass} ${errorsPass.con_password && 'error'}`}
                                            id="con_password" name="con_password" minLength="6" required
                                            defaultValue={valuesPass.con_password} onChange={(e) => handlePassChange(e)} />
                                        <label htmlFor="con_password" className="txt-label">Confirm Password</label>
                                        <input type="checkbox" className="txticon" name="chkcpass" id="chkcpass" onClick={(e) => handleCheckbox('showCPassword', e)} />
                                    </div>
                                    {errorsPass.con_password && (<span className="error-sec">{errorsPass.con_password}</span>)}
                                </div>
                                <div className="form-group">
                                    {updateErrors &&
                                        <div className={`error-sec m-1 msg-${updateErrors.type}`}>
                                            <p className="error" >{updateErrors.message}</p>
                                        </div>
                                    }
                                    <button type="button" className={`btn btn-medium btn-submit ${btnClassPass}`}
                                        disabled={disabledPass} style={{margin: 'auto 5px'}}
                                        onClick={handlePassSubmit}>Update Password {updatePassFlagLoading && <Spinner />}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
            <ImageCrop
                image={cropImage}
                show={imageCropModal}
                onCropCompleted={onCropCompleted}
                onCropCancelled={onCropCancelled}
            />
            <ConfirmOTP
                show={isShowConfirmModel}
                hide={showConfirnBox}
            />
        </div>
    );
}
export default SubContentProfileUpdate;
