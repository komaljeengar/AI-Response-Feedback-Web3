import natural from 'natural';
import compromise from 'compromise';

class FeedbackEvaluator {
    private tokenizer: natural.WordTokenizer;
    private TF_IDF: natural.TfIdf;

    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.TF_IDF = new natural.TfIdf();
    }

    evaluateFeedback(feedback: string): FeedbackScore {
        const cleanedFeedback = this.preprocessFeedback(feedback);
        
        console.log("Cleaned Feedback: ", cleanedFeedback);

        const scores = {
            length: this.assessLength(cleanedFeedback),
            uniqueness: this.calculateUniqueness(cleanedFeedback),
            semanticQuality: this.assessSemanticQuality(cleanedFeedback),
            spamProbability: this.detectSpam(cleanedFeedback)
        };

        console.log("Scores: ", scores);

        return this.calculateOverallScore(scores);
    }

    private preprocessFeedback(feedback: string): string {
        return feedback
            .toLowerCase()
            .replace(/[^\w\s]/g, '')  // Remove non-alphanumeric characters
            .trim();
    }

    private assessLength(feedback: string): number {
        const words = this.tokenizer.tokenize(feedback);
        console.log("Word Count: ", words.length);
        // Ensure length is within the desired range (10-200 words)
        return words.length >= 10 && words.length <= 200 ? 
            this.normalizeScore(words.length, 10, 200) : 0;
    }

    private normalizeScore(value: number, min: number, max: number): number {
        // Normalize score between 0 and 100 based on provided min/max
        const normalized = (value - min) / (max - min) * 100;
        return Math.min(Math.max(normalized, 0), 100);  // Ensure it stays between 0 and 100
    }

    private calculateUniqueness(feedback: string): number {
        const doc = compromise(feedback);
        // Using unique nouns to calculate uniqueness
        const uniqueTerms = doc.nouns().unique().out('array');
        console.log("Unique Terms: ", uniqueTerms);
        return (uniqueTerms.length / this.tokenizer.tokenize(feedback).length) * 100;
    }

    private assessSemanticQuality(feedback: string): number {
        const nlp = compromise(feedback);
        
        const qualityIndicators = [
            nlp.questions().found,       // Critical thinking
            nlp.sentences().found,      // Structured communication
            nlp.topics().length > 0      // Substantive content
        ];

        console.log("Quality Indicators: ", qualityIndicators);
        return qualityIndicators.filter(Boolean).length * 33.33;
    }

    private detectSpam(feedback: string): number {
        const spamSignals = [
            /^(lol|nice|good|ok)$/i.test(feedback),
            feedback.split(' ').some(word => word.repeat(3) === word),
            feedback.length < 10
        ];

        console.log("Spam Signals: ", spamSignals);
        return 100 - (spamSignals.filter(Boolean).length * 33.33);
    }

    private calculateOverallScore(scores: FeedbackScores): FeedbackScore {
        const weightedScore = (
            scores.length * 0.3 +
            scores.uniqueness * 0.2 +
            scores.semanticQuality * 0.3 +
            scores.spamProbability * 0.2
        );

        console.log("Weighted Score: ", weightedScore);
        return {
            score: Math.max(0, Math.min(100, weightedScore)),
            rewardMultiplier: weightedScore / 100
        };
    }
}

interface FeedbackScores {
    length: number;
    uniqueness: number;
    semanticQuality: number;
    spamProbability: number;
}

interface FeedbackScore {
    score: number;
    rewardMultiplier: number;
}

export default FeedbackEvaluator;
