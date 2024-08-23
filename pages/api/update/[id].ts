import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id: any;
  token: string;
  title: string;
  description: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token: any = req.headers.access_token;
  const { id } = req.query;
  const { title, description } = req.body;

  console.log(id);

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const result = await updateTodo({ id, token, title, description });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateTodo({ id, token, title, description }: Data) {
  const url = process.env.API_ENDPOINT_URL;

  const response = await fetch(`${url}/todo/${id}`, {
    method: "PATCH",
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
