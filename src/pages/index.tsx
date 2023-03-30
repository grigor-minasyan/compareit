import { type NextPage } from "next";
import Head from "next/head";
import Footer from "~/Components/Footer";
import Header from "~/Components/Header";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>LOGO</title>
        <meta name="description" content="LOGO DESC" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Footer />
      </main>
    </>
  );
};

export default Home;
