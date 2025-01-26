import FeedbackEvaluator from './FeedbackEvaluator';
import BlockchainService from './blockchainService';

class RewardSystem {
    private evaluator: FeedbackEvaluator;
    private blockchain: BlockchainService; // This will accept a BlockchainService instance
    private BASE_REWARD = 10;
    private MIN_SCORE_FOR_REWARD = 30; // Minimum score to qualify for reward


    constructor(blockchainService: BlockchainService) { // Accept the service here
        this.evaluator = new FeedbackEvaluator();
        this.blockchain = blockchainService; // Use the passed service
    }

    async processFeedback(
        userId: string, 
        feedback: string, 
        rating: number
    ) 
    {
        try {
            // Step 1: Evaluate Feedback Quality
            const evaluationResult = this.evaluator.evaluateFeedback(feedback);
            
            // Step 2: Check if feedback meets minimum quality threshold
            if (evaluationResult.score < this.MIN_SCORE_FOR_REWARD) {
                return { 
                    awarded: false, 
                    reason: "Feedback quality insufficient", 
                    score: evaluationResult.score 
                };
            }

            // Step 3: Calculate Reward Amount
            const rewardAmount = this.calculateReward(evaluationResult);

            // Step 4: Validate User Eligibility
            const userEligible = await this.blockchain.validateUserEligibility(userId);
            if (!userEligible) {
                return { 
                    awarded: false, 
                    reason: "User not eligible for rewards" 
                };
            }

            // Step 5: Prepare Review Submission Data
            const reviewSubmission = {
                userId,
                reviewText: feedback,
                rating,
                score: evaluationResult.score,
                rewardAmount
            };

            // Step 6: Submit Review and Transfer Reward on Blockchain
            const result = await this.blockchain.submitReview(reviewSubmission);

            return { 
                awarded: true, 
                amount: rewardAmount, 
                score: evaluationResult.score,
                txHash: result.txHash,
                reviewId: result.reviewId
            };

        } catch (error) {
            console.error('Reward processing failed:', error);
            return { 
                awarded: false, 
                reason: "Reward processing error" 
            };
        }
    }

    private calculateReward(evaluation: any) {
        return this.BASE_REWARD * evaluation.rewardMultiplier;
    }
}

export default RewardSystem;
