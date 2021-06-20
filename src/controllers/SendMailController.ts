import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import path from "path";

import { SurveysRespository } from "../repositories/SurveysRepository";
import { SurveysUsersRespository } from "../repositories/SurveysUsersRespository";
import { UsersRespository } from "../repositories/UsersRepository";
import sendMailService from "../services/sendMailService";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRespository);
        const surveyRepository = getCustomRepository(SurveysRespository);
        const surveysUsersRespository = getCustomRepository(
            SurveysUsersRespository
        );

        const user = await usersRepository.findOne({ email });

        if (!user) {
            return response.status(400).json({
                error: "User does not exists",
            });
        }
        const survey = await surveyRepository.findOne({ id: survey_id });

        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exists",
            });
        }

        const surveyUserAlredyExists = await surveysUsersRespository.findOne({
            where: [{ user_id: user.id }, { value: null }], relations: ["user", "survey"]
        });

        const npsPath = path.resolve(
            __dirname,
            "..",
            "views",
            "emails",
            "npsMail.hbs"
        );

        const variables = {
            username: user.name,
            title: survey.title,
            description: survey.description,
            userId: user.id,
            link: process.env.URL_MAIL
        };

        if (surveyUserAlredyExists) {
            await sendMailService.execute(email, variables.title, variables, npsPath);
            return response.json(surveyUserAlredyExists)
        }

        const surveyUser = surveysUsersRespository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUsersRespository.save(surveyUser);



        await sendMailService.execute(email, variables.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };
