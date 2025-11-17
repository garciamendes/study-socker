import { Button } from "@/components/retroui/Button"
import type { ITask as TaskProps } from "@/services/task/type"
import { HeartMinusIcon, HeartPlusIcon } from "lucide-react"
import { format } from 'date-fns'
import { useTask } from "@/hooks/task"
import { useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"

export const Task = (props: TaskProps) => {
  const { uuid, title, created_at, finish_at, amount_likes, has_my_like, user } = props
  const { like, deslike } = useTask()

  const [likes, setLikes] = useState(amount_likes ?? 0)

  // Realtime: quando alguém curtir essa task, incrementa
  useNotifications({
    onLike: (task) => {
      if (task === uuid) {
        setLikes((prev) => prev + 1)
      }
    }
  })

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
                setLikes((prev) => prev - 1)
                deslike.mutate(uuid)
                return
              }

              setLikes((prev) => prev + 1)
              like.mutate(uuid)
            }}
            disabled={!!finish_at}
            className="items-center gap-2.5"
          >
            {has_my_like ? (
              <HeartMinusIcon size={20} />
            ) : (
              <HeartPlusIcon size={20} />
            )}

            <span>{likes}</span>
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <span>Criado por {user?.username || '---'}</span>
        </div>
      </div>
    </div>
  )
}
