
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Play, Save, Mail, Linkedin, MessageSquare, Phone } from "lucide-react";

interface CampaignPreviewTabProps {
  campaign: {
    name: string;
    objective: string;
    duration: string;
    budget: string;
    audienceTags: string[];
    channels: string[];
    messageTemplate: string;
  };
  onLaunch: () => void;
  onSaveDraft: () => void;
}

const channelOptions = [
  { id: "email", label: "Email", icon: Mail },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "phone", label: "Phone", icon: Phone }
];

export function CampaignPreviewTab({ campaign, onLaunch, onSaveDraft }: CampaignPreviewTabProps) {
  return (
    <div className="space-y-6">
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
        <Button onClick={onLaunch} className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <Play size={16} />
          Launch Campaign
        </Button>
        <Button variant="outline" onClick={onSaveDraft} className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
          <Save size={16} />
          Save as Draft
        </Button>
        <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
          <Eye size={16} />
          Test Send
        </Button>
      </div>
    </div>
  );
}
