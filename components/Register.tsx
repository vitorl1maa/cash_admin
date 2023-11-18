"use client";

import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ArrowLeft, ExcludeSquare, Spinner } from "@phosphor-icons/react";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";

interface RegisterProps {
  handleShowSection: () => void;
}

interface UserRegister {
  avatar?: File | Blob | null;
  name: string;
  lastName: string;
  email: string;
  profession: string;
  password: string;
}

export default function Register({ handleShowSection }: RegisterProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [data, setData] = useState<UserRegister>({
    avatar: null,
    name: "",
    lastName: "",
    email: "",
    profession: "",
    password: "",
  });

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault;
    setIsLoading(true);

    const req = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const res = await req.json();

    console.log("USER REGISTER FORM", res);

    if (!req.ok) {
      toast({
        title: "😖 Ops!",
        description: res.error,
        variant: "destructive",
        action: (
          <ToastAction altText="Tente Novamente!">Tente Novamente!</ToastAction>
        ),
      });
    } else {
      console.log(res);
      handleShowSection();
    }

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 5000);

    setData({
      avatar: null,
      name: "",
      lastName: "",
      email: "",
      profession: "",
      password: "",
    });
    setIsLoading(false);
  }

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files && e.target.files[0];
  //   if (selectedFile) {
  //     setAvatarURL(URL.createObjectURL(selectedFile)); // Define a URL do arquivo para visualização
  //     setData((prev) => ({
  //       ...prev,
  //       avatar: selectedFile, // Atualiza o campo 'avatar' no estado com o arquivo selecionado
  //     }));
  //   }
  // };

  // const handleAddPhotoClick = () => {
  //   // Aciona o clique no input de arquivo ao clicar no botão "Adicionar foto"
  //   if (avatarRef.current) {
  //     avatarRef.current.click();
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  console.log(data);

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <span
          className="flex items-center font-bold bg-newBlue hover:bg-newBlue/30 px-5 py-2 text-md rounded-md relative lg:bottom-0 lg:left-60 bottom-10 left-32 cursor-pointer hover:translate-y-1 transition-all"
          onClick={handleShowSection}
        >
          <ArrowLeft size={20} />
          Login
        </span>
        <div className="py-10 flex flex-col items-center justify-center">
          <span className="pb-10 bg-black p-10  rounded-full">
            <ExcludeSquare size={60} weight="fill" />
          </span>
          <h1 className="text-2xl pt-5 font-semibold">Criar conta</h1>
        </div>
        {/* <Avatar className="w-32 h-32">
          {avatarURL ? (
            <AvatarImage src={avatarURL} />
          ) : (
            <AvatarFallback>Perfil</AvatarFallback>
          )}
        </Avatar> */}
        {/* <button
          className="bg-zinc-900 text-xs px-3 py-1 rounded-full mt-3 border-neutral-800 bg-zinc-800/30"
          onClick={handleAddPhotoClick}
        >
          Adicionar foto
        </button> */}
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex gap-5 my-5">
          <Input
            id="name"
            type="text"
            placeholder="Nome"
            disabled={isLoading}
            name="name"
            value={data.name}
            onChange={handleChange}
          />
          <Input
            id="lastName"
            type="text"
            placeholder="Sobrenome"
            disabled={isLoading}
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
        </div>
        <Input
          className="mb-5"
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
          id="profession"
          type="text"
          placeholder="Profissão"
          disabled={isLoading}
          name="profession"
          value={data.profession}
          onChange={handleChange}
        />
        <div className="flex gap-5 my-5">
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
        </div>
        <Button
          className="w-full mt-5 hover:translate-y-1 transition-all"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading && (
            <Spinner className="mr-2 h-4 w-4 animate-spin" size={15} />
          )}
          Criar
        </Button>
      </form>
    </main>
  );
}
