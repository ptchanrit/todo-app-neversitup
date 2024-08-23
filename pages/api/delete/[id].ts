import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  id: any;
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token: any = req.headers.access_token;
  const { id } = req.query;

  console.log(id);
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const result = await deleteTodo({ token, id });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteTodo({ token, id }:Data) {
  const url = process.env.API_ENDPOINT_URL;

  const response = await fetch(`${url}/todo/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create todo: ${response.statusText}`);
  }

  return response.json();
}
