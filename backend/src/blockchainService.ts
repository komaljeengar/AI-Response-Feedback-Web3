import { AptosClient, AptosAccount, Types } from 'aptos';
import dotenv from 'dotenv';

interface ReviewSubmission {
    userId: string;
    reviewText: string;
    rating: number;
    score: number;
    rewardAmount: number;
}

class BlockchainService {
    private client: AptosClient;
    private adminAccount: AptosAccount;
    private TOKEN_ADDRESS: string; // Address of the custom token contract
    private TOKEN_TYPE: string;    // Full type of the token

    constructor() {
        // Load environment variables
        dotenv.config();

        // Initialize Aptos client (using testnet)
        this.client = new AptosClient(
            process.env.APTOS_NETWORK_URL || 'https://fullnode.testnet.aptoslabs.com/v1'
        );

        // Load admin account and token details
        this.adminAccount = this.loadAdminAccount();
        
        // Load token contract details from environment
        this.TOKEN_ADDRESS = process.env.CUSTOM_TOKEN_CONTRACT_ADDRESS || '';
        this.TOKEN_TYPE = process.env.CUSTOM_TOKEN_TYPE || '';
    }

    // Load admin account for transactions
    private loadAdminAccount(): AptosAccount {
        const privateKey = process.env.ADMIN_PRIVATE_KEY;
        
        if (privateKey) {
            // Use existing private key
            return new AptosAccount(
                Buffer.from(privateKey, 'hex') // Assuming hex-encoded private key
            );
        } else {
            // Generate new account for testing
            return new AptosAccount();
        }
    }

    // Submit review with token reward
    async submitReview(reviewData: ReviewSubmission): Promise<{ 
        txHash: string, 
        reviewId: string 
    }> {
        try {
            // Generate a unique review ID
            const reviewId = this.generateReviewId(reviewData);

            // Prepare token transfer payload
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${this.TOKEN_ADDRESS}::token::transfer`,
                type_arguments: [this.TOKEN_TYPE],
                arguments: [
                    reviewData.userId, // Recipient address
                    (reviewData.rewardAmount * 1_000_000).toString() // Convert to smallest unit (assuming 6 decimals)
                ]
            };

            // Generate the transaction
            const transaction = await this.client.generateTransaction(
                this.adminAccount.address(),
                payload
            );

            // Sign the transaction
            const signedTx = await this.client.signTransaction(this.adminAccount, transaction);

            // Submit the transaction
            const pendingTransaction = await this.client.submitTransaction(signedTx);
            const txHash = pendingTransaction.hash;

            console.log(`Review reward transferred. TX Hash: ${txHash}`);

            return { 
                txHash: txHash, 
                reviewId 
            };
        } catch (error) {
            console.error('Token transfer for review failed:', error);
            throw new Error('Review reward transfer unsuccessful');
        }
    }

    // Fetch token balance for a user
    async getTokenBalance(userAddress: string): Promise<number> {
        try {
            // Construct view request to get token balance
            const payload: Types.ViewRequest = {
                function: `${this.TOKEN_ADDRESS}::token::balance_of`,
                type_arguments: [this.TOKEN_TYPE],
                arguments: [userAddress]
            };

            // Execute view function to get balance
            const [balance] = await this.client.view(payload);

            // Convert balance from smallest unit (e.g., 1_000_000 = 1 token)
            return Number(balance) / 1_000_000;
        } catch (error) {
            console.error('Error fetching token balance:', error);
            return 0;
        }
    }

    // Generate a unique review ID
    private generateReviewId(reviewData: ReviewSubmission): string {
        const crypto = require('crypto');
        const reviewString = `${reviewData.userId}-${reviewData.reviewText}-${Date.now()}`;
        return crypto.createHash('sha256').update(reviewString).digest('hex');
    }
}

export default BlockchainService;