import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Freemium",
    price: "Free",
    description: "Get started with essential features",
    features: [
      "AI Mentor (Basic)",
      "Access to all subjects",
      "Daily quizzes",
      "Basic progress tracking",
      "Limited chapter summaries",
    ],
    notIncluded: [
      "Detailed performance analysis",
      "Certificate tracker",
      "Event notifications",
      "Internship recommendations",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹299",
    period: "/month",
    description: "Unlock your full potential",
    features: [
      "AI Mentor (Advanced)",
      "Unlimited chapter summaries",
      "Detailed performance analysis",
      "Certificate tracker",
      "All event notifications",
      "Skill courses with tests",
      "Internship recommendations",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Go Premium",
    popular: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
            <Crown className="w-4 h-4" />
            Simple Pricing
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready to unlock premium features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative p-8 rounded-2xl border ${
                plan.popular 
                  ? "bg-card border-premium/30 shadow-premium" 
                  : "bg-card border-border/50 shadow-card"
              } transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-white text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-amber-600" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.popular ? "bg-amber-100" : "bg-success/20"}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-amber-600" : "text-success"}`} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 opacity-50">
                    <div className="p-1 rounded-full bg-muted">
                      <Check className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild 
                variant={plan.popular ? "premium" : "outline"} 
                size="lg" 
                className={`w-full ${plan.popular ? "text-white" : "text-foreground"}`}
              >
                <Link to="/auth">
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
