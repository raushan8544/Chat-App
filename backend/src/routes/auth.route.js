import express from 'express';
import {signup,login,logout,updateProfile,checkAuth} from '../controllers/auth.controller.js'
import {potectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/signup', signup) 

router.post('/login', login )

router.post('/logout', logout )

router.put('/update-profile',potectRoute,updateProfile)

router.get("/check",potectRoute,checkAuth)



export default router;