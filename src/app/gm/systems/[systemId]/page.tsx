import { SystemDetailsView } from './SystemDetailsView';

export default function SystemDetailsPage({ params }: { params: { systemId: string }}) {
  return <SystemDetailsView systemId={params.systemId} />;
}
