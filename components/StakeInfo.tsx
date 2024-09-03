import { TransactionButton } from "thirdweb/react";
import { prepareContractCall, toEther } from "thirdweb";
import { STAKING_CONTRACT } from "../utils/contracts";

interface StakeInfoProps {
    stakeInfo: readonly [bigint, bigint];
    onStake: () => void;
    onWithdraw: () => void;
    onClaimRewards: () => void;
}

export const StakeInfo = ({ stakeInfo, onStake, onWithdraw, onClaimRewards }: StakeInfoProps) => {
    const truncate = (value: string | number, decimalPlaces: number): number => {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be convertible to a number.');
        }
        const factor = Math.pow(10, decimalPlaces);
        return Math.trunc(numericValue * factor) / factor;
    };

    return (
        <div>
            <div>
                <button onClick={onStake}>Stake</button>
                <button onClick={onWithdraw}>Withdraw</button>
            </div>
            <div>
                <p>Balance Staked: {truncate(toEther(stakeInfo[0]).toString(), 2)}</p>
                <p>Reward Balance: {truncate(toEther(stakeInfo[1]).toString(), 2)}</p>
                <TransactionButton
                    transaction={() => prepareContractCall({
                        contract: STAKING_CONTRACT,
                        method: "claimRewards",
                    })}
                    onTransactionConfirmed={onClaimRewards}
                >
                    Claim Rewards
                </TransactionButton>
            </div>
            <style jsx>{`
                button {
                    margin: 5px;
                    padding: 10px;
                    background-color: #efefef;
                    border: none;
                    border-radius: 6px;
                    color: #333;
                    font-size: 1rem;
                    width: 45%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};