"use server";
import { Booking } from "@/database";
import connectDB from "../mongodb";

export const createBooking = async ({
  email,
  slug,
  eventId,
}: {
  email: string;
  slug: string;
  eventId: string;
}) => {
  try {
    await connectDB();
    await Booking.create({ eventId, slug, email });
    return { success: true };
  } catch (error) {
    console.error(error || "Something went wrong!");
    return { success: false, e: error };
  }
};
