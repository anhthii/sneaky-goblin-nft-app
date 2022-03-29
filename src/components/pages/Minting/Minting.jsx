import React, { useState, useContext, useEffect } from 'react';

// Utils
import { EthersContext } from '../../../store/all-context-interface';
import { getAllLocalEnv, floatFixer } from '../../../helpers/dev/general-helpers';

// Contract related
import MintingRouter from '../../../data/abis/MintingRouter.json';
import NFT from '../../../data/abis/NFT.json';
import WHITELIST_SIGNATURES from '../../../data/whitelists/ROUND-1-WHITELIST.json';

// Components
import PBButton from '../../ui/PBButton/PBButton';
import Floater from '../../ui/Floater/Floater';

// Styles & Assets
import sgNftBg from '../../../assets/imgs/sg-bg-nfts.svg';
import sgTextLogoBg from '../../../assets/imgs/sg-bg-logo.svg';
import './Minting.scss';

const SALE_TYPE = {
    WHITELIST: 0,
    PUBLIC: 1,
};

const Mintng = () => {
    const localEnv = getAllLocalEnv();
    const { ethers, address, provider, chainId, signer, isConnected } = useContext(EthersContext);

    // UI states
    const [defValue, setDefValue] = useState(1);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [unitPriceUI, setUnitPriceUI] = useState(0);
    // Minting states
    const [unitPrice, setUnitPrice] = useState(0);
    const [pricePerMint, setPricePerMint] = useState(ethers && ethers.utils.parseEther('0'));
    const [allowedBuyCount, setAllowedBuyCount] = useState(0);
    const [isMintingActive, setMintingActive] = useState(false);
    const [salesClosedMsg, setSalesClosedMsg] = useState('');
    const [saleType, setCurrentSaleType] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [maxPerMint, setMaxPerMint] = useState(0);
    // Contract states
    const [nftContractSigner, setNftContractSigner] = useState(null);
    const [mintingContractSigner, setMintingContractSigner] = useState(null);

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    useEffect(() => {
        if (isConnected) {
            setHasError(false);
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

                // Set prices.
                const { price, enabled, saleType, maxAmountPerMint } =
                    await _mintingContractSigner.saleRound();
                if (!enabled) {
                    setMintingActive(false);
                    setSalesClosedMsg('Sales closed.');
                    return;
                }
                setMintingActive(true);
                const priceInEther = ethers.utils.formatEther(price);

                setUnitPrice(price);
                setUnitPriceUI(floatFixer(priceInEther, 2));
                setPricePerMint(ethers.utils.parseEther(priceInEther));
                setCurrentSaleType(saleType);
                setMaxPerMint(maxAmountPerMint);

                // Check how many tokens are left for current sale
                const tokensLeft = (await _mintingContractSigner.tokensLeft()).toNumber();
                if (tokensLeft === 0) {
                    setMintingActive(false);
                    setSalesClosedMsg('SOLD OUT!');
                    return;
                }

                // Set the number of tokens that a user can buy.
                const numAllowedTokens = (
                    await _mintingContractSigner.allowedTokenCount(address)
                ).toNumber();
                setAllowedBuyCount(numAllowedTokens);

                if (numAllowedTokens === 0) {
                    setMintingActive(false);
                    setSalesClosedMsg('You cannot buy more tokens.');
                }
            })();
        }
        //  callApi();
    }, [isConnected]);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const onIncrementHandler = () => {
        setHasError(false);
        if (!isConnected) return;
        if (defValue + 1 > maxPerMint) {
            setHasError(true);
            setErrorMsg(`Quantity exceeds max amount per mint: ${maxPerMint}`);
            return;
        }

        const newValue = defValue + 1;

        if (newValue > allowedBuyCount) return;

        setDefValue(newValue);
    };

    const onDecrementHandler = () => {
        setHasError(false);
        if (!isConnected) return;

        let newValue = defValue - 1;

        if (newValue < 1) newValue = 1;

        setDefValue(newValue);
    };

    const displaySaleRoundText = () => {
        if (!isMintingActive) {
            return 'NO ACTIVE SALE';
        }

        if (saleType === SALE_TYPE.WHITELIST) {
            return 'PRE-SALE';
        }

        if (saleType === SALE_TYPE.PUBLIC) {
            return 'PUBLIC SALE';
        }
    };

    const getWhitelistSigHandler = (address) => {
        address = ethers.utils.getAddress(address);
        return WHITELIST_SIGNATURES[address] || null;
    };

    const isWhiteListRound = () => {
        return typeof saleType === 'number' && saleType === SALE_TYPE.WHITELIST;
    };

    const onClickMintHandler = async () => {
        console.log('check');
        setHasError(false);

        if (!isConnected) {
            setHasError(true);
            setErrorMsg('Please connect your wallet!');
            return;
        }

        // Check balance
        const balance = await getBalance();
        const toPay = unitPrice.mul(defValue);

        if (balance.lt(toPay)) {
            setHasError(true);
            setErrorMsg('Insufficient balance!');
            return;
        }

        try {
            let receipt;
            if (isWhiteListRound()) {
                const sig = getWhitelistSigHandler(address);
                if (sig === null) {
                    setHasError(true);
                    setErrorMsg('your wallet address is not whitelisted!');
                    return;
                }

                const transaction = await mintingContractSigner.whitelistMint(
                    address,
                    defValue,
                    sig,
                    {
                        value: pricePerMint.mul(defValue),
                    }
                );
                setIsMinting(true);
                receipt = await transaction.wait();
            } else {
                const transaction = await mintingContractSigner.publicMint(address, defValue, {
                    value: pricePerMint.mul(defValue),
                });
                setIsMinting(true);
                receipt = await transaction.wait();
            }

            if (receipt) {
                setHasError(true);
                setIsMinting(false);
                setErrorMsg('🎉 Successfully minted!');
            }
        } catch (e) {
            let _errMsg = 'Some errors were logged!';
            const errorReceived = e.data?.message || e.message;
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
            console.log('error here: ', e);
        }
    };

    const getBalance = async () => {
        const balance = await provider.getBalance(address);
        return balance;
    };

    return (
        <div className="_minting container-fluid">
            <div className="row">
                <div className="container">
                    <div className="row">
                        {/*<div className="col mx-auto">*/}
                        {/*    <p id="SGLogo">SneakyGoblins</p>*/}
                        {/*</div>*/}
                        <div className="col mx-auto">
                            <div className="sg-text-bg-logo-wrapper">
                                <img src={sgTextLogoBg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col mx-auto">
                            <div className="sg-nft-bg-wrapper">
                                <img src={sgNftBg} alt="" />
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
                                    <p className="mint-box-remaining-data">0/0000</p>
                                    <p className="mint-box-sub-remaining d-md-block d-lg-none">
                                        REMAINING
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <p className="mint-box-sub-sale">
                                        {isConnected
                                            ? displaySaleRoundText()
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
                            <div className="row g-0">
                                <div className="col-7">
                                    <input type="number" placeholder="1" value={defValue} />
                                </div>
                                <div className="col-2">
                                    <div className="input-max">
                                        <span>{maxPerMint} MAX</span>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="input-eth">
                                        <span>
                                            {unitPrice
                                                ? ethers.utils.formatEther(unitPrice.mul(defValue))
                                                : 0}{' '}
                                            ETH
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mint-button-wrapper">
                                    <PBButton
                                        method={onClickMintHandler}
                                        text="MINT"
                                        textColor="black"
                                        textSpace={1}
                                        textWeight={700}
                                        bgColor="#00C555"
                                        hoverBgColor="#15ad57"
                                        lineColor="#FFC748"
                                        hoverLineColor="#FFC748"
                                        curve={3}
                                        height={70}
                                    />
                                </div>
                            </div>
                            {hasError && (
                                <div className="row">
                                    <div className="col">
                                        <p className="error-msg">{errorMsg}</p>
                                    </div>
                                </div>
                            )}
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
        </div>
    );
};

export default Mintng;
