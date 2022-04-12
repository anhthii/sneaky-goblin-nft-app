import React, { useState } from 'react';
import gameBalance from '../../../assets/imgs/game-balance.svg';

// Components
import PBButton from '../../ui/PBButton/PBButton';

const VaultForm = ({ title, subtitle, balance, btnText, method }) => {
    const [value, setValue] = useState(balance);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleSubmit = () => {
        method(value);
    };

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
                        <input
                            type="number"
                            className="form-control amount text-right"
                            aria-label="Amount (to the nearest dollar)"
                            value={value}
                            onChange={handleChange}
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
                />
            </div>
        </div>
    );
};

export default VaultForm;
