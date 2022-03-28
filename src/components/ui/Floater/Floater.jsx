import React from 'react';
import { Modal } from 'react-bootstrap';

// Style
import './Floater.scss';

const Floater = ({ show, onHide, children }) => {
    const { Header, Body } = Modal;

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="_floater modal-90w"
            centered
        >
            <Header closeButton />

            <Body>{children}</Body>
        </Modal>
    );
};

export default Floater;
