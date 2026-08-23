import { revalidatePath } from "next/cache";

export function revalidateTeamPaths() {
  revalidatePath("/team");
  revalidatePath("/about");
  revalidatePath("/about/team");
  revalidatePath("/about/our-team");
  revalidatePath("/admin/team");
}
