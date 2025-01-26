import express, { Request } from 'express';
import cors from 'cors';
import BlockchainService from './blockchainService';
import RewardSystem from './rewardSystem';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize services
const blockchainService = new BlockchainService();
const rewardSystem = new RewardSystem(blockchainService);

// Endpoint to submit reviews and process rewards
app.post("/submit-review", async (req: Request, res: any ) => {
    console.log("Submit review") 
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

// Removed the "/reward-config" endpoint as it's not in the current BlockchainService

// Start the server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

export default app;





















