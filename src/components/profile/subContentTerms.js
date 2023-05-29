import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { termsofservice } from '../../store/actions/auth';

const SubContentTerms = () => {
	const dispatch = useDispatch();
	const [terms, setTerms] = useState('');
	const response = useSelector(({ response }) => response);

	useEffect(() => {
		dispatch(termsofservice());
	}, [])

	useEffect(() => {
		if (response.termsofservice && response.termsofservice.terms_of_service)
			setTerms(response.termsofservice && response.termsofservice.terms_of_service);
	}, [response]);

	const acceptTerms = (value) => {

	}

	return (
		<div className="row m-4">
			{terms === '' ? null :
				<div className="col-lg-12 p-0">
					<h3 className="clr-white mb-4">Terms of Service</h3>
					<p className="terms-text">{terms}</p>
					{/* <div className="terms-action">
						<a href="#">Decline</a>
						<button type="button" className="btn btn-medium btn-submit btn-green" onClick={() => acceptTerms(true)}>I Accept</button>
					</div> */}
				</div>}
		</div>
	);
}

export default SubContentTerms;
