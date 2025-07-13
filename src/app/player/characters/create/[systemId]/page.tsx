import { CharacterCreator } from "@/components/player/CharacterCreator";

export default function CreateCharacterPage({ params }: { params: { systemId: string }}) {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Forge Your Hero</h1>
        <p className="text-muted-foreground">
          You are creating a character for the <span className="text-primary font-semibold">{params.systemId.replace('-', ' ')}</span> system.
        </p>
      </div>
      <CharacterCreator systemId={params.systemId} />
    </div>
  );
}
