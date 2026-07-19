const express = require('express');

const problemRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
const {createProblem,updateProblem,deleteProblem} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");

// Create
problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);


// problemRouter.get("/:id",getProblemById);
// problemRouter.get("/", getAllProblem);
// problemRouter.get("/user", solvedAllProblembyUser);

module.exports = problemRouter;
