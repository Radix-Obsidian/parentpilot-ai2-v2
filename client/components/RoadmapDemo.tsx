import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Clock, 
  Target, 
  BookOpen, 
  Palette, 
  Zap,
  CheckCircle,
  ArrowRight,
  Brain
} from "lucide-react";

interface MockChild {
  id: string;
  name: string;
  age: number;
  grade: string;
  interests: string[];
  strengths: string[];
  description: string;
}

const mockChildren: MockChild[] = [
  {
    id: "demo-1",
    name: "Emma",
    age: 8,
    grade: "3rd Grade",
    interests: ["Art", "Reading", "Science"],
    strengths: ["Creative thinking", "Problem solving"],
    description: "Creative and curious with a love for storytelling"
  },
  {
    id: "demo-2", 
    name: "Alex",
    age: 12,
    grade: "7th Grade",
    interests: ["Technology", "Math", "Gaming"],
    strengths: ["Logical thinking", "Pattern recognition"],
    description: "Tech-savvy problem solver with strong analytical skills"
  },
  {
    id: "demo-3",
    name: "Maya",
    age: 6,
    grade: "1st Grade", 
    interests: ["Music", "Dancing", "Animals"],
    strengths: ["Rhythm", "Memory", "Empathy"],
    description: "Musical and empathetic with excellent memory"
  }
];

const timeframes = [
  { value: "1", label: "1 Year Plan", description: "Short-term focused goals" },
  { value: "3", label: "3 Year Plan", description: "Elementary development" },
  { value: "5", label: "5 Year Plan", description: "Long-term growth" },
  { value: "10", label: "10 Year Plan", description: "Complete childhood journey" }
];

const mockRoadmapData = {
  "1": {
    summary: "A focused one-year plan to strengthen creative expression and reading comprehension while building foundational STEAM skills.",
    years: [
      {
        year: 1,
        title: "Creative Foundation & Reading Mastery",
        description: "Focus on developing artistic skills while strengthening reading comprehension and introducing basic science concepts.",
        quarters: [
          {
            quarter: 1,
            focus: "Artistic Expression & Story Comprehension", 
            milestones: ["Complete 10 chapter books", "Create first art portfolio"],
            activities: ["Daily drawing practice", "Interactive read-alouds", "Nature observation journal"],
            enrichment: ["Local art classes", "Library story time", "Science museum visits"]
          },
          {
            quarter: 2,
            focus: "Creative Writing & Basic Science",
            milestones: ["Write first short story", "Complete beginner science experiments"],
            activities: ["Creative writing workshops", "Simple chemistry experiments", "Art technique exploration"],
            enrichment: ["Young authors program", "Kids science camp", "Art museum workshops"]
          }
        ]
      }
    ]
  },
  "3": {
    summary: "A comprehensive three-year plan focusing on advanced creative skills, STEAM education, and leadership development.",
    years: [
      {
        year: 1,
        title: "Creative & Analytical Foundation",
        description: "Build strong creative and analytical thinking skills",
        quarters: [
          {
            quarter: 1,
            focus: "Advanced Art Techniques",
            milestones: ["Master watercolor basics", "Complete graphic novel"],
            activities: ["Advanced drawing", "Creative writing", "Basic coding"],
            enrichment: ["Art academy enrollment", "STEAM workshops", "Coding bootcamp"]
          }
        ]
      },
      {
        year: 2, 
        title: "STEAM Integration & Leadership",
        description: "Integrate arts with science and develop leadership skills",
        quarters: [
          {
            quarter: 1,
            focus: "Scientific Art & Team Projects",
            milestones: ["Lead a team project", "Create science-art fusion piece"],
            activities: ["Collaborative art projects", "Peer mentoring", "Advanced experiments"],
            enrichment: ["Leadership camp", "Science fair participation", "Art exhibitions"]
          }
        ]
      }
    ]
  }
};

