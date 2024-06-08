import express from 'express'
import * as console from "node:console";
import mongoose from 'mongoose'
import { loginValidation, postCreateValidation, registerValidation } from "./validations.js";
import multer from 'multer'
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import {UserController, PostController} from "./controllers/index.js";
import cors from 'cors';

mongoose.connect('mongodb+srv://petradamovich:5pp9e5wd@cluster0.qh7l0b6.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('DB has been connected!')
    })
    .catch((err) => {
        console.log('An error has been occurred!', err)
    })

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

const app = express();
app.use(express.json())
app.use(cors());

app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.end('Hello World! Yes!')
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    return res.status(200).json({
        url: `uploads/${req.file.originalname}`
    })
})

app.listen(4444, err => {
    if (err) {
        console.log(err)
    }
    console.log('Server has been started! Ok')
})