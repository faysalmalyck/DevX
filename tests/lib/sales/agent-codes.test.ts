import { beforeEach, describe, expect, it, vi } from "vitest";

const crypto = vi.hoisted(() => ({
  randomBytes: vi.fn(),
}));

vi.mock("node:crypto", () => ({
  ...crypto,
  default: crypto,
}));

import {
  agentCodePrefix,
  createAgentCodeCandidate,
  generateUniqueAgentCode,
} from "@/lib/sales/agent-codes";

describe("agentCodePrefix", () => {
  it.each([
    ["Ada", "Lovelace", "ada-lovelace"],
    ["  Élodie ", "D’Arcy!", "elodie-d-arcy"],
    ["", "Smith", "smith"],
    ["---", "!!!", "agent"],
    ["A".repeat(40), "Doe", `${"a".repeat(36)}-doe`],
  ])("builds %s from %s", (firstName, lastName, expected) => {
    expect(agentCodePrefix(firstName, lastName)).toBe(expected);
  });
});

describe("createAgentCodeCandidate", () => {
  beforeEach(() => {
    crypto.randomBytes.mockReset();
  });

  it("combines the readable prefix with a four-byte hexadecimal suffix", () => {
    crypto.randomBytes.mockReturnValue(Buffer.from("c0ffee12", "hex"));

    expect(createAgentCodeCandidate("Ada", "Lovelace")).toBe(
      "ada-lovelace-c0ffee12"
    );
    expect(crypto.randomBytes).toHaveBeenCalledWith(4);
  });
});

describe("generateUniqueAgentCode", () => {
  beforeEach(() => {
    crypto.randomBytes.mockReset();
  });

  it("returns the first candidate that the supplied lookup reports as available", async () => {
    crypto.randomBytes.mockReturnValue(Buffer.from("11111111", "hex"));
    const isTaken = vi.fn(async (_code: string) => false);

    await expect(generateUniqueAgentCode("Ada", "Lovelace", isTaken)).resolves.toBe(
      "ada-lovelace-11111111"
    );
    expect(isTaken).toHaveBeenCalledWith("ada-lovelace-11111111");
    expect(isTaken).toHaveBeenCalledTimes(1);
  });

  it("tries fresh candidates until one is available", async () => {
    crypto.randomBytes
      .mockReturnValueOnce(Buffer.from("aaaaaaaa", "hex"))
      .mockReturnValueOnce(Buffer.from("bbbbbbbb", "hex"))
      .mockReturnValueOnce(Buffer.from("cccccccc", "hex"));
    const isTaken = vi
      .fn(async (_code: string) => true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(generateUniqueAgentCode("Ada", "Lovelace", isTaken)).resolves.toBe(
      "ada-lovelace-cccccccc"
    );
    expect(isTaken).toHaveBeenNthCalledWith(1, "ada-lovelace-aaaaaaaa");
    expect(isTaken).toHaveBeenNthCalledWith(2, "ada-lovelace-bbbbbbbb");
    expect(isTaken).toHaveBeenNthCalledWith(3, "ada-lovelace-cccccccc");
  });

  it("fails after eight unavailable candidates", async () => {
    crypto.randomBytes.mockReturnValue(Buffer.from("deadbeef", "hex"));
    const isTaken = vi.fn(async (_code: string) => true);

    await expect(generateUniqueAgentCode("Ada", "Lovelace", isTaken)).rejects.toThrow(
      "Unable to generate a unique sales agent code."
    );
    expect(crypto.randomBytes).toHaveBeenCalledTimes(8);
    expect(isTaken).toHaveBeenCalledTimes(8);
  });
});
