const express = require('express');
const router = express.Router();
const Admin = require('../models/admins');
const Student = require('../models/students');
const Faculty = require('../models/faculty');
const fetchUser = require('../middleware/fetchUser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "SECRET"


//signup as admin
router.post('/createadmin', async (req, res) => {
    let success = false;
    if(!req.body.username){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    if(!req.body.password){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    try {

        let admin = await Admin.findOne({ username: req.body.username })
        if (admin) {
            return res.status(400).json({ success: success, message: "This Username already exists" });
        }
    } catch (error) {
        console.log(error.message); res.status(500).json({ success: success, message: "Internal Server Error" });
    }

    const admin = await Admin.create({
        username: req.body.username,
        password: req.body.password,
    })

    const data = {
        user: {
            type: "admin",
            id: admin.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    success = true;
    res.json({ success, authToken })
})

//signup as student

router.post('/createstudent', async (req, res) => {
    let success = false;
    if(!req.body.password){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }    
    if(!req.body.name){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    if(!req.body.enrollNo){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    try {

        let student = await Student.findOne({ enrollNo: req.body.enrollNo })
        if (student) {
            return res.status(400).json({ success: success, message: "This Enroll No. already exists" });
        }
    } catch (error) {
        console.log(error.message); res.status(500).json({ success: success, message: "Internal Server Error" });
    }
    let student = {};
    try {

        student = await Student.create({
            name: req.body.name,
            enrollNo: req.body.enrollNo,
            password: req.body.password,
        })
    } catch (error) {
        console.log(error.message); res.status(500).json({ success: success, message: "Internal Server Error" });
    }
    success = true;
    const data = {
        user: {
            type: "student",
            id: student.id
        }
    }

    const authToken = jwt.sign(data, JWT_SECRET)

    res.json({ success, authToken })
})

//signup faculty
router.post('/createfaculty', async (req, res) => {
    let success = false;
    if(!req.body.facultyID){
        return res.status(400).json({ success: success, message: "This Faculty ID already exists" });
    }
    if(!req.body.password){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    if(!req.body.name){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    try {

        let faculty = await Faculty.findOne({ facultyID: req.body.facultyID })
        if (faculty) {
            return res.status(400).json({ success: success, message: "This Faculty ID already exists" });
        }
    } catch (error) {
        console.log(error.message); res.status(500).json({ success: success, message: "Internal Server Error" });
    }

    const faculty = await Faculty.create({
        name: req.body.name,
        facultyID: req.body.facultyID,
        password: req.body.password,
    })
    success = true;
    const data = {
        user: {
            type: "faculty",
            id: faculty.id
        }
    }

    const authToken = jwt.sign(data, JWT_SECRET)

    res.json({ success, authToken });
})

//Login Student
router.post('/loginstudent', async (req, res) => {
    const { enrollNo, password } = req.body;
    let success = false;
    if(!password){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    if(!enrollNo){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    try {
        let student = await Student.findOne({ enrollNo })
        if (!student) {
            return res.status(400).json({ success: success, message: "Enrollment Number or Password Incorrect" })
        }
        else {
            if (student.password !== password) {
                return res.status(400).json({ success: success, message: "Enrollment Number or Password Incorrect" })
            }
            else {
                const data = {
                    user: {
                        type: "student",
                        id: student.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                if (authToken) success = true;
                res.json({ success, authToken });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: success, message: "Internal Server Error" });
    }
})

//Login Faculty
router.post('/loginfaculty', async (req, res) => {
    const { facultyID, password } = req.body;
    let success = false;
    if(!facultyID){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }    
    if(!password){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    try {
        let faculty = await Faculty.findOne({ facultyID })
        console.log(faculty);
        if (!faculty) {
            return res.status(400).json({ success: success, message: "Faculty ID or Password Incorrect" })
        }
        else {
            if (faculty.password !== password) {
                return res.status(400).json({ success: success, message: "Faculty ID or Password Incorrect" })
            }
            else {
                const data = {
                    user: {
                        type: "faculty",
                        id: faculty.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                if (authToken) success = true;
                res.json({ success, authToken });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: success, message: "Internal Server Error" });
    }
})

//Login admin

router.post('/loginadmin', async (req, res) => {
    const { username, password } = req.body;
    let success = false;
    if(!password){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    if(!username){
        return res.status(400).json({ success: success, message: "Invalid Entry" });
    }
    try {
        let admin = await Admin.findOne({ username })
        if (!admin) {
            return res.status(400).json({ success: success, message: "Faculty ID or Password Incorrect" })
        }
        else {
            if (admin.password !== password) {
                return res.status(400).json({ success: success, message: "Faculty ID or Password Incorrect" })
            }
            else {
                const data = {
                    user: {
                        type: "admin",
                        id: admin.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                if (authToken) success = true;
                res.json({ success, authToken });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: success, message: "Internal Server Error" });
    }
})


//get user
router.get('/getuser', fetchUser, async (req, res) => {
    let success = false;
    try {
        let user;
        if (req.user.type === "student") {
            try {
                user = await Student.findById(req.user.id);
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: success, message: "Internal Server Error" });
            }
            if (!user) {
                return res.status(401).json({ success: success, message: "User not found" })
            }
            else {
                success = true;
                return res.json({ success, user });
            }
        }
        else if (req.user.type === "faculty") {
            try {
                user = await Faculty.findById(req.user.id);
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: success, message: "Internal Server Error" });
            }
            if (!user) {
                return res.status(401).json({ success: success, message: "User not found" })
            }
            else {
                success = true;
                return res.json({ success, user });
            }
        }
        else if (req.user.type === "admin") {
            try {
                user = await Admin.findById(req.user.id);
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: success, message: "Internal Server Error" });
            }
            if (!user) {
                return res.status(401).json({ success: success, message: "User not found" })
            }
            else {
                success = true;
                return res.json({ success, user });
            }
        }
    } catch (error) {
        console.log(error); res.send(500).json({ success: success, message: "Internal Server Error" });
    }
})

module.exports = router;