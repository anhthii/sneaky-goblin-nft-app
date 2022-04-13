// Deaults >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const isDev = () => {
    if (process.env.REACT_APP_IS_LOCAL_DEVELOPMENT === '1') return true;
    return false;
};

export const getAllLocalEnv = () => {
    return {
        infuraId: process.env.REACT_APP_INFURA_ID,
        mintingContract: process.env.REACT_APP_MINTING_CONTRACT,
        nftContract: process.env.REACT_APP_NFT_CONTRACT,
        nftStakingContract: process.env.REACT_APP_NFT_STAKING_CONTRACT,
        chainHex: process.env.REACT_APP_CHAIN_HEX,
        chainDec: process.env.REACT_APP_CHAIN_DECIMAL,
        chainName: process.env.REACT_APP_CHAIN_NAME,
        stakingContract: process.env.REACT_APP_NFT_STAKING_CONTRACT,
        tokenContract: process.env.REACT_APP_TOKEN_CONTRACT,
    };
};

// Numbers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const floatFixer = (num, fDigit) => {
    return parseFloat(`${num}`).toFixed(fDigit);
};
