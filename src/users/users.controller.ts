import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserDTO } from "./dtos/update-user.dto";
import { UserDTO } from "./dtos/user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { AuthService } from "./auth.service";

@Controller("auth")
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  @Post("/signup")
  createUser(@Body() body: CreateUserDTO) {
    return this.authService.singup(body.email, body.password);
  }

  @Post("/signin")
  signin(@Body() body: CreateUserDTO) {
    return this.authService.signin(body.email, body.password);
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
