import { getIsAdmin } from "@/lib/admin";
import swaggerJsdoc from "swagger-jsdoc";
import { schemas } from "./schema";
import { tags } from "./tags";

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Langsuit API Documentation",
      version: "1.0.0",
      description: "API endpoints for Langsuit language learning platform",
    },
    tags: tags,
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        description:
          capitalizeFirstLetter(process.env.ENVIRONMENT || "development") +
          " Server",
      },
    ],
    components: {
      schemas,
    },
  },
  apis: ["./app/api/**/*.ts", "./app/api/**/*.tsx"],
};

export async function GET() {
  if (process.env.ENVIRONMENT === "production") {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const spec = swaggerJsdoc(options);
  return Response.json(spec);
}
