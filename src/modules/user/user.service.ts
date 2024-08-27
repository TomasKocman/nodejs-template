import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    create(createUserDto: CreateUserDto): User {
        return new User(createUserDto.name, createUserDto.email)
    }

    findAll() {
        return `This action returns all users`
    }

    findOne(id: number) {
        return `This action returns a #${id} user`
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`
    }

    delete(id: number) {
        return `This action deletes a #${id} user`
    }
}
