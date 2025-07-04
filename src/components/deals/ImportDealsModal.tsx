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
import { Deal } from '@/types/deal';
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

  console.log('ImportDealsModal - userProfile:', userProfile);

  const validateAndParseDeals = (jsonData: string) => {
    try {
      setError(null);
      
      // Validate that we have a valid user
      if (!userProfile?.id) {
        throw new Error('User not authenticated. Please refresh the page and try again.');
      }
      
      const parsedDeals = JSON.parse(jsonData);
      
      // Validate the JSON structure
      if (!Array.isArray(parsedDeals)) {
        throw new Error('JSON must be an array of deals');
      }

      // Get current user info for owner assignment
      const ownerName = userProfile?.first_name && userProfile?.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : userProfile?.first_name || userProfile?.email || 'Unknown Owner';

      console.log('Using ownerId:', userProfile.id, 'ownerName:', ownerName);

      // Validate each deal has required fields and transform data
      const requiredFields = ['name', 'value']; // Deal name and value are required
      const transformedDeals = parsedDeals.map((deal, index) => {
        // Check required fields
        requiredFields.forEach(field => {
          if (deal[field] === undefined || deal[field] === null) {
            throw new Error(`Deal at index ${index} is missing required field: ${field}`);
          }
        });

        // Transform and set default values
        return {
          ...deal,
          owner_id: userProfile.id, // Use userProfile.id directly for owner
          actual_close_date: deal.actual_close_date || null,
          client_email: deal.client_email || null,
          client_id: deal.client_id || null,
          client_name: deal.client_name || null,
          client_phone: deal.client_phone || null,
          contact_id: deal.contact_id || null,
          currency: deal.currency || null,
          description: deal.description || null,
          expected_close_date: deal.expected_close_date || null,
          notes: deal.notes || null,
          priority: deal.priority || 'medium', // Default priority
          probability: deal.probability || 0, // Default probability
          source: deal.source || null,
          stage: deal.stage || 'prospect', // Default stage
          tags: Array.isArray(deal.tags) ? deal.tags : [],
        };
      });

      return transformedDeals;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Invalid JSON format');
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
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[
  {
    "name": "Website Redesign",
    "value": 15000,
    "stage": "proposal",
    "priority": "high",
    "client_name": "Client Alpha",
    "expected_close_date": "2024-12-31",
    "tags": ["SaaS", "New Business"],
    "description": "Full redesign of client's existing website with new branding and features."
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
    "name": "Website Redesign",
    "value": 15000,
    "stage": "proposal",
    "priority": "high",
    "client_name": "Client Alpha",
    "expected_close_date": "2024-12-31",
    "tags": ["SaaS", "New Business"],
    "description": "Full redesign of client's existing website with new branding and features."
  }
]`);
                toast({
                  title: "Copied to clipboard",
                  description: "JSON object format copied successfully.",
                });
              }}
            >
              Copy JSON Object
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
            {t('common.import')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 