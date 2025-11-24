"use client";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import React, { FormEvent, useState } from "react";

const BookEvent = ({ slug, eventId }: { slug: string; eventId: string }) => {
  const [email, setEmail] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { success, e } = await createBooking({ slug, eventId, email });
    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      console.error("Booking creation failed");
      posthog.captureException("Booking creation failed");
    }
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for booking your slot</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
