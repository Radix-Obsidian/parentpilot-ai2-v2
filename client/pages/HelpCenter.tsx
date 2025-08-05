import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  BookOpen, 
  Users, 
  Settings, 
  CreditCard, 
  Shield, 
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Target,
  Calendar,
  Star
} from "lucide-react";

export default function HelpCenter() {
  const helpCategories = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Getting Started",
      description: "Learn the basics of ParentPilot.AI",
      articles: 5,
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Child Profiles",
      description: "Managing your children's information",
      articles: 8,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Roadmaps",
      description: "Understanding development plans",
      articles: 6,
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Logging activities and milestones",
      articles: 4,
      color: "bg-amber-50 text-amber-600"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Billing & Plans",
      description: "Subscription and payment help",
      articles: 7,
      color: "bg-red-50 text-red-600"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Account Settings",
      description: "Privacy and account management",
      articles: 3,
      color: "bg-gray-50 text-gray-600"
    }
  ];

  const faqItems = [
    {
      category: "General",
      question: "What is ParentPilot.AI and how does it work?",
      answer: "ParentPilot.AI is an AI-powered parenting platform that creates personalized development roadmaps for your children. Our advanced AI analyzes your child's age, interests, strengths, and learning style to generate customized plans with activities, milestones, and enrichment recommendations."
    },
    {
      category: "Getting Started",
      question: "How do I create my first child profile?",
      answer: "After signing up, go to your Dashboard and click 'Add Child'. Fill in your child's basic information including name, age, grade, interests, and strengths. This information helps our AI create more personalized recommendations for your child's development."
    },
    {
      category: "AI Roadmaps",
      question: "How long does it take to generate a roadmap?",
      answer: "AI roadmap generation typically takes 30-60 seconds. Our system analyzes your child's profile and creates a comprehensive plan with quarterly milestones, activities, and enrichment opportunities tailored to their unique needs."
    },
    {
      category: "AI Roadmaps",
      question: "Can I modify or customize the generated roadmaps?",
      answer: "Yes! While our AI creates the foundation, you can customize roadmaps to better fit your family's needs. You can adjust activities, add personal goals, and modify timelines to match your child's pace and interests."
    },
    {
      category: "Billing",
      question: "What's included in the free trial?",
      answer: "Your 14-day free trial includes access to all Starter plan features: up to 2 child profiles, basic roadmap generation, weekly digests, and enrichment recommendations. No credit card required to start."
    },
    {
      category: "Billing",
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time from your Account Settings. You'll continue to have access until the end of your current billing period, and there are no cancellation fees."
    },
    {
      category: "Privacy",
      question: "How do you protect my family's data?",
      answer: "We use enterprise-grade security with end-to-end encryption. Your family's information is never shared with third parties, and you maintain full control over your data. You can export or delete your information at any time."
    },
    {
      category: "Technical",
      question: "What devices and browsers are supported?",
      answer: "ParentPilot.AI works on all modern devices and browsers. We recommend Chrome, Firefox, Safari, or Edge for the best experience. Our platform is fully responsive and works great on desktop, tablet, and mobile devices."
    },
    {
      category: "Features",
      question: "How often should I update my child's profile?",
      answer: "We recommend updating your child's profile every 3-6 months or whenever you notice significant changes in their interests or development. This helps our AI provide more accurate and relevant recommendations."
    },
    {
      category: "Features",
      question: "What if my child has special needs or learning differences?",
      answer: "Our AI can accommodate various learning styles and needs. When creating your child's profile, include information about any special considerations in the notes section. This helps generate more appropriate and supportive recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-indigo-600 bg-clip-text text-transparent">
              ParentPilot.AI
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-600 hover:text-brand-primary">
                Dashboard
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-brand-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions and learn how to get the most out of ParentPilot.AI
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search for help articles..."
                className="pl-12 py-6 text-lg rounded-xl border-2"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {category.articles} articles
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                      <div className="flex items-start space-x-4">
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.category}
                        </Badge>
                        <span className="font-medium text-gray-900">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Popular Articles */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-brand-primary" />
                    <Badge variant="secondary">Getting Started</Badge>
                  </div>
                  <CardTitle className="text-lg">Complete Setup Guide</CardTitle>
                  <CardDescription>
                    Step-by-step walkthrough to get your account set up and create your first roadmap
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    <Badge variant="secondary">Best Practices</Badge>
                  </div>
                  <CardTitle className="text-lg">Maximizing Your Child's Progress</CardTitle>
                  <CardDescription>
                    Expert tips on how to use roadmaps effectively and track meaningful progress
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <Badge variant="secondary">Privacy</Badge>
                  </div>
                  <CardTitle className="text-lg">Data Security & Privacy</CardTitle>
                  <CardDescription>
                    Understanding how we protect your family's information and maintain privacy
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <Badge variant="secondary">Families</Badge>
                  </div>
                  <CardTitle className="text-lg">Managing Multiple Children</CardTitle>
                  <CardDescription>
                    Best practices for tracking development across multiple children and ages
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-brand-primary to-indigo-700 rounded-2xl p-8 text-center text-white">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed with ParentPilot.AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="bg-white text-brand-primary hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
