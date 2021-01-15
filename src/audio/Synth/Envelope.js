import toRange from "utils/toRange";

export default class Envelope {
    static defaults = {
        attack: {
            default: 100,
            min: 0,
            max: 2000,
        },
        decay: {
            default: 2000,
            min: 0,
            max: 4000,
        },
        sustain: {
            default: 1,
            min: 0,
            max: 1,
        },
        release: {
            default: 1000,
            min: 0,
            max: 8_000,
        },
    }

    static get params(){
        return [...Object.keys(this.defaults)]
    }

    constructor(
            attack = Envelope.defaults.attack.default, 
            decay = Envelope.defaults.decay.default,  
            sustain = Envelope.defaults.sustain.default,  
            release = Envelope.defaults.release.default, 
        ){
        this._attack = attack;
        this._decay = decay;
        this._sustain = sustain;
        this._release = release;
    }

    _normalize(param, value){
        return toRange(value, Envelope.defaults[param].min, Envelope.defaults[param].max);
    }

    get attack(){
        return this._attack;
    }

    get decay(){
        return this._decay
    }

    get sustain(){
        return this._sustain
    }

    get release(){
        return this._release
    }

    set attack(value){
        this._attack =  this._normalize("attack", value)
    }

    set decay(value){
        this._decay = this._normalize("release", value)
    }

    set sustain(value){
        this._sustain = this._normalize("sustain", value)
    }

    set release(value){
        this._release = this._normalize("release", value)
    }

    clone(){
        return new Envelope(this._attack, this._decay, this._sustain, this._release)
    }
}