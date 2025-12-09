import { Card } from "@/components/ui/card";
import PhilosophyJobs from "./PhilosophyJobs";

interface CareersProps {
  openAuthModal: () => void;
}

const Careers = ({ openAuthModal }: CareersProps) => {

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Career Opportunities
      </h2>
      <Card className="p-6 md:p-8 shadow-lg">
        <p className="text-muted-foreground mb-6">
          Latest philosophy and ethics job opportunities from leading academic sources. Click "View Job" to apply directly on the source website.
        </p>
        <PhilosophyJobs />
      </Card>
    </div>
  );
};

export default Careers;
