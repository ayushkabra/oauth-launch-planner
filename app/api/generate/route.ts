import { NextRequest, NextResponse } from "next/server";
import { investigateAppLive } from "@/lib/agent-investigator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const result = await investigateAppLive(query);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/generate error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate guide" },
      { status: 500 }
    );
  }
}
