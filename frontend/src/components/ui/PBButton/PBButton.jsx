import React, { useState } from 'react';

// Styles
import './PBButton.scss';

const PBButton = ({
    curve = 7,
    icon = null,
    iconColor = 'white',
    hoverIconColor = '#98ea9a',
    link = null,
    linkTarget = '_blank',
    text = 'Pop Block',
    lineColor = '#5e5e5e',
    hoverLineColor = '#716e6e',
    lineSize = 1,
    bgColor = '#a276bf3b',
    hoverBgColor = '#694A7D3B',
    textColor = 'white',
    textWeight = 600,
    textSize = 1.3,
    textSpace = 0,
    font = 'Helvetica',
    wordSpace = 3,
    width = 15,
    height = 48,
    style = null,
    method = null,
}) => {
    // State
    const [isHover, setIsHover] = useState(false);

    // Handler
    const onClickLinkHandler = () => {
        if (!link && !method) return;

        if (method) {
            method();
            return;
        }

        window.open(link, linkTarget).focus();
    };

    return (
        <div className="_pbButton">
            <button
                onClick={onClickLinkHandler}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{
                    ...(style && { ...style }),
                    borderRadius: `${curve}px`,
                    border: `${lineSize}px solid ${isHover ? hoverLineColor : lineColor}`,
                    background: isHover ? hoverBgColor : bgColor,
                    color: textColor,
                    fontWeight: textWeight,
                    fontSize: `${textSize}em`,
                    letterSpacing: `${textSpace}px`,
                    padding: `0px ${width}px`,
                    height: `${height}px`,
                }}
            >
                {icon && (
                    <span style={{ color: isHover ? hoverIconColor : iconColor }}>{icon}</span>
                )}{' '}
                <span style={{ fontFamily: font, marginLeft: `${wordSpace}px` }}>{text}</span>
            </button>
        </div>
    );
};

export default PBButton;
