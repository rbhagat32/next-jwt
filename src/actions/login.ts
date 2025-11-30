"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { loginSchema, type LoginSchema } from "@/schema/login";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export type FormState = {
  errors: Partial<Record<keyof LoginSchema, string>>;
  prevFormData?: { username?: string; password?: string };
};

const loginAction = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errors: FormState["errors"] = {};
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof FormState["errors"];
      if (!errors[field]) errors[field] = err.message;
    });
    return { errors, prevFormData: data };
  }

  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (!user)
    return {
      errors: { username: "Invalid credentials !" },
      prevFormData: data,
    };

  const checkPassword = await bcrypt.compare(data.password, user.password);
  if (!checkPassword)
    return {
      errors: { password: "Invalid credentials !" },
      prevFormData: data,
    };

  await createSession(user.id);
  redirect("/");
};

export { loginAction };
