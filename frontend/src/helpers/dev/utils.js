// General >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const isDev = () => {
    if (process.env.REACT_APP_IS_LOCAL_DEVELOPMENT === '1') return true;
    return false;
};

export const getAllLocalEnv = () => {
    return {
        infuraId: process.env.REACT_APP_INFURA_ID,
        mintingContract: process.env.REACT_APP_MINTING_CONTRACT,
        nftContract: process.env.REACT_APP_NFT_CONTRACT,
    };
};

// Numbers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const floatFixer = (num, fDigit) => {
    return parseFloat(`${num}`).toFixed(fDigit);
};
