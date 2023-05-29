import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../spinner";
import { NoSeatImage } from "../../utils/Svg";
import { seatNofitifyRequest, resetOpenStore } from '../../store/actions/openActions';
import { Logger } from './../../utils/logger';
const fileLocation = "src\\components\\signup\\noseats.jsx";

const defaultValidation = {
    name: "", email: "", organization_identifier: ""
};

const NoSeats = props => {

    const dispatch = useDispatch();
    const { notifyFlagLoad, notifyFlag, seatError } = useSelector(({ open }) => open);
    const [componentLoad, setComponentLoad] = useState(false);
    const [noSeatDetails, setNoSeatDetails] = useState(defaultValidation);
    const [filedActive, setFiledActive] = useState({ name: false, email: false });
    const [validationErrors, setValidationErrors] = useState({});
    const [validForm, setValidForm] = useState(false);

    useEffect(() => {
        if (props.location.state === undefined) {
            props.history.push("/");
        }
        else {
            const updatedValues = { ...noSeatDetails, organization_identifier: props.location.state.organization_identifier };
            setNoSeatDetails(updatedValues);
        }
    }, [props.location.state])

    // Validate Organization details
    useEffect(() => {
        if (componentLoad === true) {
            let nameCount = 1;
            let emailCount = 1;

            // Organization name
            if (filedActive.name && !noSeatDetails.name) {
                setValidationErrors(prevProps => ({ ...prevProps, name: "Full name is required" }));
            } else if (filedActive.name && noSeatDetails.name) {
                nameCount = 0;
                setValidationErrors(prevProps => ({ ...prevProps, name: "" }));
            }

            // Email
            const emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (filedActive.email && !noSeatDetails.email) {
                setValidationErrors(prevProps => ({ ...prevProps, email: "Email address is required" }));
            } else if (filedActive.email && !emailTest.test(noSeatDetails.email)) {
                setValidationErrors(prevProps => ({ ...prevProps, email: "Email address is invalid" }));
            } else if (filedActive.email && noSeatDetails.email) {
                emailCount = 0;
                setValidationErrors(prevProps => ({ ...prevProps, email: "" }));
            }

            if (nameCount === 0 && emailCount === 0) {
                setValidForm(true);
            }
            else {
                setValidForm(false);
            }
        }
    }, [noSeatDetails])

    // Update state
    const updateStateValue = (event) => {
        setComponentLoad(true);
        const { name, value } = event.target;
        const activeField = { ...filedActive, [name]: true };
        setFiledActive(activeField)
        const updatedValues = { ...noSeatDetails, [name]: value };
        setNoSeatDetails(updatedValues)
    };

    const displayErrorMessage = data => {
        if (typeof data === 'object') {
            return <p className="text-error">{data.message}</p>
        } else {
            return <p className="text-error">{data}</p>
        }
    }

    const goBack = (e) => {
        e.preventDefault();
        props.history.push("/orgcode");
    }

    const getNotified = (e) => {
        dispatch(seatNofitifyRequest(noSeatDetails));
    }

    useEffect(() => {
        try {
            if (notifyFlag && notifyFlag === 1) {
                dispatch(resetOpenStore());
                props.history.push({
                    pathname: '/requestsent',
                    state: {
                        organization_identifier: props.location.state.organization_identifier,
                    }
                });
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:notifyFlag'})
        }
    }, [notifyFlag])

    return (

        <div className="container">
            <div className="row">
                <div className="box-contain bg-black-900 text-center">
                    <div>
                        {NoSeatImage}
                        <h1 className="clr-white mt-4">Uh Oh</h1>
                        <p className="mt-2">All seats in this organization are currently occupied. Please enter your name and email to be notified when seats become available.</p>
                        <br />

                        <div className="form-group">
                            <div className="bg-black-500 bg-focus">
                                <input type="text" className={`form-control ${validationErrors.name && 'error'}`}
                                    id="name" name="name" required onKeyUp={updateStateValue} defaultValue={noSeatDetails.name}/>
                                <label htmlFor="name" className="txt-label">Full Name</label>
                            </div>
                            {validationErrors.name && displayErrorMessage(validationErrors.name)}
                        </div>
                        <div className="form-group">
                            <div className="bg-black-500 bg-focus">
                                <input type="email" className={`form-control ${validationErrors.email && 'error'}`}
                                    id="email" name="email" required onChange={updateStateValue} defaultValue={noSeatDetails.email}/>
                                <label htmlFor="email" className="txt-label">Email Address</label>
                            </div>
                            {validationErrors.email && displayErrorMessage(validationErrors.email)}
                        </div>
                        {seatError && seatError.status &&
                            <>
                                {seatError.message.type === 'conflict' &&
                                    <div className="error-sec invalid-login">
                                        <span className="error">{seatError.message.message}</span>
                                    </div>
                                }
                                {seatError.message.type !== 'conflict' &&
                                    <div className="error-sec invalid-login">
                                        <span className="error">Opps something went wrong!</span>
                                    </div>
                                }
                            </>
                        }
                        <div className="mt-2 btn-sec">
                            <div className="col-sm-6">
                                <a href="" onClick={e => goBack(e)} className="btn btn-medium btn-black w-100">Back</a>
                            </div>
                            <div className="col-sm-6">
                                <button onClick={e => getNotified(e)} className={`btn btn-green md-box btn-medium ${!validForm && 'btn-gray-500'}`} disabled={!validForm}>Get Notified {notifyFlagLoad && <Spinner />}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default NoSeats;
