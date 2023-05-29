import React, {Component} from "react";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {loginUser, resetError} from '../store/actions/auth';
import SimpleReactValidator from 'simple-react-validator';
import Spinner from "./spinner";
import {Logger} from './../utils/logger';
const fileLocation = "src\\components\\signin.jsx";

class Signin extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator(
            {
                autoForceUpdate: this,
                messages: {
                    email: 'Email must be a valid email address',
                    required: ':attribute field is required',
                },
            }
        );
        this.state = {
            is_login: localStorage.getItem('is_login'),
            user_role: localStorage.getItem('user_role'),
            email: '',
            password: '',
            showPassword: false,
            error: false,
            errorMessage: [],
            disabled: 'disabled',
            spinner: false,
            errorClass: '',
            border_cls: '',
            formFilled: false,
            country_data: {},
        };
        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this);

        this.props.resetError();
    }
    componentDidMount(props) {
        if(this.state.is_login) {
            if(this.state.user_role === 'admin' || this.state.user_role === 'owner') {
                this.props.history.push('/admin/profile');
            }
            else {
                this.props.history.push('/events');
            }
        }
        setTimeout(() => {
            this.isFormValid()
        }, 10);
    }
    componentWillReceiveProps(nextProps) {
        try {
            if(nextProps.errors.errors.length > 0) {
                console.log('calll')
                this.setState({
                    errorMessage: nextProps.errors.errors,
                    spinner: false,
                    border_cls: 'left-edge',
                    formFilled: false,
                    disabled: 'disabled'
                });
                setTimeout(() => {
                    nextProps.errors.errors = [];
                }, 10);
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'signIn'})
        }
    }
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    isFormValid() {
        const {email, password} = this.state

        var isFilled = this.validateEmail(email) && password !== ""
        if(isFilled) {
            this.setState({
                formFilled: true,
                disabled: ''
            });
        }
        else {
            this.setState({
                formFilled: false,
                disabled: 'disabled'
            });
        }
    }
    handleChange = (name, e) => {
        this.setState({
            errorMessage: [],
            border_cls: '',
        });
        var val = e.target.value;
        this.changeState(name, val);
    }

    changeState(name, val) {
        this.setState({[name]: val.trim()});
        this.validator.showMessageFor(name);
        setTimeout(() => {
            this.isFormValid()
        }, 10);
    }

    handleCheckbox(name, event) {
        this.setState({[name]: event.target.checked});
    }

    goBack(e) {
        e.preventDefault();
        // this.props.history.push('/signup');
        this.props.history.push('/orgcode');
    }
    goToForgotPassword(e) {
        e.preventDefault();
        this.props.history.push("/forgot-password");
    }
    submitForm(e) {
        e.preventDefault();
        this.setState({errorMessage: []});
        this.setState({errorClass: ''});
        if(this.validator.allValid()) {
            this.setState({
                disabled: '',
                spinner: true
            });
            this.props.loginUser(this.state, this.props.history);
        } else {
            this.validator.showMessages();
            this.setState({errorClass: 'was-validated'});
        }
    }
    render() {

        var spinner = '';
        if(this.state.spinner) {
            spinner = <Spinner />;
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="box-contain bg-black-900 mt-5 mb-5">
                        <form noValidate="" className={this.state.errorClass} method="" >

                            <div>
                                <h1 id="header-welcome" className="clr-white">Welcome</h1>
                                <p id="login-prompt">Enter your email and password below to login and access your account.</p>

                                <div className="form-group">
                                    <div className={`bg-black-500 ${this.state.border_cls}`}>
                                        {this.validator.message('email', this.state.email, 'required|email')}
                                        <input id="input-email" type="email" className="form-control" value={this.state.email} onChange={(e) => this.handleChange("email", e)} required />
                                        <label className="txt-label">Email Address</label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={`bg-black-500 form-pass ${this.state.showPassword ? 'txtpass-hidden' : 'txtpass'} ${this.state.border_cls}`}>
                                        {this.validator.message('password', this.state.password, 'required')}
                                        <input id="input-password" type={this.state.showPassword ? 'text' : 'password'}
                                            className={this.state.showPassword ? 'form-control txtpass-hidden' : 'form-control txtpass'} value={this.state.password}
                                            onChange={(e) => this.handleChange("password", e)} required />
                                        <label className="txt-label">Password</label>
                                        <input id="checkbox-show-password" type="checkbox" className="txticon" name="chkpass" onClick={(e) => this.handleCheckbox('showPassword', e)} />
                                    </div>
                                </div>
                                <div className="form-group text-right">
                                    <a href="" onClick={e => this.goToForgotPassword(e)}>Forgot Password?</a>
                                </div>
                                <div className="error-sec invalid-login">
                                    {
                                        this.state.errorMessage.map(function (name, key) {
                                            return <span className="error" key={key}>{name}</span>;
                                        })
                                    }
                                </div>
                            </div>
                            <div className="mt-5 btn-sec">
                                <div className="col-sm-6">
                                    <a href="" onClick={e => this.goBack(e)} className="btn btn-medium btn-black w-100">Create New Account</a>
                                </div>
                                <div className="col-sm-6">
                                    <button id="btn-sign-in" onClick={e => this.submitForm(e)} disabled={this.state.disabled}
                                        className={`btn btn-medium  w-100 btn-submit ${this.state.formFilled ? 'btn-green' : 'btn-gray-500'}`}>
                                        Sign In {spinner} </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}

Signin.propTypes = {
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    errors: state.errors,
    response: state.response
})

export default connect(mapStateToProps, {loginUser, resetError})(Signin);
