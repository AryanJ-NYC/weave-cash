# Troubleshooting

## Prisma

### Environment variable not found: DATABASE_URL

When running Prisma commands from `packages/database/`, you may see:

```
Error: Environment variable not found: DATABASE_URL.
  -->  prisma/schema.prisma:7
```

**Solution**: Place a `.env` file in `packages/database/prisma/` with the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://weave:weave@localhost:5432/weave_cash"
```

**Why this happens**: Prisma looks for `.env` files relative to the `schema.prisma` location, not the monorepo root. In a monorepo setup where the root `.env` contains shared environment variables, Prisma won't automatically find them.

**Alternative approaches** (not used in this project):
- Use `dotenv-cli` to load the root `.env`: `dotenv -e ../../.env -- prisma migrate dev`
- Symlink the root `.env` to the prisma folder
- Set the env var inline: `DATABASE_URL="..." prisma migrate dev`
