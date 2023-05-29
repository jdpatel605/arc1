import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../includes/loginNavbar";
import Spinner from "../spinner";
import OtpInput from '../otp-input';
import { checkOrgCodeRequest, resetOpenStore } from '../../store/actions/openActions';
import { Logger } from './../../utils/logger';
import {Helper} from "../../utils/helper";
const fileLocation = "src\\components\\signup\\orgcode.jsx";

const OrgCode = props => {
    const dispatch = useDispatch();
    const { codeFlagLoading, codeFlag, orgCodeError, orgCodeSuccess } = useSelector(({ open }) => open);
    const [otpValue, setOTP] = useState('');
    const [formFilled, setFormFilled] = useState(false);
    const [confirmDisabled, setConfirmDisabled] = useState(true);

    const otpChanged = (otp) => {
        setOTP(otp.toUpperCase());
        if (otp.length === 6) {
            setFormFilled(true);
            setConfirmDisabled(false);
            dispatch(checkOrgCodeRequest(otp.toUpperCase()));
        }
        else {
            setFormFilled(false);
            setConfirmDisabled(true);
        }
    }

    useEffect(() => {
        console.log(codeFlag);
    }, [codeFlag])

    useEffect(() => {
        try {
            if (orgCodeError && orgCodeError.type === "payment_required") {
                dispatch(resetOpenStore());
                props.history.push({
                    pathname: '/noseats',
                    state: {
                        organization_identifier: orgCodeError.data.organization_identifier,
                    }
                });
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:orgCodeError'})
        }
    }, [orgCodeError])

    const goBack = (e) => {
        e.preventDefault();
        dispatch(resetOpenStore());
        props.history.push("/");
    }

    const cretaorg = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        try {
            if (orgCodeSuccess && orgCodeSuccess.identifier) {
                props.history.push({
                    pathname: '/orgsuccess',
                    state: {
                        org_code: otpValue,
                        org: orgCodeSuccess
                    }
                });
                dispatch(resetOpenStore());
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:orgCodeSuccess'})
        }
    }, [orgCodeSuccess])

    return (

        <div className="container">
            <div className="row">
                <div className="box-contain bg-black-900">
                    <form noValidate="" method="" id="entercode-form">
                        <Navbar />
                        <div>
                            <h1 className="clr-white">Org Code</h1>
                            <p>Please enter the organization code you received from your administrator.</p>
                            <div className={orgCodeError?.type === 'not_found' ? 'is_error' : ''}>
                                <OtpInput
                                    onChange={e => otpChanged(e)}
                                    numInputs={6}
                                    inputStyle="form-control"
                                    containerStyle="form-group enter-code"
                                    isInputNum={true}
                                    value={otpValue}
                                    hasErrored={false}
                                    errorStyle="error"
                                    shouldAutoFocus={true}
                                />
                                <div className="form-group text-center">
                                    <p><small>or</small></p>
                                    <a href={Helper.getMarketingUrl()} target="_blank">Create New Organization</a>
                                </div>
                                {orgCodeError && orgCodeError.status &&
                                    <>
                                        {orgCodeError.type === 'not_found' &&
                                            <div className="error-sec invalid-login">
                                                <span className="error">Oops. That doesn't seem like the right code.</span>
                                            </div>
                                        }
                                    </>
                                }
                            </div>

                        </div>
                        <div className="mt-5 btn-sec">
                            <div className="col-sm-6">
                                <a href="" onClick={e => goBack(e)} className="btn btn-medium btn-black w-100">Back</a>
                            </div>
                            <div className="col-sm-6">
                                <button type="button" onClick={e => this.submitForm(e)} disabled={confirmDisabled}
                                    className={`btn btn-medium  w-100 btn-submit ${formFilled ? "btn-green" : "btn-gray-500"}`}>
                                    Submit {codeFlagLoading && <Spinner />} </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default OrgCode;