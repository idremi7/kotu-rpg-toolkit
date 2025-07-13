import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getTranslations, createT } from '@/lib/i18n';

export default async function SignupPage({ params: { locale } }: { params: { locale: 'en' | 'fr' }}) {
  const translations = await getTranslations(locale);
  const t = createT(translations);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('signup.emailLabel')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('signup.passwordLabel')}</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label>{t('signup.roleLabel')}</Label>
            <RadioGroup defaultValue="player" className="flex gap-4">
              <div>
                <RadioGroupItem value="player" id="player" className="peer sr-only" />
                <Label
                  htmlFor="player"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {t('signup.rolePlayer')}
                </Label>
              </div>
               <div>
                <RadioGroupItem value="gm" id="gm" className="peer sr-only" />
                <Label
                  htmlFor="gm"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {t('signup.roleGM')}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">
            <UserPlus className="mr-2 h-4 w-4"/>
            {t('signup.button')}
          </Button>
           <div className="text-center text-sm text-muted-foreground">
            {t('signup.loginPrompt')}{" "}
            <Link href="/login" className="underline hover:text-primary">
              {t('signup.loginLink')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
