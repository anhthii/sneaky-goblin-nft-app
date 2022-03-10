import React, { useContext, useState, useEffect } from 'react';

// Components
import Navigation from '../Home/layouts/Navigation';
import PBButton from '../../ui/PBButton/PBButton';

// Utils
import useSignature from '../../../helpers/hooks/useSignature';
import { EthersContext, MsgNetContext } from '../../../store/all-context-interface';
import { floatFixer } from '../../../helpers/dev/general-helpers';

// Styles
import './JoinWhitelist.scss';

const JoinWhitelist = () => {
    const { setMsg } = useContext(MsgNetContext);
    const { sigData, signMessage } = useSignature();
    const { ethers, provider, address, isConnected } = useContext(EthersContext);

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [requiredBal] = useState(0.15);
    const [msgToSign, setMsgToSign] = useState('');

    // Effects >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        if (isConnected && sigData) {
            (async () => {
                await onJoinHandler();
            })();
        }
    }, [sigData]);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const onChangeHandler = (e) => {
        const { value } = e.target;
        setMsgToSign(value);
    };

    const onJoinHandler = async () => {
        const _userBal = await userBalanceHelper();
        const userBal = Number(floatFixer(_userBal, 2));

        if (userBal < requiredBal) {
            setMsg(`You must have at least ${requiredBal} ETH to join!`, 'warning');
            return;
        }

        if (sigData) {
            try {
                const res = await fetch('/api/whitelist/join', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sigData),
                });
                const receipt = await res.json();
                if (receipt.status === 'failed') {
                    setMsg(receipt.message, 'warning');
                } else {
                    setMsg('Successfully Registered!', 'success');
                }
            } catch (e) {
                setMsg('Too many requests!', 'warning');
            }
        }
    };

    // Helpers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const signMsgHelper = async () => {
        if (!isConnected) {
            setMsg('Please connect your wallet!', 'warning');
            return;
        }
        if (msgToSign === '') {
            setMsg('Message is empty', 'warning');
            return;
        }

        await signMessage(msgToSign);
    };

    const userBalanceHelper = async () => {
        const _balance = await provider.getBalance(address);
        const balance = ethers.utils.formatEther(_balance);
        return balance;
    };

    return (
        <>
            <Navigation />

            <div className="_join-whitelist">
                <div className="py-5 text-center">
                    <input
                        type="text"
                        placeholder="Message"
                        name="message"
                        onChange={onChangeHandler}
                    />
                </div>

                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <PBButton
                        text="Register"
                        textSpace={1}
                        textWeight={700}
                        bgColor="#2b3b5dd9"
                        method={signMsgHelper}
                    />
                </div>
            </div>
        </>
    );
};

export default JoinWhitelist;
