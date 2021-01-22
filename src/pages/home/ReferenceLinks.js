import "./reference-links.scss"

const ReferenceLinks = () => {
    return (
        <div className="l--centred a-btn__container">
            <a className="a-btn a-btn--npm" 
               href="https://www.npmjs.com/package/audio-limiter" 
               target="blank">
                   Limiter <b>NPM</b>
            </a>
            <a className="a-btn a-btn--github" 
               href="https://github.com/robert8888/audio-limiter" 
               target="blank">
                   Limiter <b>GITHUB</b>
            </a>
        </div>
    )
}

export default ReferenceLinks