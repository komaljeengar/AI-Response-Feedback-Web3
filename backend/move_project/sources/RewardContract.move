module RewardContract_addr::RewardContract {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // Resource to store user feedback and rewards
    struct Feedback has key {
        user: address,
        content: vector<u8>,
        score: u64,
        verified: bool,
    }
    
    struct Reward has key {
        points: u64,
    }
    
    struct Admin has key {
        admin: address,
    }

    // Initialize contract and set admin
    public entry fun initialize_admin(account: &signer) {
        let admin_address = signer::address_of(account);
        move_to(account, Admin { admin: admin_address });
    }
    
    // Function for users to submit feedback
    public entry fun submit_feedback(account: &signer, content: vector<u8>) {
        let feedback = Feedback {
            user: signer::address_of(account),
            content,
            score: 0,
            verified: false,
        };
        move_to(account, feedback);
    }
    
    // Function for admin to verify feedback and assign a score
    public entry fun verify_feedback(admin: &signer, user: address, score: u64)
    acquires Admin, Feedback {
        let admin_resource = borrow_global<Admin>(signer::address_of(admin));
        assert!(signer::address_of(admin) == admin_resource.admin, 1);
        
        let feedback = borrow_global_mut<Feedback>(user);
        assert!(!feedback.verified, 2); // Ensure feedback isn't already verified
        
        feedback.score = score;
        feedback.verified = true;
    }
    
    // Function to distribute rewards based on feedback score
    public entry fun distribute_reward(admin: &signer, user: &signer)
    acquires Admin, Feedback {
        let admin_resource = borrow_global<Admin>(signer::address_of(admin));
        assert!(signer::address_of(admin) == admin_resource.admin, 1);
        
        let feedback = borrow_global_mut<Feedback>(signer::address_of(user));
        assert!(feedback.verified, 2); // Ensure feedback is verified
        
        let reward_amount = calculate_reward(feedback.score);

        // Transfer the reward amount to the user using both admin and user as signers
        let user_address = signer::address_of(user);
        coin::transfer<AptosCoin>(admin, user_address, reward_amount);

        feedback.score = 0; // Reset score after reward distribution
    }
    
    // Calculate reward based on score multiplier
    fun calculate_reward(score: u64): u64 {
        let base_reward = 10_000_000; // 0.01 APT (assuming 1 APT = 10^8 Octas)
        (base_reward * score) / 100
    }
}
