import React, {useEffect} from "react";
import { RequestSentImage } from "../../utils/Svg";

const RequestSent = props => {

    useEffect(() => {
        if(props.location.state === undefined) {
            props.history.push("/");
        }
    }, [props.location.state])
    
    const goBack = (e) => {
        e.preventDefault();
        props.history.push("/");
    }
    
    return (

        <div className="container">
            <div className="row">
                <div className="box-contain bg-black-900 text-center">
                    <div></div>
                    <div>
                        {RequestSentImage}
                        <h1 className="clr-white mt-4">Request Sent</h1>
                        <p className="mt-2">Your request has been sent and you will be notified when seats become available.</p>
                        <br />
                    </div>
                    <div className="mt-5 btn-sec">
                        <div className="col-sm-8 offset-sm-2">
                            <button onClick={e => goBack(e)} className="btn btn-medium  w-100 btn-submit btn-green">Okay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default RequestSent;