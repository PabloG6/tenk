"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { SelectLogType } from "@/server/api/routers/logs/types";
import type { SelectTaskType } from "@/server/api/routers/tasks/types";
import { DbSelectTasks } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceStrict } from "date-fns";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const logColumns: ColumnDef<SelectLogType>[] = [
  {
    id: "select",
    meta: {
       className: 'p-0' 
    },
    header: ({}) => {
      return (
        <div className="flex justify-center px-2">
          {" "}
          <Checkbox></Checkbox>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  { accessorKey: "id", header: "#" },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const formatter = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedDate = formatter.format(row.getValue("startTime"));
      return <>{formattedDate}</>;
    },
  },

  {
    accessorKey: "startTime",
    header: "Start",
    cell: ({ row }) => {
      const formatter = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
        second: "numeric",
      });

      const formattedDate = formatter.format(row.original.startTime);
      return <>{formattedDate}</>;
    },
  },

  {
    accessorKey: "endTime",
    header: "End",
    cell: ({ row }) => {
      if (!row.original.endTime) {
        return <>-</>;
      }
      const formatter = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
        second: "numeric",
      });

      const formattedDate = formatter.format(row.original.endTime);
      return <>{formattedDate}</>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      if (!row.original.endTime) {
        return <>&#8212;</>;
      }

      const startTime = row.original.startTime;

      const date = formatDistanceStrict(
        startTime,
        row.original.endTime
      );
      return <>{date}</>;
    },
  },

  {
    accessorKey: "entryType",
    header: "Entry Type",
    cell: ({  }) => {
      return <>Automatic</>;
    },
  },
];


export const taskColumns: ColumnDef<DbSelectTasks>[] = [
    {
      id: "select",
      meta: {
         className: 'p-0' 
      },
      header: ({}) => {
        return (
          <div className="flex justify-center px-2">
            {" "}
            <Checkbox></Checkbox>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
    },
    { accessorKey: "id", header: "#" },

    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
      
    
          return <>{row.original.name}</>;
        },
      },

      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
      
    
          return <>{row.original.description}</>;
        },
      },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const formatter = new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  
        const formattedDate = formatter.format(row.original.createdAt);
        return <>{formattedDate}</>;
      },
    },
  
   
  
    
 
    
  
    {
      accessorKey: "hoursCompleted",
      header: "Hours Completed",
      cell: ({ row }) => {
        let seconds = row.original.totalHours;
        const hours = Math.floor(seconds / 3600); // Get total hours
        seconds %= 3600; // Remaining seconds after extracting hours
        const minutes = Math.floor(seconds / 60); // Get minutes
        const remainingSeconds = seconds % 60; // Remaining seconds
      

        return <>{`${hours}hrs ${minutes} mins ${remainingSeconds}ss`}</>;
      },
    },
  ];
  