import { AptosClient, AptosAccount, Types } from 'aptos';
import dotenv from 'dotenv';

class BlockchainService {
    private client: AptosClient;
    private adminAccount: AptosAccount;
    private contractAddress: string;

    constructor() {
        // Load environment variables
        dotenv.config();

        // Initialize Aptos client (using testnet)
        this.client = new AptosClient(
            process.env.APTOS_NETWORK_URL || 'https://fullnode.testnet.aptoslabs.com/v1'
        );

        // Create or load admin account for transactions
        this.adminAccount = this.loadAdminAccount();
        
        // Smart contract address (deployed review rewards contract)
        this.contractAddress = process.env.REVIEW_REWARDS_CONTRACT || '';
    }

    // Load or generate admin account
    private loadAdminAccount(): AptosAccount {
        const privateKey = process.env.ADMIN_PRIVATE_KEY;
        
        if (privateKey) {
            // Use existing private key
            return new AptosAccount(
                Buffer.from(privateKey, 'hex')
            );
        } else {
            // Generate new account for testing
            return new AptosAccount();
        }
    }

    // Transfer reward tokens
    async transferReward(
        recipientAddress: string, 
        amount: number
    ): Promise<string> {
        try {
            // Payload for reward submission
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${this.contractAddress}::submit_review`,
                type_arguments: [],
                arguments: [
                    recipientAddress,  // Recipient wallet
                    4,                 // Star rating 
                    amount.toString() // Reward amount
                ]
            };

            // Submit transaction
            const txn = await this.client.generateTransaction(
                this.adminAccount.address(),
                payload
            );

            // Sign and submit transaction
            const signedTxn = await this.client.signTransaction(
                this.adminAccount, 
                txn
            );

            const transactionResult = await this.client.submitTransaction(signedTxn);

            return transactionResult.hash;
        } catch (error) {
            console.error('Blockchain transfer failed:', error);
            throw new Error('Reward transfer unsuccessful');
        }
    }

    // Validate user's ability to receive rewards
    async validateUserEligibility(
        userAddress: string
    ): Promise<boolean> {
        try {
            // Check user's previous reward history
            const payload: Types.ViewRequest = {
                function: `${this.contractAddress}::check_user_eligibility`,
                type_arguments: [],
                arguments: [userAddress]
            };

            const result = await this.client.view(payload);
            
            // Assuming view function returns a boolean
            return result[0] as boolean;
        } catch (error) {
            console.error('Eligibility check failed:', error);
            return false;
        }
    }

    // Get current reward configuration
    async getRewardConfiguration() {
        try {
            const payload: Types.ViewRequest = {
                function: `${this.contractAddress}::get_reward_config`,
                type_arguments: [],
                arguments: []
            };

            const result = await this.client.view(payload);
            
            return {
                minStars: result[0],
                baseReward: result[1],
                totalMinted: result[2]
            };
        } catch (error) {
            console.error('Failed to fetch reward config:', error);
            return null;
        }
    }
}

export default BlockchainService;