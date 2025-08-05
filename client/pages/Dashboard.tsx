import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Users, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Star,
  Bell,
  BookOpen,
  Target,
  Activity,
  Award,
  Heart
} from "lucide-react";

export default function Dashboard() {
  // Mock data - in real app this would come from API/database
  const user = {
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    plan: "Pro",
    avatar: null
  };

  const children = [
    {
      id: 1,
      name: "Emma",
      age: 8,
      grade: "3rd Grade",
      avatar: null,
      strengths: ["Creative", "Reading"],
      recentActivity: "Completed art project",
      progressScore: 85
    },
    {
      id: 2,
      name: "Lucas",
      age: 5,
      grade: "Kindergarten", 
      avatar: null,
      strengths: ["Math", "Building"],
      recentActivity: "Learned addition facts",
      progressScore: 92
    }
  ];

  const recentActivities = [
    {
      id: 1,
      childName: "Emma",
      activity: "Completed creative writing exercise",
      date: "2 hours ago",
      category: "Academic"
    },
    {
      id: 2,
      childName: "Lucas",
      activity: "Built LEGO castle",
      date: "1 day ago", 
      category: "Creative"
    },
    {
      id: 3,
      childName: "Emma",
      activity: "Read 2 chapter books",
      date: "2 days ago",
      category: "Reading"
    }
  ];

  const weeklyDigest = {
    totalActivities: 12,
    milestonesAchieved: 3,
    newSkillsLearned: 5,
    readingTime: "4.5 hours"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-brand-primary text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Account Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-brand-primary to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Account Overview</h2>
                  <p className="opacity-90">
                    You're on the <Badge variant="secondary" className="bg-white/20 text-white">{user.plan}</Badge> plan
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{children.length}</p>
                  <p className="opacity-90">Active Children</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Digest Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">This Week's Progress</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-brand-primary mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{weeklyDigest.totalActivities}</p>
                <p className="text-gray-600">Activities Logged</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-brand-secondary mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{weeklyDigest.milestonesAchieved}</p>
                <p className="text-gray-600">Milestones Achieved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-brand-accent mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{weeklyDigest.newSkillsLearned}</p>
                <p className="text-gray-600">New Skills</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{weeklyDigest.readingTime}</p>
                <p className="text-gray-600">Reading Time</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Child Profiles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Children</h2>
            <Button className="bg-brand-primary hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Card key={child.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-brand-secondary to-emerald-600 text-white">
                        {child.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{child.name}</CardTitle>
                      <CardDescription>{child.age} years old • {child.grade}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Strengths</p>
                    <div className="flex flex-wrap gap-1">
                      {child.strengths.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Recent Activity</p>
                    <p className="text-sm text-gray-600">{child.recentActivity}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Progress Score</p>
                      <span className="text-sm font-semibold text-brand-primary">{child.progressScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brand-primary to-indigo-600 h-2 rounded-full" 
                        style={{ width: `${child.progressScore}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Target className="w-4 h-4 mr-1" />
                      Roadmap
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Activities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add Child Card */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-brand-primary transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">Add Another Child</p>
                <p className="text-sm text-gray-500">Create a new profile and roadmap</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Generate Roadmap
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Find Enrichment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                View Weekly Digest
              </Button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-secondary to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {activity.childName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.childName}</p>
                        <p className="text-gray-600">{activity.activity}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
