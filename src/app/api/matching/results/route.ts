import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { matchUsers } from "@/lib/matchingAlgorithm"; // Importation de l'algorithme de matching

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer la réponse la plus récente de l'utilisateur
    const userResponse = await prisma.matchingResponse.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!userResponse) {
      return Response.json(
        { error: "No matching response found" },
        { status: 404 },
      );
    }

    // Récupérer toutes les réponses sauf celle de l'utilisateur actuel
    const allResponses = await prisma.matchingResponse.findMany({
      where: {
        userId: {
          not: user.id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Utiliser l'algorithme de matching pour trouver les correspondances
    const matches = matchUsers(userResponse.responses, allResponses);

    // Trier les résultats par score de compatibilité décroissant
    matches.sort(
      (a: { compatibilityScore: number }, b: { compatibilityScore: number }) =>
        b.compatibilityScore - a.compatibilityScore,
    );

    return Response.json(matches);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
