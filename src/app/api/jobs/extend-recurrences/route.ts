import { NextResponse } from "next/server";
import { extendAllRecurrences } from "@/server/data/recurrences";

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await extendAllRecurrences();
  return NextResponse.json(result);
}
