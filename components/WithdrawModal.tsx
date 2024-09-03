import { useState } from 'react';
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";
import { STAKING_CONTRACT } from "../utils/contracts";

interface WithdrawModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const WithdrawModal = ({ onClose, onSuccess }: WithdrawModalProps) => {
    const [withdrawAmount, setWithdrawAmount] = useState(0);

    const handleWithdrawSuccess = () => {
        setWithdrawAmount(0);
        onSuccess();
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Close</button>
                <h3>Withdraw</h3>
                <input 
                    type="number" 
                    placeholder="0.0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                />
                <TransactionButton
                    transaction={() => prepareContractCall({
                        contract: STAKING_CONTRACT,
                        method: "withdraw",
                        params: [toWei(withdrawAmount.toString())],
                    })}
                    onTransactionConfirmed={handleWithdrawSuccess}
                >
                    Withdraw
                </TransactionButton>
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