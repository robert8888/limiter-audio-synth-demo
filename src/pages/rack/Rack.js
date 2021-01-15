import React from "react";
import Layout from "components/Layout/Layout";
import Piano from "components/Piano/Piano";
import Spectrum from "components/Spectrum/Spectrum";
import Mater from "components/Master/Master";
import Synth from "components/Synth/Synth";
import Limiter from "components/Limiter/Limiter";
import SynthMode from "components/SynthMode/SynthMode";
import { AudioContextProvider } from "audio/AudioContext";
import "./rack.scss";

const Rack = () => {

    return (
        <Layout>
            <AudioContextProvider>
                <div className="l-rack">
                    <div className="l-rack__row">
                        <div className="l-rack__group">
                            <Spectrum/>
                        </div>

                        <div className="l-rack__container l-rack__grid">
                            <Limiter/>
                            <Mater/>
                            <Synth/>
                            <SynthMode/>
                        </div>
                    </div>
                    <div>
                        <Piano/>
                    </div>
                </div>
           </AudioContextProvider>
        </Layout>
    )
}

export default Rack;