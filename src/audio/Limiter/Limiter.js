import LimiterNode from  "audio-limiter";

export default class Limiter{
    _isReady = false;
    constructor(context){
        this._limiter = new LimiterNode(context);
        this._context = context;
        this.warmUp()
    }

    async warmUp(){
        await this._limiter.isReady;
        this._isReady = true;
    }

    get node(){
        return this._limiter
    }

    setParam(param, value){
        if(!this._isReady) return;
        this._limiter[param].setValueAtTime(value, this._context.currentTime);
    }
}