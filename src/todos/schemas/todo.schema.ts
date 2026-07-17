import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});
export class CreateTodoDto extends createZodDto(createTodoSchema) {}

export const updateTodoSchema = createTodoSchema.partial().extend({
  completed: z.boolean().optional(),
});
export class UpdateTodoDto extends createZodDto(updateTodoSchema) {}