# Nova — Fastify-based API Framework

> A modern framework for building structured and type-safe APIs on top of Fastify, using decorators and Zod validation.

[🌐 Full Documentation »](https://novadoc.pages.dev/)

---

## What is Nova?

Nova is a Node.js framework built on top of Fastify that provides:

- **Decorators** for defining controllers and routes.
- **Zod schemas** for runtime validation with static type inference.
- **Modular architecture** aligned with clean design principles.
- **Simple bootstrap process** via `NovaFactory`.

Nova abstracts repetitive Fastify setup while preserving performance and flexibility.

---

## Installation

### CLI (recommended)

```bash
npm i -g @abrahambass/nova-cli
nova create my-app
cd my-app
npm install
npm run dev
```

### Manual installation

```bash
npm install @abrahambass/nova reflect-metadata zod
```

---

## Minimal Example

```ts
import 'reflect-metadata';
import { NovaFactory, Controller, Get, Post, Body, Path } from '@abrahambass/nova';
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().default(false),
});

@Controller('/tasks')
class TaskController {
  @Get()
  async getAll() {
    return [{ id: 1, title: 'Learn Nova', completed: false }];
  }

  @Get('/:id')
  async getById(@Path('id') id: number) {
    return { id, title: 'Learn Nova', completed: false };
  }

  @Post()
  async create(@Body(CreateTaskSchema) data: z.infer<typeof CreateTaskSchema>) {
    return { id: 2, ...data };
  }
}

async function bootstrap() {
  const app = await NovaFactory.create();
  app.includeController(TaskController);
  await app.listen(3000);
}

bootstrap();
```

This example demonstrates:

- Declarative route definitions via decorators.
- Automatic request body validation using Zod.
- Strong type inference inside handlers.
- Direct integration with the Fastify lifecycle.

---

## Philosophy

Nova aims to balance:

- Simplicity (clean developer experience).
- Structure (controller-based architecture).
- Performance (Fastify engine).
- Strong typing with runtime validation.

---

## Documentation

Complete documentation, advanced guides, and full API reference are available at:

👉 https://novadoc.pages.dev/

---

## Contributing

1. Open an issue describing the problem or proposal.
2. Submit a pull request with clear context.
3. Keep consistency with the framework’s architecture and philosophy.

---

## License
