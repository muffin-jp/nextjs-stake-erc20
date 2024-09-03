import { useState } from 'react';
import { TransactionButton } from "thirdweb/react";
import { approve } from "thirdweb/extensions/erc20";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { STAKE_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";

interface StakeModalProps {
    stakingTokenBalance: bigint;
    onClose: () => void;
    onSuccess: () => void;
}

export const StakeModal = ({ stakingTokenBalance, onClose, onSuccess }: StakeModalProps) => {
    const [stakeAmount, setStakeAmount] = useState(0);
    const [stakingState, setStakingState] = useState<"init" | "approved">("init");

    const handleStakeSuccess = () => {
        setStakeAmount(0);
        setStakingState("init");
        onSuccess();
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Close</button>
                <h3>Stake</h3>
                <p>Balance: {toEther(stakingTokenBalance)}</p>
                {stakingState === "init" ? (
                    <>
                        <input
                            type="number"
                            placeholder="0.0"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
                        />
                        <TransactionButton
                            transaction={() => approve({
                                contract: STAKE_TOKEN_CONTRACT,
                                spender: STAKING_CONTRACT.address,
                                amount: stakeAmount,
                            })}
                            onTransactionConfirmed={() => setStakingState("approved")}
                        >
                            Set Approval
                        </TransactionButton>
                    </>
                ) : (
                    <>
                        <h3>{stakeAmount}</h3>
                        <TransactionButton
                            transaction={() => prepareContractCall({
                                contract: STAKING_CONTRACT,
                                method: "stake",
                                params: [toWei(stakeAmount.toString())],
                            })}
                            onTransactionConfirmed={handleStakeSuccess}
                        >
                            Stake
                        </TransactionButton>
                    </>
                )}
            </div>
            <style jsx>{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: #151515;
                    padding: 40px;
                    border-radius: 10px;
                    min-width: 300px;
                }
                .close-button {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    padding: 5px;
                    margin: 5px;
                    font-size: 0.5rem;
                }
                input {
                    margin: 10px;
                    padding: 5px;
                    border-radius: 5px;
                    border: 1px solid #333;
                    width: 100%;
                }
            `}</style>
        </div>
    );
};