import React, { useEffect, useCallback, useContext, useState, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { nanoid } from 'nanoid';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Helmet } from 'react-helmet-async';

// Components
import axios from 'axios';
import PBButton from '../../ui/PBButton/PBButton';
import Connector from '../../core/Connector/Connector';
import Floater from '../../ui/Floater/Floater';
import VaultForm from './VaultForm';
import Loader from '../../ui/Loader';

// Layouts
import HowToPlay from '../_layouts/HowToPlay/HowToPlay';

// Utils
import { getAllLocalEnv, floatFixer } from '../../../helpers/dev/general-helpers';
import { EthersContext, MsgNetContext } from '../../../store/all-context-interface';

// Styles & Assets
import stakingBg from '../../../assets/imgs/staking-bg.jpg';
import stakingBgMob15 from '../../../assets/imgs/staking-bg-mob-x1.5.jpg';
import stakingBgMobPlus2 from '../../../assets/imgs/staking-bg-mob-x2.jpg';
import backArrow from '../../../assets/imgs/back-arrow-green.svg';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import './Staking.scss';

// ABIs
import NFT from '../../../data/abis/NFT.json';
import NFTStaking from '../../../data/abis/NFTStaking.json';
import Token from '../../../data/abis/Token.json';

// Constant
const TOKEN_SYMOBL = '$xSERUM';

