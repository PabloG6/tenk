"use client";
import { CommandShortcut } from "@/components/ui/command";
import { NewTask } from "./actions/NewTask";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/data-table/table";
import { taskColumns } from "../tasks/[taskID]/_components/columns";
import { StopwatchIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [tasks, query] = api.tasks.findAll.useSuspenseQuery();

  return (
    <div className="w-full max-w-5xl h-full">
     
      <div className="flex flex-col items-center gap-6 pb-4">
        <div className="flex items-center justify-center gap-1.5">
          <NewTask />
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <CommandShortcut>&#8984; + T</CommandShortcut>
          <p className="text-muted-foreground">Open/Close task entry.</p>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <CommandShortcut>&#8984; + G</CommandShortcut>
          <p className="text-muted-foreground">Go to Task.</p>
        </div>
      </div>
      <DataTable columns={taskColumns} data={tasks} />
    </div>
  );
}
