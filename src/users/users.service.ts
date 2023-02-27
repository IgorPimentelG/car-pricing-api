import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

export type FindQuery = {
  id?: number;
  email?: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  find(query: FindQuery) {
    return this.repository.find({
      where: { ...query },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repository.find({ where: { id } });
    if (user.length === 0) {
      throw new NotFoundException("User not found");
    }
    Object.assign(user[0], attrs);
    return this.repository.save(user[0]);
  }

  async remove(id: number) {
    const user = await this.repository.find({ where: { id } });
    if (user.length === 0) {
      throw new NotFoundException("User not found");
    }
    return this.repository.remove(user[0]);
  }
}
