import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Save,
  Check,
  X,
  LineChart,
  Handshake,
  ListTodo,
  Calendar,
  MessageSquare,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAvatar } from '@/lib/uploadAvatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { withPageTitle } from '@/components/withPageTitle';
import { useTranslation } from 'react-i18next';
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { cn } from "@/lib/utils";

function Settings() {
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

  // Password reset state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { userProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

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

  const handlePasswordChange = async () => {
    if (!userProfile) return;
    
    // Reset error state
    setPasswordError(null);
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('settings.security.passwordMismatch'));
      return;
    }
    
    // Validate password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError(t('settings.security.passwordRequirements'));
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: t('settings.security.passwordUpdated'),
        description: t('settings.security.passwordUpdatedDesc')
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setPasswordError(error.message);
      toast({
        title: t('settings.security.passwordUpdateError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
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

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('settings.description')}
          </p>
        </div>
        <Button className="gap-2" onClick={async () => {
          if (!userProfile) return toast({ title: t('settings.userNotLoaded'), variant: 'destructive' });
          const { error } = await supabase.from('users').update({
            first_name: settings.firstName,
            last_name: settings.lastName,
            email: settings.email,
            phone: settings.phone,
            timezone: settings.timezone
          }).eq('id', userProfile.id);
          if (error) {
            toast({ title: t('settings.saveFailed'), description: error.message, variant: 'destructive' });
          } else {
            toast({ title: t('settings.saved') });
            refreshUserProfile();
          }
        }}>
          <Save size={16} />
          {t('settings.saveChanges')}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className={cn(
          "grid w-full",
          isAdmin ? "grid-cols-5" : "grid-cols-3"
        )}>
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} />
            {t('settings.tabs.profile')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            {t('settings.tabs.notifications')}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            {t('settings.tabs.security')}
          </TabsTrigger>
          {isAdmin && (
            <>
          <TabsTrigger value="email" className="gap-2">
            <Mail size={16} />
            {t('settings.tabs.email')}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Globe size={16} />
            {t('settings.tabs.integrations')}
          </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.profile.title')}</CardTitle>
              <CardDescription>{t('settings.profile.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 cursor-pointer" onClick={handlePhotoClick}>
                  <AvatarImage src={userProfile?.avatar_url || ''} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium mb-1">{t('settings.profile.photo')}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('settings.profile.photoDesc')}
                  </p>
                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePhotoClick}>
                      <Upload size={16} className="mr-2" />
                      {t('settings.profile.upload')}
                    </Button>
                    {userProfile?.avatar_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!userProfile) return;
                          const { error } = await supabase
                            .from('users')
                            .update({ avatar_url: null })
                            .eq('id', userProfile.id);
                          if (error) {
                            toast({
                              title: t('settings.profile.removePhotoError'),
                              variant: 'destructive'
                            });
                          } else {
                            toast({ title: t('settings.profile.photoRemoved') });
                            refreshUserProfile();
                          }
                        }}
                      >
                        <Trash2 size={16} className="mr-2" />
                        {t('settings.profile.remove')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t('settings.profile.firstName')}</Label>
                  <Input
                    value={settings.firstName}
                    onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.profile.lastName')}</Label>
                  <Input
                    value={settings.lastName}
                    onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.profile.email')}</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.profile.phone')}</Label>
                  <Input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.profile.timezone')}</Label>
                  <Input
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications.title')}</CardTitle>
              <CardDescription>{t('settings.notifications.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Mail}
                title={t('settings.notifications.emailNotifs')}
                description={t('settings.notifications.emailNotifsDesc')}
              >
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={Bell}
                title={t('settings.notifications.pushNotifs')}
                description={t('settings.notifications.pushNotifsDesc')}
              >
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={LineChart}
                title={t('settings.notifications.weeklyReports')}
                description={t('settings.notifications.weeklyReportsDesc')}
              >
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={Handshake}
                title={t('settings.notifications.dealAlerts')}
                description={t('settings.notifications.dealAlertsDesc')}
              >
                <Switch
                  checked={settings.dealAlerts}
                  onCheckedChange={(checked) => handleSettingChange('dealAlerts', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={ListTodo}
                title={t('settings.notifications.taskReminders')}
                description={t('settings.notifications.taskRemindersDesc')}
              >
                <Switch
                  checked={settings.taskReminders}
                  onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="mt-4">
            <SecuritySettings />
          </div>
        </TabsContent>

        {isAdmin && (
          <>
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.email.title')}</CardTitle>
              <CardDescription>{t('settings.email.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t('settings.email.smtpServer')}</Label>
                  <Input
                    value={settings.smtpServer}
                    onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.email.smtpPort')}</Label>
                  <Input
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.email.smtpUsername')}</Label>
                  <Input
                    value={settings.smtpUsername}
                    onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('settings.email.smtpPassword')}</Label>
                  <Input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.integrations.title')}</CardTitle>
              <CardDescription>{t('settings.integrations.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Calendar}
                title={t('settings.integrations.googleCalendar')}
                description={t('settings.integrations.googleCalendarDesc')}
              >
                <Switch
                  checked={settings.googleCalendar}
                  onCheckedChange={(checked) => handleSettingChange('googleCalendar', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={Calendar}
                title={t('settings.integrations.outlookCalendar')}
                description={t('settings.integrations.outlookCalendarDesc')}
              >
                <Switch
                  checked={settings.outlookCalendar}
                  onCheckedChange={(checked) => handleSettingChange('outlookCalendar', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={MessageSquare}
                title={t('settings.integrations.slack')}
                description={t('settings.integrations.slackDesc')}
              >
                <Switch
                  checked={settings.slackIntegration}
                  onCheckedChange={(checked) => handleSettingChange('slackIntegration', checked)}
                />
              </SettingRow>
              <SettingRow
                icon={Zap}
                title={t('settings.integrations.zapier')}
                description={t('settings.integrations.zapierDesc')}
              >
                <Switch
                  checked={settings.zapierWebhooks}
                  onCheckedChange={(checked) => handleSettingChange('zapierWebhooks', checked)}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default withPageTitle(Settings, 'Settings');
