import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  username: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password }: Data = req.body;

  try {
    const result = await Login({ username, password });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function Login({ username, password }: Data) {
  const url = process.env.API_ENDPOINT_URL;

  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Failed to Login: ${response.statusText}`);
  }

  return response.json();
}
