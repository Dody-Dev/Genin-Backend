import User from '../models/User.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendEmail } from '../utils/mail.js';
import crypto from 'crypto'; //The functionalities you've requested—specifically email verification and forgot password—depend on the crypto module for security. It's the standard way in Node.js to generate secure, unpredictable tokens for these purposes. 

export const signup = asyncHandler(async (req, res, next) =>{
    const{name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({success:false, message:"User already exists"});
        return;
    }
    const user = await User.create({name, email, password});

})

export const login = asyncHandler(async (req, res, next)=>{
    const{email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({success:false, error:'Please provide an email and password'})
    }
})