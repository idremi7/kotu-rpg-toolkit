import { CreateCharacterView } from './CreateCharacterView';

export default function CreateCharacterPage({ params }: { params: { systemId: string }}) {
  return <CreateCharacterView systemId={params.systemId} />;
}
