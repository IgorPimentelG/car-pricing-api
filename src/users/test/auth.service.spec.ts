/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { User } from "../user.entity";
import { UsersService } from "../users.service";

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

fakeUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) => Promise.resolve({
        id: Math.floor(Math.random() * 9999), 
        email, 
        password
    } as User)
}

describe('Auth Service', () => {
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });
    
    it('Should create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Should create a new user with a salted and hashed password', async () => {
        const email = 'exemple@mail.com';
        const password = '12345678';
        const user = await service.signup(email, password);
        const [salt, hash] = user.password.split('.');
        expect(user.password).not.toEqual(password);
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();    
    });

    it('Should throws an error if user signup with email that is in use', async () => {
        const email = 'exemple@mail.com';
        fakeUsersService.find = () => Promise.resolve([{ email } as User]);
        await expect(service.signup(email, '12345678')).rejects.toThrow(BadRequestException);
    });

    it('Should throws an error if user not found', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([]);
        await expect(
            service.signin('any_email@mail.com', 'any_password'),
        ).rejects.toThrow(NotFoundException);
    });

    it('Should returns a user if correct password is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ email: 'any_email@mail.com', password: 'any_password' } as User]);
        const user = await service.signin('any_email@mail.com', 'any_password');
        expect(user).toBeDefined();
    })
});