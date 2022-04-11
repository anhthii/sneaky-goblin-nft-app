import React, { useState, useMemo } from 'react';

// Context
import { MsgNetContext } from './all-context-interface';

// Components
import Message from '../components/ui/Message/Message';

const MessageNet = ({ children }) => {
    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState(null);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const setMsgHandler = async (text, type, duration = 3700) => {
        await setShowMessage(false);
        await setMessageData(null);
        await setShowMessage(true);
        await setMessageData({ text, type, duration });
        setTimeout(() => {
            setShowMessage(false);
        }, 1000 + duration);
    };

    // Ethers Context Value >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const errMsgNetContextValue = useMemo(
        () => ({
            setMsg: setMsgHandler,
        }),
        [showMessage, messageData]
    );

    return (
        <MsgNetContext.Provider value={errMsgNetContextValue}>
            {children}
            {showMessage && messageData !== null && <Message data={messageData} />}
        </MsgNetContext.Provider>
    );
};

export default MessageNet;
