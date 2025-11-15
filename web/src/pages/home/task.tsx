import { Button } from "@/components/retroui/Button"
import type { ITask as TaskProps } from "@/services/task/type"
import { HeartMinusIcon, HeartPlusIcon } from "lucide-react"
import { format } from 'date-fns'
import { useTask } from "@/hooks/task"

export const Task = ({ uuid, title, created_at, finish_at, amount_likes, has_my_like, user }: TaskProps) => {
  const { like, deslike } = useTask()

  return (
    <div className="flex gap-5 flex-col px-4 py-4 w-full rounded border-2 shadow-md transition">
      <div className="flex justify-between items-center">
        <strong>{title || '---'} - {uuid || '---'}</strong>

        <span>{created_at ? format(created_at, 'dd/MM/yyyy') : '---'}</span>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-3.5">
          <Button
            onClick={() => {
              if (!uuid) return

              if (has_my_like) {
                deslike.mutate(uuid)
                return
              }

              like.mutate(uuid)
            }}
            disabled={!!finish_at} className="items-center gap-2.5"
          >
            {has_my_like ? (
              <HeartMinusIcon size={20} />
            ) : (
              <HeartPlusIcon size={20} />
            )}

            <span>{amount_likes ?? 0}</span>
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <span>Criado por {user?.username || '---'}</span>
        </div>
      </div>
    </div>
  )
}