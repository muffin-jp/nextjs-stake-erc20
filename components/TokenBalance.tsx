import { toEther } from "thirdweb";

interface TokenBalanceProps {
    label: string;
    balance: bigint | undefined;
    isLoading: boolean;
}

export const TokenBalance = ({ label, balance, isLoading }: TokenBalanceProps) => {
    const truncate = (value: string | number, decimalPlaces: number): number => {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be convertible to a number.');
        }
        const factor = Math.pow(10, decimalPlaces);
        return Math.trunc(numericValue * factor) / factor;
    };

    return (
        <p className="token-balance">
            {isLoading ? (
                "Loading..."
            ) : (
                `${label}: ${truncate(toEther(balance!), 2)}`
            )}
            <style jsx>{`
                .token-balance {
                    padding: 10px;
                    border-radius: 5px;
                    margin-right: 5px;
                }
            `}</style>
        </p>
    );
};