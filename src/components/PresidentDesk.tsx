import { Card } from "@/components/ui/card";

const PresidentDesk = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        From the Desk of the National Alumni President
      </h2>
      <Card className="p-6 md:p-8 shadow-lg animate-fade-in">
        <div className="grid md:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
          <img
            src="images/NAU3315.jpg"
            alt="Dr. Chidiebere Obi - President"
            className="w-full md:w-64 h-64 object-cover rounded-xl shadow-md mx-auto md:mx-0"
          />
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">
              <strong>Dear colleagues and friends,</strong>
            </p>
            <p className="text-foreground leading-relaxed">
              Welcome to the UNIZIK Philosophy Alumni Network. It is with deep gratitude and excitement that I invite you to explore our renewed digital home — a space designed to reconnect, collaborate, and create opportunities for intellectual and professional growth. Whether you are a recent graduate, a seasoned academic, or a friend of the department, this network is for you.
            </p>
            <p className="text-foreground leading-relaxed">
              We are committed to supporting mentorship, fostering research conversations — especially on issues that matter to our communities — and amplifying alumni achievements worldwide. Please engage with our forums, attend events, and consider mentoring a student. Together we will strengthen the ties that make our department a vibrant intellectual community.
            </p>
            <p className="text-primary font-bold mt-6">
              Warm regards,<br />
              Dr. Chidiebere Obi<br />
              President, UNIZIK Philosophy Alumni Network
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PresidentDesk;
