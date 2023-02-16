import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { UsersController } from "./users.controller";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
