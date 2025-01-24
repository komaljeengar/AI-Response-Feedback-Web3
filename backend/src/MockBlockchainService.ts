class MockBlockchainService implements BlockchainService {
    client: any;  // You can leave this as 'any' or provide a mock implementation if needed
    adminAccount: any;  // Same as above
    contractAddress: string; // Provide a mock contract address
    
    constructor() {
        this.client = {}; // mock empty object or mock client
        this.adminAccount = {}; // mock admin account if needed
        this.contractAddress = "mock-contract-address"; // Mock contract address
    }

    async transferReward(userId: string, amount: number): Promise<string> {
        console.log(`Mock reward of ${amount} transferred to ${userId}`);
        return "mock-tx-hash";
    }

    async validateUserEligibility(_userAddress: string): Promise<boolean> {
        return true;  // Return mocked value
    }

    async getRewardConfiguration() {
        return { minStars: 1, baseReward: 10, totalMinted: 1000 }; 
    }
}

export default MockBlockchainService;
