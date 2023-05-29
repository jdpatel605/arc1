import React, {useEffect} from "react";
import { SuccssAppLogo } from "../../utils/Svg";

const OrgSuccess = props => {

    useEffect(() => {
        if(props.location.state === undefined) {
            props.history.push("/");
        }
    }, [props.location.state])
    
    const goBack = (e) => {
        e.preventDefault();
        props.history.push("/");
    }
    
    const createAccount = (e) => {
        e.preventDefault();
        props.history.push({
            pathname: '/signup',
            state: {
                org_code: props?.location?.state?.org_code,
            }
        });
    }

    return (

        <div className="container">
            <div className="row">
                <div className="box-contain bg-black-900 text-center">
                    <div></div>
                    <div>
                        {SuccssAppLogo}
                        <h1 className="clr-white">Success</h1>
                        <p className="mt-2">Your are joining the [{props?.location?.state?.org?.name}] team.</p>
                        <br />
                    </div>
                    <div className="mt-5 btn-sec">
                        <div className="col-sm-6">
                            <a href="" onClick={e => goBack(e)} className="btn btn-medium btn-black w-100">Back</a>
                        </div>
                        <div className="col-sm-6">
                            <button onClick={e => createAccount(e)} className="btn btn-medium  w-100 btn-submit btn-green">Create Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default OrgSuccess;