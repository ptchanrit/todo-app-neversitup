import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Head from "next/head";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Head>
        <title>To-do App by Chanrit P</title>
        <meta name="description" content="To-do App Powered by Chanrit P." />
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="keywords"
          content="to-do, task management, productivity, Chanrit P"
        />
      </Head>
      <h1>To-do App </h1>
      <h2>powered by Chanrit P</h2>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);

  const token = cookies.token;

  if (token) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default HomePage;
