import { getCollection, type CollectionEntry } from "astro:content";
import { isUpcoming } from "./dates";

export async function allEvents(): Promise<CollectionEntry<"events">[]> {
  const list = await getCollection("events");
  return list.sort((a, b) => {
    const da = new Date(a.data.date).getTime();
    const db = new Date(b.data.date).getTime();
    return db - da;
  });
}

export function splitEvents(list: CollectionEntry<"events">[]) {
  const upcoming = list
    .filter((e) => e.data.status !== "draft" && isUpcoming(e.data.date, e.data.endTime))
    .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
  const past = list.filter(
    (e) => e.data.status !== "draft" && !isUpcoming(e.data.date, e.data.endTime)
  );
  return { upcoming, past };
}
