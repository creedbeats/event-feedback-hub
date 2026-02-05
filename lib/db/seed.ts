import { db, initializeDatabase, schema } from "./index";
import { v4 as uuidv4 } from "uuid";

const sampleEvents = [
  {
    id: uuidv4(),
    name: "React Summit 2024",
    description: "Annual conference covering the latest in React ecosystem",
    date: "2024-06-15",
  },
  {
    id: uuidv4(),
    name: "TypeScript Workshop",
    description: "Hands-on workshop for advanced TypeScript patterns",
    date: "2024-07-20",
  },
  {
    id: uuidv4(),
    name: "GraphQL Webinar",
    description: "Introduction to GraphQL and best practices",
    date: "2024-08-10",
  },
  {
    id: uuidv4(),
    name: "Next.js Conference",
    description: "Deep dive into Next.js features and deployment strategies",
    date: "2024-09-05",
  },
  {
    id: uuidv4(),
    name: "DevOps Bootcamp",
    description: "Intensive bootcamp on CI/CD and cloud infrastructure",
    date: "2024-10-12",
  },
];

export async function seed() {
  initializeDatabase();

  const existingEvents = db.select().from(schema.events).all();

  if (existingEvents.length === 0) {
    for (const event of sampleEvents) {
      db.insert(schema.events).values(event).run();
    }
    console.log(`Seeded ${sampleEvents.length} events`);
  } else {
    console.log("Events already exist, skipping seed");
  }
}

if (require.main === module) {
  seed();
}
