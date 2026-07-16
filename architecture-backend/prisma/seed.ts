import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";

const baseCategories = [
  { name: "Architecture", slug: "architecture" },
  { name: "Residential", slug: "residential" },
  { name: "Commercial", slug: "commercial" },
  { name: "Education", slug: "education" },
  { name: "Cultural", slug: "cultural" },
  { name: "Landscape", slug: "landscape" },
  { name: "Interior", slug: "interior" },
  { name: "Product Design", slug: "product-design" },
];

const offices = [
  { name: "Copenhagen Studio", slug: "copenhagen-studio", city: "Copenhagen", country: "Denmark", address: "Strandgade 27B", phone: "+45 33 33 33 33", email: "cph@example.com", latitude: 55.6761, longitude: 12.5683, published: true, sortOrder: 1 },
  { name: "Aarhus Studio", slug: "aarhus-studio", city: "Aarhus", country: "Denmark", address: "Åboulevarden 88", phone: "+45 86 86 86 86", email: "aarhus@example.com", latitude: 56.1629, longitude: 10.2039, published: true, sortOrder: 2 },
  { name: "Oslo Studio", slug: "oslo-studio", city: "Oslo", country: "Norway", address: "Akershusstranda 21", phone: "+47 22 22 22 22", email: "oslo@example.com", latitude: 59.9115, longitude: 10.7334, published: true, sortOrder: 3 },
];

const people = [
  { name: "Lars Andersen", slug: "lars-andersen", jobTitle: "Partner", biography: "Founding partner with 30 years of experience.", email: "la@example.com", published: true, sortOrder: 1 },
  { name: "Mette Nielsen", slug: "mette-nielsen", jobTitle: "Senior Architect", biography: "Specializes in residential and cultural projects.", email: "mn@example.com", published: true, sortOrder: 2 },
  { name: "Søren Hansen", slug: "soren-hansen", jobTitle: "Architect", biography: "Focuses on commercial and mixed-use developments.", email: "sh@example.com", published: true, sortOrder: 3 },
  { name: "Anna Jensen", slug: "anna-jensen", jobTitle: "Interior Designer", biography: "Leads the interior design team.", email: "aj@example.com", published: true, sortOrder: 4 },
  { name: "Peter Petersen", slug: "peter-petersen", jobTitle: "Landscape Architect", biography: "Designs public spaces and landscapes.", email: "pp@example.com", published: true, sortOrder: 5 },
  { name: "Kirsten Møller", slug: "kirsten-moller", jobTitle: "Urban Planner", biography: "Works on large-scale urban development.", email: "km@example.com", published: true, sortOrder: 6 },
  { name: "Thomas Christensen", slug: "thomas-christensen", jobTitle: "Project Manager", biography: "Manages complex construction projects.", email: "tc@example.com", published: false, sortOrder: 7 },
  { name: "Maria Rasmussen", slug: "maria-rasmussen", jobTitle: "Junior Architect", biography: "Recent graduate with a passion for sustainable design.", email: "mr@example.com", published: true, sortOrder: 8 },
];

const newsItems = [
  { title: "New Office Opening in Oslo", slug: "new-office-opening-in-oslo", excerpt: "We are excited to announce our new studio in Oslo.", content: "We are expanding our presence in Scandinavia with a new office in Oslo, Norway. The studio will focus on urban planning and public buildings.", published: true, featured: true, publishedAt: new Date("2024-06-15") },
  { title: "Completed: The Harbour Front Project", slug: "completed-harbour-front-project", excerpt: "One of our largest residential projects to date.", content: "The Harbour Front project in Copenhagen has been successfully completed, featuring 200 apartments and commercial spaces.", published: true, featured: false, publishedAt: new Date("2024-04-10") },
  { title: "Awards 2024: Double Recognition", slug: "awards-2024-double-recognition", excerpt: "Two of our projects received international awards.", content: "We are proud to announce that two of our projects have been recognized at the International Architecture Awards 2024.", published: true, featured: true, publishedAt: new Date("2024-03-20") },
  { title: "Sustainability Report 2023 Published", slug: "sustainability-report-2023", excerpt: "Read our latest sustainability report.", content: "Our commitment to sustainable architecture is documented in the annual sustainability report, now available for download.", published: true, featured: false, publishedAt: new Date("2024-01-05") },
  { title: "Upcoming: Lecture Series Spring 2025", slug: "lecture-series-spring-2025", excerpt: "Join our public lecture series.", content: "Our spring 2025 lecture series will feature speakers from leading architecture firms worldwide. Registration opens in December.", published: false, featured: false },
];

