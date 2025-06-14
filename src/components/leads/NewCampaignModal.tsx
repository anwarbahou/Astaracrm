
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Target, 
  Mail, 
  MessageSquare, 
  Linkedin,
  Phone,
  Sparkles,
  Eye,
  Play,
  Save,
  Zap
} from "lucide-react";

export function NewCampaignModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");
  
  const [campaign, setCampaign] = useState({
    name: "",
    objective: "",
    audienceTags: [] as string[],
    channels: [] as string[],
    messageTemplate: "",
    budget: "",
    duration: "",
    aiGenerated: false
  });

  const objectiveOptions = [
    "Lead Generation",
    "Brand Awareness", 
    "Product Demo",
    "Content Engagement",
    "Event Promotion"
  ];

  const channelOptions = [
    { id: "email", label: "Email", icon: Mail },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
    { id: "sms", label: "SMS", icon: MessageSquare },
    { id: "phone", label: "Phone", icon: Phone }
  ];

  const availableTags = [
    "Enterprise", "SaaS", "Hot Lead", "High Score", "Decision Maker",
    "Budget Confirmed", "Tech Lead", "Marketing Director", "CEO"
  ];

  const messageTemplates = {
    email: `Hi {{firstName}},

I noticed you've been exploring {{companyName}}'s solutions for {{industry}} companies. 

Based on your profile, I believe our {{productName}} could help you achieve {{specificBenefit}}.

Would you be open to a 15-minute call this week to discuss how we can help {{companyName}} {{specificGoal}}?

Best regards,
{{senderName}}`,
    linkedin: `Hi {{firstName}}, I see you're driving {{role}} at {{companyName}}. We're helping similar {{industry}} companies {{benefit}}. Worth a quick chat?`,
    sms: `Hi {{firstName}}, quick question about {{companyName}}'s {{painPoint}}. We've helped similar companies save {{benefit}}. 5 min call?`
  };

  const addTag = (tag: string) => {
    if (!campaign.audienceTags.includes(tag)) {
      setCampaign(prev => ({
        ...prev,
        audienceTags: [...prev.audienceTags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setCampaign(prev => ({
      ...prev,
      audienceTags: prev.audienceTags.filter(t => t !== tag)
    }));
  };

  const toggleChannel = (channelId: string) => {
    setCampaign(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const generateAIMessage = () => {
    setCampaign(prev => ({
      ...prev,
      messageTemplate: messageTemplates.email,
      aiGenerated: true
    }));
  };

  const handleLaunch = () => {
    console.log("Launching campaign:", campaign);
    setIsOpen(false);
  };

  const handleSaveDraft = () => {
    console.log("Saving campaign draft:", campaign);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus size={16} />
          New Campaign
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Target className="text-blue-400" size={20} />
            Create New Campaign
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="setup" className="text-white data-[state=active]:bg-blue-500/20">
              Setup
            </TabsTrigger>
            <TabsTrigger value="audience" className="text-white data-[state=active]:bg-blue-500/20">
              Audience
            </TabsTrigger>
            <TabsTrigger value="message" className="text-white data-[state=active]:bg-blue-500/20">
              Message
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-white data-[state=active]:bg-blue-500/20">
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Campaign Name</Label>
                  <Input
                    placeholder="Enter campaign name..."
                    value={campaign.name}
                    onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-2"
                  />
                </div>

                <div>
                  <Label className="text-white">Campaign Objective</Label>
                  <Select value={campaign.objective} onValueChange={(value) => setCampaign(prev => ({ ...prev, objective: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-2">
                      <SelectValue placeholder="Select objective..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {objectiveOptions.map((objective) => (
                        <SelectItem key={objective} value={objective} className="text-white hover:bg-white/10">
                          {objective}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Budget</Label>
                  <Input
                    placeholder="$0.00"
                    value={campaign.budget}
                    onChange={(e) => setCampaign(prev => ({ ...prev, budget: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Duration</Label>
                  <Select value={campaign.duration} onValueChange={(value) => setCampaign(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-2">
                      <SelectValue placeholder="Select duration..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="1-week" className="text-white hover:bg-white/10">1 Week</SelectItem>
                      <SelectItem value="2-weeks" className="text-white hover:bg-white/10">2 Weeks</SelectItem>
                      <SelectItem value="1-month" className="text-white hover:bg-white/10">1 Month</SelectItem>
                      <SelectItem value="3-months" className="text-white hover:bg-white/10">3 Months</SelectItem>
                      <SelectItem value="ongoing" className="text-white hover:bg-white/10">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Outreach Channels</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {channelOptions.map((channel) => {
                      const IconComponent = channel.icon;
                      return (
                        <Button
                          key={channel.id}
                          variant={campaign.channels.includes(channel.id) ? "default" : "outline"}
                          onClick={() => toggleChannel(channel.id)}
                          className={`justify-start gap-2 ${
                            campaign.channels.includes(channel.id)
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          <IconComponent size={16} />
                          {channel.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6 mt-6">
            <div>
              <Label className="text-white">Target Audience Tags</Label>
              <p className="text-gray-400 text-sm mt-1">Select tags to define your target audience</p>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={campaign.audienceTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => campaign.audienceTags.includes(tag) ? removeTag(tag) : addTag(tag)}
                    className={`justify-start text-sm ${
                      campaign.audienceTags.includes(tag)
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {campaign.audienceTags.length > 0 && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-2">Selected Audience:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.audienceTags.map((tag) => (
                      <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Estimated reach: ~{Math.floor(Math.random() * 500) + 100} leads
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="message" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <Label className="text-white">Message Template</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={generateAIMessage}
                className="gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
              >
                <Sparkles size={16} />
                Generate with AI
              </Button>
            </div>
            
            <Textarea
              placeholder="Write your message template..."
              value={campaign.messageTemplate}
              onChange={(e) => setCampaign(prev => ({ ...prev, messageTemplate: e.target.value }))}
              className="min-h-[200px] bg-white/5 border-white/20 text-white"
            />

            {campaign.aiGenerated && (
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-300">
                  <Zap size={16} />
                  <span className="text-sm font-medium">AI-Generated Template</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  This message was crafted by AI to maximize engagement and conversion rates.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-white font-medium">Available Variables:</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>• {{firstName}} - Lead's first name</div>
                  <div>• {{companyName}} - Company name</div>
                  <div>• {{industry}} - Industry type</div>
                  <div>• {{role}} - Job title</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium">Best Practices:</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>• Keep subject line under 50 characters</div>
                  <div>• Personalize with company research</div>
                  <div>• Include clear call-to-action</div>
                  <div>• A/B test different approaches</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye size={18} />
                Campaign Preview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium">Campaign Details</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{campaign.name || "Unnamed Campaign"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Objective:</span>
                        <span className="text-white">{campaign.objective || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{campaign.duration || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-white">{campaign.budget || "$0.00"}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h4 className="text-white font-medium">Target Audience</h4>
                    <div className="flex gap-1 flex-wrap mt-2">
                      {campaign.audienceTags.map((tag) => (
                        <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium">Channels</h4>
                    <div className="flex gap-2 mt-2">
                      {campaign.channels.map((channelId) => {
                        const channel = channelOptions.find(c => c.id === channelId);
                        if (!channel) return null;
                        const IconComponent = channel.icon;
                        return (
                          <div key={channelId} className="flex items-center gap-1 bg-white/10 rounded px-2 py-1">
                            <IconComponent size={14} className="text-blue-400" />
                            <span className="text-white text-xs">{channel.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium">Message Preview</h4>
                  <div className="mt-2 p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-sm text-gray-300 whitespace-pre-line">
                      {campaign.messageTemplate || "No message template set"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleLaunch} className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Play size={16} />
                Launch Campaign
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Save size={16} />
                Save as Draft
              </Button>
              <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Eye size={16} />
                Test Send
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
