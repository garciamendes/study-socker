import { Button } from "@/components/retroui/Button"
import { Input } from "@/components/retroui/Input"
import { useTask } from "@/hooks/task"
import { TaskCreateSchema, type TaskCreateSchemaType } from "@/services/task/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizonalIcon } from 'lucide-react'
import { useForm } from "react-hook-form"

export const CreateTask = () => {
  const { create } = useTask()

  const {
    register,
    handleSubmit,
  } = useForm<TaskCreateSchemaType>({
    resolver: zodResolver(TaskCreateSchema)
  })

  const handlerCreateTask = (data: TaskCreateSchemaType) => create.mutate(data)

  return (
    <form onSubmit={handleSubmit(handlerCreateTask)} className="w-full flex">
      <Input
        id="title"
        placeholder="Compartilhe uma tarefa"
        classNameWrapper="flex-1"
        {...register('title')}
      />

      <Button type="submit">
        <SendHorizonalIcon size={25} />
      </Button>
    </form>
  )
}