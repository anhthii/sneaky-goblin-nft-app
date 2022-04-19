import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Helmet } from 'react-helmet-async';

// Utils
import axios from 'axios';
import { EthersContext, MsgNetContext } from '../../../store/all-context-interface';
import { getAllLocalEnv, floatFixer } from '../../../helpers/dev/general-helpers';

// Contract related
import MintingRouter from '../../../data/abis/MintingRouter.json';
import NFT from '../../../data/abis/NFT.json';
import WHITELIST_SIGNATURES from '../../../data/whitelists/ROUND-1-WHITELIST.json';

// Components
import PBButton from '../../ui/PBButton/PBButton';
import Floater from '../../ui/Floater/Floater';

// Styles & Assets
import './Minting.scss';
import sgNftBg from '../../../assets/imgs/sg-bg-nfts.svg';
import sgNftMobBg from '../../../assets/imgs/sg-mob-bg.svg';
import sgLogoBg from '../../../assets/imgs/sg-bg-logo.svg';

const SALE_TYPE = {
    WHITELIST: 0,
    PUBLIC: 1,
};

const Mintng = () => {
    const localEnv = getAllLocalEnv();
    const { ethers, address, provider, chainId, signer, isConnected, ethersProvider } =
        useContext(EthersContext);
    const { setMsg } = useContext(MsgNetContext);
    const infuraProvider = new ethers.providers.InfuraProvider(
        localEnv.chainName.toLowerCase(),
        localEnv.infuraId
    );
    const mintingContract = new ethers.Contract(
        localEnv.mintingContract,
        MintingRouter.abi,
        infuraProvider
    );

    const nftContract = new ethers.Contract(localEnv.nftContract, NFT.abi, infuraProvider);
    // Responsive width
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 992px)' });

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // UI states
    const [defValueUI, setdefValueUI] = useState(1);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [totalAmountToPayUI, setTotalAmountToPayUI] = useState(0);
    // Minting states
    const [realDefValue, setRealDefValue] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [pricePerMint, setPricePerMint] = useState('0');
    const [allowedBuyCount, setAllowedBuyCount] = useState(0);
    const [isMintingActive, setMintingActive] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [currentSaleType, setCurrentSaleType] = useState(null);
    const [maxPerMint, setMaxPerMint] = useState(0);
    const [limitPerWallet, setLimitPerWallet] = useState(0);
    const [tokensLeft, setTokensLeft] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);
    const [tokenStatusMsg, setTokenStatusMsg] = useState('');
    const [currentSaleStatusMsg, setCurrentSaleStatusMsg] = useState('');
    const [retrigger, setRetrigger] = useState(false);
    const [saleDetailsSetFlag, setSaleDetailsSetFlag] = useState(false);
    // Contract states
    const [nftContractSigner, setNftContractSigner] = useState(null);
    const [mintingContractSigner, setMintingContractSigner] = useState(null);
    // Modal states
    const [showModal, setShowModal] = useState(false);

    const getMaxSupply = async () => {
        const tokens = await nftContract.MAX_SUPPLY();
        setMaxSupply(+tokens);
    };

    const getTotalSupply = async () => {
        const tokens = await nftContract.totalSupply();
        setTotalSupply(+tokens);

        if (+tokens === maxSupply) {
            setMintingActive(false);
            setTokenStatusMsg('Sold out!');
        }
    };

    const getTokensLeft = async () => {
        const tokens = await mintingContract.tokensLeft();
        setTokensLeft(+tokens);

        if (+tokens === 0) {
            setMintingActive(false);
            setTokenStatusMsg('Sale round sold out!');
        }
    };

    // Effects >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        // Setting sale round details
        mintingContract.saleRound().then((data) => {
            if (!saleDetailsSetFlag) {
                setSaleDetailsSetFlag(true);
                const { price, enabled, saleType, maxAmountPerMint, limitAmountPerWallet } = data;

                if (!enabled) {
                    setMintingActive(false);
                    setCurrentSaleStatusMsg('NO ACTIVE SALE');
                    return;
                }

                const priceInEther = ethers.utils.formatEther(price);
                setTotalAmountToPayUI(priceInEther);
                setPricePerMint(price);
                setUnitPrice(price);
                setCurrentSaleType(saleType);
                setMaxPerMint(
                    saleType === SALE_TYPE.WHITELIST ? +limitAmountPerWallet : +maxAmountPerMint
                );
                setLimitPerWallet(+limitAmountPerWallet);
                if (saleType === SALE_TYPE.WHITELIST) setCurrentSaleStatusMsg('PRE-SALE');
                if (saleType === SALE_TYPE.PUBLIC) setCurrentSaleStatusMsg('PUBLIC SALE');
            }
        });

        getMaxSupply();
        getTotalSupply();
        getTokensLeft();
    }, []);

    useEffect(() => {
        if (isConnected) {
            // Make sure user use the right network to avoid contract errors
            if (`${chainId}` === localEnv.chainDec) {
                (async () => {
                    // NFT Contract
                    const _nftContractSigner = new ethers.Contract(
                        localEnv.nftContract,
                        NFT.abi,
                        signer
                    );
                    setNftContractSigner(_nftContractSigner);

                    // Minting Contract
                    const _mintingContractSigner = new ethers.Contract(
                        localEnv.mintingContract,
                        MintingRouter.abi,
                        signer
                    );
                    setMintingContractSigner(_mintingContractSigner);

                    // Get the sale round data
                    const {
                        price,
                        enabled,
                        saleType,
                        totalAmount,
                        maxAmountPerMint,
                        limitAmountPerWallet,
                    } = await _mintingContractSigner.saleRound();

                    if (!enabled) {
                        setMintingActive(false);
                        setCurrentSaleStatusMsg('NO ACTIVE SALE');
                        return;
                    }
                    // If enabled
                    setMintingActive(true);
                    const priceInEther = ethers.utils.formatEther(price);
                    setTotalAmountToPayUI(priceInEther);
                    setPricePerMint(ethers.utils.parseEther(priceInEther));
                    setUnitPrice(price);
                    setCurrentSaleType(saleType);
                    setMaxPerMint(
                        saleType === SALE_TYPE.WHITELIST
                            ? limitAmountPerWallet.toNumber()
                            : maxAmountPerMint.toNumber()
                    );
                    setLimitPerWallet(limitAmountPerWallet.toNumber());

                    // Check how many tokens are left for current sale
                    const _tokensLeft = (await _mintingContractSigner.tokensLeft()).toNumber();
                    setTokensLeft(_tokensLeft);
                    if (_tokensLeft === 0) {
                        setMintingActive(false);
                        setTokenStatusMsg('Sold out!');
                    }

                    // Set the number of tokens that a user can buy.
                    let _numAllowedTokens = await _mintingContractSigner.allowedTokenCount(address);

                    // Dirty workaround to avoid max uin256 coming in and overvflowing JS Number.
                    const maxInt = ethers.BigNumber.from((Number.MAX_SAFE_INTEGER - 1).toString());
                    // console.log(Number.MAX_SAFE_INTEGER.toString(), maxInt);
                    if (_numAllowedTokens.gte(maxInt)) {
                        _numAllowedTokens = maxInt.toNumber();
                    }

                    setAllowedBuyCount(_numAllowedTokens);
                    if (_numAllowedTokens === 0) {
                        setMintingActive(false);
                        setTokenStatusMsg('You cannot buy more tokens.');
                    }

                    // Sale status
                    if (saleType === SALE_TYPE.WHITELIST) setCurrentSaleStatusMsg('PRE-SALE');
                    if (saleType === SALE_TYPE.PUBLIC) setCurrentSaleStatusMsg('PUBLIC SALE');
                })();
            } else {
                ethersProvider.disconnect();
                setMsg(`Disconnected. Please connect to ${localEnv.chainName} first!`, 'warning');
                // setTotalAmountToPayUI(0);
                // setTokensLeft(0);
                // setdefValueUI(1);
                // setMaxPerMint(0);
            }
        }
    }, [isConnected, chainId, retrigger]);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const onChangeInputHandler = (e) => {
        e.preventDefault();
        setHasError(false);

        if (!isConnected) {
            setHasError(true);
            setErrorMsg('Please connect your wallet!');
            setShowModal(true);
            return;
        }

        const _newValue = e.target.value;

        if (_newValue === '' || _newValue < 1) {
            setRealDefValue(0);
            setdefValueUI(_newValue === '' ? '' : 0);
            setTotalAmountToPayUI(ethers.utils.formatEther(unitPrice));
            return;
        }

        const _finalNewValue = Number(_newValue);
        const _toPay = ethers.utils.formatEther(unitPrice.mul(_finalNewValue));
        const _toPayExceed = ethers.utils.formatEther(unitPrice.mul(allowedBuyCount));

        if (_finalNewValue > allowedBuyCount) {
            setRealDefValue(allowedBuyCount);
            setdefValueUI(allowedBuyCount);
            setTotalAmountToPayUI(_toPayExceed);
            setHasError(true);
            setErrorMsg(`Your remaining maximum allowed count is: ${allowedBuyCount}`);
            setShowModal(true);
            return;
        }

        if (_finalNewValue > 0) {
            setRealDefValue(_finalNewValue);
            setdefValueUI(_finalNewValue);
            setTotalAmountToPayUI(_toPay);
        }
    };

    /**
     * USE THIS IN CASE OF DDOS ATTACK ON WHITELIST API
     * 1. Uncomment the function.
     * 2. Comment the getWhitelistSigHandler that gets signature from API.
     * 3. MAKE SURE TO ADD THE CORRECT WHITELIST FILE TO '../../../data/whitelists/ROUND-1-WHITELIST.json'
     ***/
    // const getWhitelistSigHandler = async (address) => {
    //     address = ethers.utils.getAddress(address);
    //     return WHITELIST_SIGNATURES[address] || null;
    // };

    const getWhitelistSigHandler = async (address) => {
        try {
            const res = await axios.get(`${localEnv.whitelistApiUrl}/get/${address}`);
            return res.data.sig || null;
        } catch (error) {
            console.error(error);
        }
    };

    const isWhiteListRound = () => {
        return typeof currentSaleType === 'number' && currentSaleType === SALE_TYPE.WHITELIST;
    };

    const onClickMintHandler = async () => {
        setHasError(false);

        if (!isConnected) {
            setHasError(true);
            setErrorMsg('Please connect your wallet!');
            setShowModal(true);
            return;
        }

        if (realDefValue < 1) {
            setHasError(true);
            setErrorMsg('Minimum is 1');
            setShowModal(true);
            return;
        }

        // Check balance
        const balance = await getBalance();
        const toPay = unitPrice.mul(realDefValue);

        if (balance.lt(toPay)) {
            setHasError(true);
            setErrorMsg('Insufficient balance!');
            setShowModal(true);
            return;
        }

        try {
            let receipt;
            if (isWhiteListRound()) {
                const sig = await getWhitelistSigHandler(address);
                if (sig === null) {
                    setHasError(true);
                    setErrorMsg('Your wallet address is not whitelisted!');
                    setShowModal(true);
                    return;
                }

                const transaction = await mintingContractSigner.whitelistMint(
                    address,
                    realDefValue,
                    sig,
                    {
                        value: pricePerMint.mul(realDefValue),
                    }
                );
                setIsMinting(true);
                receipt = await transaction.wait();
            } else {
                const transaction = await mintingContractSigner.publicMint(address, realDefValue, {
                    value: pricePerMint.mul(realDefValue),
                });
                setIsMinting(true);
                receipt = await transaction.wait();
            }

            if (receipt) {
                setHasError(true);
                setIsMinting(false);
                setErrorMsg('🎉 Successfully minted!');
                setMsg(
                    `Successfully minted ${realDefValue} ${
                        realDefValue === 1 ? 'token' : 'tokens'
                    }`,
                    'success'
                );
                setdefValueUI(1);
                setRetrigger(!retrigger);
                await getMaxSupply();
                await getTotalSupply();
                await getTokensLeft();
            }
        } catch (e) {
            let _errMsg = 'Some errors were logged!';
            const errorReceived = e.data?.message || e.message;
            if (errorReceived.toLowerCase().includes('user denied transaction')) return;
            if (errorReceived.toLowerCase().includes('active sale round is not a public round')) {
                _errMsg = 'Public sale is not yet opened!';
            }
            if (errorReceived.toLowerCase().includes('quantity exceeded max amount per mint')) {
                _errMsg = 'Quantity exceeded max amount per mint';
            }
            if (errorReceived.toLowerCase().includes('max amount was reached for this sale')) {
                _errMsg = 'Already sold out!';
            }
            if (errorReceived.toLowerCase().includes('sale round was disabled or closed')) {
                _errMsg = 'No available sale!';
            }
            if (errorReceived.toLowerCase().includes('max minted per address reached')) {
                _errMsg = 'Sale limit already reached!';
            }
            setIsMinting(false);
            setHasError(true);
            setErrorMsg(_errMsg);
            setShowModal(true);
            console.log('error here: ', e);
        }
    };

    const getBalance = async () => {
        const balance = await provider.getBalance(address);
        return balance;
    };

    return (
        <>
            <Helmet>
                <title>Sneaky Goblins | Minting</title>
            </Helmet>
            <div className="_minting-body container-fluid">
                <div className="row">
                    <div className="container">
                        <div className="row">
                            <div className="col mx-auto">
                                <div className="sg-text-bg-logo-wrap">
                                    {!isTabletOrMobile && <img src={sgLogoBg} alt="" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">
                            <div className="col mx-auto">
                                <div className="sg-nft-bg-wrap">
                                    {isTabletOrMobile ? (
                                        <img src={sgNftMobBg} alt="" />
                                    ) : (
                                        <img src={sgNftBg} alt="" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">
                            <div className="mint-box-wrapper">
                                <div className="row">
                                    <div className="col-8">
                                        <p className="mint-box-title">SNEAKY GOBLINS</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="mint-box-remaining-data">
                                            {maxSupply - totalSupply}/{maxSupply}
                                        </p>
                                        <p className="mint-box-sub-remaining d-md-block d-lg-none">
                                            REMAINING
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="mint-box-sub-sale">
                                            {isConnected
                                                ? currentSaleStatusMsg
                                                : 'PLEASE CONNECT WALLET'}
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <p className="mint-box-sub-remaining d-none d-lg-block">
                                            REMAINING
                                        </p>
                                    </div>
                                </div>
                                <br />
                                <div className="row g-0 mob-spec">
                                    <div className="col-6 col-sm-6 col-md-7">
                                        <input
                                            onChange={onChangeInputHandler}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={defValueUI}
                                        />
                                    </div>
                                    <div className="col-2">
                                        <div className="input-max">
                                            <span>{maxPerMint} MAX</span>
                                        </div>
                                    </div>
                                    <div className="col-4 col-sm-4 col-md-3">
                                        <div className="input-eth">
                                            <span>{totalAmountToPayUI} ETH</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mint-button-wrapper">
                                        <PBButton
                                            method={onClickMintHandler}
                                            text={isMinting ? 'MINTING' : 'MINT'}
                                            textColor="black"
                                            textSpace={1}
                                            textWeight={700}
                                            bgColor="linear-gradient(84.07deg, #00C555 16.64%, #00E75E 93.78%)"
                                            hoverBgColor="#15ad57"
                                            lineColor="#FFC748"
                                            hoverLineColor="#FFC748"
                                            curve={3}
                                            lineSize={2}
                                            height={70}
                                        />
                                    </div>
                                    <p
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            marginTop: '8px',
                                        }}
                                    >
                                        Stake your Goblin(s) in the Goblinverse after minting.{' '}
                                        <Link
                                            to="/invasion"
                                            style={{
                                                color: '#00e55d',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            [Enter]
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="OverlayTopFade" />
                <div id="OverlayMiddleFade" />
                <div id="OverlayBottomFade" />

                <br />
                <br />
                <br />
                <br />
                <br />

                {showModal && (
                    <Floater
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        width={50}
                        cn="_mint"
                    >
                        <div className="container-fluid">
                            <div className="minting-modal-error-wrap">
                                <h4>ERROR</h4>
                                <p>{errorMsg}</p>
                            </div>
                        </div>
                    </Floater>
                )}
            </div>
        </>
    );
};

export default Mintng;
