import React from "react";
import Layout from "components/Layout/Layout";
import Piano from "components/Piano/Piano";
import Oscilloscope from "components/Visualization/Oscilloscope/Oscilloscope";
import Spectrum from "components/Visualization/Spectrum/Spectrum";
import Mater from "components/Master/Master";
import Synth from "components/Synth/Synth";
import Limiter from "components/Limiter/Limiter";
import SynthMode from "components/SynthMode/SynthMode";
import { AudioContextProvider } from "audio/AudioContext";
import MobileRotateOverlay from "components/Overlay/MobileRotateOverlay";
import IntroductionModal from "./IntroductionModal";
import "./rack.scss";

const Rack = () => {

    return (
        <Layout>
            <AudioContextProvider>
                <div className="l-rack">
                    <div className="l-rack__row">
                        <div className="l-rack__group l-rack__group--visualization">
                            <Oscilloscope/>
                            <Spectrum/>
                        </div>

                        <div className="l-rack__container l-rack__grid">
                            <Limiter/>
                            <Mater/>
                            <Synth/>
                            <SynthMode/>
                        </div>
                    </div>
                    <div className="l-rack__piano">
                        <Piano/>
                    </div>
                </div>
            <MobileRotateOverlay/>
           </AudioContextProvider>
           <IntroductionModal/>
        </Layout>
    )
}

export default Rack;