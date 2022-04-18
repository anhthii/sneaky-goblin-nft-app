import React, { useContext, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import gameBalance from '../../../assets/imgs/game-balance.svg';

// Components
import PBButton from '../../ui/PBButton/PBButton';

// Utils
import { MsgNetContext } from '../../../store/all-context-interface';

const VaultForm = ({ title, subtitle, balance, btnText, method, disabled = false }) => {
    const { setMsg } = useContext(MsgNetContext);
    const [value, setValue] = useState(balance);

    const handleChange = ({ value }) => {
        setValue(value);
    };

    const handleSubmit = async () => {
        try {
            await method(value);
        } catch (error) {
            setMsg(`Failed ${btnText}`, 'warning');
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        setValue(balance);
    }, [balance]);

    return (
        <div className="col-12">
            <div className="_vault">
                <p className="title">{title}</p>
                <div className="input-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text icon">
                            <div className="d-inline-block icon-wrap">
                                <img src={gameBalance} alt="" />
                            </div>
                        </span>
                        <NumberFormat
                            className="form-control amount text-right"
                            aria-label="Amount (to the nearest dollar)"
                            min={0}
                            decimalScale={4}
                            value={value}
                            onValueChange={handleChange}
                            disabled={disabled}
                            thousandSeparator
                        />
                    </div>
                </div>
                <p className="sub">{subtitle}</p>
                <PBButton
                    method={handleSubmit}
                    text={btnText}
                    font="Outfit"
                    textColor="black"
                    textSpace={1}
                    textWeight={700}
                    bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                    hoverBgColor="#15ad57"
                    lineColor="#FFC748"
                    lineSize={2}
                    hoverLineColor="#FFC748"
                    curve={3}
                    height={70}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default VaultForm;
