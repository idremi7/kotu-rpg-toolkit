import { EditCharacterView } from './EditCharacterView';

export default function EditCharacterPage({ params }: { params: { characterId: string } }) {
  return <EditCharacterView characterId={params.characterId} />;
}
