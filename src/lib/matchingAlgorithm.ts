export function matchUsers(userResponses: string[], allResponses: any[]) {
  const matches = allResponses
    .map((response) => {
      const otherAnswers = response.responses; // Assurez-vous que 'responses' existe sur 'response'

      // Calculer le score de compatibilité
      const compatibilityScore = calculateCompatibility(
        userResponses, // Utilisez directement userResponses
        otherAnswers,
      );

      return {
        user: response.user, // Inclure les informations de l'utilisateur
        compatibilityScore, // Inclure le score de compatibilité
      };
    })
    .filter((match) => match.compatibilityScore > 0); // Filtrer les utilisateurs sans compatibilité

  return matches;
}

function calculateCompatibility(
  userResponses: string[],
  otherResponses: string[],
) {
  let score = 0;
  for (let i = 0; i < userResponses.length; i++) {
    if (userResponses[i] === otherResponses[i]) {
      score++;
    }
  }
  return (score / userResponses.length) * 100; // Pourcentage de compatibilité
}
