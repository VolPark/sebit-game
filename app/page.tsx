import Link from "next/link";
import { Bone, PawPrint } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zoo-blue flex flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center gap-8 text-center max-w-2xl bg-zoo-offwhite p-12 rounded-3xl shadow-cartoon border-4 border-white">

        <div className="flex gap-4">
          <PawPrint className="w-16 h-16 text-zoo-red rotate-[-12deg]" />
          <PawPrint className="w-16 h-16 text-zoo-yellow rotate-[12deg]" />
        </div>

        <h1 className="text-6xl font-black text-zoo-red tracking-wider drop-shadow-md">
          MOJE ZOO
        </h1>

        <p className="text-xl text-zoo-blue font-bold">
          Postav nejlepší Zoo na světě!
        </p>

        <div className="flex gap-6 mt-8">
          <Link href="/game" className="bg-zoo-green text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-cartoon hover:shadow-cartoon-hover hover:translate-y-[2px] transition-all flex items-center gap-2">
            <Bone className="w-8 h-8" />
            HRÁT
          </Link>
        </div>
      </main>

      <footer className="mt-12 text-white/80 font-bold">
        Pro děti od 3 let
      </footer>
    </div>
  );
}
