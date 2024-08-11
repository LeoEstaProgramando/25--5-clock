import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const intervalID = useRef(null);
    const beepAudio = useRef(null);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    };

    const handleStartStop = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning);
    };

    const handleReset = () => {
        clearInterval(intervalID.current);
        setIsRunning(false);
        setIsSession(true);
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        beepAudio.current.pause();
        beepAudio.current.currentTime = 0;
    };

    const handleBreakDecrement = () => {
        if (breakLength > 1 && !isRunning) {
            setBreakLength(breakLength - 1);
        }
    };

    const handleBreakIncrement = () => {
        if (breakLength < 60 && !isRunning) {
            setBreakLength(breakLength + 1);
        }
    };

    const handleSessionDecrement = () => {
        if (sessionLength > 1 && !isRunning) {
            setSessionLength(sessionLength - 1);
            setTimeLeft((sessionLength - 1) * 60);
        }
    };

    const handleSessionIncrement = () => {
        if (sessionLength < 60 && !isRunning) {
            setSessionLength(sessionLength + 1);
            setTimeLeft((sessionLength + 1) * 60);
        }
    };

    useEffect(() => {
        if (isRunning) {
            intervalID.current = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft === 0) {
                        beepAudio.current.play();
                        if (isSession) {
                            setIsSession(false);
                            return breakLength * 60;
                        } else {
                            setIsSession(true);
                            return sessionLength * 60;
                        }
                    }
                    return prevTimeLeft - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalID.current);
        }

        return () => clearInterval(intervalID.current);
    }, [isRunning, isSession, breakLength, sessionLength]);

    return (
        <>
            <div id="clock" className="flex flex-col gap-3">
                <h1 className="font-bold">25 + 5 Clock</h1>
                <div id="break">
                    <h2 id="break-label" className="mb-1">
                        Break Length
                    </h2>
                    <button id="break-decrement" onClick={handleBreakDecrement}>
                        <i className="fa fa-arrow-down fa-2x"></i>
                    </button>
                    <span id="break-length" className="text-2xl inline-block w-[50px]">
                        {breakLength}
                    </span>
                    <button id="break-increment" onClick={handleBreakIncrement}>
                        <i className="fa fa-arrow-up fa-2x"></i>
                    </button>
                </div>
                <div id="session">
                    <h2 id="session-label" className="mb-1">
                        Session Length
                    </h2>
                    <button
                        id="session-decrement"
                        onClick={handleSessionDecrement}
                    >
                        <i className="fa fa-arrow-down fa-2x"></i>
                    </button>
                    <span id="session-length" className="text-2xl inline-block w-[50px]">
                        {sessionLength}
                    </span>
                    <button
                        id="session-increment"
                        onClick={handleSessionIncrement}
                    >
                        <i className="fa fa-arrow-up fa-2x"></i>
                    </button>
                </div>
                <div id="timer">
                    <h2 id="timer-label" className="text-3xl">
                        {isSession ? "Session" : "Break"}
                    </h2>
                    <span id="time-left" className="text-5xl">
                        {formatTime(timeLeft)}
                    </span>
                </div>
                <div
                    id="controls"
                    className="flex flex-row gap-2 justify-center"
                >
                    <button id="start_stop" onClick={handleStartStop}>
                        {isRunning ? (
                            <i className="fa fa-pause fa-2x"></i>
                        ) : (
                            <i className="fa fa-play fa-2x"></i>
                        )}
                    </button>
                    <button id="reset" onClick={handleReset}>
                        <i className="fa fa-refresh fa-2x"></i>
                    </button>
                </div>
                <audio id="beep" ref={beepAudio} src="beep.wav" />
            </div>
            <footer className="mt-5">
                <p>Created by: <a href="https://github.com/LeoEstaProgramando" target="_blank">Leo Ventura</a></p>
            </footer>
        </>
    );
}

export default App;
