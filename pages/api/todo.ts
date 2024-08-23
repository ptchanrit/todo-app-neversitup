import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token: any = req.headers.access_token;

  if (!token) {
    console.log(token);
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const result = await getTodo({ token });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getTodo({ token }: { token: string }) {
  const url = process.env.API_ENDPOINT_URL;

  const response = await fetch(`${url}/todo`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get todo: ${response.statusText}`);
  }

  return response.json();
}
