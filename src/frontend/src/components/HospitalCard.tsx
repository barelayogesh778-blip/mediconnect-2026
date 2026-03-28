import { Clock, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { Hospital } from "../backend.d";
import StarRating from "./StarRating";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

function waitColor(mins: number) {
  if (mins < 15) return "text-green-600";
  if (mins < 30) return "text-yellow-600";
  return "text-red-600";
}

export default function HospitalCard({ hospital }: { hospital: Hospital }) {
  const wait = Number(hospital.erWaitMinutes);
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center relative">
        <div className="text-4xl">🏥</div>
        {hospital.isSponsored && (
          <Badge
            className="absolute top-2 right-2 text-xs"
            style={{ backgroundColor: "oklch(0.75 0.15 85)", color: "#000" }}
          >
            Sponsored
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1">{hospital.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{hospital.address}</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={Number(hospital.rating)} />
          <span className="text-xs text-muted-foreground">
            ({Number(hospital.reviewCount)})
          </span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium mb-2 ${waitColor(wait)}`}
        >
          <Clock className="w-3 h-3" />
          <span>ER Wait: {wait} min</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {hospital.departments.slice(0, 3).map((d) => (
            <Badge key={d} variant="outline" className="text-xs px-1.5 py-0">
              {d}
            </Badge>
          ))}
          {hospital.departments.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{hospital.departments.length - 3}
            </Badge>
          )}
        </div>
        <Link to={`/hospital/${hospital.id}`}>
          <Button
            className="w-full text-xs"
            size="sm"
            style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
          >
            View & Book
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
