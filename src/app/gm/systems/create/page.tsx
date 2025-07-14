import { SystemCreator } from "@/components/gm/SystemCreator";
import { BackButton } from "@/components/BackButton";

export default function CreateSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <BackButton />
        </div>
        <h1 className="font-headline text-4xl font-bold">System Architect</h1>
        <p className="text-muted-foreground">
          Define the rules of your world. Add attributes, skills, and feats to create a unique game system.
        </p>
      </div>
      <SystemCreator />
    </div>
  );
}
