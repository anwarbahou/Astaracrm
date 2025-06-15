
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus size={16} />
          {t("campaign.buttons.newCampaign")}
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="fixed inset-y-0 right-0 z-50 h-full w-[900px] flex flex-col bg-background border-l border-border shadow-lg">
        <DrawerHeader className="px-6 py-4 border-b border-border bg-background">
          <DrawerTitle className="text-foreground text-xl flex items-center gap-2">
            <Target className="text-blue-400" size={20} />
            {t("campaign.modal.title")}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
                <TabsTrigger 
                  value="setup" 
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  {t("campaign.tabs.setup")}
                </TabsTrigger>
                <TabsTrigger 
                  value="audience" 
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  {t("campaign.tabs.audience")}
                </TabsTrigger>
                <TabsTrigger 
                  value="message" 
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  {t("campaign.tabs.message")}
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  {t("campaign.tabs.preview")}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
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
      </DrawerContent>
    </Drawer>
  );
}
