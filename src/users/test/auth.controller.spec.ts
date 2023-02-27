/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { FindQuery, UsersService } from "../users.service";
import { AuthService } from "../auth.service";
import { User } from "../user.entity";
import { NotFoundException } from "@nestjs/common";

describe('Users Controller', () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: (query: FindQuery) => Promise.resolve([{
                id: query.id,
                email: query.email,
            } as User]),
            remove: (id: number) => Promise.resolve({ 
                id, 
                email: 'exemple@mail.com'
            } as User),
            update: (id: number, attrs: Partial<User>) => Promise.resolve({ 
                id, 
                ...attrs
            } as User),
            create: (email: string, password: string) => Promise.resolve({ 
                id: Math.floor(Math.random() * 9999), 
                email
            } as User),

        };
        fakeAuthService = {
            signup: (email: string, password: string) => Promise.resolve({
                id: Math.floor(Math.random() * 9999), 
                email
            } as User),
            signin: (email: string, password: string) => Promise.resolve({
                id: 1, 
                email
            } as User),
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ]
        }).compile();
        controller = module.get<UsersController>(UsersController);
    });

    it('Should create an instance of users controller', () => {
        expect(controller).toBeDefined();
    });

    it('Should find an user with email', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined();
    });

    it('Should signin updates session object and returns user', async () => {
        const session = { userId: 0 };
        const user = await controller.signin({
            email: 'foo@bar.com',
            password: 'any_password'
        }, session);

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });
});