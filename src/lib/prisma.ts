import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

prisma
  .$connect()
  .then(() => {
    console.log("Connected to PostgreSQL !");
  })
  .catch((e: Error) => {
    console.error("Error connecting to PostgreSQL: ", e);
    process.exit(1);
  });

export { prisma };
