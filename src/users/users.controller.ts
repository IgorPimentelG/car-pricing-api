import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserDTO } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";

@Controller("auth")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post("/signup")
  createUser(@Body() body: CreateUserDTO) {
    return this.userService.create(body.email, body.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:id")
  findUser(@Param("id") id: string) {
    return this.userService.find(+id);
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
