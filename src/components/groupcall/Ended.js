import React, {useState, useEffect} from "react";
import LoginHeader from "../includes/loginHeader";

const Ended = () => {
    const [time, setTime] = useState({h: '00:', m: '00:', s: '00'})
    const [message, setMessage] = useState(null)
    useEffect(() => {
        const url = new URL(window.location.href);
        const type = url.searchParams.get('t');
        console.log(type)
        let msg = 'You have left the event.';
        if(type == 1 ){
            msg = 'You have ended the event.';
        }else if(type == 2){
            msg = 'The event host has kicked you out of the event.';
        }else if(type == 3){
            msg = 'The event host ended the event for everyone.';
        }
        setMessage(msg)
        let secFromStorage = parseInt( localStorage.getItem('second') )
        if(isNaN(secFromStorage)){
            secFromStorage = 0
        }
        const t = secondsToTime(secFromStorage)
        setTime(t)
        return () => { redirectToHome() }
    }, [])
    const secondsToTime = (secs) => {
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
    }
    const redirectToHome = () => {
        localStorage.removeItem('second')
        window.location = '/'
    }
    return (
    <>
        <LoginHeader />   
        <div className="content align-box-center">
            <div className="container">
                <div className="row">
                    <div className="box-contain bg-black-900 w-100">
                        <div className="text-center">
                            <h4 className="clr-white mt-5">{ message }</h4>
                            <label>{time.h}{time.m}{time.s} Duration</label>
                            <div className="mt-3 mb-3">
                                <a href="#" className="btn btn-sm btn-green round-4" onClick={() => redirectToHome() }>Close</a>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Ended
