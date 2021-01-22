import Col from "components/Layout/Col";
import Layout from "components/Layout/Layout";
import Row from "components/Layout/Row";
import ReferenceLinks from "./ReferenceLinks";
import pianoKeyboardSvg from "assets/piano-keyboard-keys-silhouette.svg";
import {Link} from "react-router-dom"
import Separator from "components/Layout/Separator";
import "./home.scss"

const Home = () => {


    return (
        <Layout>
            <Row >
                <Col all={12} className="header">
                    <h2 className="header__title">
                        Web Audio Limiter
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col all={12}>
                    <ReferenceLinks/>
                </Col>
            </Row>
            <Row>
                <Col all={12} className="l--centred">
                    <Link className="a-btn a-btn--demo" to="/demo-synth">
                        RUN DEMO <img className="a-btn__img" src={pianoKeyboardSvg} alt="piano keyboard"/>
                    </Link>
                </Col>
            </Row>

            <Row className="l--centred">
                <Col md={8} xs={12} >
                    <section className="section">
                        <h6 className="section__title">About</h6>
                        <p className="section__content">
                            audio-limiter is a library witch extends browser web audio api by limiter audio node. 
                            Under the hood it uses web audio worklet api what means that audio data transformation are done on 
                            separated audio thread, and thanks of that has no bad effect on page performance.
                        </p>
                    </section>
                </Col>
            </Row>

            <Row className="l--centred">
                <Col md={8} xs={12} >
                    <section className="section">
                        <h6 className="section__title">How it works</h6>
                        <p className="section__content">
                            audio-limiter is base on delay buffer. This allows processing audio amplitude ahead of current outputted signal.
                            By default time of delayed is set on 5ms. This allows to ahead of the amplitude analysis, if raw sample value
                            is bigger than 1 / -1 what means that it will be clamped what occurs clipping audio, then is calculated ration factor
                            about which signal will be reduced to keep max value under threshold limit. Attack allows to set how fast limiter will 
                            react on growing amplitude signal, and release is response how limiter will act on decreasing amplitude
                        </p>
                    </section>
                </Col>
            </Row>
            <Separator/>
            <Row className="l--centred"> 
                 <Col md={8} xs={12} className="footer">
                    <a href="mailto:robert.kami@gmail.com"> robert.kami@gmail.com</a>
                    <a href="https://github.com/robert8888">github</a>
                </Col>
            </Row>
        </Layout>
    )
}

export default Home;