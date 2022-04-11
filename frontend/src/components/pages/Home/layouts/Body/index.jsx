import React, { useState, useContext, useEffect } from 'react';
import { GiCeremonialMask } from 'react-icons/gi';

// Utils
import { MsgNetContext, EthersContext } from '../../../../../store/all-context-interface';
import { getAllLocalEnv, floatFixer } from '../../../../../helpers/dev/utils';

import MintingRouter from '../../../../../data/abis/MintingRouter.json';
import NFT from '../../../../../data/abis/NFT.json';
import WHITELIST_SIGNATURES from '../../../../../data/whitelists/ROUND-1-WHITELIST.json';
// Components
import Crementor from '../../../../ui/Crementor/Crementor';
import PBButton from '../../../../ui/PBButton/PBButton';
// Styles & Assets
import './Body.scss';

const SALE_TYPE = {
    WHITELIST: 0,
    PUBLIC: 1,
};

const Index = () => {
    const localEnv = getAllLocalEnv();
    console.log('localEnv', localEnv);

    const { setMsg } = useContext(MsgNetContext);
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

    // Contract states
    const [nftContractSigner, setNftContractSigner] = useState(null);
    const [mintingContractSigner, setMintingContractSigner] = useState(null);
    const [saleType, setCurrentSaleType] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [maxPerMint, setMaxAmountPerMint] = useState(0);

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    useEffect(() => {
        if (isConnected) {
            (async () => {
                // NFT Contract
                const _nftContractSigner = new ethers.Contract(
                    localEnv.nftContract,
                    NFT.abi,
                    signer
                );
                setNftContractSigner(_nftContractSigner);
                const _mintingContractSigner = new ethers.Contract(
                    localEnv.mintingContract,
                    MintingRouter.abi,
                    signer
                );
                setMintingContractSigner(_mintingContractSigner);

                // Set prices.
                const saleRound = await _mintingContractSigner.saleRound();
                const { price, enabled, saleType, maxAmountPerMint } = saleRound;
                const priceInEther = ethers.utils.formatEther(price);
                if (enabled) {
                    setMintingActive(true);
                } else {
                    setMintingActive(false);
                    setSalesClosedMsg('Sales closed.');
                    return;
                }

                setUnitPrice(price);
                setUnitPriceUI(floatFixer(priceInEther, 2));
                setPricePerMint(ethers.utils.parseEther(priceInEther));
                setCurrentSaleType(saleType);
                setMaxAmountPerMint(maxAmountPerMint);

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
                console.log('Num allowed tokens', numAllowedTokens);
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

    const callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.text();
        console.log('body', body);
    };

    const displaySaleRoundText = () => {
        if (!isMintingActive) {
            return 'No sale is available at this moment!';
        }

        if (saleType === SALE_TYPE.WHITELIST) {
            return 'Whitelist sale is going on!';
        }

        if (saleType === SALE_TYPE.PUBLIC) {
            return 'Public sale is going on!';
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
        setHasError(false);
        // Avoid contracts errors
        if (defValue < 1) {
            setHasError(true);
            setErrorMsg('Quantity should be greater than 0!');
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
                console.log('whitelist round');
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
                console.log('public round');

                const transaction = await mintingContractSigner.publicMint(address, defValue, {
                    value: pricePerMint.mul(defValue),
                });
                setIsMinting(true);
                receipt = await transaction.wait();
            }

            if (receipt) {
                console.log('receipt', receipt);
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
        <div className="_body">
            <div className="px-4 py-5 my-5 text-center">
                <h1 className="display-5 fw-bold" style={{ color: '#1c1c1c' }}>
                    Sneaky Goblins Frontend
                </h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4" style={{ color: '#121111' }}>
                        {displaySaleRoundText()}
                    </p>
                    <br />
                    <br />
                    <h4>Price: {unitPriceUI} ETH/NFT</h4>
                    <h3>
                        Total cost:{' '}
                        {unitPrice ? ethers.utils.formatEther(unitPrice.mul(defValue)) : 0} ETH
                    </h3>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <Crementor
                            value={defValue}
                            bgColor="#2b3b5e"
                            lineColor="#818181"
                            onIncrement={onIncrementHandler}
                            onDecrement={onDecrementHandler}
                        />
                    </div>
                    <br />
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        {isConnected && isMintingActive && (
                            <PBButton
                                method={onClickMintHandler}
                                text="mint"
                                textSpace={1}
                                textWeight={700}
                                bgColor="#2b3b5dd9"
                                icon={<GiCeremonialMask size={22} />}
                            />
                        )}
                    </div>
                    {hasError && isConnected && (
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <div className="error-wrap">
                                <span>{errorMsg}</span>
                            </div>
                        </div>
                    )}
                    {isMinting && (
                        <div className="mt-2">
                            <div className="spinner-border text-primary" role="status">
                                {/* <span className="sr-only">Loading...</span> */}
                            </div>
                            Minting
                        </div>
                    )}
                    <br />
                </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default Index;
