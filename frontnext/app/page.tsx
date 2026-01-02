import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col justify-start py-50 px-16 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Please visit the pages:
            <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400">
              <li>
                <Link className="hover:underline"
                href="/un"
                >
                /un for the first game
                </Link>
              </li>
              <li>
                <p className="text-black dark:text-zinc-300">
                  ...more to come...
                  </p>
              </li>
            </ul>
          </h1>
        </div>
      </main>
    </div>
  );
}
