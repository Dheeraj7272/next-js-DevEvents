"use cache";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimilarEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  label,
  alt,
}: {
  icon: string;
  label: string;
  alt: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} height={17} width={17} />
    <p>{label}</p>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="age">
    <h2>Agend</h2>
    <ul>
      {agendaItems.map((agenda) => (
        <li key={agenda}>{agenda}</li>
      ))}
    </ul>
  </div>
);
const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  console.log(slug);
  if (!BASE_URL) throw new Error("Base url not found");
  if (!slug || (slug as string).trim()?.length == 0)
    console.log("Invalid slug");
  const eventDetails = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (!eventDetails.ok) return notFound();
  const data = await eventDetails.json();
  console.log(data, "eventDetails");
  const {
    description,
    agenda,
    tags,
    title,
    date,
    overview,
    image,
    time,
    mode,
    audience,
    location,
    organizer,
  } = data.event;
  const bookings = 10;

  const similarEvents = await getSimilarEvents(slug);
  console.log(similarEvents[0], "similarEvents");
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt={title ? title + "Image" : "Event image"}
            width={800}
            height={800}
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        <aside className="booking">
          <div className="signup-card">
            <h2>Book your slot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their slot
              </p>
            ) : (
              <p className="text-sm">Be the first to book your slot!</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
      <div className="flex flex-col pt-20 gap-4 w-full">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents?.length
            ? similarEvents.map((similarEvent: any) => (
                <EventCard key={similarEvent._id} {...similarEvent} />
              ))
            : undefined}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
