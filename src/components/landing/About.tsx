import { motion } from "framer-motion";
import { Linkedin, Twitter, Heart } from "lucide-react";

const founders = [
  {
    name: "Sayem",
    role: "Founder & CEO",
    bio: "Passionate about revolutionizing education through technology. Building Studixa to make quality learning accessible to every student.",
    avatar: "S",
    color: "primary",
  },
  {
    name: "Himasri",
    role: "Co-Founder & COO",
    bio: "Dedicated to creating meaningful learning experiences. Focused on bridging the gap between academic knowledge and real-world skills.",
    avatar: "H",
    color: "accent",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Heart className="w-4 h-4" />
            Our Story
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Meet the <span className="text-gradient">Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built by students, for students. We understand your struggles because we've been there.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-lg transition-all duration-300 text-center">
                {/* Avatar */}
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow`}>
                  <span className="text-3xl font-bold text-primary-foreground">
                    {founder.avatar}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-display text-2xl font-bold mb-1">
                  {founder.name}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {founder.role}
                </p>
                <p className="text-muted-foreground mb-6">
                  {founder.bio}
                </p>

                {/* Social links */}
                <div className="flex justify-center gap-3">
                  <button className="p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors">
                    <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  </button>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors">
                    <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission statement */}
        <motion.div
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-8 rounded-2xl bg-gradient-primary/5 border border-primary/20">
            <h3 className="font-display text-xl font-semibold mb-4 text-primary">
              Our Mission
            </h3>
            <p className="text-muted-foreground text-lg">
              To democratize quality education by providing AI-powered tools, comprehensive study materials, 
              and career development resources that help every student reach their full potential.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
