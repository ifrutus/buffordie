// Onde ficam curtidas e comentários de cada tipo de conteúdo.
export type Target = { kind: "post" | "radar"; id: string };

export const tables = (t: Target) =>
  t.kind === "post"
    ? { likes: "likes", comments: "comments", key: "post_id" }
    : { likes: "radar_likes", comments: "radar_comments", key: "item_id" };
