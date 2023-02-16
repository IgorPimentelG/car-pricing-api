import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  Session,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserDTO } from "./dtos/update-user.dto";
import { UserDTO } from "./dtos/user.dto";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./user.entity";
import { AuthGuard } from "../guards/auth.guard";

type UserSession = {
  userId: number | null;
};

@Controller("auth")
@Serialize(UserDTO)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  @Get("/whoami")
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post("/signup")
  async createUser(
    @Body() body: CreateUserDTO,
    @Session() session: UserSession
  ) {
    const user = await this.authService.singup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/signin")
  async signin(@Body() body: CreateUserDTO, @Session() session: UserSession) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/signout")
  signOut(@Session() session: UserSession) {
    session.userId = null;
  }

  @Get("/:id")
  findUser(@Param("id") id: string) {
    return this.userService.find({ id: +id });
  }

  @Delete("/:id")
  delete(@Param("id") id: string) {
    return this.userService.remove(+id);
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDTO) {
    return this.userService.update(+id, body);
  }
}
