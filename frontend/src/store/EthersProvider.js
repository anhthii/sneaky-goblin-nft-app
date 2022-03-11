import React, { useMemo, useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';

// Web3Modal Initialization
import web3Modal from './web3Modal-init';

// Ethers context
import { EthersContext, MsgNetContext } from './all-context-interface';

// Utils
import { getAllLocalEnv } from '../helpers/dev/general-helpers';

// Main component **********************************************************************
const EthersProvider = ({ children, askOnLoad = true }) => {
    const windowEth = window.ethereum;
    const localEnv = getAllLocalEnv();
    const { setMsg } = useContext(MsgNetContext);

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [signer, setSigner] = useState(null);
    const [provider, setProvider] = useState(null);

    // Effects >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        if (windowEth) {
            // If true then ask to change to Eth chain
            if (askOnLoad) {
                (async () => {
                    await switchNetworkHandler();
                })();
            }
        } else {
            setMsg('Please consider installing Metamask.', 'warning');
        }
    }, []);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const onConnectHandler = async () => {
        try {
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const { chainId } = await provider.getNetwork();
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setUserAddress(address);
            setChainId(chainId);
            setProvider(provider);
            setSigner(signer);
            setIsConnected(true);

            return { provider, address, chainId, signer };
        } catch ({ message }) {
            if (!message) return null;

            const errorMsg = message.toLowerCase();
            if (errorMsg.includes('user rejected')) {
                setMsg('Wallet connection was cancelled!', 'warning');
            } else {
                setMsg(message, 'warning');
            }

            return null;
        }
    };

    const onDisconnectHandler = async () => {
        await setUserAddress(null);
        await setChainId(null);
        await setProvider(null);
        await setIsConnected(false);
    };

    const switchNetworkHandler = async (network = localEnv.chainHex) => {
        try {
            await windowEth.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network }],
            });
        } catch (e) {
            setMsg('Please connect to the Ethereum network', 'warning');
        }
    };

    // Ethers Context Value >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const ethersContextValue = useMemo(
        () => ({
            ethers,
            web3Modal,
            address: userAddress,
            chainId,
            provider,
            signer,
            isConnected,
            ethersProvider: {
                connect: onConnectHandler,
                disconnect: onDisconnectHandler,
                switchNetwork: switchNetworkHandler,
            },
        }),
        [ethers, web3Modal, userAddress, chainId, provider, signer, isConnected]
    );

    return <EthersContext.Provider value={ethersContextValue}>{children}</EthersContext.Provider>;
};

export default EthersProvider;
