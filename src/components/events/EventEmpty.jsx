import React from "react";
import {Link} from 'react-router-dom';

const EventEmpty = () => {

	return (
		<div className="page-contain d-flex">
			<div className="black-box mt-5">
				<img className="box-icon" src="images/calander.png" style={{width: 108, height: 'auto'}} alt="No events" />
				<h4>No Events</h4>
				<p>You don’t have any events on your calendar, go to the discover page or an organization page to add events.</p>
				<Link to="/discover" className="btn btn-medium btn-green">Find Events</Link>
			</div>
		</div>
	);

}

export default EventEmpty;
