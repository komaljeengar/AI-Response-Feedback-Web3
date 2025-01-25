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
            console.log("###", Buffer.from(privateKey, 'utf-8').toString())
            // Use existing private key
            return new AptosAccount(
                Buffer.from(privateKey, 'utf-8')
            );
        } else {
            // Generate new account for testing
            return new AptosAccount();
        }
    }

    // Submit review and process reward on blockchain
    async submitReview(reviewData: ReviewSubmission): Promise<{ 
        txHash: string, 
        reviewId: string 
    }> {
        try {
            // Generate a unique review ID (could be a hash of review details)
            const reviewId = this.generateReviewId(reviewData);

            // Payload for review submission
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${this.contractAddress}::submit_review`,
                type_arguments: [],
                arguments: [
                    reviewData.userId,          // User who submitted the review
                    reviewId,                   // Unique review identifier
                    reviewData.rating,          // Star rating
                    reviewData.score,           // Quality score
                    reviewData.rewardAmount.toString() // Reward amount
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

            return { 
                txHash: transactionResult.hash, 
                reviewId 
            };
        } catch (error) {
            console.error('Blockchain review submission failed:', error);
            throw new Error('Review submission unsuccessful');
        }
    }

    // Generate a unique review ID
    private generateReviewId(reviewData: ReviewSubmission): string {
        // Create a hash based on review details to ensure uniqueness
        const crypto = require('crypto');
        const reviewString = `${reviewData.userId}-${reviewData.reviewText}-${Date.now()}`;
        return crypto.createHash('sha256').update(reviewString).digest('hex');
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