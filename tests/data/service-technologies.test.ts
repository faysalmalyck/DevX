import { describe, expect, it } from "vitest";
import {
  getServiceTechnologyById,
  serviceTechnologies,
  technologyIconKeys,
} from "@/data/service-technologies";

describe("service technology catalog", () => {
  it("provides a unique, described, icon-backed entry for every technology", () => {
    expect(serviceTechnologies.length).toBeGreaterThan(0);
    expect(new Set(serviceTechnologies.map((technology) => technology.id)).size).toBe(
      serviceTechnologies.length,
    );

    for (const technology of serviceTechnologies) {
      expect(technology.name).toBeTruthy();
      expect(technology.category).toBeTruthy();
      expect(technology.description).toBeTruthy();
      expect(technologyIconKeys).toContain(technology.icon);
      expect(getServiceTechnologyById(technology.id)).toEqual(technology);
    }
  });

  it("does not resolve missing technology IDs", () => {
    expect(getServiceTechnologyById("not-a-technology")).toBeUndefined();
  });
});
