import { Router } from "express";
import { SendMailController } from "./controllers/SendMailController";
import { SurveysController } from "./controllers/SurveysController";
import { UserController } from "./controllers/UserController";

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const routes = Router();

routes.post("/user", userController.create)
routes.post("/surveys", surveysController.create)
routes.get("/surveys", surveysController.show)
routes.post("/sendMail", sendMailController.execute)

export default routes;