import { CreateTask } from "./createTask"
import { ListTasks } from "./listTasks"

export const Home = () => {
  return (
    <div className="flex flex-col w-full h-full lg:w-[1300px] gap-5 mx-auto pt-3 px-5 lg:px-0">
      <CreateTask />

      <ListTasks />
    </div>
  )
}