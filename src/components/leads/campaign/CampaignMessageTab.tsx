
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Zap } from "lucide-react";

interface CampaignMessageTabProps {
  campaign: {
    messageTemplate: string;
    aiGenerated: boolean;
  };
  setCampaign: (updater: (prev: any) => any) => void;
}

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

export function CampaignMessageTab({ campaign, setCampaign }: CampaignMessageTabProps) {
  const generateAIMessage = () => {
    setCampaign(prev => ({
      ...prev,
      messageTemplate: messageTemplates.email,
      aiGenerated: true
    }));
  };

  return (
    <div className="space-y-6">
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
            <div>• {`{{firstName}}`} - Lead's first name</div>
            <div>• {`{{companyName}}`} - Company name</div>
            <div>• {`{{industry}}`} - Industry type</div>
            <div>• {`{{role}}`} - Job title</div>
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
    </div>
  );
}
