const router = require('express').Router()

const auth = require('../middleware/auth')
const Users = require('../models/userModel')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret= "sl_myJwtSecret"




// inserting user details to the user Document
router.post('/register', async (req, res) =>{

    try {

        const {name,number,address ,email, password} = req.body;


        if(number.length != 10)
        return res.status(400).json({msg: "phone  number must be 10 digit."})

        const user = await Users.findOne({email})
        if(user) return res.status(400).json({msg: "The email already exists."})

        if(password.length < 6)
            return res.status(400).json({msg: "Password is at least 6 characters long."})

        // Password Encryption
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new Users({
            name, number,address,email,password: passwordHash
        })


        await newUser.save()

        // Then create jsonwebtoken to authentication
        const accesstoken = createAccessToken({id: newUser._id})
        const refreshtoken = createRefreshToken({id: newUser._id})

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7*24*60*60*1000 // 7d
        })

        res.json({accesstoken})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

})









// login validation
router.post('/login', async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({email})
        var isMatch=''
        if(user=='null') return res.status(400).json({msg: "User does not exist."})
        if(user){
            isMatch =await bcrypt.compare(password, user.password)
        }

        if(user==null){
            res.status(201).send({ role:"Your Email Or Paswword Is Incorrect", success:true});
        }else
        {
            if(isMatch){

                const role=user.role;
                const accessToken=jwt.sign({email:user.email,role:user.role},jwtSecret,{expiresIn: 1500});
                res.status(201).send({role:user.role ,accessToken:accessToken});
            }else{

                res.status(201).send({ role:"Your Email Or Paswword Is Incorrect",success:true});
            }


        }


    } catch (err) {
        console.log("err :"+err)
        return res.status(500).json({msg: err.message})
    }


})



router.get('/logout',async (req, res) =>{
    try {
        res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
        return res.json({msg: "Logged out"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

})

 router.get('/refresh_token', async (req, res) =>{
    try {
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(400).json({msg: "Please Login or Register"})

            const accesstoken = createAccessToken({id: user.id})

            res.json({accesstoken})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

 })

 router.get('/infor', auth,  async (req, res) =>{

    try {
        const user = await Users.findById(req.user.id).select('-password')
        if(!user) return res.status(400).json({msg: "User does not exist."})

        res.json(user)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
 })





router.get('/getUserById/:id',  async (req, res) =>{
    try {
        const  email =   req.params.id;
        const user = await Users.findOne({email})
        res.send(user)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})


router.put('/editUser/:id',  async (req, res) =>{
    try {
        const {name,id,number,address}=req.body;
        await Users.findOneAndUpdate({_id:id}, {
            name,number,address
        })
        res.send({msg:'user updated successfully'})
    } catch (err) {
        console.log("err :"+err)

    }
})











 const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = router
