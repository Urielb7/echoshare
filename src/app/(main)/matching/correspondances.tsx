"use client"; // Ajoutez cette ligne en haut du fichier

import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import ky from "ky";
import { FaSyncAlt } from "react-icons/fa";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  matchingResponses: {
    interests: string[];
    location: string;
    contentTypes: string[];
    values: number;
  };
}

const Correspondances = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await ky.get("/api/users/profiles").json<UserProfile[]>();
      setProfiles(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des profils utilisateurs",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => {
      const shuffledProfiles = profiles.sort(() => 0.5 - Math.random());
      setDisplayedProfiles(shuffledProfiles.slice(0, 3)); // Affiche 3 profils
      setSpinning(false);
    }, 2000); // Durée du spin en millisecondes
  };

  const handleSendMessage = (userId: string) => {
    // Logique pour envoyer un message
    console.log("Envoyer un message à", userId);
  };

  const handleFollow = (userId: string) => {
    // Logique pour s'abonner à l'utilisateur
    console.log("S'abonner à", userId);
  };

  return (
    <div className="w-full min-w-0 space-y-5">
      <h1 className="text-center text-2xl font-bold">Correspondances</h1>
      <p className="text-center text-green-500">
        Bravo ! Vous avez trouvé une nouvelle correspondance !
      </p>
      <div className="my-5 flex justify-center">
        <button
          onClick={handleSpin}
          className="flex transform items-center justify-center rounded-full bg-primary p-3 text-white shadow-lg transition-transform hover:scale-110"
        >
          <FaSyncAlt className={`mr-2 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Recherche..." : "Tourner"}
        </button>
      </div>
      <div className="flex justify-center space-x-5">
        {displayedProfiles.map((user) => (
          <ProfileCard
            key={user.id}
            user={{
              id: user.id,
              name: user.displayName || user.username,
              avatarUrl: user.avatarUrl,
              interests: user.matchingResponses?.interests || [],
              location: user.matchingResponses?.location || "Non spécifiée",
              compatibilityScore: calculateCompatibilityScore(
                user.matchingResponses,
              ),
            }}
            onMessage={() => handleSendMessage(user.id)}
            onFollow={() => handleFollow(user.id)}
          />
        ))}
      </div>
    </div>
  );
};

const calculateCompatibilityScore = (
  matchingResponses: UserProfile["matchingResponses"],
) => {
  // Logique pour calculer le score de compatibilité
  return Math.floor(Math.random() * 100); // Exemple de score aléatoire
};

export default Correspondances;
