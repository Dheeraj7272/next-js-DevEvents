import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Define route params type for type safety
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();
    const { slug } = await params;
    if (!slug || slug.trim().length == 0 || typeof slug != "string")
      return NextResponse.json(
        { mesage: "Invalid event slug entered" },
        { status: 400 }
      );

    const sanitizedSlug = slug?.trim().toLowerCase();
    const foundEvent = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!foundEvent) {
      return NextResponse.json(
        { mesage: "Event with given slug not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Event with given slug data found", event: foundEvent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
