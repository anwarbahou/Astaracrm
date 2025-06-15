
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

interface SignInModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSignIn: () => void;
  onSwitchToSignUp: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onOpenChange, onSignIn, onSwitchToSignUp }) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log('Sign In values:', values);
    // Here you would call your auth API
    // On success:
    onSignIn();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('landingPage.auth.signInTitle')}</DialogTitle>
          <DialogDescription>{t('landingPage.auth.signInSubtitle')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex justify-end">
              <Button type="button" variant="link" className="p-0 h-auto text-sm">
                {t('landingPage.auth.forgotPassword')}
              </Button>
            </div>
            <Button type="submit" className="w-full">{t('landingPage.auth.signInButton')}</Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground">
          {t('landingPage.auth.noAccount')}{' '}
          <Button variant="link" className="p-0 h-auto" onClick={onSwitchToSignUp}>
            {t('landingPage.auth.signUpHere')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
