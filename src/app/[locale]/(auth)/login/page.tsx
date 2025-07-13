import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { getTranslations, createT } from '@/lib/i18n';

export default async function LoginPage({ params: { locale } }: { params: { locale: 'en' | 'fr' }}) {
  const translations = await getTranslations(locale);
  const t = createT(translations);
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('login.emailLabel')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('login.passwordLabel')}</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">
            <LogIn className="mr-2 h-4 w-4"/>
            {t('login.button')}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {t('login.signupPrompt')}{" "}
            <Link href="/signup" className="underline hover:text-primary">
              {t('login.signupLink')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
