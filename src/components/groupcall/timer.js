import React, { useState, useEffect } from "react";
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\groupcall\\timer.js";

const Timer = ({ eventId }) => {
	let [time, setTime] = useState({ h: '00:', m: '00:', s: '00' })
	useEffect(() => {
		const interval = setInterval(countDown, 1000)
		return () => clearInterval(interval);
	}, [])

	const countDown = () => {
		try {
			// Add one second, set state so a re-render happens.
			let secFromStorage = parseInt(localStorage.getItem(`${eventId}-second`))
			if(isNaN(secFromStorage)) {
				secFromStorage = 0
			}
			const sec = secFromStorage + 1;
			const t = secondsToTime(sec)
			localStorage.setItem(`${eventId}-second`, sec)
			setTime(t)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'countDown' })
		}
	}

	const secondsToTime = (secs) => {
		try {
			const hours = Math.floor(secs / (60 * 60));
			const divisorForMinutes = secs % (60 * 60);
			const minutes = Math.floor(divisorForMinutes / 60);
			const divisorForSeconds = divisorForMinutes % 60;
			const seconds = Math.ceil(divisorForSeconds);
			return {
				"h": hours > 9 ? `${hours}:` : `0${hours}:`,
				"m": minutes > 9 ? `${minutes}:` : `0${minutes}:`,
				"s": seconds > 9 ? seconds : `0${seconds}`
			};
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'secondsToTime' })
		}
	}

	return (
		<label className="time" style={ { width: '100px', textAlign: 'left' } } >{ time.h }{ time.m }{ time.s }</label>
	)
}

export default Timer
