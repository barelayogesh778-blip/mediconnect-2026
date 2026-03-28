import { Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { sampleEvents } from "../data/sampleData";

const eventTypeLabel = (ev: { eventType: unknown }) => {
  const t = ev.eventType as Record<string, unknown>;
  if ("webinar" in t) return "Webinar";
  if ("popupClinic" in t) return "Pop-Up Clinic";
  return "Nutrition Tour";
};

const eventTypeColor: Record<string, string> = {
  Webinar: "oklch(0.52 0.13 195)",
  "Pop-Up Clinic": "oklch(0.5 0.15 150)",
  "Nutrition Tour": "oklch(0.65 0.18 85)",
};

export default function EventsPage() {
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Webinar", "Pop-Up Clinic", "Nutrition Tour"];
  const filtered =
    filter === "All"
      ? sampleEvents
      : sampleEvents.filter((ev) => eventTypeLabel(ev) === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Community Events</h1>
      <p className="text-muted-foreground mb-6">
        Free screenings, expert webinars, and nutrition programs near you
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              filter === f
                ? "text-white border-transparent"
                : "border-border text-muted-foreground"
            }`}
            style={
              filter === f ? { backgroundColor: "oklch(0.52 0.13 195)" } : {}
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((ev) => {
          const label = eventTypeLabel(ev);
          return (
            <Card
              key={String(ev.id)}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-5">
                <Badge
                  className="mb-3 text-xs"
                  style={{
                    backgroundColor: eventTypeColor[label],
                    color: "white",
                  }}
                >
                  {label}
                </Badge>
                <h3 className="font-bold text-lg mb-2">{ev.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {ev.description}
                </p>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {ev.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(ev.dateTime).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    Organized by {ev.organizer}
                  </div>
                </div>
                <Button
                  size="sm"
                  style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
                >
                  Register / Learn More
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
