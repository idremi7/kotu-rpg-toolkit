import { BackButton } from "@/components/BackButton";
import { CharacterCreator } from "@/components/player/CharacterCreator";

export default function CreateCharacterPage({ params }: { params: { systemId: string, locale: string }}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-8">
         <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <BackButton />
         </div>
         <CharacterCreator systemId={params.systemId} />
      </div>
    </div>
  );
}
