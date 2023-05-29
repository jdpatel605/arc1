import React, {useRef, useEffect, useState} from "react";
import {useSelector} from 'react-redux';
import {SearchIcon, PlusIcon} from "../../utils/Svg";
import PropTypes from 'prop-types';

const ContentHeader = (props) => {

    const {orgList} = useSelector(({group}) => group);
    const [openClass, setOpenClass] = useState('');
    const node = useRef();
    const inputNode = useRef();

    const searchGroup = (event) => {
        props.searchGroup(event.target.value);
    }
    const createGroupBox = (value) => {
        props.createGroupBox(value);
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target) || inputNode.current.contains(e.target)) {
            setOpenClass('open');
        }
        else {
            setOpenClass('');
        }
    };

    return (
        <div className="content-title">
            <div className="d-flex">
                <h1>Groups</h1>
                <div className="search-box">
                    <input type="text" id="txtsearch" ref={inputNode} className={`search ${openClass}`} placeholder="Search..." onChange={searchGroup.bind(this)}/>
                    <a className="btn-search" href="#" ref={node}>
                        {SearchIcon}
                    </a>
                </div>
            </div>
            {orgList && orgList.eventData && orgList && orgList.eventData.entries.length > 0 &&
                <div className="add-data">
                    <a className="btn btn-add btn-green btn-click" href="#" onClick={() => createGroupBox(true)}>
                        {PlusIcon}
                    </a>
                </div>
            }
        </div>
    );
}
ContentHeader.propTypes = {
    searchGroup: PropTypes.func,
    createGroupBox: PropTypes.func,
    isCreateShow: PropTypes.bool,
};
export default ContentHeader;