import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import console from "node:console";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hashedPassword,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, 'secret', {expiresIn: '30d'})

        const {passwordHash, ...userData} = user._doc;

        res.status(200).json({...userData, token})
    } catch (e) {
        console.error(e)
        res.status(500).json('Registration has been failed')
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user)
            return res.status(404).json({message: 'User not found...'})

        const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isPasswordValid)
            return res.status(400).json({message: 'Wrong login or password...'})

        const token = jwt.sign({
            _id: user._id
        }, 'secret', {expiresIn: '30d'})

        const {passwordHash, ...userData} = user._doc;

        res.status(200).json({...userData, token})
    } catch (error) {
        console.error(error)
        res.status(500).json('Login has been failed')
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        console.log('User: ', user)
        if (!user)
            res.status(404).json({message: 'User not found'})

        const {passwordHash, ...userData} = user._doc;

        return res.status(200).json(userData)
    } catch (err) {
        console.error(err)
        res.status(500).json('Something went wrong')
    }
}