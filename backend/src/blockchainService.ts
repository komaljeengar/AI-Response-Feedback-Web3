import { AptosClient, AptosAccount, Types } from 'aptos';
import dotenv from 'dotenv';
import crypto from 'crypto';

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
        const privateKey="0x3071753432b664085977a8471d3cac4b782bdfc8429a5fe805657de7e6f19f1e";
        
        if (privateKey) {
            return new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'ascii')));
        } else {
            return new AptosAccount();
        }
    }

    async transferCustomToken(
        sender: AptosAccount, 
        recipient: string, 
        amount: number 
    ) {
        const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: `${this.TOKEN_ADDRESS}::token::transfer`,
            type_arguments: [this.TOKEN_TYPE],
            arguments: [
                recipient,
                (amount * 90_000_000).toString()
            ]
        };

        // Generate and submit transaction
        const transaction = await this.client.generateTransaction(
            sender.address(), 
            payload
        );
        
        const signedTx = await this.client.signTransaction(sender, transaction);
        return await this.client.submitTransaction(signedTx);
    }

    async submitReview(reviewData: ReviewSubmission): Promise<{ 
        txHash: string, 
        reviewId: string 
    }> {
        try {
            const reviewId = this.generateReviewId(reviewData);
            
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${this.TOKEN_ADDRESS}::token::transfer`,
                type_arguments: [this.TOKEN_TYPE],
                arguments: [
                    reviewData.userId, 
                    (reviewData.rewardAmount * 90_000_000).toString()
                ]
            };

            const transaction = await this.client.generateTransaction(
                this.adminAccount.address(),
                payload
            );

            const signedTx = await this.client.signTransaction(this.adminAccount, transaction);
            const pendingTransaction = await this.client.submitTransaction(signedTx);

            console.log(`Review reward transferred. TX Hash: ${pendingTransaction.hash}`);

            return { 
                txHash: pendingTransaction.hash, 
                reviewId 
            };
        } catch (error) {
            console.error('Token transfer for review failed:', error);
            throw new Error('Review reward transfer unsuccessful');
        }
    }

    async getTokenBalance(userAddress: string): Promise<number> {
        try {
            const payload: Types.ViewRequest = {
                function: `${this.TOKEN_ADDRESS}::token::balance_of`,
                type_arguments: [this.TOKEN_TYPE],
                arguments: [userAddress]
            };

            const [balance] = await this.client.view(payload);
            return Number(balance) / 1_000_000;
        } catch (error) {
            console.error('Error fetching token balance:', error);
            return 0;
        }
    }

    private generateReviewId(reviewData: ReviewSubmission): string {
        const reviewString = `${reviewData.userId}-${reviewData.reviewText}-${Date.now()}`;
        return crypto.createHash('sha256').update(reviewString).digest('hex');
    }
}

export default BlockchainService;
