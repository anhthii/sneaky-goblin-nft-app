import React, { useEffect, useState } from 'react';

// Styles
import './Crementor.scss';

const Crementor = ({
    value = 0,
    width = 300,
    height = 10,
    curve = 50,
    bgColor = '#2b3b5e',
    lineColor = '#818181',
    hoverLineColor = '#ac9595',
    btnColor = '#dbdbdb',
    hoverBtnColor = '#98ea9a',
    onDecrement,
    onIncrement,
}) => {
    // State
    const [hasValue, setHasValue] = useState(false);
    const [isHoverDecreBtn, setIsHoverDecreBtn] = useState(false);
    const [isHoverIncreBtn, setIsHoverIncreBtn] = useState(false);
    const [isHover, setIsHover] = useState(false);

    // Effects
    useEffect(() => {
        if (value === 0) setHasValue(false);
        if (value > 0) setHasValue(true);
    }, [value]);

    // Handlers
    const onIncrementHandler = () => onIncrement();
    const onDecrementHandler = () => onDecrement();

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="_crementor"
            style={{
                background: bgColor,
                border: `1px solid ${isHover ? hoverLineColor : lineColor}`,
                borderRadius: `${curve}px`,
                width: width > 240 ? `${width}px` : `240px`,
                padding: `${height}px 0px`,
            }}
        >
            <div className="container">
                <div className="row">
                    <button
                        onMouseEnter={() => setIsHoverDecreBtn(true)}
                        onMouseLeave={() => setIsHoverDecreBtn(false)}
                        style={{ color: isHoverDecreBtn ? hoverBtnColor : btnColor }}
                        className="col decre"
                        onClick={onDecrement}
                    >
                        -
                    </button>
                    <div className={`col value ${hasValue ? 'has-value' : 'no-value'}`}>
                        {value}
                    </div>
                    <button
                        onMouseEnter={() => setIsHoverIncreBtn(true)}
                        onMouseLeave={() => setIsHoverIncreBtn(false)}
                        style={{ color: isHoverIncreBtn ? hoverBtnColor : btnColor }}
                        className="col incre"
                        onClick={onIncrement}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Crementor;
