import { WebsiteName } from "~/constants";

export default function Footer() {
  return (
    <footer className="bg-violet-900 py-4">
      <div className="container mx-auto max-w-3xl">
        <p className="text-center text-slate-50">
          © 2023 {WebsiteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