const partners = [
  { name: "SOM", slug: "som", website: "https://www.som.com", description: "Skidmore, Owings & Merrill – structural engineering and design." },
  { name: "Arup", slug: "arup", website: "https://www.arup.com", description: "Global engineering and consulting firm." },
  { name: "Ramboll", slug: "ramboll", website: "https://www.ramboll.com", description: "Danish engineering and consulting group." },
  { name: "COBE", slug: "cobe", website: "https://www.cobe.dk", description: "Copenhagen-based architecture studio." },
  { name: "Henning Larsen", slug: "henning-larsen", website: "https://www.henninglarsen.com", description: "International architecture firm rooted in Scandinavian design." },
];

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function main() {
  const databaseUrl = requireEnv("DATABASE_URL");
  const adminName = requireEnv("ADMIN_NAME");
  const adminEmail = requireEnv("ADMIN_EMAIL").trim().toLowerCase();
  const adminPassword = requireEnv("ADMIN_PASSWORD");
  const saltRounds = Number(requireEnv("BCRYPT_SALT_ROUNDS"));

  if (!Number.isInteger(saltRounds) || saltRounds < 10 || saltRounds > 14) {
    throw new Error("BCRYPT_SALT_ROUNDS must be an integer between 10 and 14");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const password = await bcrypt.hash(adminPassword, saltRounds);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: adminName,
        password,
        role: UserRole.ADMIN,
        isActive: true,
        refreshTokenHash: null,
        tokenVersion: { increment: 1 },
      },
      create: {
        name: adminName,
        email: adminEmail,
        password,
        role: UserRole.ADMIN,
        isActive: true,
      },
      select: { id: true },
    });

    await Promise.all(
      baseCategories.map((category) =>
        prisma.category.upsert({
          where: { slug: category.slug },
          update: { name: category.name },
          create: category,
          select: { id: true },
        }),
      ),
    );

    for (const office of offices) {
      await prisma.office.upsert({
        where: { slug: office.slug },
        update: { name: office.name, city: office.city, country: office.country, address: office.address, phone: office.phone, email: office.email, latitude: office.latitude, longitude: office.longitude, published: office.published, sortOrder: office.sortOrder },
        create: office,
        select: { id: true },
      });
    }

    const officeIds = await prisma.office.findMany({ select: { id: true, slug: true } });
    const cphOffice = officeIds.find((o) => o.slug === "copenhagen-studio");
    const aarhusOffice = officeIds.find((o) => o.slug === "aarhus-studio");
    const osloOffice = officeIds.find((o) => o.slug === "oslo-studio");

    for (let i = 0; i < people.length; i++) {
      let officeId: string | undefined;
      if (i < 3) officeId = cphOffice?.id;
      else if (i < 5) officeId = aarhusOffice?.id;
      else if (i < 7) officeId = osloOffice?.id;

      await prisma.person.upsert({
        where: { slug: people[i].slug },
        update: { ...people[i], officeId },
        create: { ...people[i], officeId },
        select: { id: true },
      });
    }

    for (const news of newsItems) {
      await prisma.news.upsert({
        where: { slug: news.slug },
        update: { title: news.title, excerpt: news.excerpt, content: news.content, published: news.published, featured: news.featured, publishedAt: news.publishedAt },
        create: news,
        select: { id: true },
      });
    }

    for (const partner of partners) {
      await prisma.partner.upsert({
        where: { slug: partner.slug },
        update: { name: partner.name, website: partner.website, description: partner.description },
        create: partner,
        select: { id: true },
      });
    }

    console.log("Seed completed");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  console.error(message);
  process.exitCode = 1;
});
