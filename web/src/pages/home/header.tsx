import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export function Header() {
  const { count } = useNotifications({});

  return (
    <div className="h-10 w-full justify-end">
      <div>
        <button className="relative">
          <Bell size={30} className="text-foreground" />

          {count > 0 && (
            <span className="absolute -top-1 -right-2 rounded-full bg-primary text-black text-md flex justify-center items-center size-5 px-1">
              {count}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
