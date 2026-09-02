import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { revalidateTeamPaths } from "@/lib/team/revalidate";

describe("revalidateTeamPaths", () => {
  beforeEach(() => {
    mocks.revalidatePath.mockReset();
  });

  it("refreshes team listings plus both the previous and new canonical profile paths", () => {
    revalidateTeamPaths("ada-lovelace", "ada-byron");

    expect(mocks.revalidatePath).toHaveBeenCalledWith("/team");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/about");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/about/team");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/about/our-team");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/team");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/team/ada-lovelace");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/team/ada-byron");
  });

  it("does not interpolate missing or malformed slugs into a cache path", () => {
    revalidateTeamPaths(null, undefined, "Not A Valid Slug");

    expect(mocks.revalidatePath).not.toHaveBeenCalledWith(expect.stringMatching(/^\/team\/./));
  });
});
