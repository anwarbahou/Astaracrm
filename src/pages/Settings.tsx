import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Bell,
  Shield,
  Mail,
  Globe,
  Upload,
  Save,
  LineChart,
  Handshake,
  ListTodo,
  Calendar,
  MessageSquare,
  Zap,
  RefreshCw
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
import { createAvatar } from '@dicebear/core';
import * as micah from '@dicebear/micah';
import { delay } from '@/lib/delay';

const NUM_AVATAR_SUGGESTIONS = 5;

function Settings() {
  const { userProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState(userProfile?.first_name || '');
  const [lastName, setLastName] = useState(userProfile?.last_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [timezone, setTimezone] = useState(userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [suggestedAvatars, setSuggestedAvatars] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.first_name || '');
      setLastName(userProfile.last_name || '');
      setPhone(userProfile.phone || '');
      setTimezone(userProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [userProfile]);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  const handlePhotoClick = () => {
    if (isUploading) return;
    fileRef.current?.click();
  };

  const updateAvatar = async (file: File) => {
    if (!userProfile || isUploading) return;
    setIsUploading(true);
    try {
      const url = await uploadAvatar(file, userProfile.id);
      await supabase.from('users').update({ avatar_url: url }).eq('id', userProfile.id);
      toast({ title: t('settings.avatarUpdated') });
      
      // Add a short delay to allow the database to update before refetching
      await delay(500);
      
      refreshUserProfile();
    } catch (err) {
      toast({ title: t('settings.avatarUpdateFailed'), variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateAvatar(file);
  };

  const handleSelectSuggestedAvatar = (svg: string) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const file = new File([blob], 'avatar.svg', { type: 'image/svg+xml' });
    updateAvatar(file);
  };

  const generateSuggestions = () => {
    const suggestions = Array.from({ length: NUM_AVATAR_SUGGESTIONS }, () =>
      createAvatar(micah, {
        seed: Math.random().toString(),
        radius: 50,
      }).toString()
    );
    setSuggestedAvatars(suggestions);
  };

  useEffect(() => {
    generateSuggestions();
  }, []);
  
  const handleSaveChanges = async () => {
    if (!userProfile) return toast({ title: t('settings.userNotLoaded'), variant: 'destructive' });
    const { error } = await supabase.from('users').update({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      timezone: timezone
    }).eq('id', userProfile.id);
    if (error) {
      toast({ title: t('settings.saveFailed'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('settings.saved') });
      refreshUserProfile();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('settings.description')}
          </p>
        </div>
        <Button className="gap-2" onClick={handleSaveChanges}>
          <Save size={16} />
          {t('settings.saveChanges')}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className={cn("grid w-full", isAdmin ? "grid-cols-5" : "grid-cols-3")}>
          <TabsTrigger value="profile" className="gap-2"><User size={16} />{t('settings.tabs.profile')}</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell size={16} />{t('settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield size={16} />{t('settings.tabs.security')}</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="email" className="gap-2"><Mail size={16} />{t('settings.tabs.email')}</TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2"><Globe size={16} />{t('settings.tabs.integrations')}</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.profile.title')}</CardTitle>
              <CardDescription>{t('settings.profile.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="overflow-hidden">
                <CardHeader className="p-0"><div className="bg-muted h-24 w-full" /></CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 -mt-16">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-background cursor-pointer" onClick={handlePhotoClick}>
                        <AvatarImage src={userProfile?.avatar_url || undefined} alt={userProfile?.first_name || 'User'} />
                        <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                      </Avatar>
                      <div 
                        className={cn(
                          "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full",
                          isUploading && "opacity-100 bg-opacity-70 cursor-not-allowed"
                        )} 
                        onClick={handlePhotoClick}
                      >
                        {isUploading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> : <Upload className="h-8 w-8 text-white" />}
                      </div>
                    </div>
                    <input type="file" ref={fileRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif"/>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
                      <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={userProfile?.role === 'admin' ? 'default' : 'secondary'}>{userProfile?.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-muted-foreground">Or select an avatar</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {suggestedAvatars.map((svg, i) => (
                        <Avatar 
                          key={i} 
                          className={cn(
                            "h-12 w-12 cursor-pointer transition-transform hover:scale-110 relative",
                            isUploading && "opacity-50 cursor-not-allowed"
                          )} 
                          onClick={() => handleSelectSuggestedAvatar(svg)}
                        >
                          <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} />
                          {isUploading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            </div>
                          )}
                        </Avatar>
                      ))}
                      <Button variant="ghost" size="icon" onClick={generateSuggestions} disabled={isUploading}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="timezone">{t('settings.profile.timezone')}</Label>
                       <Input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>{t('settings.notifications.title')}</CardTitle><CardDescription>{t('settings.notifications.description')}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <SettingRow icon={Mail} title={t('settings.notifications.emailNotifs')} description={t('settings.notifications.emailNotifsDesc')}>
                <Switch checked={true} onCheckedChange={() => {}} />
              </SettingRow>
              <SettingRow icon={Bell} title={t('settings.notifications.pushNotifs')} description={t('settings.notifications.pushNotifsDesc')}>
                <Switch checked={false} onCheckedChange={() => {}} />
              </SettingRow>
              <SettingRow icon={LineChart} title={t('settings.notifications.weeklyReports')} description={t('settings.notifications.weeklyReportsDesc')}>
                <Switch checked={true} onCheckedChange={() => {}} />
              </SettingRow>
              <SettingRow icon={Handshake} title={t('settings.notifications.dealAlerts')} description={t('settings.notifications.dealAlertsDesc')}>
                <Switch checked={true} onCheckedChange={() => {}} />
              </SettingRow>
              <SettingRow icon={ListTodo} title={t('settings.notifications.taskReminders')} description={t('settings.notifications.taskRemindersDesc')}>
                <Switch checked={true} onCheckedChange={() => {}} />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="mt-4"><SecuritySettings /></div>
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="email">
              <Card>
                <CardHeader><CardTitle>{t('settings.email.title')}</CardTitle><CardDescription>{t('settings.email.description')}</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2"><Label>{t('settings.email.smtpServer')}</Label><Input value="smtp.gmail.com" onChange={() => {}} /></div>
                  <div className="grid gap-2"><Label>{t('settings.email.smtpPort')}</Label><Input value="587" onChange={() => {}} /></div>
                  <div className="grid gap-2"><Label>{t('settings.email.smtpUsername')}</Label><Input value="noreply@wolfhunt.com" onChange={() => {}} /></div>
                  <div className="grid gap-2"><Label>{t('settings.email.smtpPassword')}</Label><Input type="password" value="••••••••" onChange={() => {}} /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card>
                <CardHeader><CardTitle>{t('settings.integrations.title')}</CardTitle><CardDescription>{t('settings.integrations.description')}</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <SettingRow icon={Calendar} title={t('settings.integrations.googleCalendar')} description={t('settings.integrations.googleCalendarDesc')}>
                    <Switch checked={false} onCheckedChange={() => {}} />
                  </SettingRow>
                  <SettingRow icon={Calendar} title={t('settings.integrations.outlookCalendar')} description={t('settings.integrations.outlookCalendarDesc')}>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </SettingRow>
                  <SettingRow icon={MessageSquare} title={t('settings.integrations.slack')} description={t('settings.integrations.slackDesc')}>
                    <Switch checked={false} onCheckedChange={() => {}} />
                  </SettingRow>
                  <SettingRow icon={Zap} title={t('settings.integrations.zapier')} description={t('settings.integrations.zapierDesc')}>
                    <Switch checked={true} onCheckedChange={() => {}} />
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

export default withPageTitle(Settings, 'settings');