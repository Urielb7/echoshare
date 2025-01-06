"use client";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    interests: string[];
    location: string;
    compatibilityScore?: number; // Ajout d'un score de compatibilité optionnel
  };
  onMessage: () => void;
  onFollow: () => void;
}

export default function ProfileCard({
  user,
  onMessage,
  onFollow,
}: ProfileCardProps) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar avatarUrl={user.avatarUrl} size={100} className="mx-auto" />
      <h2 className="text-center text-xl font-bold">{user.name}</h2>
      <p className="text-center text-muted-foreground">{user.location}</p>
      {user.compatibilityScore !== undefined && ( // Affichage du score de compatibilité s'il existe
        <p className="text-center text-green-500">
          Score de compatibilité : {user.compatibilityScore}%
        </p>
      )}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {user.interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground"
          >
            {interest}
          </span>
        ))}
      </div>
      {/* Masquer les boutons Envoyer un message et S'abonner */}
      {/* <div className="mt-5 flex justify-around">
        <Button onClick={onMessage}>Envoyer un message</Button>
        <Button onClick={onFollow}>{`S'abonner`}</Button>
      </div> */}
    </div>
  );
}
