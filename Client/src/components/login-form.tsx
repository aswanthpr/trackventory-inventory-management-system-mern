import { useCallback } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LoginSchema, loginSchema } from "../validation/zodSchema";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postLogin } from "../service/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
const navigate  = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(async(data: LoginSchema) => {
    console.log("Login Data:", data)
  
    const response =  await postLogin(data);
    console.log(response)
    if( response?.data&&response.status == 200 ){
      toast.success("Logged in successfully");
      localStorage.setItem("login",response?.data?.encode);
      navigate('/');
    }
  },[navigate])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Login </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  required
                  
                />
                 {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  {...register("password")}
                  type="password"
                  placeholder="******"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-black text-white">
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
