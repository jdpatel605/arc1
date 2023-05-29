import React from "react";

const ContentGroupEmpty = (props) => {

    const organizationId = localStorage.getItem('organization_id')
    const createGroupBox = (value) => {
        props.createGroupBox(value);
    }
    return (
        <div className="black-box d-flex mt-5">
            <div style={{'margin': 'auto'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="108" height="90" viewBox="0 0 24 24">
                    <path fill="#95A1AC" fillRule="evenodd" d="M18.5 2.67c1.48.855 2.416 2.402 2.495 4.099L21 7v2.002c-.003 1.548-.725 2.993-1.929 3.926l-.072.053.001.34 3.742 1.5c.709.282 1.19.942 1.251 1.693l.007.163V22h-6v-2h4v-3.322l-3.742-1.5c-.707-.283-1.188-.94-1.251-1.693L17 13.324v-1.457l.502-.288c.867-.498 1.423-1.393 1.491-2.38L19 9.001V7c0-1.072-.571-2.063-1.5-2.599-.866-.5-1.92-.534-2.812-.1l-.188.1-.866.5-1-1.732.866-.5c1.547-.893 3.453-.893 5 0zM8 3c2.761 0 5 2.24 5 5v2.003c-.003 1.548-.725 2.993-1.929 3.926l-.072.053.001.34 3.742 1.5c.76.303 1.257 1.038 1.258 1.856V22H0v-4.326c.002-.816.5-1.549 1.257-1.851L5 14.324v-.342l-.071-.053c-1.144-.886-1.852-2.235-1.923-3.696L3 10V8c0-2.762 2.239-5 5-5zm0 2C6.343 5 5 6.345 5 8V10c.002 1.066.573 2.05 1.498 2.58l.502.288v1.458c0 .817-.499 1.552-1.257 1.855L2 17.68V20h12V17.68l-3.742-1.5C9.5 15.876 9.002 15.143 9 14.324v-1.457l.502-.288c.925-.53 1.496-1.514 1.498-2.578V8c0-1.657-1.343-3-3-3z" />
                </svg>

                <h4>{props.isCreateShow === false ? "You Haven't Joined Any Groups" : 'No Groups'}</h4>
                <p>It seems you don’t have any groups, a group is a collection of
                individuals you can quickly setup an event or call
                    with.</p>
                {organizationId !== 'null' && props.isCreateShow &&
                    <a className="btn btn-medium btn-green" href="#/" onClick={() => createGroupBox(true)}>Create Group</a>
                }
            </div>
        </div>
    );
}
export default ContentGroupEmpty;
