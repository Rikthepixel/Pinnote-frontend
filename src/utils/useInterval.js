import React, { useEffect, useRef } from "react";

export const useInterval = (callback, time, repeating) => {
    const handleRef = useRef();

    if (typeof(callback) !== "function") {
        console.error("Callback is not a function");
    }

    useEffect(() => {
        const runInterval = () => {
            handleRef.current = setTimeout(() => {
                if (typeof(callback) !== "function") {
                    console.error("Callback is not a function");
                }
    
                callback();
    
                if (repeating) {
                    runInterval();
                }
            }, time);
        }

        runInterval();

        return () => {
            if (handleRef.current) {
                clearTimeout(handleRef.current);
            }
        }
    }, [])
}

export default useInterval;