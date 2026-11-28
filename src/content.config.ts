import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const galleryItem = z.object({
  src: z.string(),
  alt_en: z.string().optional().default(""),
  alt_es: z.string().optional().default(""),
  credit: z.string().optional().default(""),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    slug: z.string(),
    status: z.enum(["upcoming", "past", "draft"]),
    placeholder: z.boolean().default(false),
    title_en: z.string(),
    title_es: z.string(),
    subtitle_en: z.string().optional().default(""),
    subtitle_es: z.string().optional().default(""),
    date: z.date().or(z.string()),
    startTime: z.string().optional().default(""),
    endTime: z.string().optional().default(""),
    timezone: z.string().default("America/Vancouver"),
    venue: z.string().optional().default(""),
    address: z.string().optional().default(""),
    ticketsUrl: z.string().optional().default(""),
    ticketsStatus: z.enum(["open", "closed", "free", "partner", "none"]).default("none"),
    priceFrom: z.number().nullable().optional(),
    currency: z.string().optional().default("CAD"),
    age_en: z.string().optional().default(""),
    age_es: z.string().optional().default(""),
    hero: z.string().optional().default(""),
    heroIsPlaceholder: z.boolean().optional().default(false),
    gallery: z.array(galleryItem).optional().default([]),
    featured: z.boolean().optional().default(false),
    source: z.string().optional().default(""),
    dateNote_en: z.string().optional().default(""),
    dateNote_es: z.string().optional().default(""),
  }),
});

const board = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/board" }),
  schema: z.object({
    slug: z.string(),
    placeholder: z.boolean().default(true),
    name_en: z.string(),
    name_es: z.string(),
    role_en: z.string().optional().default(""),
    role_es: z.string().optional().default(""),
    photo: z.string().optional().default(""),
    order: z.number().default(0),
    permissionToPublish: z.boolean().default(false),
  }),
});

const resolutions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resolutions" }),
  schema: z.object({
    slug: z.string(),
    placeholder: z.boolean().default(false),
    example: z.boolean().default(false),
    title_en: z.string(),
    title_es: z.string(),
    date: z.date().or(z.string()),
    kind: z.enum(["minutes", "resolution", "other"]).default("minutes"),
    pdf: z.string().optional().default(""),
  }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sponsors" }),
  schema: z.object({
    slug: z.string(),
    placeholder: z.boolean().default(false),
    name: z.string(),
    tier: z.string().default("friend"),
    tierLabel_en: z.string().optional().default(""),
    tierLabel_es: z.string().optional().default(""),
    logo: z.string().optional().default(""),
    url: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    year: z.number().nullable().optional(),
    event: z.string().optional().default(""),
    source: z.string().optional().default(""),
  }),
});

const volunteerRoles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/volunteer-roles" }),
  schema: z.object({
    slug: z.string(),
    placeholder: z.boolean().default(true),
    title_en: z.string(),
    title_es: z.string(),
    order: z.number().default(0),
  }),
});


const eventJobs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/event-jobs" }),
  schema: z.object({
    slug: z.string(),
    example: z.boolean().default(true),
    title_en: z.string(),
    title_es: z.string(),
    event_en: z.string().default(""),
    event_es: z.string().default(""),
    date: z.string().optional().default(""),
    pay_en: z.string(),
    pay_es: z.string(),
    order: z.number().default(0),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/partners" }),
  schema: z.object({
    slug: z.string(),
    name_en: z.string(),
    name_es: z.string(),
    url: z.string(),
    order: z.number().default(0),
  }),
});


const danceStyle = z.object({
  id: z.string(),
  name_en: z.string(),
  name_es: z.string(),
  region: z.enum(["mx", "co"]),
  confirmed: z.boolean().default(false),
  desc_en: z.string(),
  desc_es: z.string(),
});

const dance = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dance" }),
  schema: z.object({
    slug: z.string(),
    placeholder: z.boolean().default(true),
    name_en: z.string(),
    name_es: z.string(),
    formerName: z.string().optional().default(""),
    styles: z.array(danceStyle).default([]),
  }),
});

export const collections = {
  events,
  board,
  resolutions,
  sponsors,
  volunteerRoles,
  eventJobs,
  partners,
  dance,
};
