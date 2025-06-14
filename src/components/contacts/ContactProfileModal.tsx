
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Clock
} from "lucide-react";
import { Contact } from "./ContactsTable";
import { useToast } from "@/hooks/use-toast";

interface ContactProfileModalProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: Contact) => void;
}

export function ContactProfileModal({ contact, open, onOpenChange, onSave }: ContactProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  if (!contact) return null;

  const handleEdit = () => {
    setEditedContact({ ...contact });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContact) {
      onSave(editedContact);
      setIsEditing(false);
      toast({
        title: "Contact Updated",
        description: "Contact information has been successfully updated.",
      });
    }
  };

  const handleCancel = () => {
    setEditedContact(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast({
      title: "Contact Deleted",
      description: "Contact has been successfully deleted.",
    });
    onOpenChange(false);
  };

  const displayContact = isEditing && editedContact ? editedContact : contact;

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Decision Maker": return "bg-purple-100 text-purple-800";
      case "VIP": return "bg-yellow-100 text-yellow-800";
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Founder": return "bg-green-100 text-green-800";
      case "Startup": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Contact Profile</DialogTitle>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mx-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6 pt-4">
                <div className="space-y-6">
                  {/* Profile Header */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={displayContact.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                            {displayContact.firstName[0]}{displayContact.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                          {isEditing ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  value={editedContact?.firstName || ''}
                                  onChange={(e) => setEditedContact(prev => prev ? {...prev, firstName: e.target.value} : null)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  value={editedContact?.lastName || ''}
                                  onChange={(e) => setEditedContact(prev => prev ? {...prev, lastName: e.target.value} : null)}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h2 className="text-2xl font-bold">{displayContact.firstName} {displayContact.lastName}</h2>
                              <p className="text-lg text-muted-foreground">{displayContact.role}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {displayContact.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className={getTagColor(tag)}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editedContact?.email || ''}
                              onChange={(e) => setEditedContact(prev => prev ? {...prev, email: e.target.value} : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={editedContact?.phone || ''}
                              onChange={(e) => setEditedContact(prev => prev ? {...prev, phone: e.target.value} : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Role/Title</Label>
                            <Input
                              id="role"
                              value={editedContact?.role || ''}
                              onChange={(e) => setEditedContact(prev => prev ? {...prev, role: e.target.value} : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={editedContact?.company || ''}
                              onChange={(e) => setEditedContact(prev => prev ? {...prev, company: e.target.value} : null)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{displayContact.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{displayContact.phone}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Company</p>
                                <p className="font-medium">{displayContact.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{displayContact.country}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Activity Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">{displayContact.createdDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Last Contacted</p>
                            <p className="font-medium">{displayContact.lastContacted}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notes & Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add a note about this contact..."
                        className="min-h-[120px]"
                        value={displayContact.notes || ''}
                        readOnly={!isEditing}
                      />
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Recent Notes</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">Initial contact made regarding software solutions. Very interested in our CRM platform.</p>
                            <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">Follow-up meeting scheduled for next week. Prepare demo materials.</p>
                            <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="p-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Files & Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No files uploaded yet</p>
                      <Button variant="outline" className="mt-4">
                        Upload Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="p-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Communication History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                      <Button variant="outline" className="mt-4">
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="p-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border-l-2 border-blue-500 bg-blue-50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Contact created</p>
                          <p className="text-xs text-muted-foreground">{displayContact.createdDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border-l-2 border-green-500 bg-green-50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Email sent</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border-l-2 border-orange-500 bg-orange-50">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Meeting scheduled</p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
