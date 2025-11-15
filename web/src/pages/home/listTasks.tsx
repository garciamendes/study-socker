import { useTask } from "@/hooks/task"
import { Loader } from "@/components/retroui/Loader"
import { Task } from "./task"
import { useTasksRealtime } from "@/hooks/useTasksRealtime"

export const ListTasks = () => {
  const { list } = useTask()
  useTasksRealtime()

  const renderListTask = () => {
    if (list.status === "pending") {
      return (
        <div className="mx-auto mt-2.5">
          <Loader size="lg" />
        </div>
      )
    }

    const empty =
      !list.data ||
      list.data.pages.every((page) => page.results.length === 0);

    if (empty) {
      return (
        <div className="mx-auto mt-2.5">
          <strong>Nenhuma task encontrada</strong>
        </div>
      );
    }

    return (
      <>
        {list.data.pages.map((page, pIndex) =>
          page.results.map((task, tIndex) => (
            <Task key={`${pIndex}-${tIndex}`} {...task} />
          ))
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-4 pb-4 overflow-auto">
      {renderListTask()}
    </div>
  )
}