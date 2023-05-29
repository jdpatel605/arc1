import React, {Component} from "react";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {resetPassword, resetError} from '../../store/actions/auth';
import SimpleReactValidator from 'simple-react-validator';
import Spinner from "../spinner";
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\oepn\\forgotPassword.jsx";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            validators: {
                password: {  // name the rule
                    message: 'Must contain 1 lower, 1 upper, 1 special char and 1 digit',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
                    },
                    messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                    required: true  // optional
                }
            }
        });
        this.state = {
            password: '',
            password_confirmation: '',
            reset_password_token: '',
            errorMessage: [],
            btn_disabled: 'disabled',
            disabled: false,
            errorClass: '',
            formFilled: false,
            showPassword: false,
            showCPassword: false,
        };
        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);

        this.props.resetError();
    }
    componentDidMount() {

        if(!this.props.location.state) {
            // state will set from forgot password component or from signup component api response
            this.props.history.push('/');
            return;
        }

        this.changeState('reset_password_token', this.props.location.state.reset_password_token);
    }
    componentWillReceiveProps(nextProps) {
        try {
            if(nextProps.errors.errors) {
                this.setState({errorMessage: nextProps.errors.errors});
                this.setState({disabled: false});
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'resetPassword'})
        }
    }
    isFormValid() {
        const {password, password_confirmation} = this.state

        var isFilled = password !== "" && password_confirmation !== ""
        if(isFilled) {
            this.setState({
                formFilled: isFilled,
                btn_disabled: ''
            });
        }
        else {
            this.setState({
                formFilled: isFilled,
                btn_disabled: 'disabled'
            });
        }
    }
    handleChange = (name, e) => {
        var val = e.target.value;
        this.changeState(name, val);
    }

    changeState(name, val) {
        this.setState({[name]: val});
        this.validator.showMessageFor(name);
        setTimeout(() => {
            this.isFormValid()
            if(this.validator.allValid()) {
                this.setState({
                    formFilled: true,
                    btn_disabled: ''
                });
            }
            else {
                this.setState({
                    formFilled: false,
                    btn_disabled: 'disabled'
                });
            }
        }, 10);
    }

    handleCheckbox(name, event) {
        this.setState({[name]: event.target.checked});
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push("/");
    }
    submitForm(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({errorMessage: []});
        this.setState({errorClass: ''});

        if(this.validator.allValid()) {
            this.setState({disabled: true});
            this.sendLink();
        } else {
            this.validator.showMessages();
            this.setState({errorClass: 'was-validated'});
        }


    }
    sendLink() {
        var data = {
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
            reset_password_token: this.state.reset_password_token,
        };
        this.props.resetPassword(data, this.props.history);
    }
    render() {

        var spinner = '';
        if(this.state.disabled) {
            spinner = <Spinner />;
        }
        return (

            <div className="container">
                <div className="row">
                    <div className="box-contain bg-black-900">
                        <form className="form-sec" noValidate="" className={this.state.errorClass}>
                            <div>
                                <div className="form-title">
                                    <a className="bg-arrow" onClick={e => this.goBack(e)} href="">
                                        <img src="images/arrow-left.png" alt="" srcSet="" />
                                    </a>
                                    <h4 className="clr-white">
                                        Reset Password
                                        </h4>
                                    <p>Please enter a new password below, the password must include a capital letter, special charater and a number.</p>
                                </div>
                                <div className="form-group">
                                    <div className={`bg-black-500 form-pass ${this.state.showPassword ? 'txtpass-hidden' : 'txtpass'}`}>
                                        {this.validator.message('password', this.state.password, 'required|min:8|max:16|password')}
                                        <input type={this.state.showPassword ? 'text' : 'password'} className={this.state.showPassword ? 'form-control txtpass-hidden' : 'form-control txtpass'} value={this.state.password} onChange={(e) => this.handleChange("password", e)} id="txtpass" name="txtpass" required />
                                        <label className="txt-label">Password</label>
                                        <input type="checkbox" className="txticon" name="chkpass" onClick={(e) => this.handleCheckbox('showPassword', e)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={`bg-black-500 form-pass ${this.state.showCPassword ? 'txtpass-hidden' : 'txtpass'}`}>
                                        {this.validator.message('password_confirmation',
                                            this.state.password_confirmation,
                                            `required|in:${this.state.password}`,
                                            {messages: {in: 'Passwords do not match'}})}
                                        <input type={this.state.showCPassword ? 'text' : 'password'} className={this.state.showCPassword ? 'form-control txtpass-hidden' : 'form-control txtpass'} value={this.state.password_confirmation} onChange={(e) => this.handleChange("password_confirmation", e)} id="txtcpass" name="txtcpass" required />
                                        <label className="txt-label">Confirm Password</label>
                                        <input type="checkbox" className="txticon" name="chkcpass" onClick={(e) => this.handleCheckbox('showCPassword', e)} />
                                    </div>
                                </div>
                                <div className="error-sec">
                                    {
                                        this.state.errorMessage.map(function (name, key) {
                                            return <span className="error" key={key}>{name}</span>;
                                        })
                                    }
                                </div>
                                <div className="mt-5 btn-sec">
                                    <div className="col-sm-6">
                                        &nbsp;
                                    </div>
                                    <div className="col-sm-6">
                                        <button onClick={e => this.submitForm(e)} disabled={this.state.btn_disabled}
                                            className={`btn btn-medium  w-100 btn-submit ${this.state.formFilled ?
                                                "btn-green " : "btn-gray-500 "}`}>Reset Password {spinner} </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
ResetPassword.propTypes = {
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    errors: state.errors,
    response: state.response
})
export default connect(mapStateToProps, {resetPassword, resetError})(ResetPassword)
