import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type Job = {
  title: string;
  link: string;
  pubDate: string;
  institution?: string;
};

export default function PhilosophyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Free proxy that converts RSS → JSON (no backend needed!)
        const proxy = "https://api.allorigins.win/get?url=";
        const feeds = [
          "https://www.myjobmag.com/jobsxml.xml",
        ];

        const allJobs: Job[] = [];

        for (const feed of feeds) {
          const response = await fetch(proxy + encodeURIComponent(feed));
          const data = await response.json();
          const parser = new DOMParser();
          const xml = parser.parseFromString(data.contents, "text/xml");
          const items = xml.querySelectorAll("item");

          items?.forEach((item) => {
            allJobs.push({
              title: item.querySelector("title")?.textContent || "",
              link: item.querySelector("link")?.textContent || "",
              pubDate: item.querySelector("pubDate")?.textContent || "",
              institution: item.textContent?.match(/Institution: (.*)/)?.[1],
            });
          });
        }

        // Sort by date & take newest 8
        allJobs.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        setJobs(allJobs.slice(0, 8));
      } catch (e) {
        console.error("RSS fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading latest philosophy jobs...</div>;

  return (
    <div className="space-y-4">
      {jobs.map((job, i) => (
        <Card
          key={i}
          className="p-4 md:p-6 hover:shadow-md transition-all animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-primary mt-1 flex-shrink-0">💼</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {job.institution && `${job.institution} • `}Posted {new Date(job.pubDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
              asChild
            >
              <a href={job.link} target="_blank" rel="noopener">
                View Job <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
