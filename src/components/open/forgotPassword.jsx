import React, {Component} from "react";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {sendForgotPasswordOtp} from '../../store/actions/auth';
import SimpleReactValidator from 'simple-react-validator';
import Spinner from "../spinner";
import history from "../../history/history";
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\oepn\\forgotPassword.jsx";

class ForgotPassword extends Component {
    constructor(props) {

        const isLogin = localStorage.getItem('is_login');
        if(isLogin) {
            history.push('/group')
        }

        super(props);
        this.validator = new SimpleReactValidator(
            {
                autoForceUpdate: this,
                validators: {
                    email: {  // name the rule
                        message: 'Please provide valid email address.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val, /^[a-zA-Z]{1}[a-zA-Z0-9._-]+@[a-zA-Z]+.[a-zA-Z]{2,4}/)
                        },
                        messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                        required: true  // optional
                    },
                },
                messages: {
                    email: 'Email must be a valid email address',
                    required: ':attribute is required',
                },
            }
        );
        this.state = {
            email: '',
            errorMessage: [],
            btn_disabled: 'disabled',
            disabled: false,
            errorClass: '',
            formFilled: false,
            isInvalidEmail: false,
        };
        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        try {
            if(nextProps.errors.errors) {
                this.setState({errorMessage: nextProps.errors.errors});
                this.setState({disabled: false, isInvalidEmail: true});
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'forgotPassword'})
        }
    }
    isFormValid() {
        const {email} = this.state
        var isFilled = email !== ""
        if(isFilled) {
            this.setState({btn_disabled: ''});
        }
        else {
            this.setState({btn_disabled: 'disabled'});
        }
    }
    handleChange = (name, e) => {
        var val = e.target.value;
        this.changeState(name, val);
    }

    changeState(name, val) {
        this.setState({isInvalidEmail: false});
        this.setState({[name]: val});
        this.validator.showMessageFor(name);
        setTimeout(() => {
            this.isFormValid()
            if(!this.validator.allValid()) {
                this.setState({
                    formFilled: false,
                    btn_disabled: 'disabled'
                });
            }
            else {
                this.setState({
                    formFilled: true,
                    btn_disabled: ''
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
            email: this.state.email,
        };
        this.props.sendForgotPasswordOtp(data, this.props.history);
    }
    render() {

        var spinner = '';
        if(this.state.disabled) {
            spinner = <Spinner />;
        }
        return (

            <div className="container">
                <div className="row">
                    <div className="box-contain bg-black-900 mt-5 mb-5">
                        <form className="form-sec" noValidate="" className={this.state.errorClass}>
                            <div className="w-100">
                                <div className="form-title">
                                    <a className="bg-arrow" onClick={e => this.goBack(e)} href="">
                                        <img src="images/arrow-left.png" alt="" srcSet="" />
                                    </a>
                                    <h4 className="clr-white">
                                        Forgot Password
                                        </h4>
                                    <p>Please enter your email below in order to get a reset password link.</p>
                                </div>
                                <div className="form-group">
                                    <div className={`bg-black-500 ${this.state.isInvalidEmail && 'err-div'}`}>
                                        {this.validator.message('email', this.state.email, 'required|email|email')}
                                        <input type="email" className="form-control" value={this.state.email} onChange={(e) => this.handleChange("email", e)} required />
                                        <label className="txt-label">Email Address</label>
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
                                                "btn-green" : "btn-gray-500"}`}>Send Reset Link {spinner} </button>
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
ForgotPassword.propTypes = {
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    errors: state.errors,
    response: state.response
})
export default connect(mapStateToProps, {sendForgotPasswordOtp})(ForgotPassword)
