import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pin,
  Edit,
  Trash2,
  User,
  Briefcase,
  Handshake,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Users,
  Target,
  TrendingUp,
  Clock,
  Star,
  Tag,
} from "lucide-react";
import { NoteModal } from "./NoteModal";
import type { Note } from "@/types/note";
import type { Deal } from "@/types/deal";
import type { Client } from "@/types/client";
import type { Contact } from "@/components/contacts/ContactsTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ClientService } from "@/services/clientService";
import { contactsService } from "@/services/contactsService";
import { useDeals } from "@/hooks/useDeals";
import { useAuth } from "@/contexts/AuthContext";

interface NoteDetailDrawerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (noteId: string) => void;
  relatedEntityOptions?: Array<{ id: string; name: string; type: 'client' | 'contact' | 'deal' }>;
}

interface RelatedEntityData {
  type: 'deal' | 'client' | 'contact';
  data: Deal | Client | Contact | null;
  loading: boolean;
  error: string | null;
}

export function NoteDetailDrawer({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  relatedEntityOptions
}: NoteDetailDrawerProps) {
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [relatedEntity, setRelatedEntity] = useState<RelatedEntityData>({
    type: 'deal',
    data: null,
    loading: false,
    error: null
  });

  const { deals, isLoading: dealsLoading } = useDeals();

  // Fetch related entity data when note changes
  useEffect(() => {
    if (!note?.relatedEntityId || !note?.relatedEntityType || !userProfile) {
      setRelatedEntity({
        type: 'deal',
        data: null,
        loading: false,
        error: null
      });
      return;
    }

    const fetchRelatedEntity = async () => {
      setRelatedEntity(prev => ({ ...prev, loading: true, error: null }));

      try {
        let data = null;
        
        switch (note.relatedEntityType) {
          case 'deal':
            // Find deal from existing deals data
            data = deals.find(d => d.id === note.relatedEntityId) || null;
            break;
          case 'client':
            data = await ClientService.getClientProfile(note.relatedEntityId);
            break;
          case 'contact':
            // For contacts, we need to get all contacts and find the specific one
            const allContacts = await contactsService.getContacts({
              userId: userProfile.id,
              userRole: userProfile.role as any
            });
            data = allContacts.find(c => c.id.toString() === note.relatedEntityId) || null;
            break;
        }

        setRelatedEntity({
          type: note.relatedEntityType,
          data,
          loading: false,
          error: null
        });
      } catch (error: any) {
        setRelatedEntity({
          type: note.relatedEntityType,
          data: null,
          loading: false,
          error: error.message || 'Failed to fetch related entity'
        });
      }
    };

    fetchRelatedEntity();
  }, [note?.relatedEntityId, note?.relatedEntityType, userProfile, deals]);

  if (!note) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleEditSave = () => {
    onSave();
    setIsEditModalOpen(false);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'deal': return <Handshake className="h-4 w-4" />;
      case 'client': return <Briefcase className="h-4 w-4" />;
      case 'contact': return <User className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      'Lead': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Prospect': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Qualified': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Proposal': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Negotiation': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Won/Lost': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return stageColors[stage] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const renderDealDetails = (deal: Deal) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getEntityIcon('deal')}
        <h3 className="font-semibold text-lg">Deal Details</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Name</span>
          </div>
          <div className="font-medium">{deal.name}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>Client</span>
          </div>
          <div className="font-medium">{deal.client}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Value</span>
          </div>
          <div className="font-medium">{deal.currency} {deal.value?.toLocaleString()}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Probability</span>
          </div>
          <div className="font-medium">{deal.probability}%</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Expected Close</span>
          </div>
          <div className="font-medium">{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'Not set'}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Owner</span>
          </div>
          <div className="font-medium">{deal.owner}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge className={getStageColor(deal.stage)}>
          {deal.stage}
        </Badge>
        <Badge className={getPriorityColor(deal.priority)}>
          {deal.priority} Priority
        </Badge>
      </div>

      {deal.description && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Description</span>
          </div>
          <div className="text-sm bg-muted p-3 rounded-md">
            {deal.description}
          </div>
        </div>
      )}

      {deal.website && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </div>
          <div className="font-medium">
            <a href={deal.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {deal.website}
            </a>
          </div>
        </div>
      )}

      {deal.rating && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            <span>Rating</span>
          </div>
          <div className="font-medium">{deal.rating}/5</div>
        </div>
      )}
    </div>
  );

  const renderClientDetails = (client: Client) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getEntityIcon('client')}
        <h3 className="font-semibold text-lg">Client Details</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>Name</span>
          </div>
          <div className="font-medium">{client.name}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </div>
          <div className="font-medium">{client.email || 'Not provided'}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Phone</span>
          </div>
          <div className="font-medium">{client.phone || 'Not provided'}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Country</span>
          </div>
          <div className="font-medium">{client.country || 'Not provided'}</div>
        </div>
      </div>

      {client.industry && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>Industry</span>
          </div>
          <div className="font-medium">{client.industry}</div>
        </div>
      )}

      {client.industry && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Industry</span>
          </div>
          <div className="font-medium">{client.industry}</div>
        </div>
      )}
    </div>
  );

  const renderContactDetails = (contact: Contact) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getEntityIcon('contact')}
        <h3 className="font-semibold text-lg">Contact Details</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Name</span>
          </div>
          <div className="font-medium">{contact.firstName} {contact.lastName}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </div>
          <div className="font-medium">{contact.email || 'Not provided'}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Phone</span>
          </div>
          <div className="font-medium">{contact.phone || 'Not provided'}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Country</span>
          </div>
          <div className="font-medium">{contact.country || 'Not provided'}</div>
        </div>
      </div>

      {contact.company && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </div>
          <div className="font-medium">{contact.company}</div>
        </div>
      )}

      {contact.role && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>Role</span>
          </div>
          <div className="font-medium">{contact.role}</div>
        </div>
      )}

      {contact.status && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Status</span>
          </div>
          <div className="font-medium">{contact.status}</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {note.isPinned && (
                  <Pin className="h-5 w-5 text-orange-500 fill-current flex-shrink-0" />
                )}
                <SheetTitle className="text-left line-clamp-2">
                  {note.title}
                </SheetTitle>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        note and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(note.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              {note.relatedEntityId && note.relatedEntityType && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Related to:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getEntityIcon(note.relatedEntityType)}
                    {relatedEntityOptions?.find(opt => opt.id === note.relatedEntityId)?.name || note.relatedEntityType}
                  </Badge>
                </div>
              )}

              {note.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">{t('notes.detail.tags')}</span>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Related Entity Details */}
            {note.relatedEntityId && note.relatedEntityType && (
              <div className="space-y-4">
                <Separator />
                
                {relatedEntity.loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">Loading related entity details...</div>
                  </div>
                )}

                {relatedEntity.error && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-red-500">Error loading related entity: {relatedEntity.error}</div>
                  </div>
                )}

                {!relatedEntity.loading && !relatedEntity.error && relatedEntity.data && (
                  <div className="space-y-4">
                    {relatedEntity.type === 'deal' && renderDealDetails(relatedEntity.data as Deal)}
                    {relatedEntity.type === 'client' && renderClientDetails(relatedEntity.data as Client)}
                    {relatedEntity.type === 'contact' && renderContactDetails(relatedEntity.data as Contact)}
                  </div>
                )}
              </div>
            )}

            {/* Note Content */}
            <div className="space-y-3">
              <h3 className="font-medium">{t('notes.detail.content')}</h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted p-4 rounded-md">
                  {note.content}
                </div>
              </div>
            </div>

            {/* Created & Updated Info */}
            <div className="space-y-3">
              <h3 className="font-medium">{t('notes.detail.info')}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{note.owner?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span>{note.owner || 'Unknown'}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>{t('notes.detail.createdAt')}: </span>
                <span>{formatDate(note.createdAt)}</span>
              </div>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="text-sm text-muted-foreground">
                  <span>{t('notes.detail.updatedAt')}: </span>
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <NoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        note={note}
      />
    </>
  );
}
