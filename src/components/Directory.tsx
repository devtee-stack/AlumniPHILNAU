import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  graduation_year: number | null;
  profession: string | null;
  location: string | null;
  degree: string | null;
};

const Directory = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: "",
    year: "",
    location: "",
    industry: "",
  });

  // Fetch real profiles from Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, graduation_year, profession, location, degree")
        .order("full_name");

      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(data || []);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  // Filter logic
  const filteredProfiles = profiles.filter((p) => {
    if (filters.year && p.graduation_year) {
      const year = p.graduation_year.toString();
      if (filters.year === "2020-2023" && !(year >= "2020" && year <= "2023")) return false;
      if (filters.year === "2010-2019" && !(year >= "2010" && year <= "2019")) return false;
      if (filters.year === "2000-2009" && !(year >= "2000" && year <= "2009")) return false;
    }
    if (filters.location && p.location && !p.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    if (filters.industry && p.profession && !p.profession.toLowerCase().includes(filters.industry.toLowerCase()))
      return false;
    if (filters.specialization && p.degree && !p.degree.toLowerCase().includes(filters.specialization.toLowerCase()))
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p>Loading alumni directory...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Find Alumni - Directory
      </h2>

      {/* Your existing filter UI */}
      <Card className="p-6 md:p-8 shadow-lg mb-8">
        {/* Keep all your Select filters exactly as they are */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Specialization</label>
            <Select value={filters.specialization} onValueChange={(value) => setFilters({ ...filters, specialization: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="ethics">Ethics</SelectItem>
                <SelectItem value="metaphysics">Metaphysics</SelectItem>
                <SelectItem value="logic">Logic</SelectItem>
                <SelectItem value="african">African Philosophy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Graduation Year</label>
            <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="2020-2023">2020-2023</SelectItem>
                <SelectItem value="2010-2019">2010-2019</SelectItem>
                <SelectItem value="2000-2009">2000-2009</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Location</label>
            <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Industry</label>
            <Select value={filters.industry} onValueChange={(value) => setFilters({ ...filters, industry: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Search className="mr-2 h-4 w-4" />
            Search Alumni
          </Button>
          <p className="text-sm text-muted-foreground">
            {filteredProfiles.length} alumni found • Register to contact
          </p>
        </div>

        {/* Real dynamic list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((person, index) => (
            <Card
              key={person.id}
              className="p-4 hover:shadow-lg transition-all hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-4">
                <img
                  src={
                    person.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.full_name)}&background=FFD700&color=000`
                  }
                  alt={person.full_name}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gold"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary truncate">{person.full_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {person.degree || "Philosophy Alumnus"}
                    {person.graduation_year && `, ${person.graduation_year}`}
                  </p>
                  {person.profession && (
                    <p className="text-sm text-muted-foreground truncate">{person.profession}</p>
                  )}
                  {person.location && (
                    <p className="text-sm text-muted-foreground">{person.location}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No alumni match your filters yet. Be the first to complete your profile!
          </p>
        )}
      </Card>
    </div>
  );
};

export default Directory;
