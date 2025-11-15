import { Outlet } from "react-router"

export const LayoutPage = () => {
  return (
    <div className="h-full w-full flex">
      <div className="w-2/4 flex-1 bg-primary hidden lg:flex"></div>

      <div className="flex-1 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  )
}