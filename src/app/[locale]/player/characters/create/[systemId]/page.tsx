import { CharacterCreator } from "@/components/player/CharacterCreator";

export default function CreateCharacterPage({ params }: { params: { systemId: string, locale: string }}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <CharacterCreator systemId={params.systemId} />
    </div>
  );
}
