import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from './schemas/todo.schema';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  create(ownerId: string, dto: CreateTodoDto) {
    return this.prisma.todo.create({ data: { ...dto, ownerId } });
  }

  findAll(ownerId: string) {
    return this.prisma.todo.findMany({ where: { ownerId } });
  }

  async findOne(ownerId: string, id: string) {
    const todo = await this.prisma.todo.findFirst({ where: { id, ownerId } });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(ownerId: string, id: string, dto: UpdateTodoDto) {
    await this.findOne(ownerId, id); // throws if not found or not yours
    return this.prisma.todo.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    return this.prisma.todo.delete({ where: { id } });
  }
}