import { api, HydrateClient } from "@/trpc/server";
import Home from "./_components/Home";
import { StopwatchIcon } from "@radix-ui/react-icons";

export default async function Page() {
 void api.tasks.findAll.prefetch();
  return (
    <HydrateClient>
      <main className="flex min-h-screen w-full flex-col items-center h-full justify-center">
      <nav className="h-16 w-full flex py-4 gap-3 p-3">
        <StopwatchIcon className="h-6 w-6 "/>
        <p>Tenk</p>
      </nav>
        <Home/>
      </main>
    </HydrateClient>
  );
}
