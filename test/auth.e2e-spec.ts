/* eslint-disable prettier/prettier */
import * as request from "supertest";
import { AppModule } from "../src/app/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { setupApp } from "../src/setup-app";

describe("AuthController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it("Should handles a signup request", async () => {
    const userEmail = "email@example.com";
    return request(app.getHttpServer())
      .post("/auth/signup")
      .send({ userEmail, password: 'any_password' })
      .expect(201)
      .then((response) => {
        const { id, email } = response as any;
        expect(id).toBeDefined();
        expect(email).toBeDefined();
        expect(email).toEqual(userEmail);
      })
  });

  it("Should as a new user then get the currently logged in user", async () => {
    const email = "email@example.com";
    const response = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email, password: 'any_password' })
      .expect(201);

    const cookie = response.get("Set-Cookie");
    const { body } = await request(app.getHttpServer())
      .get("/auth/whoami")
      .set("Cookie", cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
