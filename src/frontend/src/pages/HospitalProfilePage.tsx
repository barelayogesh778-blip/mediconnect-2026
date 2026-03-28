import { CheckCircle, Clock, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import StarRating from "../components/StarRating";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { sampleDoctors, sampleHospitals } from "../data/sampleData";

function waitColor(mins: number) {
  if (mins < 15) return { color: "oklch(0.5 0.15 150)", label: "Low" };
  if (mins < 30) return { color: "oklch(0.65 0.18 85)", label: "Moderate" };
  return { color: "oklch(0.55 0.2 25)", label: "High" };
}

const hospitalReviews = [
  {
    name: "Carlos R.",
    rating: 5,
    comment: "Fast ER service and very professional staff.",
  },
  {
    name: "Susan K.",
    rating: 4,
    comment: "Clean facilities and knowledgeable doctors.",
  },
];

export default function HospitalProfilePage() {
  const { id } = useParams();
  const hospital = sampleHospitals.find((h) => String(h.id) === id);
  const [bookOpen, setBookOpen] = useState(false);
  const [date, setDate] = useState("");
  const [booked, setBooked] = useState(false);

  if (!hospital)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Hospital not found.
      </div>
    );

  const doctors = sampleDoctors.filter((d) => d.hospitalId === hospital.id);
  const wait = Number(hospital.erWaitMinutes);
  const wc = waitColor(wait);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{hospital.name}</h1>
              {hospital.isSponsored && (
                <Badge
                  style={{
                    backgroundColor: "oklch(0.75 0.15 85)",
                    color: "#000",
                  }}
                >
                  Sponsored
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {hospital.address}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={Number(hospital.rating)} />
              <span className="text-sm text-muted-foreground">
                {String(hospital.reviewCount)} reviews
              </span>
            </div>
          </div>
          <Button
            onClick={() => setBookOpen(true)}
            style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> ER Wait Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: wc.color }}
            >
              {wait} min
            </div>
            <Badge style={{ backgroundColor: wc.color, color: "white" }}>
              {wc.label} Wait
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hospital.departments.map((dep) => (
                <Badge
                  key={dep}
                  variant={
                    dep === hospital.featuredDepartment
                      ? "default"
                      : "secondary"
                  }
                  style={
                    dep === hospital.featuredDepartment
                      ? { backgroundColor: "oklch(0.52 0.13 195)" }
                      : {}
                  }
                >
                  {dep === hospital.featuredDepartment && (
                    <Star className="w-3 h-3 mr-1" />
                  )}
                  {dep}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{hospital.description}</p>
        </CardContent>
      </Card>

      {doctors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Our Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <DoctorCard key={String(d.id)} doctor={d} />
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalReviews.map((r) => (
              <div
                key={r.name}
                className="border-b border-border pb-3 last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{r.name}</span>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book at {hospital.name}</DialogTitle>
          </DialogHeader>
          {booked ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold">Appointment Booked!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hospital-dept"
                  className="text-sm font-medium mb-1 block"
                >
                  Department
                </label>
                <select
                  id="hospital-dept"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm"
                >
                  {hospital.departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="hospital-date"
                  className="text-sm font-medium mb-1 block"
                >
                  Date & Time
                </label>
                <Input
                  id="hospital-date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                disabled={!date}
                onClick={() => {
                  setBooked(true);
                  setTimeout(() => {
                    setBookOpen(false);
                    setBooked(false);
                  }, 2000);
                }}
                style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
