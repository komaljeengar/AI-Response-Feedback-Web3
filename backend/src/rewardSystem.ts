import FeedbackEvaluator from "./feedbackEvaluator";
import BlockchainService from './blockchainService'; // Ensure this is correctly imported

class RewardSystem {
    private evaluator: FeedbackEvaluator;
    private blockchain: BlockchainService; // This will accept a BlockchainService instance
    private BASE_REWARD = 10;

    constructor(blockchainService: BlockchainService) { // Accept the service here
        this.evaluator = new FeedbackEvaluator();
        this.blockchain = blockchainService; // Use the passed service
    }

    async processFeedback(userId: string, feedback: string, rating: number) {
        const evaluationResult = this.evaluator.evaluateFeedback(feedback);
        if (evaluationResult.score > 60) {
            const rewardAmount = this.calculateReward(evaluationResult);

            try {
                await this.blockchain.transferReward(userId, rewardAmount);
                return { awarded: true, amount: rewardAmount, score: evaluationResult.score };
            } catch (error) {
                return { awarded: false, reason: "Blockchain transfer failed" };
            }
        }

        return { awarded: false, reason: "Feedback quality insufficient" };
    }

    private calculateReward(evaluation: any) {
        return this.BASE_REWARD * evaluation.rewardMultiplier;
    }
}

export default RewardSystem;
