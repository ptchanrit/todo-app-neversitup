import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  title: string;
  description: string;
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token: any = req.headers.access_token;
  const { title, description }: Data = req.body;

  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const result = await createTodo({ token, title, description });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createTodo({ token, title, description }: Data) {
  const url = process.env.API_ENDPOINT_URL;

  const response = await fetch(`${url}/todo`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create todo: ${response.statusText}`);
  }

  return response.json();
}
