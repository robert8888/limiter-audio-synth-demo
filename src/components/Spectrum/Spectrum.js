import useMixer from "audio/useMixer";
import React, { useCallback, useEffect, useRef } from "react";
import "./spectrum.scss"


const Spectrum = () => {
    const canvasData = useRef(null);
    const {getByteTimeDomainData} = useMixer();
    const breakFlag = useRef(false)

    const renderLoop = useCallback(() => {
        if(breakFlag.current) return;
        requestAnimationFrame(() => renderLoop());
        if(!canvasData.current) return;
        const {width, height, context} = canvasData.current;

        const data = getByteTimeDomainData(width)
        
        context.lineWidth = 2;
    
        context.clearRect(0,0,width,height); 
    
        context.beginPath();
    
        context.strokeStyle = "#6fd684";
    
        const c = height / 2  / 128.8

        context.beginPath();

        for (let i=0, j=0; j< width; i++, j++)
            context.lineTo(j, (c * data[i]));
    
        context.stroke();
    }, [canvasData, breakFlag, getByteTimeDomainData])


    useEffect(() => {
        renderLoop()
        return () => {
            breakFlag.current = true;
        }
    }, [renderLoop, breakFlag])

    const updateCanvasData = useCallback((ref) => {
        if(!ref) {
            canvasData.current = null;
            return
        }

        canvasData.current = {
            context: ref.getContext("2d"),
            width: ref.width,
            height: ref.height
        }
    }, [canvasData])


    return (
        <div className="c-spectrum">
            <div className="c-spectrum__screen">
                <div className="c-spectrum__grid">
                    <div className="c-spectrum__grid__axis c-spectrum__grid__axis--x"/>
                    <div className="c-spectrum__grid__axis c-spectrum__grid__axis--y"/>
                </div>
                <canvas className="c-spectrum__canvas" 
                        ref={updateCanvasData} 
                        width={300} height={150}/>
            </div>
        </div>
    )
}

export default Spectrum