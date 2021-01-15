import { useCallback, useEffect, useRef } from "react"
import useAudioContext from "./AudioContext"
import useSynthCallbackRegistry from "./useSynthCallbackRegistry"

export default function useSynthConfigure(){
    const {synth} = useAudioContext()
    const registerListener = useSynthCallbackRegistry([
        "oscillatorEnvelopeParamChange",
        "oscillatorVolumeChange",
        "oscillatorWaveChange",
        "filterEnvelopeParamChange",
        "filterEnvelopeAmountChange",
        "filterFrequencyChange",
        "filterResonanceChange",
        "filterGainChange",
        "filterTypeChange",
    ], synth)

    return {
        setOscEnvelope: synth.setOscillatorEnvelope.bind(synth),
        setOscVol: synth.setOscillatorVolume.bind(synth),
        setWaveType: synth.setOscillatorWaveType.bind(synth),
        setFilterEnv: synth.setFilterEnvelope.bind(synth),
        setFilterEnvAmount: synth.setFilterEnvelopeAmount.bind(synth),
        setFilterFreq: synth.setFilterFreq.bind(synth),
        setFilterRes: synth.setFilterRes.bind(synth),
        setFilterType: synth.setFilterType.bind(synth),
        filterIds: () => synth.filterIds,
        oscillatorIds: () => synth.oscillatorIds,

        registerListener
    }
}