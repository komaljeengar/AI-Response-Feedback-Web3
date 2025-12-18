## AI Response Feedback Web3 (Concept Prototype)

This repo is a small prototype for an idea where **users give feedback on AI chat responses and get rewarded with tokens on-chain**.

---

## Idea

- **User chats with an AI** in a web UI.
- After each answer, the user can **rate the response and write a short review**.
- The backend **evaluates the quality of that feedback** (length, uniqueness, structure, spam‑likelihood).
- If the feedback passes a minimum quality threshold, the system **calculates a reward amount**.
- In the final version, the backend:
  - Trigger a **Web3 transaction on Aptos** to transfer a custom reward token to the user’s wallet address.
  - Return the transaction hash and store a review identifier.

So the  model is: **“Review AI → Get scored → Maybe earn tokens”**.

---

## Project Structure

- **`backend/`**: Express + TypeScript backend that:
  - Accepts review submissions.
  - Scores feedback quality.
  - Contains a draft `BlockchainService` for rewarding users on Aptos.
- **`my-react-app/`**: React (Vite) frontend that:
  - Renders an AI chat experience.
  - Lets the user rate responses and submit written reviews.
  - Connects a wallet and displays the token balance.

---

## Frontend Overview (`my-react-app/`)

- **Chat flow**
  - `App.jsx` sets up routing (`/` and `/chat`), theme (dark/light), and passes wallet state/balance down.
  - `Home.jsx` is a landing page with a simple hero, explaining the idea of connecting a wallet and chatting with AI.
  - `ChatInterface.jsx`:
    - Lets the user ask questions.
    - Calls `getAIResponse` (from `src/utils/aiUtils.js`) to fetch an AI answer.
    - Shows the full conversation with user and AI messages.
    - After each AI reply, reveals a **rating and review panel**.

- **Rating and review**
  - `RatingandReview.jsx` renders:
    - A 1–5 star rating.
    - A free‑text review textarea.
    - A submit button that calls `onReviewSubmitted(rating, reviewText)`.
  - `ChatInterface.jsx` implements `handleReviewSubmitted`:
    - Reads `userId` from `localStorage` (set when the wallet connects).
    - POSTs to `http://localhost:5174/submit-review` with `{ userId, rating, reviewText }`.
    - On success, it calls `updateBalance()` so the UI can reflect the (theoretical) new token balance.

- **Wallet connection**
  - `WalletConnection.jsx` (WalletButton) wraps `connectWallet` from `src/utils/walletUtils.js`.
  - When the wallet connects successfully, it:
    - Stores the address in `localStorage` as `userId`.
    - Shows a basic success alert.
  - The actual chain interaction in this repo is **not fully wired end‑to‑end**; this is mainly to show where wallet identity would come from.

---

## Backend Overview (`backend/`)

### API

- **`POST /submit-review`** (`src/index.ts`)
  - Expects JSON body: `{ userId, reviewText, rating }`.
  - Validates that all fields exist.
  - Calls `rewardSystem.processFeedback(userId, reviewText, rating)`.
  - Returns:
    - `success: true/false`
    - A message summarising whether a reward was granted.
    - A `details` object with scoring and (when wired) transaction info.

### Feedback evaluation (`FeedbackEvaluator`)

`src/feedbackEvaluator.ts` runs several checks on the feedback text:

- **Length**: prefers feedback between 10 and 200 words and normalises this into a 0–100 score.
- **Uniqueness**: uses `compromise` NLP library to look at unique nouns and rewards more specific content.
- **Semantic quality**: checks whether the text has:
  - Questions (shows critical thinking),
  - Well‑formed sentences,
  - Topics, as a proxy for substantive content.
- **Spam probability**: penalises:
  - Very short feedback,
  - Single words like “nice”, “good”, “ok”,
  - Naive repeated‑character patterns.

These metrics are combined into a **weighted overall score** (0–100) and a **reward multiplier**.

### Reward logic (`RewardSystem`)

`src/rewardSystem.ts` orchestrates how feedback becomes a token reward:

- Uses `FeedbackEvaluator` to compute a score.
- If the score is below `MIN_SCORE_FOR_REWARD`, it:
  - Returns `awarded: false` with a reason.
- If the score is high enough:
  - Computes a reward amount: `BASE_REWARD * rewardMultiplier`.
  - Builds a `reviewSubmission` object with:
    - `userId`, `reviewText`, `rating`, `score`, `rewardAmount`.
  - Calls `blockchain.submitReview(reviewSubmission)` to send the reward on-chain (conceptually).

### Blockchain integration 

`src/blockchainService.ts` is where the **Aptos/Web3 part is supposed to live**:

- Uses `@aptos-labs/ts-sdk` to create an `AptosClient` pointing at testnet.
- Reads token contract details from environment variables:
  - `CUSTOM_TOKEN_CONTRACT_ADDRESS`
  - `CUSTOM_TOKEN_TYPE`
- Has two high‑level methods:
  - `transferCustomToken(sender, recipientAddress, amount)` – generic transfer.
  - `submitReview(reviewData)` – generates a `reviewId`, and sends a token transfer from the admin account to `reviewData.userId` using an entry function payload.
- Also includes a `getTokenBalance(userAddress)` helper.

---

## Running the Prototype

This is just to explore the flow; the on-chain reward step will likely fail or behave unexpectedly unless you complete the Web3 configuration yourself.

- **Backend**
  - `cd backend`
  - Install dependencies: `npm install`
  - Build / run in dev:
    - Dev: `npm run dev` (TypeScript with nodemon)
    - Build + start: `npm run build` then `npm start`
  - The server listens on port `5174` by default (`POST /submit-review`).

- **Frontend**
  - `cd my-react-app`
  - Install dependencies: `npm install`
  - Start dev server: `npm run dev`
  - Open the URL shown by Vite (usually `http://localhost:5173`).

With both running you can:

1. Open the frontend.
2. Connect a wallet.
3. Chat with the AI.
4. Rate and review responses to see how the system reacts.

