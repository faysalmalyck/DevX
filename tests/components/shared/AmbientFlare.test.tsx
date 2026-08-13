import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AmbientFlare from "@/components/shared/AmbientFlare";

describe("AmbientFlare", () => {
  it("renders an inert reusable flare with the selected shape variant", () => {
    const { container } = render(
      <AmbientFlare className="custom-position" variant="banner" />,
    );
    const flare = container.querySelector("[data-ambient-flare]");

    expect(flare?.getAttribute("aria-hidden")).toBe("true");
    expect(flare?.getAttribute("data-variant")).toBe("banner");
    expect(flare?.className).toContain("bg-flare--banner");
    expect(flare?.className).toContain("custom-position");
    expect(flare?.firstElementChild?.className).toContain(
      "bg-flare__blob--banner",
    );
  });
});