export default function RoadmapDemo() {
  const [selectedChild, setSelectedChild] = useState<MockChild | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  const handleGenerateRoadmap = async () => {
    if (!selectedChild || !selectedTimeframe) return;
    
    setIsGenerating(true);
    
    // Simulate API call with realistic timing
    setTimeout(() => {
      const mockData = mockRoadmapData[selectedTimeframe as keyof typeof mockRoadmapData];
      setRoadmapData(mockData);
      setShowRoadmap(true);
      setIsGenerating(false);
    }, 2000);
  };

  const resetDemo = () => {
    setSelectedChild(null);
    setSelectedTimeframe("");
    setShowRoadmap(false);
    setRoadmapData(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-2 border-brand-primary text-brand-primary hover:bg-indigo-50">
          <Sparkles className="w-5 h-5 mr-2" />
          Try Our Roadmap Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Brain className="w-6 h-6 mr-2 text-brand-primary" />
            AI Roadmap Generator Demo
          </DialogTitle>
          <DialogDescription>
            See how our AI creates personalized development plans for your child
          </DialogDescription>
        </DialogHeader>

        {!showRoadmap ? (
          <div className="space-y-6">
            {/* Child Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Choose a Child Profile</h3>
              <div className="grid gap-3">
                {mockChildren.map((child) => (
                  <Card 
                    key={child.id}
                    className={`cursor-pointer transition-all ${
                      selectedChild?.id === child.id 
                        ? 'border-brand-primary bg-indigo-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedChild(child)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{child.name}</h4>
                            <Badge variant="secondary">{child.age} years • {child.grade}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{child.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-gray-500">Interests:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {child.interests.map((interest, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-500">Strengths:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {child.strengths.map((strength, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {selectedChild?.id === child.id && (
                          <CheckCircle className="w-5 h-5 text-brand-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Timeframe Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Select Development Timeframe</h3>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose timeframe for the roadmap" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-brand-primary" />
                        <div>
                          <div className="font-medium">{timeframe.label}</div>
                          <div className="text-xs text-gray-500">{timeframe.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleGenerateRoadmap}
                disabled={!selectedChild || !selectedTimeframe || isGenerating}
                size="lg"
                className="bg-brand-primary hover:bg-indigo-700 px-8 py-6"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Generating Your Roadmap...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate AI Roadmap
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Roadmap Display */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedTimeframe}-Year Development Roadmap for {selectedChild?.name}
                </h3>
                <p className="text-gray-600 mt-1">{roadmapData?.summary}</p>
              </div>
              <Button variant="outline" onClick={resetDemo}>
                Try Another
              </Button>
            </div>

            <div className="space-y-6">
              {roadmapData?.years?.map((year: any, yearIdx: number) => (
                <Card key={yearIdx} className="border-l-4 border-l-brand-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-brand-primary" />
                      Year {year.year}: {year.title}
                    </CardTitle>
                    <CardDescription>{year.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {year.quarters?.map((quarter: any, qIdx: number) => (
                      <div key={qIdx} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">
                          Q{quarter.quarter}: {quarter.focus}
                        </h5>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" />
                              Milestones
                            </h6>
                            <ul className="space-y-1">
                              {quarter.milestones?.map((milestone: string, mIdx: number) => (
                                <li key={mIdx} className="text-sm text-gray-600">• {milestone}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                              Activities
                            </h6>
                            <ul className="space-y-1">
                              {quarter.activities?.map((activity: string, aIdx: number) => (
                                <li key={aIdx} className="text-sm text-gray-600">• {activity}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Palette className="w-4 h-4 mr-1 text-purple-500" />
                              Enrichment
                            </h6>
                            <ul className="space-y-1">
                              {quarter.enrichment?.map((enrichment: string, eIdx: number) => (
                                <li key={eIdx} className="text-sm text-gray-600">• {enrichment}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Love what you see?</h4>
              <p className="text-gray-600 mb-4">
                Create unlimited roadmaps for your own children with personalized insights and weekly progress tracking.
              </p>
              <Button className="bg-brand-primary hover:bg-indigo-700">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
