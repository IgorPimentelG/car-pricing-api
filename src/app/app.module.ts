/* eslint-disable @typescript-eslint/no-var-requires */
import { Module, ValidationPipe, MiddlewareConsumer } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { ReportsModule } from "../reports/reports.module";
import { User } from "../users/user.entity";
import { Report } from "../reports/report.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
const cookieSession = require("cookie-session");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `../../.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "sqlite",
        database: config.get<string>('DB_NAME'),
        entities: [User, Report],
        synchronize: true,
      })
    }),
    UsersModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ["57fh47fh"],
        })
      )
      .forRoutes("*");
  }
}
