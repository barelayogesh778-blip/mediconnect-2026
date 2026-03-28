import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { DoctorProfile, Hospital } from "../backend.d";
import DoctorCard from "../components/DoctorCard";
import HospitalCard from "../components/HospitalCard";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { sampleDoctors, sampleHospitals } from "../data/sampleData";

const specialties = [
  "All",
  "Cardiologist",
  "Pediatrician",
  "Orthopedist",
  "Neurologist",
  "Dermatologist",
  "General Practitioner",
];

const symptomMap: Record<string, string[]> = {
  "chest pain": ["Cardiologist"],
  heart: ["Cardiologist"],
  fever: ["Pediatrician", "General Practitioner"],
  child: ["Pediatrician"],
  knee: ["Orthopedist"],
  back: ["Orthopedist"],
  headache: ["Neurologist"],
  rash: ["Dermatologist"],
  skin: ["Dermatologist"],
  general: ["General Practitioner"],
};

export default function FindCarePage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [specialty, setSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [suggestedSpecialties, setSuggestedSpecialties] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const q = query.toLowerCase();
    const matched = new Set<string>();
    for (const [kw, specs] of Object.entries(symptomMap)) {
      if (q.includes(kw)) {
        for (const s of specs) matched.add(s);
      }
    }
    setSuggestedSpecialties(Array.from(matched));
  }, [query]);

  const filteredDoctors: DoctorProfile[] = sampleDoctors.filter((d) => {
    const matchQ =
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty.toLowerCase().includes(query.toLowerCase()) ||
      d.bio.toLowerCase().includes(query.toLowerCase());
    const matchS = specialty === "All" || d.specialty === specialty;
    return matchQ && matchS;
  });

  const filteredHospitals: Hospital[] = sampleHospitals.filter((h) => {
    return (
      !query ||
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.departments.some((dep) =>
        dep.toLowerCase().includes(query.toLowerCase()),
      )
    );
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
    if (sortBy === "fee")
      return Number(a.consultationFee) - Number(b.consultationFee);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find Care</h1>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search symptoms, doctors, specialties…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-border rounded-md px-3 text-sm bg-white"
        >
          <option value="rating">Sort: Top Rated</option>
          <option value="fee">Sort: Lowest Fee</option>
        </select>
      </div>

      {suggestedSpecialties.length > 0 && (
        <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
          <span className="text-sm text-teal-700 font-medium">
            Based on your search, you may need:{" "}
          </span>
          {suggestedSpecialties.map((s) => (
            <button type="button" key={s} onClick={() => setSpecialty(s)}>
              <Badge
                className="ml-2 cursor-pointer"
                style={{ backgroundColor: "oklch(0.52 0.13 195)" }}
              >
                {s}
              </Badge>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {specialties.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setSpecialty(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              specialty === s
                ? "text-white border-transparent"
                : "border-border text-muted-foreground hover:border-teal-400"
            }`}
            style={
              specialty === s ? { backgroundColor: "oklch(0.52 0.13 195)" } : {}
            }
          >
            {s}
          </button>
        ))}
      </div>

      <Tabs defaultValue="doctors">
        <TabsList className="mb-6">
          <TabsTrigger value="doctors">
            Doctors ({sortedDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="hospitals">
            Hospitals ({filteredHospitals.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="doctors">
          {sortedDoctors.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No doctors found. Try a different search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDoctors.map((d) => (
                <DoctorCard key={String(d.id)} doctor={d} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="hospitals">
          {filteredHospitals.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No hospitals found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map((h) => (
                <HospitalCard key={String(h.id)} hospital={h} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
