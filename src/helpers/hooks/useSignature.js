import { useContext, useState } from 'react';
import { EthersContext } from '../../store/all-context-interface';

const useSignature = () => {
    const { address, signer } = useContext(EthersContext);
    const [sigData, setSigData] = useState({});

    const signMessage = async (msg, receivedSigner = null) => {
        if (!msg || msg === '') {
            setSigData({});
            return;
        }

        // Defaults
        const _signer = receivedSigner || (signer && signer);
        const _address = receivedSigner ? await _signer.getAddress() : address;

        // Signing the message
        const signature = await _signer.signMessage(msg);

        await setSigData({
            ...sigData,
            signature,
            address: _address,
            message: msg,
        });
    };

    return { sigData, signMessage };
};

export default useSignature;
