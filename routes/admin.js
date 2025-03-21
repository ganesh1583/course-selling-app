const { Router } = require("express");
const adminRouter = Router();
const { adminModel,courseModel } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function(req, res) {
    const {email, password, firstName, lastName} = req.body;
    //add zod validation
    //hash password and then store it
    try {
        await adminModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
        })
    } catch(e) {
        console.log(e);
    }
    
    res.json({
        message: "signup successful"
    })
})

adminRouter.post("/signin", async function(req, res) {
    const {email, password} = req.body;
    
     const admin = await adminModel.findOne({
        email: email,
        password: password,
     });

     if(admin) {
        const token = jwt.sign({
            id: admin._id
        },process.env.JWT_ADMIN_PASSWORD);

        res.json({
            token: token
        })
     } else {
            res.json({
            message: "signin fail"
        })
    }
})

adminRouter.post("/course",adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const {title, description, imageUrl, price} = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const {title, description, imageUrl, price, courseId} = req.body;

    const course = await courseModel.update({
        _id: courseId,
        creatorId: adminId
    },{
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    })

    res.json({
        message: "Course updated",
        courses: courses
    })
})

module.exports = {
    adminRouter: adminRouter
}