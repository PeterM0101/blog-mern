import { body } from 'express-validator'

export const registerValidation = [
    body("fullName").isLength({min: 3}),
    body("email", "Invalid email").isEmail(),
    body("password","Password is too short").isLength({min: 5}),
    body("avatarUrl").optional().isURL()
]

export const loginValidation = [
    body("email", "Invalid email").isEmail(),
    body("password","Password is too short").isLength({min: 5})
]

export const postCreateValidation = [
    body("title","Title is too short").isLength({min: 3}).isString(),
    body("text","Text is too short").isLength({min: 10}).isString(),
    body("tags").optional().isString(),
    body("imageUrl", 'Invalid image link').optional().isString()
]

