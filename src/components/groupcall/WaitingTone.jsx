import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import Tone from '../../assets/tones/waiting.mp3'
import { Logger } from './../../utils/logger';
const fileLocation = "src\\components\\groupcall\\WaitingTone.jsx";

const WaitingTone = ({ parent, state }) => {
	let tone
        const clickListener = (e) => {
            /* for safari tone not auto playing  */
            const tone = document.getElementById('wait-beep')
            tone.play().catch(err => console.log('play waiting tone error on click', err))
            tone.pause()
            tone.currentTime = 0
            document.body.removeEventListener('click', clickListener)
        }
        useEffect(() => {
            document.body.addEventListener('click', clickListener)
        }, [])
	useEffect(() => {
		if(state.playWaitingTone === true) {
			try {
				tone = document.getElementById('wait-beep')
				tone.setAttribute("preload", "auto")
				tone.autobuffer = true
				// tone.load()
				var isPlaying = tone.currentTime > 0 && !tone.paused && !tone.ended
					&& tone.readyState > 2;

				if(!isPlaying) {
					tone.play().catch(err => console.log('play waiting tone error', err));
				}
				// tone.play()
				parent.changeState('playWaitingTone', false)
			} catch({ message }) {
				Logger.error({ fileLocation, message, trace: 'useEffect:playWaitingTone' })
			}
		}
	}, [state.playWaitingTone])
	return (
		<audio id="wait-beep" className="d-none">
			<source src={ Tone } />
		</audio>
	)
}
WaitingTone.propTypes = {
	parent: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
};
export default WaitingTone
