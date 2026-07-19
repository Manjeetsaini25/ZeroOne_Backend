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

const updateProblem = async (req,res)=>{
    
  const {id} = req.params;
  const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,
    referenceSolution, problemCreator
   } = req.body;

  try{

     if(!id){
      return res.status(400).send("Missing ID Field");
     }

    const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
    for(const {language,completeCode} of referenceSolution){
         

      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);
        
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase)=>({
          source_code:completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value)=> value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
      
     const testResult = await submitToken(resultToken);

    //  console.log(testResult);

     for(const test of testResult){
      if(test.status_id!=3){
       return res.status(400).send("Error Occured");
      }
     }

    }


  const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
   
  res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}

module.exports = {createProblem,updateProblem,deleteProblem};