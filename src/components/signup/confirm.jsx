import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {confirmOtp, resendOtp, resetError, verifyPasswordOtp} from '../../store/actions/auth';
import OtpInput from '../otp-input';
import Spinner from "../spinner";
import PhoneFormat from "../common/PhoneFormat";
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\signup\\confirm.jsx";

class Confirm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            otp: '',
            email: '',
            error: false,
            is_error: false,
            errorMessage: [],
            disabled: false,
            formFilled: false,
            fromSignup: 'SIGNUP',
            codeSent: false,
            phone_number: false,
        };
        this.submitForm = this.submitForm.bind(this);
        this.goBack = this.goBack.bind(this);
        console.log(this.props);
        this.props.resetError();
        this.props.resetError(true);
    }
    componentDidMount() {
        if(!this.props.location.state) {
            // state will set from forgot password component or from signup component api response
            this.props.history.push('/');
            return;
        }
        this.changeState('fromSignup', this.props.location.state.from);
        this.changeState('email', this.props.location.state.email);
        this.changeState('phone_number', this.props.location.state.mobile_phone_number);
    }
    componentWillReceiveProps(nextProps) {
        try {
            if(nextProps.errors.errors) {
                this.setState({errorMessage: nextProps.errors.errors});
                this.setState({disabled: false});
                if(nextProps.errors.errors.length !== 0) {
                    this.setState({is_error: true});
                }
            }
            if(nextProps.response && nextProps.response.sent) {
                this.setState({disabled: false});
                this.setState({codeSent: true});
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'confirmOTP'})
        }
    }
    isFormValid() {
        const {otp} = this.state
        var isFilled = otp.length === 6
        this.setState({formFilled: isFilled});
    }
    changeState(name, val) {
        this.setState({[name]: val});
        setTimeout(() => {
            this.isFormValid()
        }, 10);
    }
    otpChanged(otp) {
        this.changeState('errorMessage', []);
        this.changeState('otp', otp.toUpperCase());
        this.changeState('is_error', false);
        if(otp.length === 6) {
            this.changeState('disabled', true);
            var data = {
                otp: otp.toUpperCase()
            };

            if(this.state.fromSignup === "FORGOT_PASSWORD") {
                data.email = this.state.email
                this.props.verifyPasswordOtp(data, this.props.history);
            } else {
                this.props.confirmOtp(data, this.props.history);
            }
        }
    }
    goBack(e) {
        e.preventDefault();
        if(this.state.fromSignup === 'FORGOT_PASSWORD') {
            this.props.history.push("/forgot-password");
        } else {
            this.props.history.push("/");
        }
    }
    submitForm(e) {
        e.preventDefault();
        if(!this.state.otp || this.state.otp.length < 6) {
            this.changeState('error', true);
            this.changeState('errorMessage', ['Please fill code']);
        }
        else {
            this.changeState('disabled', true);
            var data = {
                otp: this.state.otp
            };

            if(this.state.fromSignup === "FORGOT_PASSWORD") {
                data.email = this.state.email
                this.props.verifyPasswordOtp(data, this.props.history);
            } else {
                this.props.confirmOtp(data, this.props.history);
            }
        }
    }
    resendCode(e) {
        e.preventDefault();

        var data = {
            email: this.state.email
        };
        this.props.resendOtp(data, this.props.history);
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
                        <form noValidate="" method="" id="entercode-form">
                            <div>
                                <h1 className="clr-white">Enter Code</h1>
                                <p>You should receive a 6 digit code via text message (SMS), please enter it below.</p>
                                <div className={this.state.is_error ? 'is_error' : ''}>
                                    <OtpInput
                                        onChange={e => this.otpChanged(e)}
                                        numInputs={6}
                                        inputStyle="form-control"
                                        containerStyle="form-group enter-code"
                                        isInputNum={true}
                                        value={this.state.otp}
                                        hasErrored={this.state.error}
                                        errorStyle="error"
                                        shouldAutoFocus={true}
                                    />
                                    <div className="form-group text-right">
                                        <a href="" onClick={e => this.resendCode(e)}>Re-send code</a>
                                    </div>
                                    {this.state.codeSent && <div className="form-group">
                                        <p className="new-code-send">A new code has been sent to <PhoneFormat number={this.state.phone_number} /></p>
                                    </div>}
                                    <div className="error-sec invalid-login">
                                        {
                                            this.state.errorMessage.map(function (name, key) {
                                                return <span className="error" key={key}>{name}</span>;
                                            })
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="mt-5 btn-sec">
                                <div className="col-sm-6">
                                    <a href="" onClick={e => this.goBack(e)} className="btn btn-medium btn-black w-100">Back</a>
                                </div>
                                <div className="col-sm-6">
                                    <button type="button" onClick={e => this.submitForm(e)} disabled={this.state.disabled}
                                        className={`btn btn-medium  w-100 btn-submit ${this.state.formFilled ? "btn-green" : "btn-gray-500"}`}>
                                        Submit {spinner} </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}

Confirm.propTypes = {
    errors: PropTypes.object.isRequired,
    response: PropTypes.object,
    location: PropTypes.object,
    resetError: PropTypes.func,
    resendOtp: PropTypes.func,
    confirmOtp: PropTypes.func,
    verifyPasswordOtp: PropTypes.func,
}

const mapStateToProps = state => ({
    errors: state.errors,
    response: state.response
})

export default connect(mapStateToProps, {confirmOtp, resendOtp, resetError, verifyPasswordOtp})(Confirm);
