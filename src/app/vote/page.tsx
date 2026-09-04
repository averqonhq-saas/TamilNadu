"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VotingBallot from "@/components/voting/VotingBallot";
import VotingSuccess from "@/components/voting/VotingSuccess";
import VotingResults from "@/components/voting/VotingResults";
import VotingNotStarted from "@/components/voting/VotingNotStarted";
import {
  DEFAULT_CAMPAIGN,
  DEFAULT_SHORTLISTED_IDEAS,
  ShortlistedIdea,
  CampaignStatus,
} from "@/lib/constants/campaign";
import { Loader2 } from "lucide-react";

function VotePageContent() {
  const searchParams = useSearchParams();
  const previewState = searchParams?.get("state") as CampaignStatus | null;

  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<CampaignStatus>(previewState || DEFAULT_CAMPAIGN.status);
  const [votingEnd, setVotingEnd] = useState<Date | string | null>(DEFAULT_CAMPAIGN.voting_end);
  const [votingStart, setVotingStart] = useState<Date | string | null>(DEFAULT_CAMPAIGN.voting_start);
  const [shortlisted, setShortlisted] = useState<ShortlistedIdea[]>(DEFAULT_SHORTLISTED_IDEAS);
  const [userVoted, setUserVoted] = useState(false);
  const [votedIdea, setVotedIdea] = useState<ShortlistedIdea | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string>("");

  useEffect(() => {
    async function loadVoteStatus() {
      try {
        const res = await fetch("/api/vote");
        if (res.ok) {
          const data = await res.json();
          if (previewState) {
            setStatus(previewState);
          } else if (data.status) {
            setStatus(data.status);
          }
          if (data.voting_end) setVotingEnd(data.voting_end);
          if (data.voting_start) setVotingStart(data.voting_start);
          if (data.shortlisted_ideas) setShortlisted(data.shortlisted_ideas);

          if (data.user_voted && data.voted_idea_id) {
            setUserVoted(true);
            const found = (data.shortlisted_ideas || DEFAULT_SHORTLISTED_IDEAS).find(
              (i: ShortlistedIdea) => i.id === data.voted_idea_id || i.public_id === data.voted_idea_id
            );
            if (found) setVotedIdea(found);
          }
        }
      } catch (err) {
        console.error("Failed to load voting status", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadVoteStatus();
  }, [previewState]);

  const handleVoteSuccess = (payload: { idea: ShortlistedIdea; emailMasked: string }) => {
    setVotedIdea(payload.idea);
    setMaskedEmail(payload.emailMasked);
    setUserVoted(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {isLoading ? (
          <div className="pt-32 pb-24 flex items-center justify-center text-[#64748b]">
            <Loader2 size={32} className="animate-spin text-[#e85d26]" />
          </div>
        ) : userVoted && votedIdea ? (
          <VotingSuccess
            votedIdea={votedIdea}
            maskedEmail={maskedEmail}
            votingEnd={votingEnd}
            onResetVote={() => {
              setUserVoted(false);
              setVotedIdea(null);
              setMaskedEmail("");
            }}
          />
        ) : status === "RESULTS" || status === "WINNER" ? (
          <VotingResults ideas={shortlisted} />
        ) : status === "VOTING" ? (
          <VotingBallot
            shortlistedIdeas={shortlisted}
            votingEnd={votingEnd}
            onVoteSuccess={handleVoteSuccess}
          />
        ) : (
          <VotingNotStarted
            shortlistedIdeas={shortlisted}
            votingStart={votingStart}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export default function VotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
          <Loader2 size={36} className="animate-spin text-[#e85d26]" />
        </div>
      }
    >
      <VotePageContent />
    </Suspense>
  );
}
