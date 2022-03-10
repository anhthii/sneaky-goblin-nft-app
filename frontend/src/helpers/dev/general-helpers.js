// Deaults >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const isDev = () => {
    if (process.env.REACT_APP_IS_LOCAL_DEVELOPMENT === '1') return true;
    return false;
};

export const getAllLocalEnv = () => {
    return {
        infuraId: process.env.REACT_APP_INFURA_ID,
        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
        chainId: process.env.REACT_APP_CHAIN_ID,
    };
};

// Numbers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const floatFixer = (num, fDigit) => {
    return parseFloat(`${num}`).toFixed(fDigit);
};
