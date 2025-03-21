const { Router } = require("express");
const {userModel, purchaseModel, courseModel} = require("../db");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/user");
require("dotenv").config();

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    const {email, password, firstName, lastName} = req.body;
    //add zod validation
    //hash password and then store it 
    try {
        await userModel.create({
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


userRouter.post("/signin", async function(req, res) {
    const {email, password} = req.body;
    
     const user = await userModel.findOne({
        email: email,
        password: password,
     });

     if(user) {
        const token = jwt.sign({
            id: user._id.toString()
        },process.env.JWT_USER_PASSWORD);

        res.json({
            token: token
        })
     } else {
            res.json({
            message: "signin fail"
        })
    }
})

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId: userId
    })

    const courseData = await courseModel.find({
        _id: {$in: purchases.map(x => x.courseId)}
    })

    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}



























// function createUserRoutes(app) {

//     app.post("/user/signup", function(req, res) {
//         res.json({
//             message: "signup endpoing"
//         })
//     })


//     app.post("/user/signin", function(req, res) {
//         res.json({
//             message: "signin endpoing"
//         })
//     })

//     app.get("/user/purchases", function(req, res) {
//         res.json({
//             message: "signup endpoing"
//         })
//     })
// }

// module.exports = {
//     createUserRoutes: createUserRoutes
// }