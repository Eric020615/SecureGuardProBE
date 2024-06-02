import { Router } from "express";
import UserRoute from "./users";
import AuthRoute from "./auth";

const router = Router();

const routes = [
    UserRoute,
    AuthRoute
]

routes.forEach((route) => {
    router.use(route)
})

export default router;