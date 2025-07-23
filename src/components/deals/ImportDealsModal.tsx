import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Deal, DealStage } from '@/types/deal';
import { AlertCircle, Upload, FileText, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportDealsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (deals: Omit<Deal, 'id' | 'created_at' | 'updated_at'>[]) => void;
}

export function ImportDealsModal({ open, onOpenChange, onImport }: ImportDealsModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateAndParseDeals = (jsonData: string) => {
    try {
      setError(null);
      
      // Validate that we have a valid user
      if (!userProfile?.id) {
        throw new Error('User not authenticated. Please refresh the page and try again.');
      }
      
      let parsedDeals;
      try {
        parsedDeals = JSON.parse(jsonData);
      } catch (e) {
        // Try to parse as multiple JSON objects separated by newlines
        try {
          parsedDeals = jsonData
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => JSON.parse(line));
        } catch {
        throw new Error('Invalid JSON format. Please check your input.');
        }
      }
      
      // Validate the JSON structure
      if (!Array.isArray(parsedDeals)) {
        throw new Error('JSON must be an array of deals or multiple JSON objects separated by newlines');
      }

      if (parsedDeals.length === 0) {
        throw new Error('No deals found in the import data');
      }

      // Get current user info for owner assignment
      const ownerName = userProfile.first_name && userProfile.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : userProfile.email?.split('@')[0] || 'Unknown';

      return parsedDeals.map((deal: any) => {
        // Parse and validate value
        let dealValue = deal.value;
        if (dealValue === undefined || dealValue === null) {
          dealValue = 0; // Default to 0 if missing
        }
        if (typeof dealValue === 'string') {
          // Remove currency symbols, commas, and spaces
          dealValue = dealValue.replace(/[^0-9.-]/g, '');
          dealValue = parseFloat(dealValue);
        }

        // Allow 0 as a valid value for prospect deals
        if (isNaN(dealValue) || dealValue < 0) {
          throw new Error(`Deal "${deal.name}" has an invalid value (${deal.value}). Please provide a non-negative number.`);
        }

        // Normalize stage value
        const normalizedStage = (deal.stage || 'prospect').toLowerCase();
        const validStages = ['prospect', 'lead', 'opportunity', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
        if (!validStages.includes(normalizedStage)) {
          throw new Error(`Deal "${deal.name}" has an invalid stage. Valid stages are: ${validStages.join(', ')}`);
        }

        // Normalize priority value
        const normalizedPriority = (deal.priority || 'medium').toLowerCase();
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(normalizedPriority)) {
          throw new Error(`Deal "${deal.name}" has an invalid priority. Valid priorities are: ${validPriorities.join(', ')}`);
        }

        // Set default probability based on stage if not provided
        let probability = deal.probability;
        if (probability === undefined || probability === null) {
          switch (normalizedStage) {
            case 'prospect': probability = 10; break;
            case 'lead': probability = 25; break;
            case 'opportunity': probability = 50; break;
            case 'proposal': probability = 75; break;
            case 'negotiation': probability = 90; break;
            case 'closed_won': probability = 100; break;
            case 'closed_lost': probability = 0; break;
            default: probability = 25;
          }
        }

        // Return normalized deal object
        return {
          name: deal.name,
          client: deal.client || 'Unknown Client',
          clientId: deal.clientId || null,
          value: dealValue,
          stage: normalizedStage,
          probability: probability,
          expectedCloseDate: deal.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          source: deal.source || '',
          priority: normalizedPriority,
          tags: Array.isArray(deal.tags) ? deal.tags : [],
          notes: deal.notes || '',
          owner: ownerName,
          ownerId: userProfile.id,
          currency: 'MAD', // Always use MAD
          clientPhone: deal.clientPhone || deal.client_phone || null // Pass through phone number
        };
      });
    } catch (error) {
      throw error;
    }
  };

  const handleImport = () => {
    try {
      const parsedDeals = validateAndParseDeals(jsonInput);
      onImport(parsedDeals);
      onOpenChange(false);
      setJsonInput('');
      setSelectedFile(null);
      
      toast({
        title: 'Success',
        description: `${parsedDeals.length} deals imported successfully`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/json') {
      setError('Please select a JSON file');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        validateAndParseDeals(content); // Validate but don't import yet
        setJsonInput(content);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid JSON format');
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('deals.import.title', 'Import Deals')}</DialogTitle>
          <DialogDescription>
            {t('deals.import.description', 'Import your deals data from a JSON file or paste it directly')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="paste" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/10' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedFile(null);
                      setJsonInput('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mb-4 mx-auto text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <p>Drag and drop your JSON file here, or</p>
                    <label className="relative mt-2 inline-block">
                      <span className="text-primary hover:underline cursor-pointer">browse to upload</span>
                      <input
                        type="file"
                        accept="application/json"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Please paste a <b>JSON array of deal objects</b> below. Example:
            </div>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[
  {
    "name": "Website Redesign",
    "value": 15000,
    "stage": "proposal",
    "priority": "high",
    "client": "Client Alpha",
    "expectedCloseDate": "2024-12-31",
    "tags": ["SaaS", "New Business"],
    "description": "Full redesign of client's existing website with new branding and features."
  },
  {
    "name": "Mobile App Development",
    "value": 25000,
    "stage": "negotiation",
    "priority": "medium",
    "client": "Client Beta",
    "expectedCloseDate": "2024-11-15",
    "tags": ["Mobile", "App"],
    "description": "Developing a cross-platform mobile app."
  }
]`}
              className="font-mono min-h-[300px]"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(`[
  {
    "name": "Casablanca CRM Rollout",
    "value": 120000,
    "stage": "proposal",
    "priority": "high",
    "client": "Société Atlas",
    "clientPhone": "+212 661-234567",
    "expectedCloseDate": "2024-09-15",
    "tags": ["CRM", "Morocco", "Enterprise"],
    "description": "Deploying CRM system for sales and support teams in Casablanca.",
    "probability": 70,
    "source": "Referral",
    "currency": "MAD",
    "notes": "Key decision maker: Mr. El Amrani."
  },
  {
    "name": "E-commerce Platform Upgrade",
    "value": 85000,
    "stage": "negotiation",
    "priority": "medium",
    "client": "MarocShop SARL",
    "clientPhone": "+212 662-987654",
    "expectedCloseDate": "2024-10-10",
    "tags": ["E-commerce", "Upgrade", "Morocco"],
    "description": "Upgrade Magento store and integrate local payment gateways.",
    "probability": 80,
    "source": "LinkedIn",
    "currency": "MAD",
    "notes": "Client interested in Payzone and CMI integration."
  }
]`);
                toast({
                  title: "Copied to clipboard",
                  description: "Moroccan JSON array format copied successfully.",
                });
              }}
            >
              Copy Moroccan JSON Example
            </Button>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleImport} disabled={!jsonInput.trim() || !!error}>
            {t('deals.import.cta', 'Import Deals')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 