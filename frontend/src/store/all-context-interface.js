import React from 'react';

export const EthersContext = React.createContext({
    ethers: null,
    web3Modal: null,
    ethersProvider: null,
});

export const MsgNetContext = React.createContext({
    setMsg: () => {},
});
