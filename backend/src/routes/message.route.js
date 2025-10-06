import express from "express"
import { potectRoute } from "../middleware/auth.middleware.js";
import { getMessage,getUserForSidebar,sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",potectRoute, getUserForSidebar);
router.get("/:id",potectRoute,getMessage);

router.post("/send/:id",potectRoute,sendMessage)

export default router;