import express from "express"
import { potectRoute } from "../middleware/auth.middleware.js";
import { aiRateLimiter } from "../middleware/aiRateLimiter.js";
import { getMessage,getUserForSidebar,sendMessage,deleteMessageController, debugDeleteMessageController, debugCookiesController, askAIController, aiTestController } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",potectRoute, getUserForSidebar);
router.get("/:id",potectRoute,getMessage);

router.post("/send/:id",potectRoute,sendMessage)
router.post('/ai/:id', potectRoute, aiRateLimiter, askAIController);
router.get('/ai/test', potectRoute, aiTestController);
router.delete("/delete/:id",potectRoute,deleteMessageController)
// DEV: debug route that deletes without authentication (local testing only)
router.delete("/debug-delete/:id", debugDeleteMessageController)
router.get('/debug-cookies', debugCookiesController)

export default router;