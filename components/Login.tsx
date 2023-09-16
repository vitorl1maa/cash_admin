"use client";

import { ExcludeSquare, Spinner } from "@phosphor-icons/react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Register from "./Register";
import { signIn } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface IUser {
  email: string;
  password: string;
}

export default function Login({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IUser>({
    email: "",
    password: "",
  });

  const handleShowSection = () => {
    setShowRegister((prevShowRegister) => !prevShowRegister);
  };

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault;
    setIsLoading(true);

    const res = await signIn<"credentials">("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      toast({
        title: "😖 Ops... Erro ao fazer login",
        description: res.error,
        variant: "destructive",
        action: (
          <ToastAction altText={"Tente Novamente!"}>
            Tente Novamente!
          </ToastAction>
        ),
      });
    } else {
      console.log("Erro:", res?.error);
      router.push("/dashboard");
    }

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 5000);

    setData({
      email: "",
      password: "",
    });
    setIsLoading(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  console.log(data);

  return (
    <div className="flex justify-center h-screen w-full">
      <div
        className={`${
          showRegister ? "flex" : "hidden"
        } lg:w-1/2 items-center justify-center px-5`}
      >
        {showRegister && <Register handleShowSection={handleShowSection} />}
      </div>
      <section
        className={`w-full ${
          showRegister ? "hidden" : "flex"
        } lg:w-1/2 px-5 flex flex-col items-center justify-center`}
      >
        <h1 className="flex text-3xl font-extrabold lg:hidden">Cash Admin</h1>
        <div className="py-10 flex flex-col items-center justify-center">
          <span className="pb-10 bg-black p-10  rounded-full">
            <ExcludeSquare size={60} weight="fill" />
          </span>
          <h1 className="text-2xl pt-5 font-semibold">Seja Bem-vindo!</h1>
        </div>
        <div>
          <form
            action=""
            className="flex flex-col gap-5 w-80"
            onSubmit={handleSubmit}
          >
            <Input
              id="email"
              type="email"
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <Input
              id="password"
              type="password"
              placeholder="Senha"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            <Button
              className="w-full mt-5"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" size={15} />
              )}
              Entrar
            </Button>
          </form>
          <div>
            <Button className="w-full mt-5" onClick={() => signIn("google")}>
              <img src="/google.svg" alt="" className="pr-3 w-9" />
              Entrar com o Google
            </Button>
          </div>
          <Button
            className="w-full mt-5 bg-green-600 hover:bg-green-600/30 text-white"
            onClick={handleShowSection}
          >
            Criar conta
          </Button>
        </div>
      </section>
    </div>
  );
}
