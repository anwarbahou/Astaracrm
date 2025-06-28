import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof passwordSchema>;

export function SecuritySettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.getUser()?.data?.user?.email || "",
        password: data.currentPassword,
      });

      if (signInError) {
        toast({
          title: t("settings.security.passwordUpdateError"),
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        toast({
          title: t("settings.security.passwordUpdateError"),
          description: updateError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("settings.security.passwordUpdated"),
        description: t("settings.security.passwordUpdatedDesc"),
      });

      form.reset();
    } catch (error) {
      toast({
        title: t("settings.security.passwordUpdateError"),
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const newPassword = form.watch("newPassword");
  const requirements = [
    { key: "reqLength", check: () => newPassword.length >= 8 },
    { key: "reqUppercase", check: () => /[A-Z]/.test(newPassword) },
    { key: "reqLowercase", check: () => /[a-z]/.test(newPassword) },
    { key: "reqNumber", check: () => /[0-9]/.test(newPassword) },
    { key: "reqSpecial", check: () => /[@$!%*?&]/.test(newPassword) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.security.title")}</CardTitle>
        <CardDescription>{t("settings.security.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.security.currentPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.security.newPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.security.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t("settings.security.requirements")}</h4>
              <ul className="space-y-2 text-sm">
                {requirements.map(({ key, check }) => (
                  <li key={key} className="flex items-center gap-2">
                    {check() ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {t(`settings.security.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("settings.security.updating") : t("settings.security.updatePassword")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 