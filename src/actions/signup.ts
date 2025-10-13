"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { signupSchema, type SignupSchema } from "@/schema/signup";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export type FormState = {
  errors: Partial<Record<keyof SignupSchema, string>>;
  prevFormData?: {
    username?: string;
    email?: string;
    password?: string;
  };
};

const signupAction = async (
  _prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signupSchema.safeParse(data);

  if (!result.success) {
    const errors: FormState["errors"] = {};
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof FormState["errors"];
      if (!errors[field]) errors[field] = err.message;
    });
    return { errors, prevFormData: data };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: data.username }, { email: data.email }],
    },
  });

  if (existingUser) {
    const errors: FormState["errors"] = {};
    if (existingUser.username === data.username)
      errors.username = "Username already taken !";
    if (existingUser.email === data.email)
      errors.email = "Email already registered !";
    return { errors, prevFormData: data };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
  });

  await createSession(user.id);
  redirect("/");
};

export { signupAction };
