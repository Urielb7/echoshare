"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    question:
      "Vous avez un désaccord avec un colocataire sur le partage des tâches ménagères. Que faites-vous ?",
    options: [
      "Je propose une réunion de médiation avec un tableau blanc et des marqueurs.",
      "Je fais semblant de ne pas entendre et espère que ça se résoudra tout seul.",
    ],
  },
  {
    question: "C'est vendredi soir. Quel est votre plan idéal ?",
    options: [
      "Sortie en groupe ! Plus on est de fous, plus on rit !",
      "Moi, mon lit, et un bon livre. Le paradis !",
    ],
  },
  {
    question:
      "Un ami vous demande de l'aide pour organiser une collecte de fonds, mais vous aviez prévu de passer la soirée à regarder un film. Que décidez-vous ?",
    options: [
      "Bien sûr, je vais l'aider ! C'est important de soutenir ses amis dans leurs projets.",
      "Désolé, mais j'avais vraiment prévu cette soirée pour moi. Peut-être une autre fois ?",
    ],
  },
  {
    question:
      "Un ami vous raconte ses problèmes personnels. Comment réagissez-vous ?",
    options: [
      "Je l'écoute attentivement, hoche la tête et offre des conseils réfléchis.",
      "Je hoche la tête en pensant à ce que je vais manger pour le dîner.",
    ],
  },
  {
    question:
      "Comment décririez-vous votre approche envers l'exercice physique ?",
    options: [
      "Je suis un athlète dans l'âme, prêt à relever tous les défis sportifs !",
      "Je préfère rester confortablement installé sur mon canapé, à regarder des séries sur Netflix. Mon activité physique se limite à lever la télécommande !",
    ],
  },
  {
    question:
      "Quelle valeur personnelle influence le plus vos choix dans la vie ?",
    options: [
      "La créativité. Pour moi, la vie est une toile vierge, et je suis prêt à y mettre ma touche personnelle, comme un artiste en plein élan !",
      "Le plaisir. Si ça ne me fait pas sourire, est-ce que ça vaut vraiment le coup ? Après tout, la vie est trop courte pour s'ennuyer !",
    ],
  },
  {
    question:
      "Si vous deviez choisir un animal spirituel qui représente votre rythme de sommeil, lequel serait-ce ?",
    options: [
      "Le coq. Je suis le premier à accueillir le jour (même si cela dérange mes colocataires).",
      "Le hibou. La nuit est mon royaume, et je suis toujours prêt à sortir.",
    ],
  },
];

export default function MatchingQuestionnaire() {
  const [responses, setResponses] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    if (responses.some((response) => response === "")) {
      setError("Veuillez répondre à toutes les questions avant de soumettre.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/matching/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
      });

      if (response.ok) {
        router.push("/matching/correspondances");
      } else {
        const data = await response.json();
        setError(
          data.error ||
            "Une erreur est survenue lors de la soumission du questionnaire.",
        );
      }
    } catch (error) {
      console.error("Erreur lors de l envoi du questionnaire", error);
      setError("Une erreur de réseau est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-[#2e3a59]">
        Questionnaire de Compatibilité
      </h1>
      <form className="space-y-6">
        {questions.map((q, index) => (
          <section key={index}>
            <h2 className="text-xl font-bold text-[#2e3a59]">{q.question}</h2>
            {q.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <input
                  type="radio"
                  id={`question-${index}-option-${optionIndex}`}
                  name={`question-${index}`}
                  value={option}
                  checked={responses[index] === option}
                  onChange={() => handleOptionChange(index, option)}
                  className="mr-2"
                />
                <label
                  htmlFor={`question-${index}-option-${optionIndex}`}
                  className="text-lg text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </section>
        ))}
        {error && <p className="text-red-500">{error}</p>}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#007bff] text-white transition-colors duration-300 hover:bg-[#0056b3]"
        >
          {isSubmitting ? "Soumission en cours..." : "Soumettre"}
        </Button>
      </form>

      <div className="mt-8 text-lg text-gray-700">
        {responses.some((response) => response) && (
          <div>
            <h2>Vos Réponses :</h2>
            <ul>
              {responses.map(
                (response, index) =>
                  response && (
                    <li key={index}>
                      {questions[index].question} - {response}
                    </li>
                  ),
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
