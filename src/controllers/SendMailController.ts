import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRespository } from "../repositories/SurveysRepository";
import { SurveysUsersRespository } from "../repositories/SurveysUsersRespository";
import { UsersRespository } from "../repositories/UsersRepository";
import sendMailService from "../services/sendMailService";


class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRespository);
        const surveyRepository = getCustomRepository(SurveysRespository);
        const surveysUsersRespository = getCustomRepository(SurveysUsersRespository);

        const userAlredyExists = await usersRepository.findOne({ email });

        if (!userAlredyExists) {
            return response.status(400).json({
                error: "User does not exists"
            })
        }
        const surveyAlredyExists = await surveyRepository.findOne({ id: survey_id });

        if (!surveyAlredyExists) {
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }

        const surveyUser = surveysUsersRespository.create({
            user_id: userAlredyExists.id,
            survey_id: survey_id,
        });

        await surveysUsersRespository.save(surveyUser);

        await sendMailService.execute(email, surveyAlredyExists.title, surveyAlredyExists.description)

        return response.json(surveyUser)
    }
}

export { SendMailController }