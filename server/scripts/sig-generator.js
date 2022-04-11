import { ethers } from "ethers";

const sigGenerator = async (provider, addressToWhitelist) => {
  if (!provider || !addressToWhitelist) return null;

  const domain = {
    name: process.env.TOKEN_NAME,
    version: process.env.TOKEN_VERSION,
    chainId: process.env.REACT_APP_CHAIN_DECIMAL,
    verifyingContract: ethers.utils.getAddress(
      process.env.REACT_APP_NFT_CONTRACT
    ),
  };

  const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);

  const types = { Minter: [{ name: "wallet", type: "address" }] };

  const address = ethers.utils.getAddress(addressToWhitelist);
  const signature = await signer._signTypedData(domain, types, {
    wallet: addressToWhitelist,
  });

  return { address, signature };
};

export default sigGenerator;
