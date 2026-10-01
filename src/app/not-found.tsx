import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-4 py-32 text-center">
      <p className="font-display text-7xl font-bold text-blood">YOU DIED</p>
      <p className="mt-4 text-zinc-400">Essa página não existe (ou ainda não deu respawn).</p>
      <Link href="/" className="mt-8 rounded-md bg-acid px-5 py-2.5 font-semibold text-ink">
        Voltar ao checkpoint
      </Link>
    </div>
  );
}
