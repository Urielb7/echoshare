import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { responses } = await req.json(); // Assurez-vous de récupérer ces champs

    // Créer une nouvelle entrée dans la base de données
    await prisma.matchingResponse.create({
      data: {
        userId: user.id,
        responses: responses,
        // Vous pouvez ajouter d'autres champs si nécessaire, comme une date de soumission
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
