import { GlobalNotificationToaster } from "@/components/globalNotification"
import { useAuth } from "@/hooks/auth"
import { Navigate, Outlet } from "react-router"

export const HomeLayout = () => {
  const { authenticated } = useAuth()

  if (!authenticated()) return <Navigate to="/auth" replace />

  return (
    <>
      <GlobalNotificationToaster />

      <Outlet />
    </>
  )
}