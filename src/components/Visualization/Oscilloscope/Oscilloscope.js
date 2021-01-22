import useMixer from "audio/useMixer";
import React, { useCallback, useEffect, useRef} from "react";
import "./oscilloscope.scss"


const Oscilloscope = () => {
    const canvasData = useRef(null);
    const {getByteTimeDomainData} = useMixer();
    const breakFlag = useRef(false)

    const findFirstPositive = useCallback((buffer, length, height) => {
        const n = v => (v / 128) - 1;

        let prev, next;
        for(let i = 1; i < length - 1; i++){
            prev = n(buffer[i - 1]);
            next = n(buffer[i + 1]);
            if(prev * next <= 0 && prev > 0)
                return i;
        }
        
        return 0;
    }, [])


    const renderLoop = useCallback(() => {
        if(!canvasData.current) return;
        const {width, height, context} = canvasData.current;

        const data = getByteTimeDomainData(width * 2)
        
        context.lineWidth = 2;
    
        context.clearRect(0,0,width,height); 
    
        context.beginPath();
    
        context.strokeStyle = "#6fd684";
    
        const c = height / 2  / 128;

        context.beginPath();

        var zeroCross = findFirstPositive(data, width, height) ;

        for (let i= zeroCross, j=0; j< width; i++, j++)
            context.lineTo(j, (c * data[i]));
    
        context.stroke();
    }, [canvasData, getByteTimeDomainData, findFirstPositive])

    const loop = useCallback(() => {
        if(breakFlag.current) return;
        requestAnimationFrame(() => loop());
        renderLoop();
    }, [renderLoop])


    useEffect(() => {
        loop()
        return () => {
            breakFlag.current = true;
        }
    }, [loop, breakFlag])

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
        <div className="c-oscilloscope">
            <div className="c-oscilloscope__screen">
                <div className="c-oscilloscope__grid">
                    <div className="c-oscilloscope__grid__axis c-oscilloscope__grid__axis--x"/>
                    <div className="c-oscilloscope__grid__axis c-oscilloscope__grid__axis--y"/>
                </div>
                <canvas className="c-oscilloscope__canvas" 
                        ref={updateCanvasData} 
                        width={300} height={150}/>
            </div>
        </div>
    )
}

export default Oscilloscope