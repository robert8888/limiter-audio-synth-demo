import SyntaxHighlighter from 'react-syntax-highlighter';
import dedent from "dedent";
import 'highlight.js/styles/vs2015.css';
import "./code.scss";

export default function Code({children}){

    return (
        <SyntaxHighlighter language="javascript" useInlineStyles={false}>
            {dedent`${children}`}
        </SyntaxHighlighter>
    )
}