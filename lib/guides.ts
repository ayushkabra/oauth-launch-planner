import { Guide, GuideSchema } from "./schema";

// Import all guides statically for guaranteed SSR and client performance
import googleGmail from "../data/guides/google-gmail.json";
import githubOauth from "../data/guides/github-oauth.json";
import googleClassroom from "../data/guides/google-classroom.json";
import githubApp from "../data/guides/github-app.json";
import slack from "../data/guides/slack.json";
import notion from "../data/guides/notion.json";
import hubspot from "../data/guides/hubspot.json";
import microsoftGraph from "../data/guides/microsoft-graph.json";
import spotify from "../data/guides/spotify.json";
import linear from "../data/guides/linear.json";
import twitterX from "../data/guides/twitter-x.json";
import jotform from "../data/guides/jotform.json";
import discord from "../data/guides/discord.json";
import airtable from "../data/guides/airtable.json";

const rawGuides: unknown[] = [
  githubOauth,
  googleGmail,
  googleClassroom,
  githubApp,
  slack,
  notion,
  hubspot,
  microsoftGraph,
  spotify,
  linear,
  twitterX,
  jotform,
  discord,
  airtable,
];

// Validate all guides with Zod to guarantee schema integrity
export const STATIC_GUIDES: Guide[] = rawGuides.map((raw) => {
  const result = GuideSchema.safeParse(raw);
  if (!result.success) {
    console.error("Guide schema validation error:", result.error);
    throw new Error(`Failed to validate guide data for ${(raw as any)?.appName || "unknown"}`);
  }
  return result.data;
});

export function getAllGuides(): Guide[] {
  return STATIC_GUIDES;
}

export function getGuideById(id: string): Guide | undefined {
  return STATIC_GUIDES.find((g) => g.id === id);
}

export function searchGuides(query: string, category?: string, difficulty?: string): Guide[] {
  return STATIC_GUIDES.filter((guide) => {
    const matchesQuery =
      !query ||
      guide.appName.toLowerCase().includes(query.toLowerCase()) ||
      guide.category.toLowerCase().includes(query.toLowerCase()) ||
      guide.verdict.oneLineSummary?.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = !category || category === "all" || guide.category.toLowerCase().includes(category.toLowerCase());
    const matchesDifficulty = !difficulty || difficulty === "all" || guide.verdict.difficulty === difficulty;

    return matchesQuery && matchesCategory && matchesDifficulty;
  });
}
