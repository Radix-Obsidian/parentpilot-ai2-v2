import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RoadmapDemo from "@/components/RoadmapDemo";
import {
  Brain,
  Users,
  Target,
  Calendar,
  BookOpen,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  Trophy,
  ChevronRight,
} from "lucide-react";

// Animated Counter Component
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          let startTime = 0;
          const startCount = 0;

          const animate = (currentTime: number) => {
            if (startTime === 0) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, isVisible]);

  return (
    <span
      id={`counter-${end}`}
      className="text-4xl font-bold text-brand-primary"
    >
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Index() {
  // Scroll animation effect
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-indigo-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-20 animate-float-slow"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-fade-in-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-indigo-600 bg-clip-text text-transparent">
              ParentPilot.AI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-brand-primary transition-all duration-300 hover:scale-105 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-brand-primary transition-all duration-300 hover:scale-105 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-brand-primary transition-all duration-300 hover:scale-105 relative group"
            >
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-brand-primary transform transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-brand-primary hover:bg-indigo-700 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 relative">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge
            variant="secondary"
            className="mb-6 bg-indigo-100 text-brand-primary border-indigo-200 animate-fade-in-up animation-delay-300 opacity-0"
          >
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            AI-Powered Parenting Made Simple
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary bg-clip-text text-transparent animate-fade-in-up animation-delay-500 opacity-0">
            Unlock Your Child's
            <br />
            <span className="inline-block animate-bounce-gentle">
              Full Potential
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-700 opacity-0">
            Create personalized developmental roadmaps powered by AI. Track
            progress, get weekly insights, and discover enrichment opportunities
            tailored to your child's unique journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-900 opacity-0">
            <Link to="/register" className="group">
              <Button
                size="lg"
                className="bg-brand-primary hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-indigo-500/25"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="transform transition-all duration-300 hover:scale-105">
              <RoadmapDemo />
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 animate-fade-in-up animation-delay-1100 opacity-0">
            <div className="flex items-center group cursor-default">
              <Check className="w-4 h-4 text-brand-secondary mr-2 transform transition-transform group-hover:scale-125" />
              14-day free trial
            </div>
            <div className="flex items-center group cursor-default">
              <Check className="w-4 h-4 text-brand-secondary mr-2 transform transition-transform group-hover:scale-125" />
              No credit card required
            </div>
            <div className="flex items-center group cursor-default">
              <Check className="w-4 h-4 text-brand-secondary mr-2 transform transition-transform group-hover:scale-125" />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Animated Statistics */}
        <div className="container mx-auto px-4 mt-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up animation-delay-1300 opacity-0">
              <AnimatedCounter end={10000} suffix="+" />
              <p className="text-gray-600 mt-2">Happy Families</p>
            </div>
            <div className="animate-fade-in-up animation-delay-1500 opacity-0">
              <AnimatedCounter end={50000} suffix="+" />
              <p className="text-gray-600 mt-2">Roadmaps Created</p>
            </div>
            <div className="animate-fade-in-up animation-delay-1700 opacity-0">
              <AnimatedCounter end={95} suffix="%" />
              <p className="text-gray-600 mt-2">Parent Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Everything You Need to Guide Your Child
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From personalized roadmaps to weekly insights, ParentPilot.AI
              provides the tools and guidance to support your child's unique
              developmental journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-brand-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform animate-on-scroll group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-brand-primary transition-colors">
                  AI-Generated Roadmaps
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create personalized 1, 3, 5, or 10-year developmental plans
                  tailored to your child's strengths and interests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-secondary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform animate-on-scroll animation-delay-200 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary to-emerald-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-brand-secondary transition-colors">
                  Child Profiles
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage multiple children with detailed profiles including
                  strengths, interests, and learning styles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-accent/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform animate-on-scroll animation-delay-400 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-amber-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-brand-accent transition-colors">
                  Progress Tracking
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Log activities and milestones to track your child's
                  development over time with visual insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform animate-on-scroll animation-delay-600 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-brand-primary transition-colors">
                  Weekly Digests
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Receive AI-powered summaries of your child's progress with
                  actionable insights and recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-secondary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform animate-on-scroll animation-delay-800 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary to-emerald-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-brand-secondary transition-colors">
                  Enrichment Discovery
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Find personalized activities, resources, and opportunities
                  based on your child's unique profile.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-accent/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform animate-on-scroll animation-delay-1000 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-amber-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-brand-accent transition-colors">
                  Milestone Celebrations
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Celebrate achievements and track important developmental
                  milestones with your family.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-indigo-50 to-emerald-50 scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Trusted by Thousands of Parents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how ParentPilot.AI is helping families unlock their children's
              potential and build stronger connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-on-scroll group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-brand-accent fill-current transform transition-transform duration-200 hover:scale-125"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed group-hover:text-gray-800 transition-colors">
                  "ParentPilot.AI transformed how we approach our daughter's
                  development. The personalized roadmap gave us clear direction
                  and the weekly insights keep us motivated."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold transform transition-all duration-300 group-hover:scale-110">
                    SM
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">
                      Sarah Mitchell
                    </p>
                    <p className="text-gray-600 text-sm">Mother of 2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-on-scroll animation-delay-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-brand-accent fill-current transform transition-transform duration-200 hover:scale-125"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed group-hover:text-gray-800 transition-colors">
                  "The enrichment recommendations are spot-on! We discovered
                  activities we never would have thought of that perfectly match
                  our son's interests and learning style."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold transform transition-all duration-300 group-hover:scale-110">
                    DK
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">David Kim</p>
                    <p className="text-gray-600 text-sm">Father of 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-on-scroll animation-delay-600 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-brand-accent fill-current transform transition-transform duration-200 hover:scale-125"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed group-hover:text-gray-800 transition-colors">
                  "As busy working parents, ParentPilot.AI helps us stay
                  organized and intentional about our children's development.
                  It's like having a personal guidance counselor."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-amber-600 rounded-full flex items-center justify-center text-white font-semibold transform transition-all duration-300 group-hover:scale-110">
                    LR
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">
                      Lisa Rodriguez
                    </p>
                    <p className="text-gray-600 text-sm">Mother of 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our Starter plan and upgrade as your family grows. All
              plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200 hover:border-brand-primary/30 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Starter
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-gray-600">
                  Perfect for families just getting started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">Up to 2 child profiles</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">
                    Basic roadmap generation
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">Weekly progress digests</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">
                    Basic enrichment recommendations
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">Email support</span>
                </div>
                <Link to="/register" className="block pt-6">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-brand-primary bg-gradient-to-br from-indigo-50 to-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brand-primary text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Pro
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-brand-primary">
                    $49
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-gray-600">
                  Everything you need for unlimited growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">
                    Unlimited child profiles
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">
                    Advanced AI roadmap generation
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">
                    Detailed weekly insights
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">
                    Premium enrichment recommendations
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-brand-secondary mr-3" />
                  <span className="text-gray-700">PDF exports & sharing</span>
                </div>
                <Link to="/register" className="block pt-6">
                  <Button className="w-full bg-brand-primary hover:bg-indigo-700 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about ParentPilot.AI
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="bg-white border rounded-lg mb-4"
            >
              <AccordionTrigger className="px-6 py-4 text-left">
                How does the AI generate personalized roadmaps?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                Our AI analyzes your child's age, interests, strengths, learning
                style, and developmental goals to create customized roadmaps. It
                draws from extensive research in child development and
                educational best practices to suggest age-appropriate activities
                and milestones.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-white border rounded-lg mb-4"
            >
              <AccordionTrigger className="px-6 py-4 text-left">
                Can I manage multiple children on one account?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                Yes! The Starter plan allows up to 2 child profiles, while the
                Pro plan supports unlimited children. Each child gets their own
                personalized roadmap and tracking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-white border rounded-lg mb-4"
            >
              <AccordionTrigger className="px-6 py-4 text-left">
                What happens during the free trial?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                You get full access to all features for 14 days with no credit
                card required. You can create child profiles, generate roadmaps,
                and explore all the tools to see if ParentPilot.AI is right for
                your family.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-white border rounded-lg mb-4"
            >
              <AccordionTrigger className="px-6 py-4 text-left">
                Is my family's data secure and private?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                Absolutely. We use enterprise-grade security and never share
                your personal information. All data is encrypted and stored
                securely. You own your data and can export or delete it anytime.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-white border rounded-lg mb-4"
            >
              <AccordionTrigger className="px-6 py-4 text-left">
                Can I cancel my subscription anytime?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                Yes, you can cancel your subscription at any time with no
                penalties. You'll continue to have access until the end of your
                current billing period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-primary to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Unlock Your Child's Potential?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of parents who are already using ParentPilot.AI to
            guide their children toward a brighter future. Start your free trial
            today.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-brand-primary hover:bg-gray-100 px-8 py-6 text-lg rounded-xl"
            >
              Start Your Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ParentPilot.AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering parents with AI-driven insights to unlock their
                children's full potential.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Get parenting tips and updates.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
                />
                <Button className="bg-brand-primary hover:bg-indigo-700 rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 ParentPilot.AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
