import Image from "next/image";
import { formatBallotNumber, type Candidate } from "@/lib/site";

export function CandidateShowcase({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="candidate-showcase">
      <div className="candidate-grid">
        {candidates.map((candidate, index) => (
          <article className="candidate-card" key={candidate.slug} style={{ animationDelay: `${index * 45}ms` }}>
            <div className="candidate-media">
              <Image src={candidate.poster} alt={`Poster ${candidate.name}`} width={4000} height={2250} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
              <span className="candidate-number">{formatBallotNumber(candidate.number)}</span>
            </div>
            <div className="candidate-content">
              <p>{candidate.className}</p>
              <h3>{candidate.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
