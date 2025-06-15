
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  region: z.string({ required_error: 'Please select a region.' }),
});

interface SignUpModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSignUp: () => void;
  onSwitchToSignIn: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onOpenChange, onSignUp, onSwitchToSignIn }) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', companyName: '', email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    console.log('Sign Up values:', values);
    // Here you would call your auth API
    // On success:
    onSignUp();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('landingPage.auth.signUpTitle')}</DialogTitle>
          <DialogDescription>{t('landingPage.auth.signUpSubtitle')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landingPage.auth.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landingPage.auth.companyNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landingPage.auth.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landingPage.auth.passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landingPage.auth.regionLabel')}</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('landingPage.auth.regionPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mena">{t('landingPage.auth.regionMena')}</SelectItem>
                      <SelectItem value="europe">{t('landingPage.auth.regionEurope')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{t('landingPage.auth.signUpButton')}</Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground">
          {t('landingPage.auth.hasAccount')}{' '}
          <Button variant="link" className="p-0 h-auto" onClick={onSwitchToSignIn}>
            {t('landingPage.auth.signInHere')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
