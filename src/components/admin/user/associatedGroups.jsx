import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';
import PropTypes from 'prop-types';
import TruncationText from "../../common/TruncationText";
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\user\\associatedGroups.jsx";

const AssociatedGroups = props => {
    const ref = useRef(null);
    const [boxShow, setBoxShow] = useState(false);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [activeClass, setActiveClass] = useState('');
    
    const enteringMode = (event) => {
        // code
    };
    const handleClick = (event) => {
        setBoxShow(true)
        setBoxShow(!boxShow)
        setShow(!show);
        setTarget(event.target);
        setActiveClass('popactive');
    };

    const handleClose = (event) => {
        setBoxShow(false)
        setShow(false);
        setActiveClass('');
    };
    
    return (
        <div ref={ref}>
            <p onClick={(e) => handleClick(e)} >group</p>
            <Overlay
                show={show}
                target={target}
                placement="left"
                container={ref.current}
                containerPadding={2}
                onEntering={enteringMode}
                rootClose
                onHide={handleClose}
            >
                <Popover id="popover-contained">
                    <Popover.Content>
                            <div className="setting-detail">
                                <div className="setting-sec">
                                    <label><TruncationText content={'Group 1'}  /></label>
                                    <div className="communication">
                                        <a className="btn btn-round btn-blue" href="#"> Group Owner </a>
                                    </div>
                                </div>
                                <div className="setting-sec"> 
                                    <label><TruncationText content={'Group 2'}  /></label>
                                    <div className="communication">
                                        <a className="btn btn-round btn-yellow" href="#"> Group Admin </a>
                                    </div>
                                </div>
                                <div className="setting-sec"> 
                                    <label><TruncationText content={'Group 3'}  /></label>
                                    <div className="communication">
                                        <a className="btn btn-round btn-gray" href="#"> Member </a>
                                    </div>
                                </div>
                                <div className="setting-sec"> 
                                    <label><TruncationText content={'Group 4'}  /></label>
                                    <div className="communication">
                                        <a className="btn btn-round btn-black" href="#"> Member </a>
                                    </div>

                                </div>
                            </div>
                    </Popover.Content>
                </Popover>
            </Overlay>
        </div>
    )
}
AssociatedGroups.propTypes = {
  name: PropTypes.string,
};
AssociatedGroups.defaultProps = {
  name: '',
};
export default AssociatedGroups;