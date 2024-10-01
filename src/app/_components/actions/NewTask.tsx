"use client";
import { useEffect, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandShortcut } from "@/components/ui/command";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TaskSchema, type TaskType } from "@/server/api/routers/tasks/types";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export function NewTask() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<TaskType>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  //mutations

  const createTask = api.tasks.create.useMutation({
    onSuccess: (data) => {
      router.push(`/tasks/${data?.id}`);
    },
  });
  //functions and callbacks

  const onSubmitHandler = (tasks: TaskType, e?: React.BaseSyntheticEvent | KeyboardEvent) => {
    console.log(e);
    e?.preventDefault();
    createTask.mutate(tasks);
  };

  const submitForm = useCallback(async (ke: KeyboardEvent) => {
    await form.handleSubmit((data, e) => onSubmitHandler(data, ke), (error) => {
      console.log(error);
    })();
  }, []);

  //key bindings
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const save = (e: KeyboardEvent) => {
   
      if (e.key === "ß" && (e.metaKey || e.ctrlKey)) {

        void submitForm(e);
      }
    };

    document.addEventListener("keydown", save);
    return () => document.removeEventListener("keydown", save);
  }, []);
  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        <CommandShortcut>&#8984; + K</CommandShortcut>
        <p className="text-muted-foreground">New task.</p>
      </div>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          form.reset();
          setOpen(open);
        }}
      >
        <DialogContent className="max-w-[400px]">
          <DialogTitle>New Task</DialogTitle>
          <Form {...form}>
            <form className="flex flex-col gap-3">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input {...field} placeholder="e.g. Learn Guitar"></Input>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Input
                      {...field}
                      placeholder="e.g. Trying to be like Rosetta Tharpe..."
                    />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
          <div className="flex w-full items-center justify-end">
            <Button variant={"outline"}>
              <CommandShortcut>&#8984; &#8997; S</CommandShortcut>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
