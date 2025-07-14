import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Swords } from "lucide-react";
import Link from "next/link";
import { listSystemsAction } from "@/app/actions";

export default async function GMDashboard() {
  const systems = await listSystemsAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">GM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your game systems and campaigns.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/gm/systems/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New System
          </Link>
        </Button>
      </div>
      
      {systems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {systems.map(system => (
            <Card key={system.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Swords className="text-primary"/>
                  {system.name}
                </CardTitle>
                <CardDescription>{system.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
              </CardContent>
              <div className="p-4 pt-0">
                 <Button asChild variant="secondary" className="w-full">
                    <Link href={`/gm/systems/${system.id}`}>Manage System</Link>
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-12">
          <h2 className="text-2xl font-semibold mb-2">No Systems Found</h2>
          <p className="text-muted-foreground mb-4">It looks like you haven't created any game systems yet.</p>
          <Button asChild size="lg">
            <Link href="/gm/systems/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First System
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
