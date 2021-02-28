import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRespository } from "../repositories/UsersRepository";

class UserController {

    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const usersRepository = getCustomRepository(UsersRespository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (userAlreadyExists) {
            return response.status(400).json({ error: "Usuário já existe" })
        }

        const createdUser = usersRepository.create({ name, email });

        await usersRepository.save(createdUser);

        response.json(createdUser);
    }
}

export { UserController };
