
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CampaignAudienceTabProps {
  campaign: {
    audienceTags: string[];
  };
  setCampaign: (updater: (prev: any) => any) => void;
}

const availableTags = [
  "Enterprise", "SaaS", "Hot Lead", "High Score", "Decision Maker",
  "Budget Confirmed", "Tech Lead", "Marketing Director", "CEO"
];

export function CampaignAudienceTab({ campaign, setCampaign }: CampaignAudienceTabProps) {
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

  return (
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
  );
}
