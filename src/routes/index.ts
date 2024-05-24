import { Router } from "express";
import UserRoute from "./users";

const router = Router();

const routes = [
    UserRoute
]

routes.forEach((route) => {
    router.use(route)
})

export default router;