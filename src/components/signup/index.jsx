import React, { Component, useRef } from "react";
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser, countryList, timezoneList, termsofservice, resetError } from '../../store/actions/auth';
import Spinner from "../spinner";
import SimpleReactValidator from 'simple-react-validator';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { ArrowBackIcon } from "../../utils/Svg";
import '../../assets/css/Typeahead.css';
import Select from 'react-select';
import InputMask from 'react-input-mask';
import history from "../../history/history";
import { Logger } from './../../utils/logger';
const fileLocation = "src\\components\\signup\\index.jsx";

class Signup extends Component {
    constructor(props) {
        super(props);

        this.validator = new SimpleReactValidator(
            {
                autoForceUpdate: this,
                messages: {
                    required: ':attribute is required',
                },
                validators: {
                    email: {  // name the rule
                        message: 'Please provide valid email address.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val, /^[a-zA-Z]{1}[a-zA-Z0-9._-]+@[a-zA-Z]+.[a-zA-Z]{2,4}/)
                        },
                        messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                        required: true  // optional
                    },
                    country_code: {  // name the rule
                        message: 'Please provide valid country code.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val, /^[+]{1}[0-9 ()]+$/)
                        },
                        messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                        required: true  // optional
                    },
                    password: {  // name the rule
                        message: 'Must contain 1 lower, 1 upper, 1 special char and 1 digit',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val, /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
                        },
                        messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                        required: true  // optional
                    },
                    validPhone: {  // name the rule
                        message: 'Phone number must be 10 digit',
                        rule: (val, params, validator) => {
                            return val.length >= 13
                        }
                    }
                }
            }
        );
        this.saveSignup = this.saveSignup.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);

        this.state = {
            org_ode: this.props?.location?.state?.org_code,
            activeTermsCheck: "",
            name: "",
            phone_number: "",
            email: "",
            password: "",
            password_confirmation: "",
            country: "",
            country_tag: "",
            country_code: "",
            timezone_tag: "",
            timezone: "",
            errorMessage: [],
            btn_disabled: 'disabled',
            disabled: false,
            errorClass: '',
            showPassword: false,
            showCPassword: false,
            isLoading: false,
            ip: '',
            options: [],
            selectedOption: null,
            timezoneListData: [],
            isMount: false,
            defaultCountry: [],
            defaultCountryData: [{
                "alpha2": "US",
                "alpha3": "USA",
                "dialing_prefix": "+1",
                "name": "United States of America"
            }],
            formFilled: false,
            duplicateEmail: false,
            duplicatePhone: false,
            showTermsModal: false,
            termsCheck: false,
            termsofservice: ''
        };
        this.props.resetError()
        this.refTimezone = React.createRef();

    }
    componentWillMount() {
        const publicIp = require('public-ip');
        (async () => {
            this.setState({ ip: await publicIp.v4() });
            //=> '46.5.21.123'
            //=> 'fe80::200:f8ff:fe21:67cf'
            const ipLocation = require("iplocation");
            try {
                var locationData = await ipLocation(await publicIp.v4());
                if (locationData) {
                    var countryData = [{
                        "alpha2": locationData.country.code,
                        "alpha3": locationData.country.iso3,
                        "dialing_prefix": locationData.country.callingCode,
                        "name": locationData.country.name
                    }];
                    this.setState({ defaultCountry: countryData });
                    this.changeCountry(countryData);
                    this.onHandleSearch(locationData.country.name);
                    this.setState({ isMount: true });
                }
            } catch (e) {
                this.setState({ defaultCountry: this.state.defaultCountryData });
                this.changeCountry(this.state.defaultCountryData);
                this.onHandleSearch(this.state.defaultCountryData[0].name);
                this.setState({ isMount: true });
            }
        })();
    }

    componentDidMount() {
        // this.changeCountry(this.state.defaultCountry);
        // this.onHandleSearch(this.state.defaultCountry[0].name);
        if (this.state.org_ode === undefined) {
            history.push('/')
        }
        const isLogin = localStorage.getItem('is_login');
        if (isLogin) {
            history.push('/events')
        }
        this.props.termsofservice();
    }
    componentWillReceiveProps(nextProps) {
        try {
            if (nextProps.errors.errors) {
                this.setState({ errorMessage: nextProps.errors.errors });
                this.setState({ disabled: false });
                this.setState({ isLoading: false });
                nextProps.errors.errors.map(msg => {
                    if (msg === 'email has already been taken') {
                        this.setState({ duplicateEmail: true });
                    } else {
                        this.setState({ duplicateEmail: false });
                    }
                    if (msg === 'Phone number has already been taken') {
                        this.setState({ duplicatePhone: true });
                    } else {
                        this.setState({ duplicatePhone: false });
                    }
                });
            }
            if (nextProps.response.options) {
                this.setState({ options: nextProps.response.options });
                this.setState({ isLoading: false });
            }
            if (nextProps.response.timezone) {
                if (nextProps.response.timezone.time_zones.length > 0) {
                    const cutomvalue = nextProps.response.timezone.time_zones.map(item => {
                        return { label: item.text, value: item.value }
                    });
                    this.setState({ timezoneListData: cutomvalue });
                }
                else {
                    /* const cutomvalue = [{
                        label: "Chicago (-06:00)",
                        value: "America/Chicago"
                    }];
                    this.setState({timezoneListData: cutomvalue}); */
                }
            }
            if (nextProps.response.termsofservice)
                if (nextProps.response.termsofservice.terms_of_service !== "")
                    this.setState({ termsofservice: nextProps.response.termsofservice.terms_of_service });
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'signUp' })
        }
    }
    isFormValid() {
        const { phone_number, email, password, password_confirmation, country, country_code, timezone } = this.state

        var isFilled = phone_number !== "" && email !== "" && password !== "" && password_confirmation !== "" && country !== "" && timezone !== "" && country_code !== ""
        this.setState({ formFilled: isFilled });
        if (isFilled) {
            this.setState({ btn_disabled: '' });
        }
        else {
            this.setState({ btn_disabled: 'disabled' });
        }
    }

    handleChange = (name, e) => {
        var val = e.target.value;
        if (name === 'email') {
            this.setState({ duplicateEmail: false });
        }
        if (name === 'phone_number') {
            this.setState({ duplicatePhone: false });
        }

        const errorMsg = document.getElementById("errorMsg");
        if (errorMsg) {
            errorMsg.innerHTML = '';
        }
        this.changeState(name, val);
    }
    changeState(name, val) {
        this.setState({ [name]: val });
        this.validator.showMessageFor(name);
        setTimeout(() => {
            this.isFormValid()
            if (!this.validator.allValid()) {
                this.setState({ btn_disabled: 'disabled', formFilled: false });
            }
            else if(this.state.termsCheck === false) {
                this.setState({btn_disabled: 'disabled', formFilled: false});
            }
            else {
                this.setState({ btn_disabled: '', formFilled: true });
            }
        }, 10);
    }

    saveSignup(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ errorMessage: [] });
        this.setState({ errorClass: '' });

        if (this.validator.allValid()) {
            this.setState({ disabled: true });
            this.props.registerUser(this.state, this.props.history);
        } else {
            this.validator.showMessages();
            this.setState({ errorClass: 'was-validated' });
        }


    }

    handleCheckbox(name, event) {
        this.setState({ [name]: event.target.checked });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push("/");
    }
    onHandleSearch = (term) => {
        var data = { search: term };
        this.setState({ isLoading: true });

        this.props.countryList(data, this.props.history);
        this.changeState('country_tag', term);
    }
    inputChange = (value) => {
        this.changeState('country_tag', value);
        this.changeState('country', '');
        this.changeState('timezone', '');
    }
    changeCountry(selected) {
        if (selected.length) {
            this.changeState('country', selected[0]['alpha3']);
            this.changeState('country_code', selected[0]['dialing_prefix']);
            var tData = { search: selected[0]['alpha3'] };
            this.props.timezoneList(tData);
        } else {
            this.changeState('country', '');
            this.changeState('country_code', '');
            this.changeState('timezone', '');
        }
    }

    changeTimezone = selectedOption => {
        this.setState({ selectedOption });
        this.changeState('timezone_tag', selectedOption.label);
        this.changeState('timezone', selectedOption.value);
    };

    inputChangeTimezone = value => {
        if (this.state.timezone_tag === '') {
            this.changeState('timezone_tag', value);
        }
    }

    focusTimezone = value => {
        this.changeState('timezone_tag', ' ');
    }

    focusOutTimezone = value => {
        if (this.state.timezone_tag.trim() === '') {
            this.changeState('timezone_tag', '');
        }
    }

    beforeMaskedValueChange = (newState, oldState, userInput) => {
        var { value } = newState;
        var selection = newState.selection;
        var cursorPosition = selection ? selection.start : null;

        // keep minus if entered by user
        if (value.endsWith('-') && userInput !== '-' && !this.state.phone_number.endsWith('-')) {
            if (cursorPosition === value.length) {
                cursorPosition--;
                selection = { start: cursorPosition, end: cursorPosition };
            }
            value = value.slice(0, -1);
        }

        return {
            value,
            selection
        };
    }

    showTerms = value => {
        this.setState({ showTermsModal: value });
    }

    acceptTerms = value => {
        this.setState({
            showTermsModal: false
        });
        if (!this.state.termsCheck) {
            this.handleTermsService();
        }
    }

    handleTermsService = e => {
        this.setState({
            termsCheck: !this.state.termsCheck,
            activeTermsCheck: !this.state.termsCheck,
        });
        if (this.validator.allValid() && !this.state.termsCheck) {
            this.setState({ btn_disabled: '', formFilled: true });
        }
        else {
            this.setState({ btn_disabled: 'disabled', formFilled: false });
        }
    }

    render() {
        var spinner = '';
        if (this.state.disabled) {
            spinner = <Spinner />;
        }
        return (
            <>
                {this.state.isMount &&
                    <div className="container">
                        <div className="row">
                            <div className="box-contain bg-black-900 mt-5 mb-5">
                                <form noValidate="" className={this.state.errorClass} id="signup-form">
                                    <div>
                                        <h1 className="clr-white">Welcome</h1>
                                        <p>Get started by entering your information below to create an account.</p>
                                        <div>
                                            <div className="form-group">
                                                <div className="bg-black-500">
                                                    {this.validator.message('name', this.state.name, 'required|alpha_space|max:100')}
                                                    <input type="text" className="form-control" id="txtname" value={this.state.name}
                                                        onChange={(e) => this.handleChange("name", e)} required autoComplete="off" />
                                                    <label className="txt-label">Full Name</label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={`bg-black-500 ${this.state.duplicateEmail && 'err-div'}`}>
                                                    {this.validator.message('email', this.state.email, 'required|email|email')}
                                                    <input type="email" className="form-control" id="txtemail" aria-describedby="emailHelp" value={this.state.email} onChange={(e) => this.handleChange("email", e)} required autoComplete="off" />
                                                    <label className="txt-label">Email</label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={`bg-black-500 form-pass ${this.state.showPassword ? 'txtpass-hidden' : 'txtpass'}`}>
                                                    {this.validator.message('password', this.state.password, 'required|min:8|max:16|password')}
                                                    <input type={this.state.showPassword ? 'text' : 'password'}
                                                        className={this.state.showPassword ? 'form-control txtpass txtpass-hidden' : 'form-control txtpass'}
                                                        id="txtpass" value={this.state.password}
                                                        onChange={(e) => this.handleChange("password", e)} required />
                                                    <label className="txt-label">Password</label>
                                                    <input type="checkbox" className="txticon" name="chkpass" onClick={(e) => this.handleCheckbox('showPassword', e)} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={`bg-black-500 form-pass ${this.state.showCPassword ? 'txtpass-hidden' : 'txtpass'}`}>
                                                    {this.validator.message('password_confirmation',
                                                        this.state.password_confirmation,
                                                        `required|in:${this.state.password}`,
                                                        { messages: { in: 'Passwords do not match' } })}
                                                    <input type={this.state.showCPassword ? 'text' : 'password'}
                                                        className={this.state.showCPassword ? 'form-control txtpass-hidden' : 'form-control txtpass'} id="txtcpass"
                                                        value={this.state.password_confirmation}
                                                        onChange={(e) => this.handleChange("password_confirmation", e)} required />
                                                    <label className="txt-label">Confirm Password</label>
                                                    <input type="checkbox" className="txticon" name="chkcpass" onClick={(e) => this.handleCheckbox('showCPassword', e)} />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div id="countryList" className={`bg-black-500 custom-auto-complete ${!this.state.country && 'err-div'}`}>
                                                    {this.validator.message('country', this.state.country, 'required')}
                                                    <AsyncTypeahead
                                                        {...this.state}
                                                        ref={this.refTimezone}
                                                        labelKey={option => `${option.name}`}
                                                        id="country"
                                                        name="country"
                                                        defaultValue={this.state.country}
                                                        isLoading={this.state.isLoading}
                                                        onSearch={this.onHandleSearch}
                                                        onInputChange={this.inputChange}
                                                        options={this.state.options}
                                                        placeholder=""
                                                        renderMenuItemChildren={(option, props) => (
                                                            option.name
                                                        )}
                                                        onChange={selected => this.changeCountry(selected)}
                                                        shouldSelect={true}
                                                        defaultSelected={this.state.defaultCountry}
                                                    />
                                                    <label className={this.state.country_tag ? 'top-5' : ''}>Country</label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={`bg-black-500 custom-auto-complete `}>
                                                    {this.validator.message('timezone', this.state.timezone, 'required')}
                                                    <Select
                                                        // menuIsOpen={true}
                                                        isSearchable={true}
                                                        value={this.state.selectedOption}
                                                        onChange={this.changeTimezone}
                                                        onMenuOpen={this.focusTimezone}
                                                        onMenuClose={this.focusOutTimezone}
                                                        onInputChange={this.inputChangeTimezone}
                                                        options={this.state.timezoneListData}
                                                        placeholder=""
                                                    />
                                                    <label className={this.state.timezone_tag ? 'top-5' : ''}>Timezone</label>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-6">
                                                    <div className="bg-black-500">
                                                        {this.validator.message('country_code', this.state.country_code, 'required|country_code')}
                                                        <input type="text" className="form-control" value={this.state.country_code}
                                                            onChange={(e) => this.handleChange("country_code", e)} readOnly />
                                                        <label className={this.state.country_code ? 'top-5' : ''}>Country Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className={`bg-black-500 ${this.state.duplicatePhone && 'err-div'}`}>
                                                        {this.validator.message('phone_number', this.state.phone_number, 'required|validPhone')}
                                                        <InputMask mask="(999)999-9999" className="form-control"
                                                            maskChar={null} value={this.state.phone_number}
                                                            onChange={(e) => this.handleChange("phone_number", e)}
                                                            beforeMaskedValueChange={this.beforeMaskedValueChange} />
                                                        <label className="txt-label">Phone Number</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <span className="dropdown-item checkbox" href="#/">
                                                    <input type="checkbox" id="terms_service" name="discussion" className="checkbox-input" checked={this.state.termsCheck} onChange={(e) => this.handleTermsService(e)} />
                                                    <label htmlFor="terms_service" className="checkbox-lable">I agree to <a href="#" onClick={e => this.showTerms(true)}><b>Terms of Service</b></a></label>
                                                </span>
                                                {this.state.activeTermsCheck === false &&
                                                    <p className="text-error ml-1">Please accept Terms of service</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="error-sec">
                                            {
                                                this.state.errorMessage.map(function (name, key) {
                                                    return <p id="errorMsg" className="error" key={key}>{name}</p>;
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-5 btn-sec">
                                        <div className="col-sm-6">
                                            <a href="" onClick={e => this.goBack(e)} className="btn btn-medium btn-black w-100">Back</a>
                                        </div>
                                        <div className="col-sm-6">
                                            <button onClick={(e) => this.saveSignup(e)} disabled={this.state.btn_disabled}
                                                className={`btn btn-medium  w-100 btn-submit ${this.state.formFilled ? "btn-green" : "btn-gray-500"}`}>
                                                Create Account {spinner}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <Modal size="lg" show={this.state.showTermsModal} backdrop="static" onHide={() => this.showTerms(false)} aria-labelledby="example-modal-sizes-title-lg" >
                            {/* <Loader visible={memberLoading} content={loadingText}  /> */}
                            <Modal.Header>
                                <div className="back-btn">
                                    <a href="#" onClick={() => this.showTerms(false)}>
                                        {ArrowBackIcon}
                                    </a>
                                </div>
                                <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
                                    Terms of Service
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="modal-invite-group">
                                <div className="row ml-4 mr-4 mb-4 mt-0">
                                    <div className="col-lg-12 p-0">
                                        <p className="terms-text">{this.state.termsofservice}</p>
                                        <div className="terms-action">
                                            <a href="#" onClick={() => this.showTerms(false)}>Decline</a>
                                            <button type="button" className="btn btn-medium btn-submit btn-green" onClick={() => this.acceptTerms(true)}>I Accept</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                }
            </>
        );
    }
}
Signup.propTypes = {
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    errors: state.errors,
    response: state.response
})
export default connect(mapStateToProps, { registerUser, countryList, timezoneList, termsofservice, resetError })(Signup)
