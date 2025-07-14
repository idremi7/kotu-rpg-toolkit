import { getCharacterAction, getSystemAction } from "@/app/actions";
import { CharacterSheetPreview } from "@/components/player/CharacterSheetPreview";
import { notFound } from "next/navigation";

export default async function CharacterSheetPage({ params }: { params: { characterId: string, locale: string }}) {
  
  const character = await getCharacterAction(params.characterId);
  
  if (!character) {
    notFound();
  }

  const system = await getSystemAction(character.systemId);

  if (!system) {
    // Or handle this as a recoverable error, maybe the system was deleted.
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CharacterSheetPreview data={character.data} system={system} />
    </div>
  );
}
