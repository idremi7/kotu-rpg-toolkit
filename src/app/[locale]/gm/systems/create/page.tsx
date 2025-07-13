import { SystemCreator } from "@/components/gm/SystemCreator";

export default function CreateSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">System Architect</h1>
        <p className="text-muted-foreground">
          Define the rules of your world. Add attributes, skills, and feats to create a unique game system.
        </p>
      </div>
      <SystemCreator />
    </div>
  );
}
