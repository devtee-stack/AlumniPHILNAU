import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      toast.error("Please enter your email to subscribe");
      return;
    }
    toast.success("Subscribed! Thank you for joining our newsletter.");
    setEmail("");
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Contact Us
      </h2>
      <Card className="p-6 md:p-8 shadow-lg animate-fade-in">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Get in touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-accent" />
                <span>alumni@unizikphilosophyalumi.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-accent" />
                <span>+234 803 000 0000</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Subscribe to newsletter
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSubscribe}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contact;
