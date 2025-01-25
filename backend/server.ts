import express from 'express';
import cors from 'cors';
import BlockchainService from './src/blockchainService';
import RewardSystem from './src/rewardSystem';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize services
const blockchainService = new BlockchainService();
const rewardSystem = new RewardSystem(blockchainService);

// Endpoint to submit reviews and process rewards
app.post("/submit-review", async (req, res) => {
    try {
        const { userId, reviewText, rating } = req.body;

        // Validate input
        if (!userId || !reviewText || !rating) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing required fields" 
            });
        }

        // Process review and potential reward
        const result = await rewardSystem.processFeedback(
            userId, 
            reviewText, 
            rating
        );

        // Respond with detailed result
        res.json({
            success: result.awarded,
            message: result.awarded 
                ? "Review processed and reward granted!" 
                : "Review processed without reward",
            details: result
        });

    } catch (error) {
        console.error("Error processing review:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error" 
        });
    }
});

// Endpoint to get reward configuration
app.get("/reward-config", async (req, res) => {
    try {
        const config = await blockchainService.getRewardConfiguration();
        res.json({
            success: true,
            configuration: config
        });
    } catch (error) {
        console.error("Error fetching reward config:", error);
        res.status(500).json({ 
            success: false, 
            error: "Could not retrieve reward configuration" 
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

export default app;