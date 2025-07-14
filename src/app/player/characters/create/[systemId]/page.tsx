import { BackButton } from "@/components/BackButton";
import { CharacterCreator } from "@/components/player/CharacterCreator";

export default function CreateCharacterPage({ params }: { params: { systemId: string }}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8 flex items-center justify-center">
         <div className="absolute left-0">
            <BackButton />
         </div>
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold">Forge Your Hero</h1>
            <p className="text-muted-foreground">
            You are creating a character for the <span className="text-primary font-semibold">{params.systemId}</span>{' '}
            system.
            </p>
        </div>
      </div>
      <CharacterCreator systemId={params.systemId} />
    </div>
  );
}
