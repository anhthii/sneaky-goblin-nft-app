import React, { useState } from 'react';
import { nanoid } from 'nanoid';

// Components
import Connector from '../../../core/Connector/Connector';
import Floater from '../../../ui/Floater/Floater';

// Assets & Style
import sgLogo from '../../../../assets/imgs/sg-logo.svg';
import discordLogo from '../../../../assets/imgs/discord.svg';
import instaLogo from '../../../../assets/imgs/insta.svg';
import openseaLogo from '../../../../assets/imgs/opensea.svg';
import twitterLogo from '../../../../assets/imgs/twitter.svg';
import menu from '../../../../assets/imgs/menu.svg';
import visionRing from '../../../../assets/imgs/vision-ring.svg';
import goblinKey from '../../../../assets/imgs/goblin-key.svg';
import sneakyClub from '../../../../assets/imgs/sneaky-club.png';
import sneakyStudio from '../../../../assets/imgs/sneaky-studio.svg';
import gamingStaking from '../../../../assets/imgs/gaming-staking.svg';
import metaverse from '../../../../assets/imgs/metaverse.svg';
import './Navigation.scss';

const Navigation = () => {
    // States
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pageContentType, setPageContentType] = useState('');
    // Roadmap data
    const [roadmapData] = useState([
        {
            status: 1,
            percent: '20%',
            date: "December 21' - Fecbruary 22'",
            phase: 'PHASE 0 - THE FOUNDATION',
            todos: [
                'Building a team of experts.',
                'Development of the Lore concept.',
                'Development of the character concept',
                'Launch social media accounts',
            ],
        },
        {
            status: 0,
            percent: '40%',
            date: "February - March 22'",
            phase: 'PHASE 1 - THE INITIATION',
            todos: [
                'Build awareness and brand positioning.',
                'Build strong community foundations.',
                'Collaborate with influencers, collections, and alpha groups.',
                'Release article and bio on our Art Director & Lead 3D Artist.',
                'Launch Website.',
            ],
        },
        {
            status: 0,
            percent: '60%',
            date: "March - May 22'",
            phase: 'PHASE 2 - THE BEGINNING',
            todos: [
                'Launch of the Sneaky Goblins Genesis Collection.',
                'Stake-to-Earn platform launched. Holders to be rewarded with the ecosystem token $xSERUM -> available just after reveal.',
                'Community Vault with 15% of all royalties -> to finance continuous project development.',
                'Executive team expansion -> Priority hiring for the community members.',
                'Launch of a whitelist marketplace powered by $xSERUM.',
                'Launch of a separate NFT collection to boost staking rewards ->$xSERUM will be used to mint.',
            ],
        },
        {
            status: 0,
            percent: '80%',
            date: "April - June 22'",
            phase: 'PHASE 3 - THE EXPANSION',
            todos: [
                'Launch story and airdrop the second NFT character to Sneaky Goblins Holders -> 45-60 days after first drop.',
                'Develop AAA partnerships with the sole purpose of benefiting the community.',
                'Airdrop of Alpha Group Pass to holders of 3 Sneaky Goblins NFTs -> expert analysts hired to provide daily market analysis.',
                'Creation of a community DAO for governance.',
                'Begin Sneaky Studios, the NFT & Metaverse Development hub of Sneaky Goblins.',
            ],
        },
        {
            status: 0,
            percent: '100%',
            date: "June - September 22'",
            phase: 'PHASE 4 - THE EVOLUTION',
            todos: [
                'Creative Team expansion -> 3D Artists, Animators, VFX…',
                'Evolution of the Sneaky Goblins to be Metaverse ready & to be played in compatible games.',
                'Build analytics & automation tools to help holders navigate the NFT market.',
                'Build more streams of revenue for the Community Fund (ex: launch tools as a subscription service, offer development services for projects, and more)',
                'Start up Incubator & Accelerator service for talented artists & teams with ambition and vision (Funding, advisory, network, marketing, and more)',
            ],
        },
    ]);

    // Handlers
    const onClickMenuHandler = () => setShowMenu(!showMenu);

    const onClickModalPageHandler = (target) => {
        setShowModal(true);
        setPageContentType(target);
    };

    // Inline Components
    const onClickModalPageContentSelector = (target) => {
        if (target === 'mission') return missionContent();
        if (target === 'roadmap') return roadmapContent();
        if (target === '') return <span />;
    };

    const missionContent = () => (
        <div className="container-fluid">
            <div className="modal-body-wrapper">
                <div className="row">
                    <div className="col-12">
                        <p className="text-center overlay-title">
                            <span className="overlay-title-first">The</span> Visi
                            <div className="ring-wrapper">
                                <img src={visionRing} alt="" />
                            </div>
                            n
                        </p>
                        <br />
                        <br />
                        <p className="text-center vision-body">
                            Our vision for the Sneaky Goblins is to be the Genesis collection of a
                            larger upcoming ecosystem. Over time, we are building the components of
                            an NFT & Metaverse Studio to empower our community. Sneaky Studios will
                            help talented artists launch collections and build NFT experiences
                            through the Sneaky Incubator.
                        </p>
                        <br />
                        <br />
                        <div className="goblin-wrapper mx-auto">
                            <img src={goblinKey} alt="" />
                        </div>
                        <p className="text-center overlay-title reverse">
                            <span className="overlay-title-first">Key</span> Features
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 ml-auto">
                        <div className="features-wrap">
                            <h4>Gaming Staking</h4>
                            <p>
                                Stake your Goblins to receive the ecosystem token. Use it for future
                                character drops, NFT upgrades and more.
                            </p>
                            <div className="feature-img-wrap">
                                <img src={gamingStaking} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 ml-auto">
                        <div className="features-wrap">
                            <h4>The Sneaky Club</h4>
                            <p>
                                The most engaged Goblins get exclusive access to the Club where
                                market alpha and advanced NFT tools are shared.
                            </p>
                            <div className="feature-img-wrap">
                                <img src={sneakyClub} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 ml-auto">
                        <div className="features-wrap">
                            <h4>The Sneaky Studio</h4>
                            <p>
                                The Sneaky Studio is an NFT Studio that will help artists launch
                                their collections with a % of every mint going to the community
                                vault.
                            </p>
                            <div className="feature-img-wrap">
                                <img src={sneakyStudio} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 ml-auto">
                        <div className="features-wrap">
                            <h4>Metaverse</h4>
                            <p>
                                The Sneaky Goblins will be Metaverse ready characters to be played
                                in compatible games and Metaverse worlds.
                            </p>
                            <div className="feature-img-wrap">
                                <img src={metaverse} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const roadmapContent = () => (
        <div className="container-fluid">
            <div className="modal-body-wrapper roadmap">
                <div className="row">
                    <div />
                    <div className="col-12">
                        <p className="text-center overlay-title">
                            <span className="overlay-title-first">Road</span>map
                        </p>
                        <div />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
                {roadmapData.map((data) => (
                    <div key={nanoid(7)} className="row roadmap-wrapper">
                        <div className="col-1 col-sm-1 col-md-1 col-lg-1">
                            <div
                                className={`roadmap-dot ${data.status === 1 ? 'done' : 'ongoing'}`}
                            />
                        </div>
                        <div
                            className={`col-1 col-sm-1 col-md-1 col-lg-3 roadmap-percent ${
                                data.status === 1 ? 'done' : 'ongoing'
                            }`}
                        >
                            {data.percent}
                        </div>
                        <div className="col-10 col-sm-10 col-md-10 col-lg-8">
                            <p className={`roadmap-date ${data.status === 1 ? 'done' : 'ongoing'}`}>
                                {data.date}
                            </p>
                            <p
                                className={`roadmap-phase ${
                                    data.status === 1 ? 'done' : 'ongoing'
                                }`}
                            >
                                {data.phase}
                            </p>
                        </div>
                        <div className="row">
                            <div className="col-1 col-sm-1 col-md-1 col-lg-1" />
                            <div className="col-1 col-sm-1 col-md-1 col-lg-3" />
                            <div className="col-10 col-sm-10 col-md-10 col-lg-8 ml-auto">
                                <ul
                                    className={`roadmap-todos ${
                                        data.status === 1 ? 'done' : 'ongoing'
                                    }`}
                                >
                                    {data.todos.map((todo) => (
                                        <li key={nanoid(6)}>{todo}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div className="_navigation container d-none d-lg-block">
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
                        className="collapse navbar-collapse justify-content-between"
                        id="navbarToggle"
                    >
                        <ul className="navbar-nav custom-nav left">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    onClick={() => onClickModalPageHandler('roadmap')}
                                >
                                    Roadmap
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

                        <a className="navbar-brand d-none d-lg-block" href="/">
                            <div className="logo-wrapper">
                                <img src={sgLogo} alt="" />
                            </div>
                        </a>

                        <ul className="navbar-nav custom-nav right">
                            <div className="spacer-last" />
                            <li className="nav-item">
                                <a className="nav-link" href="#">
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
                            <div className="spacer-last" />
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
                    <Floater show={showModal} onHide={() => setShowModal(false)} width={80}>
                        {onClickModalPageContentSelector(pageContentType)}
                    </Floater>
                )}
            </div>

            {/* Custom Mobile Nav */}
            <div className="_navigation container-fluid d-block d-lg-none">
                <div className="row">
                    <div className="col-4">
                        <div className="menu-wrap-mobile">
                            <div onClick={onClickMenuHandler} className="menu-inner-wrap">
                                <img src={menu} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <a className="" href="#">
                            <div className="logo-wrapper">
                                <img src={sgLogo} alt="" />
                            </div>
                        </a>
                    </div>
                    <div className="col-4">
                        <div className="connector-wrap-mobile">
                            <Connector
                                connText="Connect Wallet"
                                disconnText="Disconnect"
                                curve={3}
                                bgColor="#00C555"
                                hoverBgColor="#15ad57"
                                lineColor="#FFC748"
                                hoverLineColor="#FFC748"
                                textSize={1.15}
                                textColor="black"
                                height={60}
                                width={180}
                                padd="10px 10px"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Mobile Menu */}
            <div id="MobileMenu" className={showMenu ? 'show' : 'hide'}>
                <div>
                    <p>test link</p>
                    <p>test link</p>
                    <p>test link</p>
                </div>
            </div>
        </>
    );
};

export default Navigation;
