import { type NextPage } from "next";
import Head from "next/head";
import { HomePage } from "~/Components/Homepage";
import { WebsiteName } from "~/constants";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          {`${WebsiteName} - AI powered product comparison based on real customer reviews`}
        </title>
        <meta
          name="description"
          content={`${WebsiteName} - AI powered product comparison based on real customer reviews`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </>
  );
};

export default Home;
