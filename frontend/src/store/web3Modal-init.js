import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
// Utils
import { getAllLocalEnv } from '../helpers/dev/general-helpers';

// Web3Modal setup with Ethers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const localEnv = getAllLocalEnv();

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: localEnv.infuraId,
        },
    },
};

const web3Modal = new Web3Modal({ network: 'mainnet', providerOptions });

export default web3Modal;
