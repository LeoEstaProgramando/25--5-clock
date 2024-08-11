import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
    const intervalID = useRef(null);
    const session = useRef(true);
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timerLeft, setTimerLeft] = useState(1500);

    const breakDecrement = () => {
        if (breakLength > 1 && !intervalID.current) {
            setBreakLength(breakLength - 1);
        }
    };

    const breakIncrement = () => {
        if (breakLength < 60 && !intervalID.current) {
            setBreakLength(breakLength + 1);
        }
    };

    const sessionDecrement = () => {
        if (sessionLength > 1 && !intervalID.current) {
            setSessionLength(sessionLength - 1);
            setTimerLeft((sessionLength - 1) * 60);
        }
    };

    const sessionIncrement = () => {
        if (sessionLength < 60 && !intervalID.current) {
            setSessionLength(sessionLength + 1);
            setTimerLeft((sessionLength + 1) * 60);
        }
    };

    const startSession = () => {
        if (intervalID.current) return;

        intervalID.current = setInterval(() => {
            setTimerLeft((prev) => prev - 1);
        }, 1000);
    };

    const pauseSession = () => {
        clearInterval(intervalID.current);
        intervalID.current = null;
    };

    const resetSession = () => {
        pauseSession();
        setBreakLength(5);
        setSessionLength(25);
        setTimerLeft(1500);
        session.current = true;
    };

    // Manejo de cambios de sesión usando useEffect
    useEffect(() => {
        if (timerLeft < 0) {
            const isSession = session.current;
            const newTime = isSession ? breakLength * 60 : sessionLength * 60;
            session.current = !isSession;
            setTimerLeft(newTime);
        }
    }, [timerLeft, breakLength, sessionLength]);

    useEffect(() => {
        return () => pauseSession();
    }, []);

    return (
        <main className="flex flex-col gap-10">
            <h1 className="font-bold text-12xl">25 + 5 Clock</h1>
            <div className="flex flex-row gap-5">
                <div className="flex flex-col gap-2">
                    <p className="text-xl" id="break-label">
                        Break Length
                    </p>
                    <div className="flex flex-row justify-center items-center gap-3">
                        <button id="break-decrement" onClick={breakDecrement}>
                            <i className="fa fa-arrow-down fa-2x"></i>
                        </button>
                        <p className="text-lg" id="break-length">
                        {breakLength}
                        </p>
                        <button id="break-increment" onClick={breakIncrement}>
                            <i className="fa fa-arrow-up fa-2x"></i>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xl" id="session-label">
                        Session Length
                    </p>
                    <div className="flex flex-row justify-center items-center gap-3">
                        <button
                            id="session-decrement"
                            onClick={sessionDecrement}
                        >
                            <i className="fa fa-arrow-down fa-2x"></i>
                        </button>
                        <p className="text-lg" id="session-length" defaultValue={25}>
                            {sessionLength}
                        </p>
                        <button
                            id="session-increment"
                            onClick={sessionIncrement}
                        >
                            <i className="fa fa-arrow-up fa-2x"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <p className="text-xl" id="timer-label">
                        {session.current ? "Session" : "Break"}
                    </p>
                    {timerLeft == 0 ? <audio id="beep" src="beep.wav" autoPlay></audio> : ""}
                    <p className="text-5xl" id="time-left">
                        {Math.floor(timerLeft / 60)}:
                        {("0" + (timerLeft % 60)).slice(-2)}
                    </p>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <div id="start_stop">
                    <button id="start" onClick={startSession}>
                        <i className="fa fa-play fa-2x"></i>
                    </button>
                    <button id="stop" onClick={pauseSession}>
                        <i className="fa fa-pause fa-2x"></i>
                    </button>
                    </div>
                    <button id="reset" onClick={resetSession}>
                        <i className="fa fa-refresh fa-2x"></i>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default App;
