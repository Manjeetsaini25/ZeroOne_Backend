const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");

const createProblem = async (req, res) => {
    try {

        const {
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution
        } = req.body;

        if (
            !title ||
            !description ||
            !difficulty ||
            !tags ||
            !visibleTestCases ||
            !hiddenTestCases ||
            !startCode ||
            !referenceSolution
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        for (const solution of referenceSolution) {

            const languageId = getLanguageById(solution.language);

            if (!languageId) {
                return res.status(400).json({
                    message: `Unsupported language ${solution.language}`
                });
            }

            const allTests = [
                ...visibleTestCases,
                ...hiddenTestCases
            ];

            const submissions = allTests.map(test => ({
                source_code: solution.completeCode,
                language_id: languageId,
                stdin: test.input,
                expected_output: test.output
            }));

            const submitResult = await submitBatch(submissions);

            const tokens = submitResult.map(x => x.token);

            const results = await submitToken(tokens);

            for (const result of results) {
                if (result.status.id !== 3) {
                    return res.status(400).json({
                        message: "Reference solution failed.",
                        error: result
                    });
                }
            }
        }

        const problem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreator: req.result._id
        });

        return res.status(201).json({
            message: "Problem Created Successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = createProblem;