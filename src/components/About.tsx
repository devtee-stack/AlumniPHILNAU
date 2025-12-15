import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        About Us
      </h2>
      <Card className="p-6 md:p-8 shadow-lg animate-fade-in">
        <p className="text-lg text-foreground leading-relaxed mb-4">
          <strong>Alumni Association of Department of Philosophy, UNIZIK</strong> connects graduates of the Department of Philosophy, Nnamdi Azikiwe University (UNIZIK). The Alumni Association of the Department of Philosophy at Nnamdi Azikiwe University (UNIZIK) was formally established in 2023, marking a pivotal step in uniting graduates to support the department's legacy of scholarship and foster a vibrant community.
The association's inception included the election of its pioneer executive committee and Board of Trustees, comprising distinguished alumni dedicated to governance, mentorship, and advancement of philosophical studies.

        </p>
        <p className="text-sm text-muted-foreground mt-6">
          <strong>Mission:</strong> "Our mission is to support intellectual exchange, professional development, and mentorship — building a lifelong community to uplift students and alumni through events, job opportunities, and collaborative projects."
        </p>
      </Card>
    </div>
  );
};

export default About;
