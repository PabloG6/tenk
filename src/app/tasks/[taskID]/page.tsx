import { api } from "@/trpc/server";
import TaskHome from "./_components/TaskHome";

export default async function Page({params}: {params: {taskID: number}}) {
    void api.tasks.getByID.prefetch(params.taskID)
    return <TaskHome/>
}