
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
    setIsOpen(false);
  };

  const handleSaveDraft = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus size={16} />
          {t("campaign.buttons.newCampaign")}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Target className="text-blue-400" size={20} />
            {t("campaign.modal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">
                {t("campaign.tabs.setup")}
              </TabsTrigger>
              <TabsTrigger value="audience">
                {t("campaign.tabs.audience")}
              </TabsTrigger>
              <TabsTrigger value="message">
                {t("campaign.tabs.message")}
              </TabsTrigger>
              <TabsTrigger value="preview">
                {t("campaign.tabs.preview")}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="setup" className="space-y-6 mt-0">
                <CampaignSetupTab campaign={campaign} setCampaign={setCampaign} />
              </TabsContent>

              <TabsContent value="audience" className="space-y-6 mt-0">
                <CampaignAudienceTab campaign={campaign} setCampaign={setCampaign} />
              </TabsContent>

              <TabsContent value="message" className="space-y-6 mt-0">
                <CampaignMessageTab campaign={campaign} setCampaign={setCampaign} />
              </TabsContent>

              <TabsContent value="preview" className="space-y-6 mt-0">
                <CampaignPreviewTab 
                  campaign={campaign} 
                  onLaunch={handleLaunch} 
                  onSaveDraft={handleSaveDraft} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
