/* eslint-disable prettier/prettier */
import { BadRequestException, NotFoundException, Injectable } from "@nestjs/common";
import { encrypt, verifyPassword } from "../util/encrypt";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const isExist = await this.usersService.find({ email });
        if (isExist.length) {
            throw new BadRequestException('Email in use');
        }

        const hash = await encrypt(password);
        const user = await this.usersService.create(email, hash);
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (verifyPassword(user.password, password)) {
            return user;
        } else {
            throw new BadRequestException('bad password');
        }
    }
}
