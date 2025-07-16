import { CharacterSheetView } from './CharacterSheetView';

export default function CharacterSheetPage({ params }: { params: { characterId: string }}) {
  return <CharacterSheetView characterId={params.characterId} />;
}
