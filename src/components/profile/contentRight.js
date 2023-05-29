import React, { useEffect, useState } from "react";
import SubContentSettings from "./subContentSettings";
import SubContentOrganizations from "./subContentOrganizations";
import SubContentHelp from "./subContentHelp";
import SubContentProfileUpdate from "./subContentProfileUpdate";
import SubContentTerms from "./subContentTerms";
import PropTypes from 'prop-types';

const ContentRight = ({ panel }) => {
    const [tab, setTab] = useState('')

    useEffect(() => {
        setTab(panel)
    }, [panel]);


    return (
        <div className="right-panal pt-1">
            {tab === 'SETTING' && <SubContentSettings />}
            {tab === 'ORG' && <SubContentOrganizations />}
            {tab === 'HELP' && <SubContentHelp />}
            {tab === 'PROFILE' && <SubContentProfileUpdate />}
            {tab === 'TERMS' && <SubContentTerms />}
        </div>
    );
}
ContentRight.propTypes = {
    panel: PropTypes.string,
};
ContentRight.defaultProps = {
    panel: 'ORG'
};
export default ContentRight
