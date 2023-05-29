import React, {Component} from "react";
import PropTypes from 'prop-types';

export default class Thankyou extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push("/");
    }

    render() {

        return (

            <div className="container">
                <div className="row">
                    <div className="box-contain bg-black-900 text-center">
                        <div></div>
                        <div>
                            <img src="images/mail.svg" alt="" style={{width: '120px'}} />
                            <h1 className="clr-white">Thank You</h1>
                            <p>An email has been sent to your address. Please click the link in your email to confirm your account.</p>
                            <br />
                        </div>
                        <div className="mt-2 btn-sec">
                            <div className="col-sm-3">
                            </div>
                            <div className="col-sm-6">
                                <button onClick={e => this.goBack(e)} className="btn btn-medium  w-100 btn-submit btn-green">Okay</button>
                            </div>
                            <div className="col-sm-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
Thankyou.propTypes = {
    history: PropTypes.object
}