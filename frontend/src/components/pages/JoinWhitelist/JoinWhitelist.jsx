import React, { useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

// Components
import Navigation from '../Home/layouts/Navigation';
import PBButton from '../../ui/PBButton/PBButton';

// Utils
import useSignature from '../../../helpers/hooks/useSignature';
import { EthersContext, MsgNetContext } from '../../../store/all-context-interface';
import { getAllLocalEnv } from '../../../helpers/dev/general-helpers';

// Styles
import './JoinWhitelist.scss';

const JoinWhitelist = () => {
    const localEnv = getAllLocalEnv();
    const { setMsg } = useContext(MsgNetContext);
    const { sigData, signMessage } = useSignature();
    const { isConnected } = useContext(EthersContext);

    // States >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // Effects >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        if (isConnected && sigData) {
            (async () => {
                await onJoinHandler();
            })();
        }
    }, [sigData]);

    // Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const onJoinHandler = async () => {
        if (sigData) {
            const payload = {
                ...sigData,
                chainName: localEnv.chainName,
            };

            try {
                const res = await fetch('/api/whitelist/join', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
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
        const msg = `register-${nanoid()}`;
        await signMessage(msg);
    };

    return (
        <>
            <Navigation />

            <div className="_join-whitelist">
                <div className="py-5 text-center">
                    <h3 className="display-5" style={{ color: '#1c1c1c' }}>
                        Join Whitelist
                    </h3>
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
