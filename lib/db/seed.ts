import { db, initializeDatabase, schema } from "./index";

const sampleEvents = [
  {
    name: "React Summit 2024",
    description: "Annual conference covering the latest in React ecosystem",
    date: "2024-06-15",
  },
  {
    name: "TypeScript Workshop",
    description: "Hands-on workshop for advanced TypeScript patterns",
    date: "2024-07-20",
  },
  {
    name: "GraphQL Webinar",
    description: "Introduction to GraphQL and best practices",
    date: "2024-08-10",
  },
  {
    name: "Next.js Conference",
    description: "Deep dive into Next.js features and deployment strategies",
    date: "2024-09-05",
  },
  {
    name: "DevOps Bootcamp",
    description: "Intensive bootcamp on CI/CD and cloud infrastructure",
    date: "2024-10-12",
  },
];

export async function seed() {
  await initializeDatabase();

  const existingEvents = await db.select().from(schema.events);

  if (existingEvents.length === 0) {
    await db.insert(schema.events).values(sampleEvents);
    console.log(`Seeded ${sampleEvents.length} events`);
  } else {
    console.log("Events already exist, skipping seed");
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
