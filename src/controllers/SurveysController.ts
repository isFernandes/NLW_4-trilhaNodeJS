import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRespository } from "../repositories/SurveysRepository";

class SurveysController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        const surveysRespository = getCustomRepository(SurveysRespository);

        const createdSurvey = surveysRespository.create({ title, description });

        await surveysRespository.save(createdSurvey);

        return response.status(201).json(createdSurvey);
    }
    async show(request: Request, response: Response) {
        const surveysRespository = getCustomRepository(SurveysRespository);

        const allSurveys = await surveysRespository.find();
        return response.status(201).json(allSurveys);
    }
}

export { SurveysController }