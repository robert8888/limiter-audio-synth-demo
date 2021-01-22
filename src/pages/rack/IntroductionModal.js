import Modal from "components/Modal/Modal";

export default function IntroductionModal(){
    return (
        <Modal confirmButtonText="Got it" className="c-introduction-modal">
            <h4 className="c-introduction-modal__title">Audio Limiter synth playground</h4>
            <ol className="c-introduction-modal__list">
                <li className="c-introduction-modal__list-item">Use the keyboard to play multiple sounds at the same time</li>
                <li className="c-introduction-modal__list-item">Play with sound loudness and observe peak meters and wave shape on oscilloscope</li>
                <li className="c-introduction-modal__list-item">Turn on limiter bypass mode to hear difference</li>
            </ol>
            <h5  className="c-introduction-modal__subtitle">Have a fun !!!</h5>
        </Modal>
    )
}