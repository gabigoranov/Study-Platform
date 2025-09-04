import { useEffect, useState } from "react";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div>
      <div className="min-h-screen p-8">
        <button
          onClick={() => setDark(!dark)}
          className="mb-4 px-4 py-2 bg-primary text-white rounded"
        >
          Toggle Dark Mode
        </button>

        <h1 className="text-4xl font-bold">Hello World</h1>
        <p>This is a paragraph.</p>
        <a href="#">This is a link</a>
      </div>
    </div>
  );
}
