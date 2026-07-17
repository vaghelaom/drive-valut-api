import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './schemas/todo.schema';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  create(@Session() session: UserSession, @Body() dto: CreateTodoDto) {
    return this.todosService.create(session.user.id, dto);
  }

  @Get()
  findAll(@Session() session: UserSession) {
    return this.todosService.findAll(session.user.id);
  }

  @Get(':id')
  findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.todosService.findOne(session.user.id, id);
  }

  @Patch(':id')
  update(@Session() session: UserSession, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(session.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Session() session: UserSession, @Param('id') id: string) {
    return this.todosService.remove(session.user.id, id);
  }
}