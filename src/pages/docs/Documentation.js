import Section from "components/ActiveNav/Section";
import Navigation from "components/ActiveNav/Navigation";
import Layout from "components/Layout/Layout";
import Code from "components/Code/Code";
import "./documentation.scss";
import ScrollTopButton from "components/ScrollTopButton/ScrollTopButton";

export default function Docs(){
    console.log("documentation")
    return (
        <Layout>
            <Navigation title={"Api"}>
                <Section menu={["Installation"]} className="content">
                    <h4 className="content__title">Installation</h4>
                    <Code>
                        npm install audio-limiter
                    </Code>
                </Section>
                <Section menu={["Creation", "Factory method"]} className="content">
                    <h4 className="content__title">AudioContext | offlineAudioContext factory method</h4>
                    <Code>
                    {`import "audio-limiter" 
                    // call this import in any file on your project 
                    // recommendation - do it in main file
                    // this file will patch AudioContext prototype

                    crateAudio = async () => {
                        const context = new AudioContext();
                        const buffer = await fetch("./your-audio.mp3")
                            .then(response => response.arrayBuffer())
                            .then(arrayBuffer => context.decodeAudioData(arrayBuffer); 

                        const source = context.createBufferSource();
                      source.buffer = buffer;

                        // factory method
                        const limiter = await context.createLimiter();
                        // connect
                      source.connect(limiter);
                      limiter.connect(context.destination);

                        source.start(0);
                    }`}
                    </Code>
                </Section>
                <Section menu={["Creation", "Constructor"]} className="content">
                    <h4 className="content__title">Constructor</h4>
                    <Code>
                    {
                    `import LimiterNode from "audio-limiter"

                    const context = new AudioContext();
                    const limiter = new LimiterNode(context, {time: 0.005});
                    const oscillator = new OscillatorNode(context)
                    const gain = new GainNode(context);

                    gain.gain.value = 10; // should be strongly overdrive
                    oscillator.start(0);

                    oscillator.connect(gain)
                    gain.connect(limiter);
                    limiter.connect(context.destination);

                    limiter.isReady.then(() => {
                        limiter.attack.setValueAtTime(0.1, 10)// set value 100ms in 10 second
                        limiter.bypass.setValueAtTime(1, 20)// any not zero value will activate bypass
                    })`
                    }
                    </Code>
                </Section>
                <Section menu={["Creation", "Configuration"]} className="content">
                    <h4 className="content__title">Constructor options</h4>
                    <p className="content__text">
                        Time - [in seconds] - Latency time witch limiter will delay output. Any non zero
                        attack/release time will lag envelope behind current processed audio. To attenuate
                        right part of signal this limiter implements delay buffer. This value should be
                        minium equal to attack time. If value of time will be less that attack then limiter 
                        will act on the past envelope change. By default value is 5ms. This means that audio 
                        is delayed by 5 ms and in this range is analyzed envelope.
                    </p>
                    <Code>
                    {
                        `const context = new OfflineAudioContext(OfflineAudioContextOptions)
                        //time - min: 0, max: 10s
                        const limiter = await context.createLimiter({time: 0.005})`
                    }
                    </Code>
                    <p className="content__text"><b>Number of channels </b> - default value is 2. you can change it by define it.</p>
                    <Code>
                    {
                    `const context = new OfflineAudioContext(OfflineAudioContextOptions)
                     const limiter = await context.createLimiter({
                            channelCount: 1, 
                            time: 0.005 // 5ms
                        })`
                    }
                    </Code>
                    <p className="content__text">Predefined configs that you <b>can't change</b></p>
                    <Code>
                    {
                    `const limiter = await context.createLimiter({
                        channelCountMode: "explicit" 
                        numberOfInputs: 1,
                        numberOfOutputs: 1
                    })`    
                    }    
                    </Code>
                </Section>
                <Section menu={["Parameters", "Attack"]} className="content">
                    <h4 className="content__title">Attack</h4>
                    <p className="content__text">
                     Attack - [in seconds] defining how quickly the detection responds to rising amplitudes.
                    </p>
                    <Code>
                        {
                        `const limiter = await context.createLimiter();
                        //by access params map
                        
                        const attack = limiter.parameters.get("attack");
                        
                        attack.value = .001// 1ms - by default 0
                        attack.setValueAtTime(0.001, context.currentTime);
                        
                        //or by shortcut getter 
                        limiter.attack.setValueAtTime(.001, context.currentTime)
                        limiter.attack.minValue // 0
                        limiter.attack.maxValue // 2s
                        limiter.attack.defaultValue // 0`
                        }
                    </Code>
                </Section>
                <Section menu={["Parameters", "Release"]} className="content">
                    <h4 className="content__title">Release</h4>
                    <p className="content__text">
                    Release - [in seconds] - defining how quickly the detection responds to falling amplitudes.
                    </p>
                    <Code>
                        {
                        `limiter.parameters.get("release").setValueAtTime(.001, context.currentTime)
                        //or
                        limiter.release.setValueAtTime(.001, context.currentTime)
                        limiter.release.minValue // 0
                        limiter.release.maxValue // 2
                        limiter.release.defaultValue // 0.1 - 100 ms`
                        }
                    </Code>
                </Section>
                <Section menu={["Parameters", "Threshold "]} className="content">
                    <h4 className="content__title">Threshold</h4>
                    <p className="content__text">
                    Threshold - [in dB] - level to witch will be limiting audio. Be default is -2dB this means
                    that max amplitude value will be ~0.79... Set it to 0 if you expect sample value +- 1.
                    </p>
                    <Code>
                        {
                        `limiter.threshold.setValueAtTime(2, 0);
                        limiter.threshold.minValue // -100
                        limiter.threshold.maxValue // 0
                        limiter.threshold.defaultValue // -2dB`
                        }
                    </Code>
                </Section>
                
                <Section menu={["Parameters", "Pre Gain"]} className="content">
                    <h4 className="content__title">Pre Gain </h4>
                    <p className="content__text">
                    [in dB] - just like apply gain before limiter node. can be useful in kind of normalization process.
                    </p>
                    <Code>
                        {
                        `limiter.preGain.setValueAtTime(2, 0);
                        limiter.preGain.minValue // -100
                        limiter.preGain.maxValue // 100
                        limiter.preGain.defaultValue // 0 dB`
                        }
                    </Code>
                </Section>

                <Section menu={["Parameters", "Post Gain"]} className="content">
                    <h4 className="content__title">Pre Gain </h4>
                    <p className="content__text">
                    Post Gain - [in dB] - post limiting gain. Be careful if you expect not clipping data. 
                    If you set threshold -2dB then max post gain can be set to +2dB.
                    </p>
                    <Code>
                        {
                        `limiter.postGain.setValueAtTime(2, 0);
                        limiter.postGain.minValue // -100
                        limiter.postGain.maxValue // 100
                        limiter.postGain.defaultValue // 0 dB`
                        }
                    </Code>
                </Section>

                
                <Section menu={["Parameters", "Bypass"]} className="content">
                    <h4 className="content__title">Bypass</h4>
                    <p className="content__text">
                    Bypass - [boolean number] - Every value other than 0 is tracked as truth. If you pass truthy value 
                    to bypass param then signal will not be limited. But, delay buffer will still by the same.
                    </p>
                    <Code>
                        {
                        `limiter.bypass.setValueAtTime(1, 0);
                        limiter.bypass.minValue // 0
                        limiter.bypass.maxValue // 1
                        limiter.bypass.defaultValue // 0`
                        }
                    </Code>
                </Section>

                <Section menu={["Importing processor"]} className="content">
                    <h4 className="content__title">What if I don't want modify AudioContext prototype ??</h4>
                    <p className="content__text">
                        No problem. Don't import main library file. Just register limiter worklet processor 
                        and add module. You fill find it in library dist folder.
                    </p>
                    <Code>
                        {
                        `const context = new AudioContext();
                        const path = [
                            "node_models",
                            "limiter-audio-node",
                            "dist",
                            "limiter-audio-worklet-processor.js"
                        ].join("/");
                        
                        await context.audioWorklet.addMode(path);
                        const limiter = new LimiterAudioWorkletNode(context, 'limiter-processor', options);`
                        }
                    </Code>
                </Section>
            </Navigation>
            <ScrollTopButton/>
        </Layout>
    )
}