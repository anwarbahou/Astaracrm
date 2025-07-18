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
import { Client } from '@/types/client';
import { AlertCircle, Upload, FileText, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportClientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (clients: Omit<Client, 'id' | 'created_at' | 'updated_at'>[]) => void;
}

export function ImportClientsModal({ open, onOpenChange, onImport }: ImportClientsModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateAndParseClients = (jsonData: string) => {
    try {
      setError(null);
      
      // Validate that we have a valid user
      if (!userProfile?.id) {
        throw new Error('User not authenticated. Please refresh the page and try again.');
      }
      
      const parsedClients = JSON.parse(jsonData);
      
      // Validate the JSON structure
      if (!Array.isArray(parsedClients)) {
        throw new Error('JSON must be an array of clients');
      }

      // Get current user info for owner assignment
      const ownerName = userProfile?.first_name && userProfile?.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : userProfile?.first_name || userProfile?.email || 'Unknown Owner';

      // Validate each client has required fields and transform data
      const requiredFields = ['name']; // Client name is the primary required field
      const transformedClients = parsedClients.map((client, index) => {
        // Check required fields
        requiredFields.forEach(field => {
          if (client[field] === undefined || client[field] === null) {
            throw new Error(`Client at index ${index} is missing required field: ${field}`);
          }
        });

        // Transform and set default values
        return {
          ...client,
          owner: userProfile.id, // Use userProfile.id directly for owner
          address: client.address || null,
          avatar_url: client.avatar_url || null,
          contacts_count: client.contacts_count || 0,
          country: client.country || null,
          email: client.email || null,
          industry: client.industry || null,
          notes: client.notes || null,
          phone: client.phone || null,
          stage: client.stage || 'lead', // Default stage for clients
          status: client.status || 'active', // Default status for clients
          tags: Array.isArray(client.tags) ? client.tags : [],
          total_deal_value: client.total_deal_value || 0,
          website: client.website || null,
        };
      });

      return transformedClients;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Invalid JSON format');
    }
  };

  const handleImport = () => {
    try {
      const parsedClients = validateAndParseClients(jsonInput);
      onImport(parsedClients);
      onOpenChange(false);
      setJsonInput('');
      setSelectedFile(null);
      
      toast({
        title: 'Success',
        description: `${parsedClients.length} clients imported successfully`,
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
        validateAndParseClients(content); // Validate but don't import yet
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
          <DialogTitle>{t('clients.import.title', 'Import Clients')}</DialogTitle>
          <DialogDescription>
            {t('clients.import.description', 'Import your clients data from a JSON file or paste it directly')}
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
    "name": "Client Alpha",
    "email": "alpha@example.com",
    "phone": "+1-111-222-3333",
    "industry": "Technology",
    "country": "USA",
    "status": "active",
    "stage": "prospect",
    "tags": ["Enterprise", "Strategic"],
    "notes": "Seeking CRM solution for large team.",
    "website": "https://www.alpha.com",
    "total_deal_value": 150000
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
    "name": "Client Alpha",
    "email": "alpha@example.com",
    "phone": "+1-111-222-3333",
    "industry": "Technology",
    "country": "USA",
    "status": "active",
    "stage": "prospect",
    "tags": ["Enterprise", "Strategic"],
    "notes": "Seeking CRM solution for large team.",
    "website": "https://www.alpha.com",
    "total_deal_value": 150000
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