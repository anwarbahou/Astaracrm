import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Palette,
  Download,
  Upload,
  Trash2,
  Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAvatar } from '@/lib/uploadAvatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Settings() {
  const [settings, setSettings] = useState({
    // Profile Settings (will be populated from userProfile)
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timezone: "",
    
    // Company Settings
    companyName: "WOLFHUNT CRM",
    companyEmail: "contact@wolfhunt.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Business Ave, Suite 500, New York, NY 10001",
    companyTimezone: "America/New_York",
    currency: "MAD",
    dateFormat: "MM/DD/YYYY",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    dealAlerts: true,
    taskReminders: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // Email
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@wolfhunt.com",
    smtpPassword: "••••••••",
    
    // Integrations
    googleCalendar: false,
    outlookCalendar: true,
    slackIntegration: false,
    zapierWebhooks: true,
  });

  const { userProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();

  // Sync settings with userProfile when it loads/changes
  useEffect(() => {
    if (userProfile) {
      setSettings({
        // Profile Settings
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        timezone: userProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        // Company Settings (keep defaults or fetch from userProfile/company if available)
        companyName: settings.companyName,
        companyEmail: settings.companyEmail,
        companyPhone: settings.companyPhone,
        companyAddress: settings.companyAddress,
        companyTimezone: settings.companyTimezone,
        currency: settings.currency,
        dateFormat: settings.dateFormat,
        // Notifications (keep defaults or fetch from userProfile if available)
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        weeklyReports: settings.weeklyReports,
        dealAlerts: settings.dealAlerts,
        taskReminders: settings.taskReminders,
        // Security (keep defaults or fetch from userProfile if available)
        twoFactorAuth: settings.twoFactorAuth,
        sessionTimeout: settings.sessionTimeout,
        passwordExpiry: settings.passwordExpiry,
        // Email (keep defaults or fetch from userProfile if available)
        smtpServer: settings.smtpServer,
        smtpPort: settings.smtpPort,
        smtpUsername: settings.smtpUsername,
        smtpPassword: settings.smtpPassword,
        // Integrations (keep defaults or fetch from userProfile if available)
        googleCalendar: settings.googleCalendar,
        outlookCalendar: settings.outlookCalendar,
        slackIntegration: settings.slackIntegration,
        zapierWebhooks: settings.zapierWebhooks,
      });
    }
    // eslint-disable-next-line
  }, [userProfile]);

  const initials = `${userProfile?.first_name?.charAt(0) || ''}${userProfile?.last_name?.charAt(0) || ''}`;

  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;
    console.log('[Settings] File selected', file.name, file.size, 'bytes');
    try {
      const url = await uploadAvatar(file, userProfile.id);
      console.log('[Settings] Avatar URL returned', url);
      const { error } = await supabase.from('users').update({ avatar_url: url }).eq('id', userProfile.id);
      if (error) {
        console.error('[Settings] DB update error', error);
      } else {
        console.log('[Settings] users.avatar_url updated');
      }
      toast({ title: 'Photo updated' });
      console.log('[Settings] Triggering profile refresh...');
      refreshUserProfile();
    } catch (err) {
      console.error('[Settings] Avatar upload flow failed', err);
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const SettingRow = ({ icon: Icon, title, description, children }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="ml-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your CRM system preferences and integrations.
          </p>
        </div>
        <Button className="gap-2" onClick={async () => {
          if (!userProfile) return toast({ title: 'User not loaded', variant: 'destructive' });
          const { error } = await supabase.from('users').update({
            first_name: settings.firstName,
            last_name: settings.lastName,
            email: settings.email,
            phone: settings.phone,
            timezone: settings.timezone
          }).eq('id', userProfile.id);
          if (error) {
            toast({ title: 'Failed to save changes', description: error.message, variant: 'destructive' });
          } else {
            toast({ title: 'Settings saved' });
            refreshUserProfile();
          }
        }}>
          <Save size={16} />
          Save All Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile?.avatar_url || ''} />
                  <AvatarFallback>{initials || 'UP'}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" onClick={handlePhotoClick}>Change Photo</Button>
                  <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />
                  <p className="text-xs text-muted-foreground mt-1">PNG or JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={settings.firstName} onChange={e => handleSettingChange('firstName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={settings.lastName} onChange={e => handleSettingChange('lastName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={settings.email} onChange={e => handleSettingChange('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={settings.phone} onChange={e => handleSettingChange('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value={settings.timezone} onChange={e => handleSettingChange('timezone', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    placeholder="MAD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input
                    id="dateFormat"
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value="English (US)"
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Mail}
                title="Email Notifications"
                description="Receive notifications via email"
              >
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </SettingRow>

              <SettingRow
                icon={Bell}
                title="Push Notifications"
                description="Receive browser push notifications"
              >
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </SettingRow>

              <SettingRow
                icon={Mail}
                title="Weekly Reports"
                description="Get weekly performance summaries"
              >
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </SettingRow>

              <SettingRow
                icon={Bell}
                title="Deal Alerts"
                description="Notifications for deal stage changes"
              >
                <Switch
                  checked={settings.dealAlerts}
                  onCheckedChange={(checked) => handleSettingChange('dealAlerts', checked)}
                />
              </SettingRow>

              <SettingRow
                icon={Bell}
                title="Task Reminders"
                description="Reminders for upcoming and overdue tasks"
              >
                <Switch
                  checked={settings.taskReminders}
                  onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Shield}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                  {settings.twoFactorAuth && <Badge variant="secondary">Enabled</Badge>}
                </div>
              </SettingRow>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Password Requirements</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span className="text-sm">Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span className="text-sm">Include uppercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span className="text-sm">Include numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span className="text-sm">Include special characters</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    value={settings.smtpServer}
                    onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Email Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Globe}
                title="Google Calendar"
                description="Sync appointments with Google Calendar"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.googleCalendar}
                    onCheckedChange={(checked) => handleSettingChange('googleCalendar', checked)}
                  />
                  {!settings.googleCalendar && <Button variant="outline" size="sm">Connect</Button>}
                </div>
              </SettingRow>

              <SettingRow
                icon={Globe}
                title="Outlook Calendar"
                description="Sync appointments with Outlook Calendar"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.outlookCalendar}
                    onCheckedChange={(checked) => handleSettingChange('outlookCalendar', checked)}
                  />
                  {settings.outlookCalendar && <Badge variant="secondary">Connected</Badge>}
                </div>
              </SettingRow>

              <SettingRow
                icon={Globe}
                title="Slack Integration"
                description="Send notifications to Slack channels"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => handleSettingChange('slackIntegration', checked)}
                  />
                  {!settings.slackIntegration && <Button variant="outline" size="sm">Connect</Button>}
                </div>
              </SettingRow>

              <SettingRow
                icon={Globe}
                title="Zapier Webhooks"
                description="Automate workflows with Zapier"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.zapierWebhooks}
                    onCheckedChange={(checked) => handleSettingChange('zapierWebhooks', checked)}
                  />
                  {settings.zapierWebhooks && <Badge variant="secondary">Active</Badge>}
                </div>
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your CRM data in CSV or JSON format
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download size={16} />
                      Export CSV
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download size={16} />
                      Export JSON
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Import Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Import contacts, deals, and other data from CSV files
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Upload size={16} />
                    Import CSV
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <h4 className="font-medium mb-2 text-red-800">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-4">
                    Permanently delete all CRM data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 size={16} />
                    Delete All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Total Contacts</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
