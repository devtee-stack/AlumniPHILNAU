import { Users, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const Executives = () => {
  const executives = [
    {
      name: "Dr. Chidiebere Obi",
      position: "President",
      image: "/images/NAU3315.jpg",
      bio: "Leading the alumni network with vision and dedication",
    },
    {
      name: "Joy Amadi",
      position: "Vice President",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      bio: "Fostering academic excellence and professional growth",
    },
    {
      name: "Dr. Ogochukwu Okpokwasili",
      position: "Secretary General",
      image: "/images/executive3.jpeg",
      bio: "Ensuring effective communication and organization",
    },
    {
      name: "Dr. Onyeka Uzowulu",
      position: "Assistant Secretary",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      bio: "Managing financial resources with transparency",
    },
    {
      name: "Dr. Kelechi Ezeani",
      position: "Financial Secretary",
      image: "/images/executive5.jpeg",
      bio: "Building strong community relationships",
    },
    {
      name: "Anthony Nwokoye",
      position: "Treasurer",
      image: "/images/executive6.jpeg",
      bio: "Organizing impactful alumni gatherings and programs",
    },
    {
      name: "Dr. Kizito Okoli",
      position: "Director of Socials",
      image: "/images/executive7.jpeg",
      bio: "Organizing impactful alumni gatherings and programs",
    },
    {
      name: "Francis Aleke",
      position: "Public Relations Officer",
      image: "https://images.unsplash.com/-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      bio: "Managing public relations and communications",
    },
  ];

  const trustees = [
    {
      name: "Dr. Austin Ezejiofor",
      position: "Board Chairman",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      bio: "Distinguished professor and thought leader in African Philosophy",
    },
    {
      name: "Dr. Chioma Eze",
      position: "Trustee",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      bio: "Ethics specialist and community advocate",
    },
    {
      name: "Prof. Austin",
      position: "Trustee",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      bio: "Expert in philosophy of science and epistemology",
    },
    {
      name: "Dr. Adaeze Nwankwo",
      position: "Trustee",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80",
      bio: "Renowned scholar in contemporary African thought",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Executives Section */}
      <div className="mb-20" id="executives">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
            Executive Committee
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our dedicated executive team works tirelessly to strengthen alumni connections, 
          support professional development, and foster a vibrant community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executives.map((exec, index) => (
            <Card 
              key={index} 
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md">
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{exec.name}</h3>
              <p className="text-gold font-semibold mb-3">{exec.position}</p>
              <p className="text-sm text-muted-foreground">{exec.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Trustees Section */}
      <div id="trustees">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
            Board of Trustees
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our esteemed board of trustees provides strategic guidance and oversight, 
          ensuring the long-term success and integrity of our alumni association.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustees.map((trustee, index) => (
            <Card 
              key={index} 
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img
                  src={trustee.image}
                  alt={trustee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{trustee.name}</h3>
              <p className="text-gold font-semibold mb-3 text-sm">{trustee.position}</p>
              <p className="text-xs text-muted-foreground">{trustee.bio}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Executives;
