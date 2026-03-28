import { Star } from "lucide-react";

const STAR_POSITIONS = ["1st", "2nd", "3rd", "4th", "5th"];

export default function StarRating({
  rating,
  max = 5,
}: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {STAR_POSITIONS.slice(0, max).map((pos, i) => (
        <Star
          key={pos}
          className="w-3.5 h-3.5"
          fill={i < rating ? "oklch(0.75 0.15 85)" : "none"}
          stroke={i < rating ? "oklch(0.75 0.15 85)" : "oklch(0.7 0 0)"}
        />
      ))}
    </div>
  );
}
