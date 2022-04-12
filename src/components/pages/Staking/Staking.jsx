import React, { useEffect, useCallback, useContext, useState, Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import { nanoid } from 'nanoid';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Helmet } from 'react-helmet-async';

// Components
import PBButton from '../../ui/PBButton/PBButton';
import Connector from '../../core/Connector/Connector';

// Layouts
import HowToPlay from '../_layouts/HowToPlay/HowToPlay';

// Utils
import { getAllLocalEnv } from '../../../helpers/dev/general-helpers';
import { EthersContext, MsgNetContext } from '../../../store/all-context-interface';

// Styles & Assets
import stakingBg from '../../../assets/imgs/staking-bg.jpg';
import stakingBgMob15 from '../../../assets/imgs/staking-bg-mob-x1.5.jpg';
import gameBalance from '../../../assets/imgs/game-balance.svg';
import stakingBgMobPlus2 from '../../../assets/imgs/staking-bg-mob-x2.jpg';
import backArrow from '../../../assets/imgs/back-arrow-green.svg';
import dummmyA from '../../../assets/imgs/dummy-a.png';
import dummmyB from '../../../assets/imgs/dummy-b.png';
import dummmyC from '../../../assets/imgs/dummy-c.png';
import dummmyD from '../../../assets/imgs/dummy-d.png';
import dummmyE from '../../../assets/imgs/dummy-e.png';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import './Staking.scss';

