import { Input } from "@/components/retroui/Input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/retroui/Button"
import { useAuth } from "@/hooks/auth"
import { useEffect } from "react"
import { toast } from "sonner"
import { LoginSchema, type LoginSchemaType } from "@/services/auth/type"

export const Login = () => {
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema)
  })

  useEffect(() => {
    if (!login.error && !login.isError) return

    toast.error('Erro ao tentar logar, verifique username/senha')
  }, [login.error, login.isError])

  const handlerExecuteLogin = (data: LoginSchemaType) => login.mutate(data)

  return (
    <form
      className="flex flex-col px-2.5 w-full lg:p-0 lg:w-1/2 gap-6"
      onSubmit={handleSubmit(handlerExecuteLogin)}>
      <Input
        id="username"
        label="Username"
        placeholder="Digite seu username"
        error={errors.username?.message}
        {...register('username')} />

      <Input
        id="password"
        label="Senha"
        placeholder="Digite sua senha"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        loading={login.isPending}
        disabled={login.isPending}
        className="justify-center h-10"
        classNameLoader="h-1"
        type="submit">
        Entrar
      </Button>
    </form>
  )
}