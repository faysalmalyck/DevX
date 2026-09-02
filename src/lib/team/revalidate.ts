import { revalidatePath } from "next/cache";

const canonicalSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function revalidateTeamPaths(...slugs: Array<string | null | undefined>) {
  revalidatePath("/team");
  revalidatePath("/about");
  revalidatePath("/about/team");
  revalidatePath("/about/our-team");
  revalidatePath("/admin/team");

  for (const slug of new Set(slugs)) {
    if (slug && canonicalSlug.test(slug)) {
      revalidatePath(`/team/${slug}`);
    }
  }
}
