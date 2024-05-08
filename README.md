# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Development setup?

Add your local or remote postgres database URL in the `.env` file. See `.env.sample` file for URL pattern.

In `prisma.schema` file change the existing code of the `datasource db` with the below code. Make sure you have added `DATABASE_URL` in your `.env` file.

```
datasource db {
  provider  = "postgresql"
  url      = env("DATABASE_URL")
}
```

Install the packages using `yarn install`

Make sure your local or remote instance of the database is running before running the following commands

```
yarn db:push
```

To see if the database is created with the supporting tables run `yarn db:studio`.

To populate the DB with the categories data run `yarn db:seed`.

After all the commands executed successfully then run `yarn dev` to start the development server.
