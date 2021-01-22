import useMixer from "audio/useMixer";
import React, { useCallback, useEffect, useRef } from "react";
import "./spectrum.scss";

const Spectrum = () => {
    const canvas = useRef();
    const {getByteFrequencyData} = useMixer();
    
    const renderLoop = useCallback(() => {
        const {context, width, height} = canvas.current;
        if(!context) return;

        const data = getByteFrequencyData();

        const step = width / data.length;

        context.clearRect(0, 0, width, height); 
    
        context.beginPath();

        context.strokeStyle = "#6fd684";
    
        for (let i = 0; i < data.length; i++){
            context.lineTo(i * step,( height - 5) - (data[i] / 255 * (height - 10)));
        }

        context.stroke();
    }, [canvas, getByteFrequencyData]);

    const loop = useCallback(() => {
        requestAnimationFrame(() => loop());
        renderLoop();
    }, [renderLoop])

    useEffect(() => {
        loop();
    },[loop])

    const updateCanvasRef = useCallback(ref => {
        if(!ref) return;
        canvas.current = {
            context: ref.getContext("2d"),
            width: ref.width,
            height: ref.height,
        }
    }, [canvas])

    return (
        <div className="c-spectrum">
            <div className="c-spectrum__screen">
                <canvas width={300} height={100} 
                        ref={updateCanvasRef}
                        className="c-spectrum__canvas"/>
            </div>
        </div>
    )
}

export default Spectrum;