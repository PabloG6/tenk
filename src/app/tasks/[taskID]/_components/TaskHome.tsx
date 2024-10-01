"use client";

import { CommandShortcut } from "@/components/ui/command";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LogWatch from "./StopWatch";
import type { DbLogs } from "@/server/db/schema";
import { DataTable } from "@/components/data-table/table";
import { logColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskHome() {
  const params = useParams<{ taskID: string }>();
  const id = Number.parseInt(params.taskID);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [task, query] = api.tasks.getByID.useSuspenseQuery(id, {});
  const utils = api.useUtils();

  const router = useRouter();
  const [currentLog, setCurrentLog] = useState<DbLogs | null>(null);
  const [showActiveTimer, setShouldShowActiveTimer] = useState<boolean>(false);
  const createLog = api.logs.create.useMutation({
    onSuccess: (logs) => {
      setCurrentLog(logs!);
      const formattedDate = logs?.startTime.toLocaleString("en-US", {
        dayPeriod: "long",
        day: "2-digit",
        month: "long",
        weekday: "long",
        hour12: true,
        hour: "numeric",
        year: "numeric",
        minute: "numeric",
      });
      toast("Created a new entry.", {
        description: formattedDate,
        dismissible: true,
        duration: 3_000,
      });

      void utils.tasks.getByID.invalidate();
    },
  });

  const updateLog = api.logs.update.useMutation({
    onSuccess: (logs) => {
      setCurrentLog(logs!);
      const formattedDate = logs?.endTime?.toLocaleString("en-US", {
        dayPeriod: "long",
        day: "2-digit",
        month: "long",
        weekday: "long",
        hour12: true,
        hour: "numeric",
        year: "numeric",
        minute: "numeric",
      });
      toast("Updated your active entry", {
        description: formattedDate,
        dismissible: true,
        duration: 3_000,
      });
    },
  });

  useEffect(() => {
    const startStopCurrentEntry = (e: KeyboardEvent) => {
      if (e.key == "¬") {
        const date = new Date();
        if (currentLog !== null && currentLog?.endTime == null) {
          updateLog.mutate({ id: currentLog.id, time: date });
        } else {
          createLog.mutate({ startTime: date, taskID: id });
        }
      }
    };

    document.addEventListener("keydown", startStopCurrentEntry);

    return () => {
      document.removeEventListener("keydown", startStopCurrentEntry);
    };
  });

  useEffect(() => {
    const goBack = (e: KeyboardEvent) => {
      if (e.key == "˙" || (e.altKey && e.key == "h") || e.key == "H") {
        router.replace("/");
      }
    };

    document.addEventListener("keydown", goBack);

    return () => {
      document.removeEventListener("keydown", goBack);
    };
  });

  useEffect(() => {
    if (task.logs) {
      const firstLog = task.logs[0];
      if (!firstLog?.endTime && !currentLog) {
        setCurrentLog(firstLog!);
      }
    }
  }, [task]);

  useEffect(() => {
    setShouldShowActiveTimer(() => {
      console.log(query);
      const value =
        !(query.isFetching || query.isLoading) && currentLog == null;
      console.log(
        "should show active timer",
        query.isFetching,
        query.isLoading,
        currentLog == null,
      );
      return !(query.isFetching || query.isLoading) && currentLog == null;
    });
  }, [currentLog]);
  return (
    <main className="flex h-full w-full flex-col items-center p-4">
      <div className="flex flex-col items-center">
        <div className="mb-6">
          <p className="rounded-full border px-4 py-1 text-sm font-medium text-muted-foreground">
            {task?.name}
          </p>
        </div>
        <h1 className="text-5xl text-muted-foreground">0/10000 hrs logged</h1>

        <div className="h-36 p-9">
          {currentLog ? (
            <LogWatch
              startTime={currentLog?.startTime}
              endTime={currentLog.endTime}
            ></LogWatch>
          ) : showActiveTimer ? (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span className="text-sm text-muted-foreground">
                You have no active timers.
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <CommandShortcut>
                  &#8997; + <kbd className="text-xs">L</kbd>
                </CommandShortcut>
                <p className="text-muted-foreground">
                  Start/Stop current entry.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <CommandShortcut>
                  &#8997; + <kbd className="text-xs">H</kbd>
                </CommandShortcut>
                <p className="text-muted-foreground">Go to Home.</p>
              </div>
            </div>
          ) : (
            <Skeleton className="h-4 w-40"></Skeleton>
          )}
        </div>
      </div>
      <>
        {query.isFetched && task.logs?.length > 0 ? (
          <div className="flex w-full justify-center">
            <DataTable columns={logColumns} data={task.logs} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center pb-16">
            <EmptyContent></EmptyContent>
          </div>
        )}
      </>
    </main>
  );
}

const EmptyContent = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground">
          You have no entry logs.
        </span>
        <div className="flex items-center justify-center gap-1.5">
          <CommandShortcut>
            &#8997; + <kbd className="text-xs">L</kbd>
          </CommandShortcut>
          <p className="text-muted-foreground">Start/Stop current entry.</p>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <CommandShortcut>
            &#8997; + <kbd className="text-xs">H</kbd>
          </CommandShortcut>
          <p className="text-muted-foreground">Go Back.</p>
        </div>
      </div>
    </>
  );
};
