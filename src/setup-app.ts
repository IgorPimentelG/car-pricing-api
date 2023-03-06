/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";

export const setupApp = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
};
