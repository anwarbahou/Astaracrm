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
import { Contact } from '@/components/contacts/ContactsTable';
import { AlertCircle, Upload, FileText, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (contacts: Omit<Contact, 'id' | 'created_at' | 'updated_at'>[]) => Promise<number>;
}

export function ImportContactsModal({ open, onOpenChange, onImport }: ImportContactsModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  console.log('ImportContactsModal - userProfile:', userProfile);

  const validateAndParseContacts = (jsonData: string) => {
    try {
      setError(null);
      
      // Validate that we have a valid user
      if (!userProfile?.id) {
        throw new Error('User not authenticated. Please refresh the page and try again.');
      }
      
      const parsedContacts = JSON.parse(jsonData);
      
      // Validate the JSON structure
      if (!Array.isArray(parsedContacts)) {
        throw new Error('JSON must be an array of contacts');
      }

      // Get current user info for owner assignment
      const ownerName = userProfile?.first_name && userProfile?.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : userProfile?.first_name || userProfile?.email || 'Unknown Owner';

      console.log('Using ownerId:', userProfile.id, 'ownerName:', ownerName);

      // Validate each contact has required fields and transform data
      const requiredFields = ['firstName', 'lastName', 'email'];
      const transformedContacts = parsedContacts.map((contact, index) => {
        // Check required fields
        requiredFields.forEach(field => {
          if (contact[field] === undefined || contact[field] === null) {
            throw new Error(`Contact at index ${index} is missing required field: ${field}`);
          }
        });

        // Transform and set default values
        return {
          ...contact,
          owner: userProfile.id, // Use userProfile.id directly for owner
          company: contact.company || null,
          phone: contact.phone || null,
          role: contact.role || null,
          country: contact.country || null,
          status: contact.status || 'Active',
          tags: Array.isArray(contact.tags) ? contact.tags : [],
          notes: contact.notes || null,
        };
      });

      return transformedContacts;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Invalid JSON format');
    }
  };

  const handleImport = async () => {
    try {
      const parsedContacts = validateAndParseContacts(jsonInput);

      const inserted: number = await onImport(parsedContacts);

      onOpenChange(false);
      setJsonInput('');
      setSelectedFile(null);

      toast({
        title: inserted > 0 ? 'Import Complete' : 'No New Contacts',
        description: inserted > 0
          ? `${inserted} new contacts imported successfully.`
          : 'All provided emails already exist, nothing was added.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import contacts.';
      setError(message);
      toast({
        title: 'Import Error',
        description: message,
        variant: 'destructive',
      });
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
        validateAndParseContacts(content); // Validate but don't import yet
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
          <DialogTitle>{t('contacts.import.title', 'Import Contacts')}</DialogTitle>
          <DialogDescription>
            {t('contacts.import.description', 'Import your contacts data from a JSON file or paste it directly')}
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
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "company": "Acme Corp",
    "role": "CEO",
    "country": "USA",
    "status": "Active",
    "tags": ["Lead", "Potential"],
    "notes": "Met at conference, very interested in product."
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
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "company": "Acme Corp",
    "role": "CEO",
    "country": "USA",
    "status": "Active",
    "tags": ["Lead", "Potential"],
    "notes": "Met at conference, very interested in product."
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