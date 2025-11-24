// "use client";

import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
// import { events } from "@/lib/constants";
import { cacheLife } from "next/cache";

const page = async () => {
  "use cache";
  cacheLife("hours");
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`;
const response = await fetch(url);

// Defensive check before parsing JSON
if (!response.ok) {
  const text = await response.text();
  console.error('Failed to fetch events (status', response.status, '):', text);
  // handle fallback UI or throw a helpful error
  throw new Error(`Failed to fetch events: ${response.status} ${text}`);
}

const { events } = await response.json();
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event: any) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
