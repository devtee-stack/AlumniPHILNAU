const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4 text-gold">Alumni Association of Department of Philosophy</h4>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Connecting philosophy graduates worldwide for professional development, intellectual exchange, and community building.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2">
              {["Alumni Directory", "Events Calendar", "Job Board", "Mentorship", "Discussion Forums"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-gold">Resources</h4>
            <ul className="space-y-2">
              {["Career Services", "Giving Opportunities", "Photo Gallery", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-primary-foreground/60 pt-8 border-t border-primary-foreground/20">
          © {currentYear} UNIZIK Philosophy Alumni Association — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