const Staking = () => {
    const magicContractType = 0; // Signifies it's the contract of the first nft collection
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
    // UI States -----------
    const [activeTab, setActiveTab] = useState('');
    const [activeSubTab, setActiveSubTab] = useState('');
    const [withdrawModal, setWithdrawModal] = useState({ show: false, amount: null });
    const [inGameBal, setInGameBal] = useState('0');
    const [ercBal, setErcBal] = useState('0');
    const [dailyYield, setDailyYield] = useState('0');
    const totalBalance = useMemo(() => floatFixer(+ercBal + +inGameBal, 4), [ercBal, inGameBal]);
    // Staking States ------
    const [stakedPercentage, setStakedPercentage] = useState('n/a');
    const [selectedNFT, setSelectedNFT] = useState([]);
    const [stakingProcessStarted, setStakingProcessStarted] = useState(false);
    const [isStakingActive, setIsStakingActive] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isUpdatingData, setIsUpdatingData] = useState(false);
    // const [stakedNFTS, setStakedNFTS] = useState([]);
    // NFT States ----------
    const [isRevealed, setIsRevealed] = useState(false);
    const [baseURI, setBaseURI] = useState('');
    const [unrevealedData, setUnrevealedData] = useState(null);
    // Contract States -----
    const [nftContractSigner, setNftContractSigner] = useState(null);
    const [stakingContractSigner, setStakingContractSigner] = useState(null);
    const [tokenContractSigner, setTokenContractSigner] = useState(null);
    // Loaders
    const [loadingUserNFTs, setLoadingUserNFTs] = useState(true);
    const [loadingStakedTokens, setLoadingStakedTokens] = useState(true);
    // Buttons
    const [withdrawBtnDisabled, setWithdrawBtnDisabled] = useState(false);
    const [withdrawBtnText, setWithdrawBtnText] = useState('Withdraw to ERC-20');
    const [depositBtnDisabled, setDepositBtnDisabled] = useState(false);
    const [depositBtnText, setDepositBtnText] = useState('Deposit to game');
    const [stakingBtnDisabled, setStakingBtnDisabled] = useState(false);
    const [stakingBtnText, setStakingBtnText] = useState('Approve Invaders');
    const [unstakingBtnDisabled, setUnstakingBtnDisabled] = useState(false);
    const [unstakingBtnText, setUnstakingBtnText] = useState('Approve Deserters');

    // DUMMY DATA, SHOULD BE DELETED
    // uncomment allNftUserOwns and stakedNFTS above after you delete these 2
    const [allNftUserOwns, setAllNftUserOwn] = useState([]);
    const [stakedNFTS, setStakedNFTS] = useState([]);

    // Helpers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const getInGameBal = async (_tokenContractSigner = tokenContractSigner) => {
        const _inGameBal = await _tokenContractSigner.getUserBalance(address);
        const formattedInGameBal = floatFixer(ethers.utils.formatEther(_inGameBal), 4);
        setInGameBal(formattedInGameBal);
    };

    const getErcBal = async (_tokenContractSigner = tokenContractSigner) => {
        const _ercBal = await _tokenContractSigner.balanceOf(address);
        const formattedErcBal = floatFixer(ethers.utils.formatEther(_ercBal), 4);
        setErcBal(formattedErcBal);
    };

    const getDailyYield = async (_stakingContractSigner = stakingContractSigner) => {
        const currentYield = await _stakingContractSigner.getCurrentYield(address);
        const formattedCurrentYield = ethers.utils.formatEther(currentYield);
        setDailyYield(formattedCurrentYield);
    };

    const getAllUserNFT = async (
        _nftContractSigner = nftContractSigner,
        _isRevealed = isRevealed,
        _baseURI = baseURI,
        _unrevealedData = unrevealedData
    ) => {
        setLoadingUserNFTs(true);
        try {
            const _nftBalance = +(await _nftContractSigner.balanceOf(address));
            if (_nftBalance <= 0) return setAllNftUserOwn([]);

            const idsPromises = [...Array(_nftBalance).keys()].map((index) =>
                _nftContractSigner.tokenOfOwnerByIndex(address, index)
            );
            const tokenIds = await Promise.all(idsPromises);

            if (!_isRevealed) {
                const data = tokenIds.map((id) => ({
                    customId: nanoid(5),
                    id,
                    uri: _baseURI,
                    data: _unrevealedData,
                    stakeStatus: false,
                    stakedData: null,
                }));

                setLoadingUserNFTs(false);
                setAllNftUserOwn(data);
                return;
            }

            const uri = _baseURI.substring(0, _baseURI.lastIndexOf('/'));

            const tokenURIs = [];

            const dataPromises = tokenIds.map((id) => {
                const tokenURI = `${uri}/${id}`;
                tokenURIs.push(tokenURI);
                return axios.get(tokenURI);
            });

            const results = await Promise.all(dataPromises);

            const _allNftUserOwns = results.map(({ data }, idx) => ({
                customId: nanoid(5),
                id: tokenIds[idx],
                uri: tokenURIs[idx],
                data,
                stakeStatus: false,
                stakedData: null,
            }));
            setAllNftUserOwn(_allNftUserOwns);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingUserNFTs(false);
        }
    };

    const getStakedTokens = async (
        _stakingContractSigner = stakingContractSigner,
        _nftContractSigner = nftContractSigner,
        _isRevealed = isRevealed,
        _baseURI = baseURI,
        _unrevealedData = unrevealedData
    ) => {
        setLoadingStakedTokens(true);
        try {
            const _stakedNFTS = await _stakingContractSigner.getStakerTokens(
                magicContractType,
                address
            );
            if (_stakedNFTS.length <= 0) {
                // if (isInitialProcessDone) {
                //     setStakingProcessStarted(false);
                //     setIsUpdatingData(false);
                // }
                setStakedNFTS([]);
                return;
            }

            if (!_isRevealed) {
                const data = _stakedNFTS.map((id) => ({
                    customId: nanoid(5),
                    id,
                    uri: _baseURI,
                    data: _unrevealedData,
                    stakeStatus: true,
                    stakedData: null,
                }));

                setStakingProcessStarted(false);
                setLoadingStakedTokens(false);
                setStakedNFTS(data);
                return;
            }

            const idsPromises = _stakedNFTS.map((id) => _nftContractSigner.tokenURI(id));

            const tokenURIs = await Promise.all(idsPromises);

            const dataPromises = tokenURIs.map((tokenURI) =>
                tokenURI.includes('...') ? null : axios.get(tokenURI)
            );

            const results = await Promise.all(dataPromises);

            const _userStakedNfts = results.map(({ data }, idx) => ({
                customId: nanoid(5),
                id: _stakedNFTS[idx],
                uri: tokenURIs[idx],
                data,
                stakeStatus: true,
                stakedData: null,
            }));

            setStakedNFTS(_userStakedNfts);

            // if (!isInitialProcessDone) setIsInitialProcessDone(true);
        } catch (e) {
            console.error('INITIAL:#1:', e);
        } finally {
            setStakingProcessStarted(false);
            setLoadingStakedTokens(false);
        }
    };

    const stakerHelper = async () => {
        setStakingBtnDisabled(true);
        setStakingBtnText('Confirm Transaction');
        setMsg('Please confirm - Staking your NFT(s).', 'success', 5000);

        try {
            const tx = await stakingContractSigner.deposit(magicContractType, selectedNFT);
            setIsUpdatingData(true);
            setStakingBtnText('Staking...');
            await tx.wait();
            setTimeout(async () => {
                setAllNftUserOwn([]);
                setStakedNFTS([]);
                setSelectedNFT([]);
                setActiveSubTab('');
                await getAllUserNFT();
                await getStakedTokens();
            }, 500);

            setMsg('All NFTs were staked!', 'success', 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setStakingProcessStarted(false);
            setStakingBtnDisabled(false);
            setStakingBtnText('Approve Invaders');
        }
    };
    const unstakerHelper = async () => {
        setUnstakingBtnDisabled(true);
        setUnstakingBtnText('Confirm Transaction');
        setMsg('Please confirm - Unstaking your NFT(s).', 'success', 5000);

        try {
            const tx = await stakingContractSigner.withdraw(magicContractType, selectedNFT);
            setIsUpdatingData(true);
            setUnstakingBtnText('Unstaking...');
            await tx.wait();
            setTimeout(async () => {
                setAllNftUserOwn([]);
                setStakedNFTS([]);
                setSelectedNFT([]);
                setActiveSubTab('');
                await getStakedTokens();
                await getAllUserNFT();
            }, 500);

            setMsg('All NFTs were unstaked!', 'success', 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setStakingProcessStarted(false);
            setUnstakingBtnDisabled(false);
            setUnstakingBtnText('Approve Deserters');
        }
    };

    const closeWithdrawModal = () => {
        setWithdrawModal({ show: false, amount: null });
    };

    // Effects >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        if (!isConnected) return;

        // Default active tab
        setActiveTab('invasion');

        // Make sure user use the right network to avoid contract errors
        if (`${chainId}` !== localEnv.chainDec) {
            ethersProvider.disconnect();
            setMsg(`Disconnected. Please connect to ${localEnv.chainName} first!`, 'warning');
            // Revert all other states here...
            return;
        }

        (async () => {
            const _stakingContractSigner = new ethers.Contract(
                localEnv.nftStakingContract,
                NFTStaking.abi,
                signer
            );

            const _tokenContractSigner = new ethers.Contract(
                localEnv.tokenContract,
                Token.abi,
                signer
            );

            const _nftContractSigner = new ethers.Contract(localEnv.nftContract, NFT.abi, signer);

            const _isRevealed = await _nftContractSigner.revealed();
            const _baseURI = await _nftContractSigner.tokenURI(0); // TODO: Replace with getBaseUrl

            let _unrevealedData = null;
            if (!_isRevealed) {
                _unrevealedData = await axios.get(_baseURI).then((res) => res.data);
                setUnrevealedData(_unrevealedData);
            }

            const _isStakingActive = await _stakingContractSigner.stakingLaunched();
            if (_isStakingActive) setIsStakingActive(true);

            const _nftTotalSupply = await _nftContractSigner.totalSupply();
            const _stakeContractBalance = await _nftContractSigner.balanceOf(
                _stakingContractSigner.address
            );
            setStakedPercentage(
                Math.round((_stakeContractBalance / _nftTotalSupply.toNumber()) * 100)
            );

            setStakingContractSigner(_stakingContractSigner);
            setTokenContractSigner(_tokenContractSigner);
            setNftContractSigner(_nftContractSigner);
            setIsRevealed(_isRevealed);
            setBaseURI(_baseURI);
            await getInGameBal(_tokenContractSigner);
            await getErcBal(_tokenContractSigner);
            await getAllUserNFT(_nftContractSigner, _isRevealed, _baseURI, _unrevealedData);
            await getStakedTokens(
                _stakingContractSigner,
                _nftContractSigner,
                _isRevealed,
                _baseURI,
                _unrevealedData
            );
            await getDailyYield(_stakingContractSigner);

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
    }, [isConnected, chainId]);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // This will set inline pages of Invasion tab
    const invasionButtonsHandler = (tab) => () => {
        if (allNftUserOwns.length < 1 && stakedNFTS.length < 1) {
            setMsg('There is no available NFT', 'warning');
            return;
        }
        if (tab === 'unstake' && stakedNFTS.length < 1) {
            setMsg('There is no NFT available to unstake', 'warning');
            return;
        }
        if (tab === 'stake' && allNftUserOwns.length < 1) {
            setMsg('There is no NFT available to stake', 'warning');
            return;
        }
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
        (tokenId, type) => {
            let _clone;
            if (type === 'unstaked') _clone = [...allNftUserOwns];
            if (type === 'staked') _clone = [...stakedNFTS];

            // Update the nft selected property
            const _nftToUpdateIndex = _clone.findIndex((nft) => nft.id === tokenId);
            _clone[_nftToUpdateIndex].selected = !_clone[_nftToUpdateIndex].selected;
            setAllNftUserOwn(_clone);
            // Update the selectedNFT array
            setSelectedNFT([]);
            // for some weird/unknown reason .filter() is not working
            _clone.forEach((nft) => {
                if (nft.selected) setSelectedNFT((prev) => [...prev, nft.id]);
            });
        },
        [selectedNFT, allNftUserOwns, stakedNFTS]
    );

    // Will handle staking of NFT(s)
    const onStakingHandler = async () => {
        if (!allNftUserOwns.length) return;

        if (selectedNFT.length < 1) {
            setMsg('Please choose an NFT to stake!', 'warning');
            return;
        }

        if (!isStakingActive) {
            setMsg('Staking is not launched yet!', 'warning');
            return;
        }

        // Can only stake not-yet-staked NFTs, so if some of the selected NFTs are already staked...
        let _someAreStaked = false;
        selectedNFT.forEach((_id) => {
            _someAreStaked = allNftUserOwns.some(
                ({ id, stakeStatus }) => _id === id && stakeStatus
            );
        });
        if (_someAreStaked) {
            setMsg('You can only stake unstaked NFT(s)', 'warning');
            return;
        }

        try {
            // Check first if user already approved the web app as operator
            const _isApproved = await nftContractSigner.isApprovedForAll(
                address,
                localEnv.nftStakingContract
            );
            if (!_isApproved) {
                setMsg(`Please approve and authorize first.`, 'info');
                setIsApproving(true);
                try {
                    const tx = await nftContractSigner.setApprovalForAll(
                        localEnv.nftStakingContract,
                        true
                    );
                    setStakingBtnDisabled(true);
                    setStakingBtnText('Approving...');
                    await tx.wait();
                } catch (e) {
                    setMsg(e.data?.message ?? e.message, 'warning');
                    setStakingBtnDisabled(false);
                    setStakingBtnText('Approve Invaders');
                } finally {
                    setIsApproving(false);
                }
            }

            setStakingProcessStarted(true);
            setSelectedNFT([]);
            await stakerHelper();
        } catch (error) {
            setMsg(error.message, 'warning');
        }
        // TODO: If NFTs are not approved, approve it first
        // TODO: Also, refetch latest updated data from contract
        // TODO: Don't forget to reset the selectedNFT array []
        // _temporaryRevertForUITest(allNftUserOwns);
    };

    // Will handle unstaking of NFT(s)
    const onUnstakingHandler = async () => {
        if (!stakedNFTS.length) return;

        if (selectedNFT.length < 1) {
            setMsg('Please choose an NFT to unstake!', 'warning');
            return;
        }

        if (!isStakingActive) {
            setMsg('Staking is not launched yet!', 'warning');
            return;
        }

        let _someAreNotStaked = false;
        selectedNFT.forEach((_id) => {
            _someAreNotStaked = stakedNFTS.some(
                ({ id, stakeStatus }) => _id === id && !stakeStatus
            );
        });
        if (_someAreNotStaked) {
            setMsg('You can only unstake staked NFT(s)', 'warning');
            return;
        }

        try {
            await unstakerHelper();
        } catch (e) {
            setMsg(e.data?.message ?? e.message, 'warning');
            console.error(e);
        }
    };

    // Import $xSERUM to MetaMask
    const importToMetamask = async () => {
        if (!isMetamaskInstalled) return;
        try {
            const confirm = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: localEnv.tokenContract,
                        symbol: TOKEN_SYMOBL, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: 18, // The number of decimals in the token
                        // image: localEnv.tokenImage, // A string url of the token logo
                    },
                },
            });

            if (confirm) {
                closeWithdrawModal();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handles withdrawal for erc20, converts in-game to erc
    const onWithdrawInGame = async (amount) => {
        setWithdrawBtnDisabled(true);
        setWithdrawBtnText('Confirm transaction...');
        const ercAmount = ethers.utils.parseEther(amount);
        try {
            const tx = await tokenContractSigner.withdrawToken(ercAmount);
            setWithdrawBtnText('Pending...');
            await tx.wait();
            setWithdrawBtnText('Updating balances...');
            setWithdrawModal({ show: true, amount });
            await getErcBal();
            await getInGameBal();
        } catch (e) {
            setMsg(e.data?.message ?? e.message, 'warning');
        } finally {
            setWithdrawBtnDisabled(false);
            setWithdrawBtnText('Withdraw to ERC-20');
        }
    };

    // Handles erc deposit
    const onDepositERC = async (amount) => {
        setDepositBtnDisabled(true);
        setDepositBtnText('Confirm transaction...');
        const ercAmount = ethers.utils.parseEther(amount);
        try {
            const tx = await tokenContractSigner.depositToken(ercAmount);
            setDepositBtnText('Pending...');
            await tx.wait();
            setDepositBtnText('Updating balances...');
            await getErcBal();
            await getInGameBal();
        } catch (e) {
            setMsg(e.data?.message ?? e.message, 'warning');
        } finally {
            setDepositBtnDisabled(false);
            setDepositBtnText('Deposit to game');
        }
    };

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
                            <div className="fade-line" />
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
                            <div className="fade-line" />
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
                                    {!isMetamaskInstalled && (
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
            <p className="sub">Supply Staked: {stakedPercentage}% of all Goblins</p>
            <div className="stats-wrap">{_hqStatsData()}</div>
        </div>
    );

    // Headquarter Stats: mobile
    const hqStatsMobile = () => (
        <div className="col-12">
            <div className="_hq-stats-mobile">
                <p className="title">HEADQUARTER STATS</p>
                <p className="sub">Supply Staked: {stakedPercentage}% of all Goblins</p>
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
                        Game Balance: <span>{floatFixer(inGameBal, 4)}</span>
                    </p>
                </li>
                <li>
                    <p>
                        ERC-20 Balance: <span>{floatFixer(ercBal, 4)}</span>
                    </p>
                </li>
                <li>
                    <p>
                        Total Balance: <span>{floatFixer(totalBalance, 4)}</span>
                    </p>
                </li>
                <li>
                    <p>
                        Daily Yield:{' '}
                        <span>
                            {dailyYield} {TOKEN_SYMOBL}
                        </span>
                    </p>
                </li>
            </ul>
        ),
        [TOKEN_SYMOBL, inGameBal, ercBal, dailyYield, totalBalance]
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

    // Invasion: main wrap
    const _invasionWrap = useCallback(
        (child) => {
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
                                                        method={invasionButtonsHandler('stake')}
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
                                                        method={invasionButtonsHandler('unstake')}
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
                                                    text={stakingBtnText}
                                                    disabled={stakingBtnDisabled}
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
                                                    method={onUnstakingHandler}
                                                    text={unstakingBtnText}
                                                    disabled={unstakingBtnDisabled}
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
        },
        [
            activeSubTab,
            allNftUserOwns,
            stakedNFTS,
            stakingBtnDisabled,
            stakingBtnText,
            unstakingBtnDisabled,
            unstakingBtnText,
        ]
    );

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
                                    {loadingStakedTokens ? (
                                        <div>
                                            <Loader />
                                        </div>
                                    ) : (
                                        <p>
                                            You don???t have any Goblins Reserve. Recruit more on{' '}
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
                                    )}
                                </div>
                            ) : (
                                <div className="sub">
                                    {loadingUserNFTs ? (
                                        <div>
                                            <Loader />
                                        </div>
                                    ) : (
                                        <p>
                                            You haven???t sent any Goblins to the invasion campaign
                                            yet.
                                        </p>
                                    )}
                                    <br />
                                    <br />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`row g-3 mb-3 ${
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
                                <div key={nft.customId} className="col-auto _nft-cards">
                                    <div className="nft-img-wrap">
                                        {isRevealed ? (
                                            <img src={nft.data?.image} alt={nft.data?.name} />
                                        ) : (
                                            <video controls={false} loop autoPlay muted playsInline>
                                                <source
                                                    src={nft.data?.animation_url}
                                                    type="video/mp4"
                                                />
                                                <img src={nft.data?.image} alt={nft.data?.name} />
                                            </video>
                                        )}
                                    </div>
                                    <p className="yield">
                                        <span>{nft.data?.name}</span>
                                    </p>
                                    {nft.data?.attributes?.map((attr) => {
                                        if (attr.trait_type === "Level") {
                                            return (<p className="yield" key={attr.trait_type}>
                                                {attr.trait_type}: <span>{attr.value}</span>
                                            </p>)
                                        }
                                    })}

                                    {btnText && (
                                        <div className="nft-btn">
                                            <PBButton
                                                method={() => onSelectingNftHandler(nft.id, type)}
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
                                        You don???t have any Goblins Reserve. Recruit more on{' '}
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
                                        You haven???t sent any Goblins to the invasion campaign yet.
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
                                    <SwiperSlide key={nft.customId}>
                                        <div className="col-auto _nft-cards">
                                            <div className="nft-img-wrap">
                                                {isRevealed ? (
                                                    <img
                                                        src={nft.data?.image}
                                                        alt={nft.data?.name}
                                                    />
                                                ) : (
                                                    <video
                                                        controls={false}
                                                        loop
                                                        autoPlay
                                                        muted
                                                        playsInline
                                                    >
                                                        <source
                                                            src={nft.data?.animation_url}
                                                            type="video/mp4"
                                                        />
                                                        <img
                                                            src={nft.data?.image}
                                                            alt={nft.data?.name}
                                                        />
                                                    </video>
                                                )}
                                            </div>
                                            <p className="yield">
                                                <span>{nft.data?.name}</span>
                                            </p>
                                            {nft.data?.attributes?.map((attr) => (
                                                <p className="yield" key={attr.trait_type}>
                                                    {attr.trait_type}: <span>{attr.value}</span>
                                                </p>
                                            ))}

                                            {btnText && (
                                                <div className="nft-btn">
                                                    <PBButton
                                                        method={() =>
                                                            onSelectingNftHandler(nft.id, type)
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
            {loadingUserNFTs && loadingStakedTokens ? (
                <Loader />
            ) : (
                <div className="sub">
                    {loadingStakedTokens ? (
                        <div>
                            <Loader />
                        </div>
                    ) : (
                        <p>
                            <span>Goblins Reserve (Unstaked):</span> You don???t have any Goblins
                            Reserve. Recruit more on{' '}
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
                    )}
                    {loadingUserNFTs ? (
                        <div>
                            <Loader />
                        </div>
                    ) : (
                        <p>
                            <span>Goblins Invaders (Staked):</span> You haven???t sent any Goblins to
                            the invasion campaign yet.
                        </p>
                    )}
                </div>
            )}

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
                                method={invasionButtonsHandler('stake')}
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
                                method={invasionButtonsHandler('unstake')}
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
                    <VaultForm
                        title="GAME BALANCE"
                        subtitle={`In-Game ${TOKEN_SYMOBL} available to withdraw (25% Tax)`}
                        balance={inGameBal}
                        btnText={withdrawBtnText}
                        method={onWithdrawInGame}
                        disabled={+inGameBal <= 0 || withdrawBtnDisabled}
                    />
                    <VaultForm
                        title="ERC-20 BALANCE"
                        subtitle={`ERC-20 ${TOKEN_SYMOBL} available to deposit`}
                        balance={ercBal}
                        btnText={depositBtnText}
                        method={onDepositERC}
                        disabled={+ercBal <= 0 || depositBtnDisabled}
                    />
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

                <Floater
                    show={withdrawModal.show}
                    onHide={closeWithdrawModal}
                    width={50}
                    cn="_mint"
                >
                    <div className="container-fluid">
                        <div className="withdrawn-modal-wrap">
                            <h4>Success</h4>

                            <p>
                                You have successfully withdrawn {withdrawModal.amount}{' '}
                                {TOKEN_SYMOBL}
                            </p>

                            <PBButton
                                text={`Import ${TOKEN_SYMOBL} to MetaMask`}
                                method={importToMetamask}
                                textSize={1}
                                textSpace={1}
                                font="Outfit"
                                textColor="black"
                                textWeight={700}
                                bgColor="#FFC748"
                                hoverBgColor="#DEAD3F"
                                lineColor="#FFC748"
                                lineSize={2}
                                hoverLineColor="#FFC748"
                                curve={3}
                            />
                        </div>
                    </div>
                </Floater>

                <div className="_body-overlay" />
            </div>
        </>
    );
};

export default Staking;
