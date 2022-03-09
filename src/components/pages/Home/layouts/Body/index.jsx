import React, { useContext, useState, useEffect } from 'react';
import { GiCeremonialMask } from 'react-icons/gi';

// Utils
import { MsgNetContext } from '../../../../../store/all-context-interface';

// Components
import Crementor from '../../../../ui/Crementor/Crementor';
import PBButton from '../../../../ui/PBButton/PBButton';

// Styles & Assets
import './Body.scss';

const Index = () => {
    const { setMsg } = useContext(MsgNetContext);

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [defValue, setDefValue] = useState(0);

    useEffect(() => {
        callApi();
    }, []);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const onIncrementHandler = () => {
        setDefValue(defValue + 1);
    };

    const onDecrementHandler = () => {
        if (defValue === 0) return;
        setDefValue(defValue - 1);
    };

    const callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.text();
        console.log('body', body);
    };

    return (
        <div className="_body">
            <div className="px-4 py-5 my-5 text-center">
                <h1 className="display-5 fw-bold" style={{ color: '#1c1c1c' }}>
                    Sneaky Goblins Frontend
                </h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4" style={{ color: '#121111' }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor.
                    </p>
                    <br />
                    <br />

                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <Crementor
                            value={defValue}
                            bgColor="#2b3b5e"
                            lineColor="#818181"
                            onIncrement={onIncrementHandler}
                            onDecrement={onDecrementHandler}
                        />
                    </div>

                    <br />

                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <PBButton
                            text="mint"
                            textSpace={1}
                            textWeight={700}
                            bgColor="#2b3b5dd9"
                            icon={<GiCeremonialMask size={22} />}
                        />
                    </div>
                </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default Index;
