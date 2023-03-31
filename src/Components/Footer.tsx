import React from "react";
import { WebsiteName } from "~/constants";

export default function Footer() {
  return (
    <footer className="bg-violet-900 py-4">
      <div className="container mx-auto px-4">
        <p className="text-white">© 2023 {WebsiteName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
