const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const fetchUser = require('../middleware/fetchUser');


router.post('/getleave', fetchUser, async (req, res) => {
    let success = false;
    //validation
    if (!req.user) {
        return res.json({ success });
    }
    if (!req.user.type) {
        return res.json({ success });
    }

    //admin
    if (req.user.type === "admin") {
        res.json({});
    }

    //student
    if (req.user.type === "student") {
        let success=false;
        if(!req.body.facultyID){return res.json({success:success,dates:[],type:req.user.type,message:"Faculty 1not found"})}
        try {
            let faculty=await Faculty.findOne({facultyID:req.body.facultyID});
            if(!faculty){
                return res.json({success:success,dates:[],type:req.user.type,message:"Faculty 2not found"})
            }
            success=true;
            console.log("stu suc")
            console.log(faculty);
            res.json({ success: success, dates: faculty.absent, type: req.user.type })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: success, message: "Internal Server Error" });
        }
    }
    if (req.user.type === "faculty") {
        let success = false;
        try {
            let faculty = await Faculty.findById(req.user.id);
            if (!faculty) {
                return res.status(401).json({ success: success, message: "User not found" })
            }
            else {
                success = true;
                res.json({ success: success, dates: faculty.absent, type: req.user.type })
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: success, message: "Internal Server Error" });
        }
    }
})

//add leave
router.post('/addleave', fetchUser, async (req, res) => {
    let success = false;
    //validation
    if (!req.user) {
        return res.json({ success });
    }
    if (!req.user.type) {
        return res.json({ success });
    }

    //for admin
    if (req.user.type === "admin") {
        res.json({});
    }

    //for students
    if (req.user.type === "student") {
        res.json({});
    }

    //for faculty
    if (req.user.type === "faculty") {
        let success = false;
        try {
            let faculty = await Faculty.findById(req.user.id);
            if (!faculty) {
                return res.status(401).json({ success: success, message: "User not found" })
            }
            else {
                if (faculty.absent.includes(req.body.date)) {
                    return res.json({ success: false, message: "Already On leave" });
                }
                faculty.absent.push(req.body.date);
                try {
                    await faculty.save();
                    console.log("saved");
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ success: success, message: "Internal Server Error" });
                }
                success = true;
                return res.json({ success: success, dates: faculty.absent })
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: success, message: "Internal Server Error" });
        }
    }
})


//delete Leave
router.post('/deleteleave', fetchUser, async (req, res) => {
    let success = false;
    //validation
    if (!req.user) {
        return res.json({ success });
    }
    if (!req.user.type) {
        return res.json({ success });
    }
    if (!req.user.id) {
        return res.json({ success });
    }

    //for admin
    if (req.user.type === "admin") {
        res.json({});
    }

    //for student
    if (req.user.type === "student") {
        res.json({});
    }

    //for faculty
    if (req.user.type === "faculty") {
        let success = false;
        try {
            let faculty = await Faculty.findById(req.user.id);
            if (!faculty) {
                return res.status(401).json({ success: success, message: "User not found" })
            }
            else {
                var index = faculty.absent.indexOf(req.body.date);
                if (index === -1) {
                    return res.json({ success: success, message: "Already present" })
                }
                try {
                    faculty.absent.splice(index,1);
                    await faculty.save()
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ success: success, message: "Internal Server Error" });
                }
                success=true;
                res.json({ success: success, dates: faculty.absent })
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: success, message: "Internal Server Error" });
        }
    }
})

router.get('/getfacultydata', fetchUser, async (req, res) => {
    let success = false;
    //validation
    if(!req.user.id){return res.json({success: success, message: "Access Denied" })}
    let facultyNames=[];
    let facultyIDs=[];
    try {
        
        Faculty.find({},(err,users)=>{
            if(err){
              return  res.status(500).json({ success: success, message: "Internal Server Error" });
            }
            users.map(user=>{
                facultyNames.push(user.name);
                facultyIDs.push(user.facultyID);
            })
            success=true;
            return res.json({success,facultyIDs,facultyNames});
        })


        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: success, message: "Internal Server Error" });
        }
    
})


module.exports = router;
