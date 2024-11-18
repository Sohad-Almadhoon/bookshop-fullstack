import express from 'express';
import followUser from "../controllers/user.controller.js";
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();
router.post("/follow", verifyToken, followUser);


export default router;
