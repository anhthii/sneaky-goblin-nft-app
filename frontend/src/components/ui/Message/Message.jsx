import React, { useState, useEffect } from 'react';

import './Message.css';

const Message = ({ data }) => {
    const [slide, setSlide] = useState(false);
    const [show, setShow] = useState(false);
    const [type, setType] = useState(data.type || '');
    const [message, setMessage] = useState(data.text || '');
    const [duration, setDuration] = useState(data.duration || 2700);

    useEffect(() => {
        (() => {
            if (data) {
                setShow(false);
                setShow(true);

                setType(data.type);
                setMessage(data.text);
                setDuration(data.duration);

                setTimeout(() => {
                    setSlide(true);
                }, 250);

                setTimeout(() => {
                    setSlide(false);
                }, 300 + duration);
            }
        })();
    }, []);

    const onClickMessageHelper = () => {
        setTimeout(() => {
            setShow(false);
        }, 200);
    };

    return (
        <div>
            {data && show && (
                <div
                    onClick={onClickMessageHelper}
                    className={`message-wrap ${slide ? 'slide-down' : ''}`}
                >
                    <p className={type === 'warning' ? 'warning' : 'success'}>{message}</p>
                </div>
            )}
        </div>
    );
};

export default Message;
