import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { categories, getCategory, getPostsByCategory } from "@/lib/content";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  return cat ? { title: cat.name } : {};
}

export default async function CategoryPage({ params }: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const list = getPostsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <header className="mt-10 border-b border-line pb-6">
        <p className="font-display text-sm uppercase tracking-widest text-acid">Seção</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-white">{cat.name}</h1>
      </header>
      {list.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-zinc-400">Nada por aqui ainda — volte em breve.</p>
      )}
    </div>
  );
}
