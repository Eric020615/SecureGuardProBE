import { Router } from "express";
import UserRoute from "./users";
import AuthRoute from "./auth";
import FacilityRoute from "./facility";
import NoticeRoute from "./notice";

const router = Router();

const routes = [
    UserRoute,
    AuthRoute,
    FacilityRoute,
    NoticeRoute
]

routes.forEach((route) => {
    router.use(route)
})

export default router;