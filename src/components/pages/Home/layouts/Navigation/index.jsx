import React, { useState } from 'react';

// Components
import Connector from '../../../../core/Connector/Connector';
import Floater from '../../../../ui/Floater/Floater';

// Assets & Style
import sgLogo from '../../../../../assets/imgs/sg-logo.svg';
import discordLogo from '../../../../../assets/imgs/discord.svg';
import instaLogo from '../../../../../assets/imgs/insta.svg';
import openseaLogo from '../../../../../assets/imgs/opensea.svg';
import twitterLogo from '../../../../../assets/imgs/twitter.svg';
import menu from '../../../../../assets/imgs/menu.svg';
import './Navigation.scss';

const Navigation = () => {
    // States
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pageContentType, setPageContentType] = useState('');

    // Handlers
    const onClickMenuHandler = () => setShowMenu(!showMenu);

    const onClickModalPageHandler = (target) => {
        setShowModal(true);
        setPageContentType(target);
    };

    // Helpers
    const onClickModalPageContent = (target) => {
        if (target === 'mission') {
            return (
                <div>
                    <h4 className="text-center">The Vision</h4>
                    <br />
                    <p className="text-center">
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus
                        ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
                        ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                        risus, porta ac consectetur ac, vestibulum at eros.
                    </p>
                </div>
            );
        }
        if (target === 'roadmap') {
            return (
                <>
                    <h4>Roadmap Modal</h4>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus
                        ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
                        ac, vestibulum at eros.
                    </p>
                </>
            );
        }
        if (target === '') return <span />;
    };

    return (
        <div className="_navigation container">
            <nav className="navbar navbar-expand-lg navbar-dark">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarToggle"
                    aria-controls="navbarToggle"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <div onClick={onClickMenuHandler} className="mobile-menu-btn-wrapper">
                        <img src={menu} alt="" />
                    </div>
                </button>

                <div
                    className={`collapse navbar-collapse justify-content-between ${
                        showMenu ? 'show' : ''
                    }`}
                    id="navbarToggle"
                >
                    <ul className="navbar-nav custom-nav left">
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Roadmap
                                {/*Home <span className="visually-hidden">(current)</span>*/}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                onClick={() => onClickModalPageHandler('mission')}
                            >
                                Mission
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Artist
                            </a>
                        </li>
                    </ul>

                    <a className="navbar-brand d-none d-lg-block" href="#">
                        <div className="logo-wrapper">
                            <img src={sgLogo} alt="" />
                        </div>
                    </a>

                    <ul className="navbar-nav custom-nav right">
                        <div style={{ marginRight: '70px' }} />
                        <li className="nav-item">
                            <a className="nav-link" href="/testdiscord">
                                <img src={discordLogo} alt="" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <img src={openseaLogo} alt="" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <img src={instaLogo} alt="" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <img src={twitterLogo} alt="" />
                            </a>
                        </li>
                        <div style={{ marginLeft: '40px' }} />
                        <li>
                            <Connector
                                connText="Connect Wallet"
                                disconnText="Disconnect"
                                curve={3}
                                bgColor="#00C555"
                                hoverBgColor="#15ad57"
                                lineColor="#FFC748"
                                hoverLineColor="#FFC748"
                                textSize={1.25}
                                textColor="black"
                            />
                        </li>
                    </ul>
                </div>
            </nav>

            {showModal && (
                <Floater show={showModal} onHide={() => setShowModal(false)}>
                    {onClickModalPageContent(pageContentType)}
                </Floater>
            )}
        </div>
    );
};

export default Navigation;
