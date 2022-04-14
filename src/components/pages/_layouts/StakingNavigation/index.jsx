import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Components
import Connector from '../../../core/Connector/Connector';

// Assets & Style
import stakingLogo from '../../../../assets/imgs/staking-logo.png';
import stakingLogoMob from '../../../../assets/imgs/staking-logo-mob.png';
import discordLogo from '../../../../assets/imgs/discord.svg';
import instaLogo from '../../../../assets/imgs/insta.svg';
import openseaLogo from '../../../../assets/imgs/opensea.svg';
import twitterLogo from '../../../../assets/imgs/twitter.svg';
import menu from '../../../../assets/imgs/menu.svg';
import closeMenu from '../../../../assets/imgs/close-menu.svg';
import backArrow from '../../../../assets/imgs/back-arrow.svg';
import './StakingNavigation.scss';

const StakingNavigation = () => {
    const navigate = useNavigate();
    const navigateTo = (route, options) => () => navigate(route, options);
    // States
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileFooter, setShowMobileFooter] = useState(true);
    // Social Medias
    const [socials] = useState({
        discord: '#',
        opensea: '#',
        insta: '#',
        twitter: '#',
    });

    // Handlers
    const onClickMenuHandler = () => setShowMenu(!showMenu);

    return (
        <div className="_staking-nav-wrap">
            {/* Desktop Nav */}
            <div className="_staking-nav container d-none d-lg-block">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div
                        className="collapse navbar-collapse justify-content-between"
                        id="navbarToggle"
                    >
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <div className="logo-wrapper" onClick={navigateTo("/")}>
                                    <img src={stakingLogo} alt="Goblinverse Invasion" />
                                    {/* This is hidden visually, for SEO*/}
                                    <h1 id="MainTextBrand">Goblinverse Invasion</h1>
                                </div>
                            </li>
                        </ul>

                        <div className="nav-line-wrap-top">
                            <div className="fade-line" />
                        </div>
                        <div className="nav-line-wrap-bottom">
                            <div className="fade-line" />
                        </div>

                        <ul className="navbar-nav custom-nav right">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/stake" className="nav-link active">
                                    Staking Platform
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#"
                                    // onClick={() => onClickModalPageHandler('artist')}
                                >
                                    Marketplace
                                </a>
                            </li>
                        </ul>

                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <div className="desktop-connect-wrap">
                                    <Connector
                                        connText="Connect"
                                        disconnText="Disconnect"
                                        curve={3}
                                        bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                                        hoverBgColor="#15ad57"
                                        lineColor="#FFC748"
                                        hoverLineColor="#FFC748"
                                        lineSize={1}
                                        textSize={1.15}
                                        textColor="black"
                                        height={60}
                                        width={130}
                                        padd="10px 10px"
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Custom Mobile Nav */}
            <div className="_staking-nav container-fluid d-block d-lg-none">
                <div className="row">
                    <div className="col-3">
                        <div className="mobile-menu-left-wrap">
                            <div onClick={onClickMenuHandler} className="menu-inner-wrap">
                                <img src={showMenu ? closeMenu : menu} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <Link to="/" className="">
                            <div className="logo-wrapper">
                                <img src={stakingLogoMob} alt="" />
                            </div>
                        </Link>
                    </div>
                    <div className="col-3">
                        <div className="mobile-connect-wrap">
                            <Connector
                                connText="Connect"
                                disconnText="Disconnect"
                                curve={3}
                                bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                                hoverBgColor="#15ad57"
                                lineColor="#FFC748"
                                hoverLineColor="#FFC748"
                                lineSize={1}
                                textSize={1.15}
                                textColor="black"
                                height={60}
                                width={130}
                                padd="10px 10px"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Overlay - Mobile Menu */}
            <div id="MobileMenu" className={showMenu ? 'show d-block d-lg-none' : 'hide'}>
                <div className="mobile-menu-link-wrap">
                    <p onClick={navigateTo('/')}>Home</p>
                    <p>Staking Platform</p>
                    <p>Marketplace</p>
                </div>
            </div>

            {/* Footer Mobile Menu - Social Media Links */}
            {showMobileFooter && showMenu && (
                <div id="FooterWrap" className="d-block d-lg-none">
                    <div className="line-wrap">
                        <div className="fade-line" />
                    </div>
                    <div className="social-links-wrap">
                        <ul>
                            <li>
                                <a href={socials.discord}>
                                    <div className="footer-logo-wrap">
                                        <img src={discordLogo} alt="" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href={socials.opensea}>
                                    <div className="footer-logo-wrap">
                                        <img src={openseaLogo} alt="" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href={socials.insta}>
                                    <div className="footer-logo-wrap">
                                        <img src={instaLogo} alt="" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href={socials.twitter}>
                                    <div className="footer-logo-wrap">
                                        <img src={twitterLogo} alt="" />
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StakingNavigation;
