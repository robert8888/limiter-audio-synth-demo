import connectInChain from "utils/connectInChainAudioNodes";
import { CONNECTIONS } from "./SynthMode";


export default class SynthUnitRewire {
    _blocks = {}

    _composeKey = ({type, id}) =>  `${type}-${id}`
    _decomposeKey = key => {
        const [type, id] = key.split("-");
        return {type, id}
    }

    wireOscChannel(id, nodes){
        this._blocks[this._composeKey({type: "oscillator", id})] = nodes
        connectInChain([
            nodes.oscillator,
            nodes.volume,
            nodes.envelope,
            nodes.output
        ])
    }

    wireFilterChannel(id, nodes){
        this._blocks[this._composeKey({type: "filter", id})] = nodes;
        connectInChain([
            nodes.input,
            nodes.filter,
            nodes.output
        ])
    }

    wireMainChanel(nodes){
        this._blocks[this._composeKey({type: "main", id:""})] = nodes;
        connectInChain([
            nodes.input,
            nodes.scaler,
            nodes.output
        ])
    }

    disconnect(){
        for(let rule of this.lastMode.rules()){
            const source = this._blocks[this._composeKey(rule.source)];
            const target = this._blocks[this._composeKey(rule.target)];
            switch(rule.connection){
                case CONNECTIONS.FM :{
                    source.output.disconnect(target.oscillator.frequency)
                    source.output.gain.value = 1;
                    break;
                }
                case CONNECTIONS.AMP:{
                    source.output.disconnect(target.output.gain);
                    break;
                }
                case CONNECTIONS.DIR :{
                }
                // eslint-disable-next-line no-fallthrough
                default: {
                    source.output.disconnect(target.input)
                }
            }
        }
        this.lastMode = null;
    }

    buildConnection(mode){
        for(let rule of mode.rules()){
            const source = this._blocks[this._composeKey(rule.source)];
            const target = this._blocks[this._composeKey(rule.target)];
            switch(rule.connection){
                case CONNECTIONS.FM :{
                    source.output.connect(target.oscillator.frequency)
                    source.output.gain.value = 5000;
                    break;
                }
                case CONNECTIONS.AMP:{
                    source.output.connect(target.output.gain);
                    source.output.gain.value = 2;
                    break;
                }
                case CONNECTIONS.DIR :{
                }
                // eslint-disable-next-line no-fallthrough
                default: {
                    source.output.connect(target.input)
                }
            }
        }

        this.lastMode = mode.clone();
    }

    reConnection(mode){
        this.disconnect();
        this.buildConnection(mode);
    }
}