import { getCharacterAction, getSystemAction } from '@/actions';
import { BackButton } from '@/components/BackButton';
import { CharacterCreator } from '@/components/player/CharacterCreator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditCharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  const character = await getCharacterAction(params.characterId);

  if (!character) {
    notFound();
  }

  const system = await getSystemAction(character.systemId);

  if (!system) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute left-0">
          <Button asChild variant="outline" size="icon">
            <Link href="/player/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold">Edit Character</h1>
          <p className="text-muted-foreground">
            You are editing{' '}
            <span className="text-primary font-semibold">{character.data.name}</span> for the{' '}
            <span className="text-primary font-semibold">{system.systemName}</span> system.
          </p>
        </div>
      </div>
      <CharacterCreator systemId={character.systemId} system={system} initialCharacter={character} />
    </div>
  );
}
