import { EditSystemView } from './EditSystemView';

export default function EditSystemPage({ params }: { params: { systemId: string } }) {
  return <EditSystemView systemId={params.systemId} />;
}
