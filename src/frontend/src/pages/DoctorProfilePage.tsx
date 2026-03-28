import { Award, Calendar, CheckCircle, Video } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
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

const reviews = [
  {
    name: "Alice M.",
    rating: 5,
    comment: "Incredibly thorough and compassionate.",
  },
  { name: "John T.", rating: 4, comment: "Great doctor, highly recommended." },
  {
    name: "Maria L.",
    rating: 5,
    comment: "Best specialist I've seen in years.",
  },
];

export default function DoctorProfilePage() {
  const { id } = useParams();
  const doctor = sampleDoctors.find((d) => String(d.id) === id);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookingType, setBookingType] = useState("consultation");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState(false);

  if (!doctor)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Doctor not found.
      </div>
    );

  const hospital = sampleHospitals.find((h) => h.id === doctor.hospitalId);

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => {
      setBookOpen(false);
      setBooked(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div
          className="w-32 h-32 rounded-2xl flex items-center justify-center text-5xl font-bold flex-shrink-0"
          style={{
            backgroundColor: "oklch(0.92 0.04 195)",
            color: "oklch(0.52 0.13 195)",
          }}
        >
          {doctor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{doctor.name}</h1>
            {doctor.verified && (
              <Badge
                className="flex items-center gap-1"
                style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
              >
                <CheckCircle className="w-3 h-3" /> Verified
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="mb-3">
            {doctor.specialty}
          </Badge>
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={Number(doctor.rating)} />
            <span className="text-sm text-muted-foreground">
              {String(doctor.reviewCount)} reviews
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Award className="w-4 h-4" />
            {doctor.credentials}
          </div>
          {hospital && (
            <div className="text-sm text-muted-foreground">
              📍 {hospital.name}
            </div>
          )}
          <div
            className="mt-3 text-sm font-semibold"
            style={{ color: "oklch(0.52 0.13 195)" }}
          >
            ${Number(doctor.consultationFee)} per consultation
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setBookOpen(true)}
            style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
          >
            Book Appointment
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Video className="w-4 h-4" /> Telehealth
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{doctor.bio}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant={doctor.available ? "default" : "secondary"}
            style={
              doctor.available
                ? { backgroundColor: "oklch(0.52 0.13 195)" }
                : {}
            }
          >
            {doctor.available ? "Available Today" : "Currently Unavailable"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((r) => (
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
            <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          </DialogHeader>
          {booked ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold">Appointment Booked!</p>
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="booking-type"
                  className="text-sm font-medium mb-1 block"
                >
                  Appointment Type
                </label>
                <select
                  id="booking-type"
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="consultation">Consultation</option>
                  <option value="diagnostic">Diagnostic Test</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="booking-date"
                  className="text-sm font-medium mb-1 block"
                >
                  Preferred Date & Time
                </label>
                <Input
                  id="booking-date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="booking-notes"
                  className="text-sm font-medium mb-1 block"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="booking-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Describe your symptoms or reason for visit…"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleBook}
                disabled={!date}
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
