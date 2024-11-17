import express from 'express'
const router = express.Router();
import { createUser, getUsers } from '../controllers/users.controller.js';
router.post('/', createUser);
router.get('/', getUsers);
export default router;