
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Users, 
  Calendar,
  Edit,
  Star,
  MessageSquare,
  UserPlus,
  MoreHorizontal,
  Linkedin,
  Globe,
  DollarSign,
  Activity,
  Clock,
  FileText
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  score: number;
  status: "Hot" | "Warm" | "Cold";
  source: string;
  lastActivity: string;
  dealSize: string;
  location: string;
  companySize: string;
  industry: string;
  engagement: number;
  avatar: string;
  tags: string[];
  assignedTo?: string;
  dateAdded: string;
  aiInsights?: string;
}

interface LeadProfileModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadProfileModal({ lead, isOpen, onClose }: LeadProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Warm": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-green-400";
    if (score >= 70) return "text-amber-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const mockActivityData = [
    { action: "Email opened", time: "2 hours ago", type: "email" },
    { action: "Visited pricing page", time: "1 day ago", type: "website" },
    { action: "Downloaded whitepaper", time: "3 days ago", type: "download" },
    { action: "LinkedIn profile viewed", time: "1 week ago", type: "social" },
  ];

  const mockNotes = [
    { id: 1, content: "Very interested in Enterprise plan. Follow up next Tuesday.", author: "John Smith", time: "2 hours ago" },
    { id: 2, content: "Budget confirmed: $50k. Decision makers identified.", author: "Sarah Johnson", time: "1 day ago" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] bg-slate-900 border-white/10 overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={lead.avatar} 
                  alt={lead.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white/20"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  lead.status === 'Hot' ? 'bg-red-500' : 
                  lead.status === 'Warm' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
              </div>
              <div>
                <SheetTitle className="text-white text-xl">{lead.name}</SheetTitle>
                <p className="text-gray-400">{lead.position}</p>
                <p className="text-gray-500 text-sm">{lead.company}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(lead.status)} border`}>
              {lead.status}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
              <Mail size={16} />
              Email
            </Button>
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
              <Phone size={16} />
              Call
            </Button>
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
              <MessageSquare size={16} />
              Message
            </Button>
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
              <UserPlus size={16} />
              Assign
            </Button>
            <Button variant="outline" size="icon" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-500/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-white data-[state=active]:bg-blue-500/20">
              Activity
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-500/20">
              Notes
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-white data-[state=active]:bg-blue-500/20">
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={16} className="text-gray-400" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={16} className="text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{lead.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Linkedin size={16} className="text-gray-400" />
                  <span>linkedin.com/in/{lead.name.toLowerCase().replace(' ', '-')}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Building size={16} className="text-gray-400" />
                  <span>{lead.company}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users size={16} className="text-gray-400" />
                  <span>{lead.companySize}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe size={16} className="text-gray-400" />
                  <span>{lead.industry}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Lead Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Lead Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">AI Score</span>
                    <Star className={getScoreColor(lead.score)} size={16} />
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${lead.score >= 90 ? 'bg-emerald-400' : 
                        lead.score >= 80 ? 'bg-green-400' : 'bg-amber-400'}`}
                      style={{ width: `${lead.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Deal Size</span>
                    <DollarSign className="text-green-400" size={16} />
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {lead.dealSize}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {lead.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                    {tag}
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="border-dashed border-white/20 text-gray-400 hover:bg-white/10">
                  + Add Tag
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <div className="space-y-3">
              {mockActivityData.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notes</h3>
              <Button size="sm" className="gap-2 bg-blue-500 hover:bg-blue-600">
                <FileText size={16} />
                Add Note
              </Button>
            </div>
            <div className="space-y-3">
              {mockNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-300 text-sm mb-2">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>By {note.author}</span>
                    <span>{note.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
              <p className="text-gray-300 mb-3">{lead.aiInsights}</p>
              <div className="flex gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  High Intent
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Budget Confirmed
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Decision Maker
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Recommended Actions</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Clock className="text-amber-400" size={16} />
                  <span className="text-gray-300 text-sm">Schedule demo within 48 hours</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Mail className="text-blue-400" size={16} />
                  <span className="text-gray-300 text-sm">Send Enterprise pricing proposal</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
