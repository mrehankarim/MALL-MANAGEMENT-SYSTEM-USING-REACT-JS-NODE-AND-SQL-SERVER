import {Router} from "express"

import { loginUser, logOutUser, registerUser,getUserInfo } from "../controllers/user.controller.js"
import verifyJwt from '../middleware/auth.middleware.js'
const router=Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt,logOutUser)
router.route('/info').get(verifyJwt,getUserInfo)

export default router