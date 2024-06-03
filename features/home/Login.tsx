"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Loading from "@/app/loading";
import * as z from "zod";
import type { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";

type Schema = z.infer<typeof schema>;

// Define validation rules for input data
const schema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

// Login page
const Login = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Initial values
    defaultValues: { email: "", password: "" },
    // Input validation
    resolver: zodResolver(schema),
  });

  // Submit
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);

    try {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // Error check
      if (error) {
        setMessage("An error occurred: " + error.message);
        return;
      }

      // Navigate to the dashboard
      router.push("/dashboard");
    } catch (error) {
      setMessage("An error occurred: " + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="px-10 py-20 bg-white rounded-lg">
      <div className="w-3/5 mx-auto">
        <div className="text-center font-bold text-4xl mb-10">Login</div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              placeholder="Email"
              id="email"
              {...register("email", { required: true })}
            />
            <div className="my-3 text-center text-sm text-red-500">
              {errors.email?.message}
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <input
              type="password"
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              placeholder="Password"
              id="password"
              {...register("password", { required: true })}
            />
            <div className="my-3 text-center text-sm text-red-500">
              {errors.password?.message}
            </div>
          </div>

          {/* Login button */}
          <div className="mb-5">
            {loading ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                className="font-bold bg-buttonPrimary w-full rounded-full p-2 text-white text-sm"
              >
                Login
              </Button>
            )}
          </div>
        </form>

        {message && (
          <div className="my-5 text-center text-sm text-red-500">{message}</div>
        )}

        <div className="text-center text-sm mb-2">
          <Link
            href="/auth/resetPassword"
            className="text-gray-500 hover:opacity-70 font-light "
          >
            Forgot your password?
          </Link>
        </div>
        <div className="text-center text-sm">
          <Link
            href="/auth/signup"
            className="text-gray-500 font-light hover:opacity-70"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
