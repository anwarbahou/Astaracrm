
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Linkedin, Phone } from "lucide-react";

interface CampaignSetupTabProps {
  campaign: {
    name: string;
    objective: string;
    budget: string;
    duration: string;
    channels: string[];
  };
  setCampaign: (updater: (prev: any) => any) => void;
}

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

export function CampaignSetupTab({ campaign, setCampaign }: CampaignSetupTabProps) {
  const toggleChannel = (channelId: string) => {
    setCampaign(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  return (
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
  );
}
