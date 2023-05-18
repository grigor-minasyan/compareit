import { WebsiteName } from "~/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-4">
      <div className="container mx-auto max-w-3xl">
        <p className="text-center text-slate-50">© 2023 {WebsiteName}</p>
      </div>
    </footer>
  );
}
