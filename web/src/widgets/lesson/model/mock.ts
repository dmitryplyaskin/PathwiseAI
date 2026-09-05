export const mockLessonContent = `
# Welcome to Your First Lesson: Introduction to Machine Learning

Machine learning (ML) is a field of inquiry devoted to understanding and building methods that 'learn', that is, methods that leverage data to improve performance on some set of tasks. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known as training data, in order to make predictions or decisions without being explicitly programmed to do so.

## What is Machine Learning?

At its core, machine learning is the process of teaching a computer system how to make accurate predictions when fed data. Those predictions could be answering whether a piece of fruit in a photo is a banana or an apple, spotting people crossing the road in front of a self-driving car, whether the use of the word book in a sentence relates to a paperback or a hotel reservation, whether an email is spam, or correctly recognizing speech.

### Types of Machine Learning

There are three main types of machine learning:

1.  **Supervised Learning:** The algorithm is 'trained' on a pre-defined set of training examples, which then facilitates its ability to reach an accurate conclusion when given new data.
2.  **Unsupervised Learning:** The algorithm is not given any pre-assigned labels or scores for the data. It must figure out the data's structure on its own.
3.  **Reinforcement Learning:** This type of machine learning is all about making suitable actions to maximize reward in a particular situation. It is employed by various software and machines to find the best possible behavior or path it should take in a specific situation.

***

## A Brief History of Machine Learning

The term machine learning was coined in 1959 by Arthur Samuel, an American IBMer and pioneer in the field of computer gaming and artificial intelligence. The synonym self-teaching computers was also used in this time period.

-   **1950s:** The earliest machine learning programs were written.
-   **1960s:** The discovery of the backpropagation algorithm caused a resurgence in machine learning research.
-   **1990s:** The work on machine learning shifted from a knowledge-driven approach to a more data-driven one. Scientists began creating programs for computers to analyze large amounts of data and draw conclusions from the results.

Here is a simple table summarizing the types:

| Type                  | Input Data        | Goal                               | Example                                |
| --------------------- | ----------------- | ---------------------------------- | -------------------------------------- |
| Supervised Learning   | Labeled Data      | Predict output for new data        | Spam detection                         |
| Unsupervised Learning | Unlabeled Data    | Find hidden patterns or structures | Customer segmentation                  |
| Reinforcement Learning| No predefined data| Learn a series of actions          | Game playing (e.g., Chess, Go)         |

\`\`\`javascript
// Example of a simple "learning" algorithm in JavaScript
function simpleLinearRegression(x, y) {
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumXX += x[i] * x[i];
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
}

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 5, 4, 5];
const regression = simpleLinearRegression(x, y);
console.log(\`y = \${regression.slope.toFixed(2)}x + \${regression.intercept.toFixed(2)}\`);
\`\`\`

## Conclusion

Machine learning is a powerful tool that is already having a significant impact on our world. As the amount of data we generate continues to grow, so too will the potential for machine learning to solve some of the world's most challenging problems. This was just a brief introduction. In the next lessons, we will dive deeper into each of the learning types and build our own models. Stay tuned!
`;
