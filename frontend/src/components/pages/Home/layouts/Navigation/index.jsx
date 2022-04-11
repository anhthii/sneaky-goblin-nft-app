import React from 'react';

// Components
import Connector from '../../../../core/Connector/Connector';

// Styles
import './Navigation.scss';

const Navigation = () => {
    return (
        <div className="_navigation container">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4">
                <div className="brand d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark">
                    Sneaky Goblins
                </div>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li />
                </ul>

                <div className="col-md-3 text-end">
                    <Connector bgColor="#cbac87" hoverBgColor="#ab9882" />
                </div>
            </header>
        </div>
    );
};

export default Navigation;
