import React, {useEffect} from "react";
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import {createGroupEventRequest} from "../../store/actions/group";
import history from "../../history/history";
import {VideoWhiteIcon} from "../../utils/Svg";
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\group\\GroupCallButton.jsx";

const GroupCallButton = props => {
	const dispatch = useDispatch();
	const {eventJoinData} = useSelector(({group}) => group);

	useEffect(() => {
		// Check if the event is generated successfully
		try {
			if(eventJoinData.eventJoin) {
				const {eventJoin} = eventJoinData;
				const jwt = localStorage.getItem("accessToken");
				const channel = eventJoin.identifier;

				// Store the event data in local storage
				localStorage.setItem(channel, jwt);
				// Push user to the group call screen
				history.push(`/event?e=${channel}&type=owner`);
				window.location.reload();
			}
		} catch({message}) {
			Logger.error({fileLocation, message, trace: 'useEffect:eventJoinData'})
		}
	}, [eventJoinData])

	const makeGroupCall = () => {

		const payload = {
			group_id: props.groupId,
			begins_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			ends_at: moment().add(1, 'month').format("YYYY-MM-DD HH:mm:ss"),
			name: 'Dummy event for group',
			type: 'discussion'
		}

		// Create the event for session user and join the event
		dispatch(createGroupEventRequest(payload));
	}

	return (
		<span className="btn btn-round btn-green" onClick={makeGroupCall}>
			Call Group &nbsp;
			{VideoWhiteIcon}
		</span>
	);
}

export default GroupCallButton;
