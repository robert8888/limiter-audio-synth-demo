import Text from "components/Text";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import range from "utils/range";
import throttle from "utils/throttle";
import "./peak-meter.scss"

const PeakMeter = ({
    orientation, 
    levels = {left: -20, right: 7},
    updateMeter = () =>  ({left: -50, right: -50}),
    start = true, 
    dBonLed = 2, 
    size = 20, 
    zero = 14,
    text,
}) => {
    const leds = useRef({left: {}, right: {}});
    const loop = useRef(false)
    
    const renderLeds = useCallback(() => {
        const levels = updateMeter()
        const leftOn = zero + levels.left / dBonLed;
        const rightOn = zero + levels.right / dBonLed;

        const toggleState = (ledRef, state) => {
             if(!ledRef) return;
             state ?  
                ledRef.classList.add("c-peak-meter__led--on") :
                ledRef.classList.remove("c-peak-meter__led--on")
        }
        for(let i = size; i >= 0 ; i--){
            toggleState(leds.current.left[i], size - i <= leftOn);
            toggleState(leds.current.right[i], size - i <= rightOn);
        } 
    }, [levels, leds, dBonLed, zero, size])

    const renderLedsThrottled = useMemo(() => throttle(renderLeds, 50), [renderLeds])

    const renderLoop = useCallback(() => {
        if(!loop.current) return;
        requestAnimationFrame(renderLoop);
        renderLedsThrottled();
    }, [loop, renderLedsThrottled])
    
    useEffect(() => {
        if(start){
            loop.current = true;
            renderLoop();
        } else {
            loop.current = false;
        }

    }, [renderLoop, start, loop])

    useEffect(() => () => loop.current = false, [loop])
    
    return (
        <div className={"c-peak-meter c-peak-meter--" + orientation}>
            {range(size).map((_,index) => 
                <div className="c-peak-meter__row" key={`led-${index}`}>
                    <div 
                        className="c-peak-meter__led c-peak-meter__led--left" 
                        ref={ref => leds.current.left[index] = ref}/>
                    <div 
                        className="c-peak-meter__led c-peak-meter__led--right" 
                        ref={ref => leds.current.right[index] = ref}/>
                </div>
            )}
            <Text className="c-peak-meter__text">
                {text}
            </Text>
        </div>
    )
}

export default PeakMeter