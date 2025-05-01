import { getIsAdmin } from "@/lib/admin";
import { createSwaggerSpec } from "next-swagger-doc";
import { schemas } from "./schema";
import { tags } from "./tags";

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export async function GET() {
  console.log(process.env.NODE_ENV);
  console.log(getIsAdmin());

  if (process.env.ENVIRONMENT === "production") {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const spec = createSwaggerSpec({
    apiFolder: "app/api",
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
  });

  return Response.json(spec);
}
