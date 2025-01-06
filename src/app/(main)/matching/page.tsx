import { Metadata } from "next";
import MatchingQuestionnaire from "./MatchingQuestionnaire";

export const metadata: Metadata = {
  title: "Matching",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Matching</h1>
        </div>
        <MatchingQuestionnaire />
      </div>
    </main>
  );
}
