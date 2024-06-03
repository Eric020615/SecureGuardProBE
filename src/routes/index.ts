import { Router } from "express";
import UserRoute from "./users";
import AuthRoute from "./auth";
import FacilityRoute from "./facility";

const router = Router();

const routes = [
    UserRoute,
    AuthRoute,
    FacilityRoute
]

routes.forEach((route) => {
    router.use(route)
})

export default router;