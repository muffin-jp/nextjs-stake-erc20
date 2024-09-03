'use client';

import { useEffect, useState } from 'react';
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc20";
import { client } from "@/app/client";
import { chain } from "@/app/chain";
import { REWARD_TOKEN_CONTRACT, STAKE_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { StakeModal } from './StakeModal';
import { WithdrawModal } from './WithdrawModal';
import { StakeInfo } from './StakeInfo';
import { TokenBalance } from './TokenBalance';

const REFETCH_INTERVAL = 10000; // 10 seconds

export const Stake = () => {
    const account = useActiveAccount();
    const [isStaking, setIsStaking] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const { data: stakingTokenBalance, isLoading: loadingStakeTokenBalance, refetch: refetchStakingTokenBalance } = useReadContract(balanceOf, {
        contract: STAKE_TOKEN_CONTRACT,
        address: account?.address || "",
        queryOptions: { enabled: !!account },
    });

    const { data: rewardTokenBalance, isLoading: loadingRewardTokenBalance, refetch: refetchRewardTokenBalance } = useReadContract(balanceOf, {
        contract: REWARD_TOKEN_CONTRACT,
        address: account?.address || "",
        queryOptions: { enabled: !!account },
    });

    const { data: stakeInfo, refetch: refetchStakeInfo } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address as string],
        queryOptions: { enabled: !!account },
    });

    const refetchData = () => {
        refetchStakeInfo();
        refetchStakingTokenBalance();
        refetchRewardTokenBalance();
    };

    useEffect(() => {
        const intervalId = setInterval(refetchData, REFETCH_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    if (!account) return null;

    return (
        <div className="stake-container">
            <ConnectButton client={client} chain={chain} />
            <div className="token-balances">
                <TokenBalance 
                    label="Staking Token" 
                    balance={stakingTokenBalance} 
                    isLoading={loadingStakeTokenBalance} 
                />
                <TokenBalance 
                    label="Reward Token" 
                    balance={rewardTokenBalance} 
                    isLoading={loadingRewardTokenBalance} 
                />
            </div>
            
            {stakeInfo && (
                <StakeInfo 
                    stakeInfo={stakeInfo}
                    onStake={() => setIsStaking(true)} 
                    onWithdraw={() => setIsWithdrawing(true)} 
                    onClaimRewards={refetchData} 
                />
            )}

            {isStaking && (
                <StakeModal 
                    stakingTokenBalance={stakingTokenBalance!}
                    onClose={() => setIsStaking(false)}
                    onSuccess={refetchData}
                />
            )}

            {isWithdrawing && (
                <WithdrawModal 
                    onClose={() => setIsWithdrawing(false)}
                    onSuccess={refetchData}
                />
            )}
            
            <style jsx>{`
                .stake-container {
                    background-color: #151515;
                    padding: 40px;
                    border-radius: 10px;
                }
                .token-balances {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin: 20px;
                }
            `}</style>
        </div>
    );
};