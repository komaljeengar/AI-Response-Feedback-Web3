module RewardContract_addr::RewardContract {
    use std::signer;

    struct Reward has key, store {
        value: u64,
    }

    public entry fun initialize(account: &signer) {
        let reward = Reward { value: 0 };
        move_to(account, reward);
    }

    public entry fun add_reward(account: &signer, amount: u64) acquires Reward {
        let reward = borrow_global_mut<Reward>(signer::address_of(account));
        reward.value = reward.value + amount;
    }

    public fun get_reward(account: &signer): u64 acquires Reward {
        let reward = borrow_global<Reward>(signer::address_of(account));
        reward.value
    }

    public entry fun redeem_reward(account: &signer) acquires Reward {
        let reward = borrow_global_mut<Reward>(signer::address_of(account));
        reward.value = 0;
    }
}