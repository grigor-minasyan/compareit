import { type NextPage } from "next";
import Head from "next/head";
import { HomePage } from "~/Components/HomepageMain";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.home.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>LOGO</title>
        <meta name="description" content="LOGO DESC" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </>
  );
};

export default Home;
