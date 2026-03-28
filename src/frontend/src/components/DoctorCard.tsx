import { CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { DoctorProfile } from "../backend.d";
import StarRating from "./StarRating";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function DoctorCard({ doctor }: { doctor: DoctorProfile }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
        <div
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold"
          style={{ color: "oklch(0.52 0.13 195)" }}
        >
          {doctor.name.charAt(0)}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-sm">{doctor.name}</h3>
          {doctor.verified && (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}
        </div>
        <Badge variant="secondary" className="text-xs mb-2">
          {doctor.specialty}
        </Badge>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={Number(doctor.rating)} />
          <span className="text-xs text-muted-foreground">
            ({Number(doctor.reviewCount)})
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Clock className="w-3 h-3" />
          <span>{doctor.available ? "Available today" : "Not available"}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          ${Number(doctor.consultationFee)} consultation
        </div>
        <Link to={`/doctor/${doctor.id}`}>
          <Button
            className="w-full text-xs"
            size="sm"
            style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
          >
            Book Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
