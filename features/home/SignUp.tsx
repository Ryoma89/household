"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import Title from "@/app/components/elements/Title";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter valid email and password.");
      return;
    }
    console.log("emailとpassword");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("error", error);

    if (error) {
      setError(error.message);
    } else {
      alert(
        "Sign up successful. Please check your email to confirm your account."
      );
      router.push("/dashboard");
    }
  };

  return (
    <section className="p-10">
      <Title title="Sign Up" />
      <form className="space-y-4 mt-10" onSubmit={handleSignUp}>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="passwordConf"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password(confirmation)
          </label>
          <input
            type="password"
            name="passwordConf"
            id="passwordConf"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-gray-600 hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>
          {error && <p className="text-red mt-2">{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default SignUp;
