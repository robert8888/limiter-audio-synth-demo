import wait from "utils/wait";
import Envelope from "./Envelope";

export default class Enveloper{
    static _id = 0;
    from = 0;
    to = 1;

    constructor(context, audioNode, paramName){
        if(!context || !audioNode || !paramName) 
            throw new Error("Not all Enveloper constructor parameters were provided ")
        

        if(!(audioNode[paramName] instanceof AudioParam))
            throw new Error("Enveloper - AudioNode forwarded to constructor doesn't contain param " + paramName)
        
        this.context = context;
        this.node = audioNode;
        this.param = audioNode[paramName];
        this._id = Enveloper._id++;
    }

    set base(num){
        this.from = num;
    }

    set target(num){
        this.to = num;
    }

    async start(envelope = new Envelope()){
        this._currentEnvelope = envelope;
        this._breakFlag = false;
        this.param.setValueAtTime(this.from, this.context.currentTime)
        this.param.linearRampToValueAtTime(this.to, this.context.currentTime + envelope.attack / 1000);
        await wait(envelope.attack);

        if(this._breakFlag) return
        const sustainLevel = this.from + (this.to - this.from) * envelope.sustain;
        if(this.param.cancelAndHoldAtTime){
            this.param.cancelAndHoldAtTime(this.context.currentTime);
        } else {
            this.param.cancelScheduledValues(this.context.currentTime);
        }
        this.param.linearRampToValueAtTime(sustainLevel, this.context.currentTime + envelope.decay / 1000);

        await wait(envelope.decay);

        return true;

    }

    async stop(){
        this._breakFlag = true;

        if(this.param.cancelAndHoldAtTime){
            this.param.cancelAndHoldAtTime(this.context.currentTime);
        } else {
            this.param.cancelScheduledValues(this.context.currentTime);
        }
        this.param.linearRampToValueAtTime(this.from || 0.00001, this.context.currentTime + this._currentEnvelope.release / 1000);

        await wait(this._currentEnvelope.release);

        return true;
    }
}