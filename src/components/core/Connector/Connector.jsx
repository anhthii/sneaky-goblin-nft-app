import React, { useContext, useState, useEffect } from 'react';

import { EthersContext } from '../../../store/all-context-interface';

// Style
import './Connector.scss';

const Connector = ({
    forceSwitch = true,
    network = '0x1',
    connText = 'CONNECT',
    disconnText = 'DISCONNECT',
    bgColor = '#5e356c',
    hoverBgColor = '#2d996c',
    lineColor = '#b3bdb3',
    hoverLineColor = '#dae7da',
    lineSize = 1,
    curve = 23,
    textSpace = 0,
    textSize = 1.3,
    font = 'Outfit',
    textColor = 'white',
    textWeight = 600,
    padd = '17px 34px 17px 34px',
    height = 70,
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
            padding: `${padd}`,
            height: `${height}px`,
            color: textColor,
        });
    }, []);

    // Handlers
    const onConnectHandler = async () => {
        const data = await ethersProvider.connect();
        if (data) await setIsConnected(true);
        if (!data) await setIsConnected(false);
        // Force switch to the network set in .env
        if (data && forceSwitch) {
            try {
                await ethersProvider.switchNetwork();
            } catch (e) {}
        }
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
