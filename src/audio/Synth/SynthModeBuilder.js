import SynthMode from "./SynthMode";
import { CONNECTIONS } from "./SynthMode";

export default class SynthModeBuilder {
    static preBuiltConfigurations = {
        Sum : [
            [{type: "oscillator", id: 0}, CONNECTIONS.DIR, {type: "filter", id: 0}],
            [{type: "oscillator", id: 1}, CONNECTIONS.DIR, {type: "filter", id: 0}],
            [{type: "filter", id: 0}, CONNECTIONS.DIR, {type: "main", id: ""}],
        ],
        Fm: [
            [{type: "oscillator", id: 0}, CONNECTIONS.DIR, {type: "filter", id: 0}],
            [{type: "oscillator", id: 1}, CONNECTIONS.FM, {type: "oscillator", id: 0}],
            [{type: "filter", id: 0}, CONNECTIONS.DIR, {type: "main", id: ""}],
        ],
        Amp: [
            [{type: "oscillator", id: 0}, CONNECTIONS.DIR, {type: "filter", id: 0}],
            [{type: "oscillator", id: 1}, CONNECTIONS.AMP, {type: "oscillator", id: 0}],
            [{type: "filter", id: 0}, CONNECTIONS.DIR, {type: "main", id: ""}],
        ]
    }

    static getSynthConfiguration(name){
        const configuration = SynthModeBuilder.preBuiltConfigurations[name];
        if(!configuration)
            throw new Error("Synth mode configuration builder don't contain prebuilt configuration with given name: " + name);
        
        const mode = new SynthMode();
        for(let rule of configuration){
            mode.setRule(...rule);
        }

        return mode;
    }

    static getSynthModesNames(){
        return [...Object.keys(SynthModeBuilder.preBuiltConfigurations)]
    }
}