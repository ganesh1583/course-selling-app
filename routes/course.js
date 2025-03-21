const { Router } = require("express");
const courseRouter = Router();
const {purchaseModel} = require("../db");
const { userMiddleware } = require("../middleware/user");
const { courseModel } = require("../db");

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId: userId,
        courseId: courseId
    });

    res.json({
        message: `You purchased ${courseId} course`
    })
})

courseRouter.get("/preview", async function(req, res) {
    const courses = await courseModel.find({})
    res.json({
        courses: courses
    })
})


module.exports = {
    courseRouter: courseRouter
}