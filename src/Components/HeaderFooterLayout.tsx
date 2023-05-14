import { type ReactNode } from "react";
import Footer from "./Footer";
import ErrorAlerts from "./ErrorAlerts";
import Header from "./Header";

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <>
      <Header />
      <main className="m-0 bg-gradient-to-br from-slate-100 to-violet-100">
        {children}
      </main>
      <Footer />
      <ErrorAlerts />
    </>
  );
}
