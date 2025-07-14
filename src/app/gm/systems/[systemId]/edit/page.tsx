import { getSystemAction } from '@/actions';
import { notFound } from 'next/navigation';
import { SystemCreator } from '@/components/gm/SystemCreator';
import { BackButton } from '@/components/BackButton';

export default async function EditSystemPage({ params }: { params: { systemId: string } }) {
  const system = await getSystemAction(params.systemId);

  if (!system) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <BackButton />
        </div>
        <h1 className="font-headline text-4xl font-bold">Edit System</h1>
        <p className="text-muted-foreground">
          Modify the rules of the "{system.systemName}" system.
        </p>
      </div>
      <SystemCreator initialData={system} />
    </div>
  );
}
