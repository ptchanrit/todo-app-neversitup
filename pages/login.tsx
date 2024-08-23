import React, { useState, useEffect } from "react";
import Link from "next/link";
import Input from "@/components/UI/Input";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import nookies, { destroyCookie } from "nookies";

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        nookies.set(null, "token", data.access_token, {
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/app");
      } else {
        const res = await response.json();
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="username"
            icon={faUser}
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            required
          />

          <Input
            label="password"
            icon={faLock}
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <div>
            <button
              type="submit"
              className="w-full flex justify-center mt-9 py-2 border border-transparent rounded-md text-sm font-medium text-white shadow-sm bg-gradient-to-r from-indigo-700 to-red-400 hover:from-indigo-800 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
