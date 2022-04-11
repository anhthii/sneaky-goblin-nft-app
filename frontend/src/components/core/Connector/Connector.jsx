import React, { useContext, useState, useEffect } from 'react';

import { EthersContext } from '../../../store/all-context-interface';

// Style
import './Connector.scss';

const Connector = ({
    forceSwitch = false,
    network = '0x1',
    connText = 'CONNECT',
    disconnText = 'DISCONNECT',
    bgColor = '#5e356c',
    hoverBgColor = '#2d996c',
    lineColor = '#b3bdb3',
    hoverLineColor = '#dae7da',
    lineSize = 1,
    curve = 23,
    textSpace = 2,
    textSize = 1.3,
    font = 'Helvetica',
    textColor = 'white',
    textWeight = 700,
    height = 12,
    width = 210,
}) => {
    const { ethersProvider } = useContext(EthersContext);

    // State
    const [isConnected, setIsConnected] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [defBtnStyle, setDefBtnStyle] = useState({});

    // Effects
    useEffect(() => {
        setDefBtnStyle({
            borderRadius: `${curve}px`,
            letterSpacing: `${textSpace}px`,
            fontSize: `${textSize}em`,
            fontFamily: `${font}`,
            fontWeight: textWeight,
            padding: `${height}px 0px`,
            color: textColor,
        });
    }, []);

    // Handlers
    const onConnectHandler = async () => {
        const data = await ethersProvider.connect();
        if (data) await setIsConnected(true);
        if (!data) await setIsConnected(false);
        // Force switch to Ethereum after connecting, default: 0x1
        if (data && forceSwitch) await ethersProvider.switchNetwork(network);
    };

    const onDisconnectHandler = async () => {
        await ethersProvider.disconnect();
        await setIsConnected(false);
    };

    return (
        <div className="_connector-wrap" style={{ width: `${width}px` }}>
            {isConnected ? (
                <button
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    style={{
                        ...defBtnStyle,
                        border: `${lineSize}px solid ${isHover ? hoverLineColor : lineColor}`,
                        background: isHover ? hoverBgColor : bgColor,
                    }}
                    className="connector"
                    onClick={onDisconnectHandler}
                >
                    {disconnText}
                </button>
            ) : (
                <button
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    style={{
                        ...defBtnStyle,
                        border: `${lineSize}px solid ${isHover ? hoverLineColor : lineColor}`,
                        background: isHover ? hoverBgColor : bgColor,
                    }}
                    className="connector"
                    onClick={onConnectHandler}
                >
                    {connText}
                </button>
            )}
        </div>
    );
};

export default Connector;
