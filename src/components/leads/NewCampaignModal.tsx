
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target } from "lucide-react";
import { CampaignSetupTab } from "./campaign/CampaignSetupTab";
import { CampaignAudienceTab } from "./campaign/CampaignAudienceTab";
import { CampaignMessageTab } from "./campaign/CampaignMessageTab";
import { CampaignPreviewTab } from "./campaign/CampaignPreviewTab";

export function NewCampaignModal() {
  const { t } = useTranslation();
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
          {t("aiLeads.buttons.newCampaign")}
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
            <CampaignSetupTab campaign={campaign} setCampaign={setCampaign} />
          </TabsContent>

          <TabsContent value="audience" className="space-y-6 mt-6">
            <CampaignAudienceTab campaign={campaign} setCampaign={setCampaign} />
          </TabsContent>

          <TabsContent value="message" className="space-y-6 mt-6">
            <CampaignMessageTab campaign={campaign} setCampaign={setCampaign} />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <CampaignPreviewTab 
              campaign={campaign} 
              onLaunch={handleLaunch} 
              onSaveDraft={handleSaveDraft} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
