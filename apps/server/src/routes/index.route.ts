import { indexController } from "@/controllers/index.controller";
import { Router } from "express";

const router = Router();

router.route("/").get(indexController);

export default router;
