import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestionText?: string;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  suggestionText = "This page is coming soon! Continue prompting to have me fill in the content for this page." 
}: PlaceholderPageProps) {
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-brand-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Construction className="w-10 h-10 text-gray-500" />
              </div>
              
              <CardTitle className="text-3xl text-gray-900 mb-4">
                {title}
              </CardTitle>
              
              <CardDescription className="text-lg text-gray-600 mb-6">
                {description}
              </CardDescription>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
                <p className="text-indigo-800 font-medium">
                  {suggestionText}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="outline" size="lg">
                    Go to Homepage
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" className="bg-brand-primary hover:bg-indigo-700">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