const Staking = () => {
    const localEnv = getAllLocalEnv();
    const {
        ethers,
        address,
        provider,
        chainId,
        signer,
        isConnected,
        isMetamaskInstalled,
        ethersProvider,
    } = useContext(EthersContext);
    const { setMsg } = useContext(MsgNetContext);

    // Swiper settings
    const sliderSettings = {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
    };

    // Responsive width detection >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const isTablet = useMediaQuery({ minWidth: 587, maxWidth: 991 });
    const isMobile = useMediaQuery({ query: '(max-width: 586px)' });
    const isLarge = useMediaQuery({ query: '(min-width: 992px)' });

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // Constant
    const [TOKEN_SYMOBL] = useState('$xSERUM');
    // UI States -----------
    const [activeTab, setActiveTab] = useState('');
    const [activeSubTab, setActiveSubTab] = useState('');
    const [inGameBal, setInGameBal] = useState('24.900'); // temp
    const [ercBal, setErcBal] = useState('10.000'); // temp
    // Staking States ------
    const [selectedNFT, setSelectedNFT] = useState([]);
    const [stakingProcessStarted, setStakingProcessStarted] = useState(false);
    // const [allNftUserOwns, setAllNftUserOwn] = useState([]);
    // const [stakedNFTS, setStakedNFTS] = useState([]);
    // NFT States ----------
    const [isRevealed, setIsRevealed] = useState(false);
    // Contract States -----
    const [nftContractSigner, setNftContractSigner] = useState(null);
    const [stakingContractSigner, setStakingContractSigner] = useState(null);

    // DUMMY DATA, SHOULD BE DELETED
    // uncomment allNftUserOwns and stakedNFTS above after you delete these 2
    const [allNftUserOwns, setAllNftUserOwn] = useState([
        { uri: dummmyA, tokenId: 0, selected: false },
        { uri: dummmyB, tokenId: 1, selected: false },
        { uri: dummmyC, tokenId: 2, selected: false },
        { uri: dummmyD, tokenId: 3, selected: false },
        { uri: dummmyE, tokenId: 4, selected: false },
    ]);
    const [stakedNFTS, setStakedNFTS] = useState([
        { uri: dummmyC, tokenId: 5, selected: false },
        { uri: dummmyD, tokenId: 6, selected: false },
        { uri: dummmyE, tokenId: 7, selected: false },
    ]);

    // Effects >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        if (isConnected) {
            // Default active tab
            setActiveTab('invasion');

            // Make sure user use the right network to avoid contract errors
            if (`${chainId}` === localEnv.chainDec) {
                (async () => {
                    //... Put all initial load logic here for contracts
                    // NFT Contract
                    // const _nftContractSigner = new ethers.Contract(
                    //     localEnv.nftContract,
                    //     NFT.abi,
                    //     signer
                    // );
                    // setNftContractSigner(_nftContractSigner);
                    // Staking Contract
                    // const _stakingContractSigner = new ethers.Contract(
                    //     localEnv.nftStakingContract,
                    //     NFT_STAKING.abi,
                    //     signer
                    // );
                    // setStakingContractSigner(_stakingContractSigner);
                    //---------
                    // TODO: Get all user's NFT s/he owns and save in setAllNftUserOwn([])
                    // TODO: Determine which NFTs are already staked and save in setStakedNFTS([])
                    // NOTE: MOD project has a working staking page, it's worth to check that out
                    // NOTE: Another important thing use nanoid(5) as customId in your NFT data
                    // so that each mapping of element is unique, don't depend on the token id.
                    // Please check MOD project, I implemented it there. Sample NFT data:
                    // {
                    //       customId, // nanoid
                    //       tokenId,
                    //       uri,
                    //       selected, // this is use to determine if nft is selected or not
                    //       ...
                    // }
                })();
            } else {
                ethersProvider.disconnect();
                setMsg(`Disconnected. Please connect to ${localEnv.chainName} first!`, 'warning');
                // Revert all other states here...
            }
        }
    }, [isConnected, chainId]);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // This will set inline pages of Invasion tab
    const invasionButtonsHandler = (tab) => {
        if (allNftUserOwns.length < 1 && stakedNFTS.length < 1) return;
        if (tab === 'unstake' && stakedNFTS.length < 1) return;
        if (tab === 'stake' && allNftUserOwns.length < 1) return;
        setActiveSubTab(tab);
    };

    // This will set secondary nav active tab
    const secondaryNavHandler = (tab) => {
        if (!isConnected) return;

        // Revert this if tab is not "invasion"
        if (tab !== 'invasion') setActiveSubTab('');
        setActiveTab(tab);
    };

    // When user selects and NFT
    const onSelectingNftHandler = useCallback(
        async (tokenId, type) => {
            let _clone;
            if (type === 'unstaked') _clone = [...allNftUserOwns];
            if (type === 'staked') _clone = [...stakedNFTS];

            // Update the nft selected property
            const _nftToUpdateIndex = _clone.findIndex((nft) => nft.tokenId === tokenId);
            _clone[_nftToUpdateIndex].selected = !_clone[_nftToUpdateIndex].selected;
            await setAllNftUserOwn(_clone);
            // Update the selectedNFT array
            setSelectedNFT([]);
            // for some weird/unknown reason .filter() is not working
            _clone.forEach((nft) => {
                if (nft.selected) setSelectedNFT((prev) => [...prev, nft.tokenId]);
            });
        },
        [selectedNFT, allNftUserOwns, stakedNFTS]
    );

    // Will handle staking of NFT(s)
    const onStakingHandler = () => {
        console.log('Selected for staking', selectedNFT);
        // TODO: If NFTs are not approved, approve it first
        // TODO: Also, refetch latest updated data from contract
        // TODO: Don't forget to reset the selectedNFT array []
        _temporaryRevertForUITest(allNftUserOwns);
    };

    // Will handle unstaking of NFT(s)
    const onUntakingHandler = () => {
        console.log('Selected for unstaking', selectedNFT);
        // TODO: Refetch latest updated data from contract after
        _temporaryRevertForUITest(stakedNFTS);
    };

    // TODO: Please delete this func later
    const _temporaryRevertForUITest = (arr) => {
        const _clone = [...arr];
        const _updated = _clone.map((nft) => {
            nft.selected = false;
            return nft;
        });
        setAllNftUserOwn(_updated);
        setSelectedNFT([]);
    };

    // Handles withdrawal for erc20, converts in-game to erc
    const onWithdrawInGame = () => {};

    // Handles erc deposit
    const onDepositERC = () => {};

    // Inline >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const whichBg = useCallback(() => {
        if (isTablet) return stakingBgMobPlus2;
        if (isMobile) return stakingBgMob15;
        return stakingBg;
    }, [isTablet, isMobile, stakingBg, stakingBgMob15, stakingBgMobPlus2]);

    // The nav within the page, not the top navigation
    const secondaryNav = () => (
        <div
            className={`_secondary-nav ${!isConnected && isLarge ? 'nc' : ''} ${
                activeTab !== 'vault' ? 'notvault' : ''
            }`}
        >
            <div className="container">
                <div className="row">
                    <div className="col-12 mx-auto">
                        <div className="line-wrap-top">
                            <div className="fade-left-line" />
                            <div className="fade-right-line" />
                        </div>
                    </div>

                    <div className="col-12 mx-auto sec-menu">
                        <ul>
                            <li>
                                <p
                                    onClick={() => secondaryNavHandler('invasion')}
                                    className={`menu-text ${
                                        activeTab === 'invasion' ? 'active' : ''
                                    }`}
                                >
                                    Invasion
                                </p>
                            </li>
                            <li>
                                <p
                                    onClick={() => secondaryNavHandler('vault')}
                                    className={`menu-text ${activeTab === 'vault' ? 'active' : ''}`}
                                >
                                    Vault
                                </p>
                            </li>
                            {!isLarge && (
                                <li>
                                    <p
                                        onClick={() => secondaryNavHandler('stats')}
                                        className={`menu-text ${
                                            activeTab === 'stats' ? 'active' : ''
                                        }`}
                                    >
                                        Stats
                                    </p>
                                </li>
                            )}
                            <li>
                                <p
                                    onClick={() => secondaryNavHandler('htp')}
                                    className={`menu-text ${activeTab === 'htp' ? 'active' : ''}`}
                                >
                                    How to play
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="col-12 mx-auto">
                        <div className="line-wrap-bottom">
                            <div className="fade-left-line" />
                            <div className="fade-right-line" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // If the user is not connected yet
    const notConnectedSection = () => (
        <div className="_not-connected-section">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className={`ncs-wrap ${isMetamaskInstalled ? 'mm' : ''}`}>
                            <p className="title">Connect Wallet</p>
                            <div className="text-wrap">
                                <p>
                                    <span>The Goblinverse Invasion Campaign</span> could not be
                                    traced! <br />
                                    {!isMetamaskInstalled && isLarge && (
                                        <>
                                            Please install <span>Metamask</span> or use the Wallet
                                            Browser Dapp
                                        </>
                                    )}
                                </p>
                            </div>
                            {isMetamaskInstalled || !isLarge ? (
                                <Connector
                                    connText="Connect Wallet"
                                    disconnText="Disconnect"
                                    curve={3}
                                    bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                                    hoverBgColor="#15ad57"
                                    lineColor="#FFC748"
                                    hoverLineColor="#FFC748"
                                    lineSize={2}
                                    textSize={1.4}
                                    textColor="black"
                                    height={70}
                                    width={220}
                                    textWeight={700}
                                    padd="10px 10px"
                                />
                            ) : (
                                <PBButton
                                    link="https://metamask.io"
                                    text="Install Metamask"
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
                                    width={220}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Headquarter Stats: desktop
    const hqStats = () => (
        <div className={`_hq-stats ${activeTab !== 'vault' ? 'notvault' : ''}`}>
            <p className="title">HEADQUARTER STATS</p>
            <p className="sub">Supply Staked: 88% of all Goblins</p>
            <div className="stats-wrap">{_hqStatsData()}</div>
        </div>
    );

    // Headquarter Stats: mobile
    const hqStatsMobile = () => (
        <div className="col-12">
            <div className="_hq-stats-mobile">
                <p className="title">HEADQUARTER STATS</p>
                <p className="sub">Supply Staked: 88% of all Goblins</p>
                <div className="stats-wrap">{_hqStatsData()}</div>
            </div>
        </div>
    );

    // Headquarter Stats: data
    const _hqStatsData = useCallback(
        () => (
            <ul>
                <li>
                    <p>
                        Game Balance: <span>24900</span>
                    </p>
                </li>
                <li>
                    <p>
                        ERC-20 Balance: <span>10000</span>
                    </p>
                </li>
                <li>
                    <p>
                        Total Balance: <span>34900</span>
                    </p>
                </li>
                <li>
                    <p>
                        Daily Yield: <span>9800 {TOKEN_SYMOBL}</span>
                    </p>
                </li>
            </ul>
        ),
        [TOKEN_SYMOBL]
    );

    // The How-to-Play data elements
    const howToPlay = () => (
        <div className="col">
            <div className="_htp">
                <div className="-wrap">
                    <p className="title">How to Play</p>
                    <div className="-body">
                        <HowToPlay />
                    </div>
                </div>
            </div>
        </div>
    );

    // The in-game and erc balances
    const vault = (title, sub, bal, btnText, method) => (
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
                            disabled
                            type="text"
                            className="form-control"
                            aria-label="Amount (to the nearest dollar)"
                        />
                        <span className="input-group-text amount">{bal}</span>
                    </div>
                </div>
                <p className="sub">{sub}</p>
                <PBButton
                    method={method}
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

    // Invasion: main wrap
    const _invasionWrap = (child) => {
        let _title = 'INVASION';
        if (activeSubTab === 'stake') _title = 'STAKE';
        if (activeSubTab === 'unstake') _title = 'UNSTAKE';

        return (
            <div className="col">
                <div
                    className={`_invasion ${
                        activeTab === 'invasion' &&
                        (allNftUserOwns.length > 0 || stakedNFTS.length > 0)
                            ? 'wide'
                            : ''
                    }`}
                >
                    <div
                        className={`-wrap ${
                            activeTab === 'invasion' &&
                            (allNftUserOwns.length > 0 || stakedNFTS.length > 0)
                                ? 'wide'
                                : ''
                        } ${activeSubTab !== '' ? 'sub-tab' : ''} ${
                            allNftUserOwns.length < 1 || stakedNFTS.length < 1 ? 'none' : ''
                        }`}
                    >
                        <p className="title">{_title}</p>
                        <div
                            className={`-body ${
                                allNftUserOwns.length < 1 || stakedNFTS.length < 1 ? 'none' : ''
                            }`}
                        >
                            {child}
                        </div>
                        {/* If has NFTs, at least, show Stake & Unstake buttons */}
                        {(allNftUserOwns.length > 0 || stakedNFTS.length > 0) &&
                            activeSubTab === '' && (
                                <div className="btns-wrap">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12 col-lg-6 stake">
                                                <PBButton
                                                    method={() => invasionButtonsHandler('stake')}
                                                    text="Stake"
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
                                                    width={144}
                                                />
                                            </div>
                                            <div className="col-12 col-lg-6 unstake">
                                                <PBButton
                                                    method={() => invasionButtonsHandler('unstake')}
                                                    text="Unstake"
                                                    font="Outfit"
                                                    textColor="black"
                                                    textSpace={1}
                                                    textWeight={700}
                                                    bgColor="linear-gradient(84.07deg, #C50000 16.64%, #FF0808 93.78%)"
                                                    hoverBgColor="#B10000"
                                                    lineColor="#FFC748"
                                                    lineSize={2}
                                                    hoverLineColor="#FFC748"
                                                    curve={3}
                                                    height={70}
                                                    width={144}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {activeSubTab === 'stake' && (
                            <div className="btns-wrap sub-tab">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12 col-lg-4 mx-auto approve">
                                            <PBButton
                                                method={onStakingHandler}
                                                text="Approve Invaders"
                                                font="Outfit"
                                                textColor="black"
                                                textSize={1.25}
                                                textSpace={1}
                                                textWeight={700}
                                                bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                                                hoverBgColor="#15ad57"
                                                lineColor="#FFC748"
                                                lineSize={2}
                                                hoverLineColor="#FFC748"
                                                curve={3}
                                                height={70}
                                                width={229}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSubTab === 'unstake' && (
                            <div className="btns-wrap sub-tab">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12 col-lg-4 mx-auto approve">
                                            <PBButton
                                                method={onUntakingHandler}
                                                text="Approve Deserters"
                                                font="Outfit"
                                                textColor="black"
                                                textSize={1.25}
                                                textSpace={1}
                                                textWeight={700}
                                                bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                                                hoverBgColor="#15ad57"
                                                lineColor="#FFC748"
                                                lineSize={2}
                                                hoverLineColor="#FFC748"
                                                curve={3}
                                                height={70}
                                                width={229}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Invasion: desktop nft cards reusable (todo: refactor put to _layouts dir)
    const _invasionDesktopCard = useCallback(
        (header = null, type, nfts, attrib, btnText = null) => (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="header">
                            {header &&
                                (type === 'unstaked' ? (
                                    <>
                                        {header} <span> (UNSTAKED):</span>
                                    </>
                                ) : (
                                    <>
                                        {header} <span> (STAKED):</span>
                                    </>
                                ))}
                        </p>
                    </div>
                </div>

                {nfts.length < 1 ? (
                    <div className="row">
                        <div className="col-12 mix">
                            {type === 'unstaked' ? (
                                <div className="sub">
                                    <p>
                                        You don’t have any Goblins Reserve. Recruit more on{' '}
                                        <span>
                                            <a
                                                href="https://opensea.io"
                                                target="_blank"
                                                rel="noreferrer noopener"
                                            >
                                                Opensea
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <div className="sub">
                                    <p>
                                        You haven’t sent any Goblins to the invasion campaign yet.
                                    </p>
                                    <br />
                                    <br />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`row gx-3 mb-3 ${
                            allNftUserOwns.length < 5 && type === 'unstaked'
                                ? 'justify-content-center'
                                : ''
                        } ${
                            stakedNFTS.length < 5 && type === 'staked'
                                ? 'justify-content-center'
                                : ''
                        }`}
                    >
                        {nfts.length > 0 &&
                            nfts.map((nft) => (
                                <div key={nanoid(5)} className="col-auto _nft-cards">
                                    <div className="nft-img-wrap">
                                        <img src={nft.uri} alt="" />
                                    </div>
                                    <p className="yield">
                                        {attrib}: <span>1600</span>
                                    </p>

                                    {btnText && (
                                        <div className="nft-btn">
                                            <PBButton
                                                method={() =>
                                                    onSelectingNftHandler(nft.tokenId, type)
                                                }
                                                text={nft.selected ? 'Selected' : btnText}
                                                font="Outfit"
                                                textColor="black"
                                                textSize={1}
                                                textSpace={1}
                                                textWeight={700}
                                                bgColor={nft.selected ? 'gray' : '#FFC748'}
                                                hoverBgColor="#DEAD3F"
                                                lineColor="#FFC748"
                                                lineSize={2}
                                                hoverLineColor="#FFC748"
                                                curve={3}
                                                height={35}
                                                width={150}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        ),
        [allNftUserOwns, stakedNFTS]
    );

    // Invasion: mombile nft cards reusable (todo: refactor put to _layouts dir)
    const _invasionMobileCard = useCallback(
        (header = null, type, nfts, attrib, btnText = null) => (
            <div className="container cards-btm-margin">
                <div className="row">
                    <div className="col-12">
                        <p className="header">
                            {header &&
                                (type === 'unstaked' ? (
                                    <>
                                        {header} <span> (UNSTAKED):</span>
                                    </>
                                ) : (
                                    <>
                                        {header} <span> (STAKED):</span>
                                    </>
                                ))}
                        </p>
                    </div>
                </div>

                {nfts.length < 1 ? (
                    <div className="row">
                        <div className="col-12 mix">
                            {type === 'unstaked' ? (
                                <div className="sub">
                                    <p>
                                        You don’t have any Goblins Reserve. Recruit more on{' '}
                                        <span>
                                            <a
                                                href="https://opensea.io"
                                                target="_blank"
                                                rel="noreferrer noopener"
                                            >
                                                Opensea
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <div className="sub">
                                    <p>
                                        You haven’t sent any Goblins to the invasion campaign yet.
                                    </p>
                                    <br />
                                    <br />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <Swiper
                            {...sliderSettings}
                            loopedSlide={nfts.length}
                            modules={[Pagination]}
                            className={`sg-swipe-${type}-${activeSubTab}`}
                        >
                            {nfts.length > 0 &&
                                nfts.map((nft) => (
                                    <SwiperSlide key={nanoid(5)}>
                                        <div className="col-auto _nft-cards">
                                            <div className="nft-img-wrap">
                                                <img src={nft.uri} alt="" />
                                            </div>
                                            <p className="yield">
                                                {attrib}: <span>1600</span>
                                            </p>

                                            {btnText && (
                                                <div className="nft-btn">
                                                    <PBButton
                                                        method={() =>
                                                            onSelectingNftHandler(nft.tokenId, type)
                                                        }
                                                        text={nft.selected ? 'Selected' : btnText}
                                                        font="Outfit"
                                                        textColor="black"
                                                        textSize={1}
                                                        textSpace={1}
                                                        textWeight={700}
                                                        bgColor={nft.selected ? 'gray' : '#FFC748'}
                                                        hoverBgColor="#DEAD3F"
                                                        lineColor="#FFC748"
                                                        lineSize={2}
                                                        hoverLineColor="#FFC748"
                                                        curve={3}
                                                        height={35}
                                                        width={150}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                )}
            </div>
        ),
        [Swiper, sliderSettings, Pagination, allNftUserOwns, stakedNFTS, activeSubTab, activeTab]
    );

    // Invasion: Main screen -> if no NFTs
    const invasionNoNft = () => (
        <div className="_no-nfts">
            <p className="main d-none d-lg-block">
                STAKE YOUR GOBLINS AND JOIN THE <span> GOBLINVERSE INVASION.</span>
            </p>
            <p className="main d-block d-lg-none">
                Stake your Goblins and join the <span> Goblinverse Invasaion.</span>
            </p>
            <div className="sub">
                <p>
                    <span>Goblins Reserve (Unstaked):</span> You don’t have any Goblins Reserve.
                    Recruit more on{' '}
                    <span>
                        <a href="https://opensea.io" target="_blank" rel="noreferrer noopener">
                            Opensea
                        </a>
                    </span>
                </p>
                <p>
                    <span>Goblins Invaders (Staked):</span> You haven’t sent any Goblins to the
                    invasion campaign yet.
                </p>
            </div>

            <div className="btns-wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-6 stake">
                            <PBButton
                                text="Stake"
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
                                width={144}
                            />
                        </div>
                        <div className="col-12 col-lg-6 unstake">
                            <PBButton
                                text="Unstake"
                                font="Outfit"
                                textColor="black"
                                textSpace={1}
                                textWeight={700}
                                bgColor="linear-gradient(84.07deg, #C50000 16.64%, #FF0808 93.78%)"
                                hoverBgColor="#B10000"
                                lineColor="#FFC748"
                                lineSize={2}
                                hoverLineColor="#FFC748"
                                curve={3}
                                height={70}
                                width={144}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Invasion: Main screen -> has NFT(s)
    const invasionHasNft = () => (
        <div className="_has-nfts">
            {isLarge ? (
                <>
                    {_invasionDesktopCard('GOBLIN RESERVE', 'unstaked', allNftUserOwns, 'Power')}
                    {_invasionDesktopCard('GOBLIN INVADERS', 'staked', stakedNFTS, 'Yield')}
                </>
            ) : (
                <>
                    {_invasionMobileCard('GOBLIN RESERVE', 'unstaked', allNftUserOwns, 'Power')}
                    {_invasionMobileCard('GOBLIN INVADERS', 'staked', stakedNFTS, 'Yield')}
                </>
            )}
        </div>
    );

    // Invasion: Unstaked screen, NFTs that are not staked
    const invasionUnstakedUI = () => (
        <div className="_has-nfts">
            <div className="arrow-back" onClick={() => setActiveSubTab('')}>
                <img src={backArrow} alt="" />
            </div>
            <p className="sub-tab-title">Goblins Reserve</p>
            {isLarge
                ? _invasionDesktopCard(null, 'unstaked', allNftUserOwns, 'Power', 'Stake')
                : _invasionMobileCard(null, 'unstaked', allNftUserOwns, 'Power', 'Stake')}
        </div>
    );

    // Invasion: Staked screen, NFT(s) that are already staked
    const invasionStakedUI = () => (
        <div className="_has-nfts">
            <div className="arrow-back" onClick={() => setActiveSubTab('')}>
                <img src={backArrow} alt="" />
            </div>
            <p className="sub-tab-title">Goblins Reserve</p>
            {isLarge
                ? _invasionDesktopCard(null, 'staked', stakedNFTS, 'Yield', 'Unstake')
                : _invasionMobileCard(null, 'staked', stakedNFTS, 'Yield', 'Unstake')}
        </div>
    );

    // This is the controller for the tabs: Invasion, Vault, etc...
    const whichTab = () => {
        if (activeTab === 'invasion') {
            if (activeSubTab === 'stake' && allNftUserOwns.length > 0) {
                return _invasionWrap(invasionUnstakedUI());
            }

            if (activeSubTab === 'unstake' && stakedNFTS.length > 0) {
                return _invasionWrap(invasionStakedUI());
            }

            if (allNftUserOwns.length < 1 && stakedNFTS < 1) {
                return _invasionWrap(invasionNoNft());
            }
            if (allNftUserOwns.length > 0 || stakedNFTS.length > 0) {
                return _invasionWrap(invasionHasNft());
            }
        }

        if (activeTab === 'vault') {
            return (
                <>
                    {vault(
                        'GAME BALANCE',
                        `In-Game ${TOKEN_SYMOBL} available to withdraw`,
                        inGameBal,
                        'Withdraw to erc-20',
                        onWithdrawInGame
                    )}
                    {vault(
                        'ERC-20 BALANCE',
                        `ERC-20 ${TOKEN_SYMOBL} available to deposit`,
                        ercBal,
                        'Deposit to game',
                        onDepositERC
                    )}
                </>
            );
        }

        if (activeTab === 'stats') {
            return hqStatsMobile();
        }

        if (activeTab === 'htp') {
            return <>{howToPlay()}</>;
        }
    };

    // Main >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return (
        <>
            <Helmet>
                <title>Sneaky Goblins | Staking</title>
            </Helmet>
            <div className="_staking-body">
                <div className="main-bg">
                    <img className={isLarge ? 'large' : ''} src={whichBg()} alt="" />
                </div>

                <div className="_rest">
                    {isConnected && isLarge && hqStats()}

                    {secondaryNav()}

                    {!isConnected && notConnectedSection()}

                    {isConnected && (
                        <div
                            className={`_tabs ${
                                activeTab === 'htp' || activeTab === 'invasion' ? 'notvault' : ''
                            }`}
                        >
                            <div className="container">
                                <div className="row">{whichTab()}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="_body-overlay" />
            </div>
        </>
    );
};

export default Staking;