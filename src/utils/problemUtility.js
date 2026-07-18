const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{


const options = {
  method: "POST",
  url: "https://ce.judge0.com/submissions/batch",
  params: {
    base64_encoded: false
  },
  headers: {
    "Content-Type": "application/json"
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
    // console.log(response.data);
		return response.data;
	} catch (error) {
		console.error(error);
	}
} 

 return await fetchData();
}

const waiting = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


const submitToken = async(resultToken)=>{

const options = {
  method: "GET",
  url: "https://ce.judge0.com/submissions/batch",
  params: {
    tokens: resultToken.join(","),
    base64_encoded: false,
    fields: "*"
  },
  headers: {
    "Content-Type": "application/json"
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
    // console.log(response.data);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

 while(true){

 const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}
}


module.exports = {getLanguageById,submitBatch,submitToken};








// 


