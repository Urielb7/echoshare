import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        matchingResponses: {
          select: {
            interests: true,
            contentTypes: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des profils utilisateurs",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
