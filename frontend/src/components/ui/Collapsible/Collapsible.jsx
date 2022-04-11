import React, { useState, useCallback } from 'react';

// Styles
import './Collapsible.scss';

const Collapsible = ({ question, answer }) => {
    // States
    const [wrapperHeight, setWrapperHeight] = useState('80px');

    // Handlers
    const onClickQuestion = useCallback(() => {
        if (wrapperHeight !== '1000px') {
            setWrapperHeight('1000px');
        } else {
            setWrapperHeight('80px');
        }
    }, [wrapperHeight]);

    return (
        <div
            className="_collapsible question-wrapper"
            style={{ maxHeight: wrapperHeight }}
            onClick={onClickQuestion}
        >
            <p className="question-text">{question}</p>

            <div className="answer-wrapper">
                <p>{answer}</p>
            </div>
        </div>
    );
};

export default Collapsible;
