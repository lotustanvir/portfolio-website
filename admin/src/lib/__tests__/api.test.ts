import { describe, it, expect, vi } from "vitest";
import { getErrorMessage } from "@/lib/api";

describe("getErrorMessage", () => {
  function makeAxiosError(status: number | undefined, message?: string, code?: string) {
    return {
      isAxiosError: true,
      response: status ? { status, data: message ? { error: { message } } : undefined } : undefined,
      code,
    } as any;
  }

  it("returns error.message from response data", () => {
    expect(getErrorMessage(makeAxiosError(400, "Bad request"))).toBe("Bad request");
  });

  it("returns 401 message", () => {
    expect(getErrorMessage(makeAxiosError(401))).toBe("Please login to continue.");
  });

  it("returns 403 message", () => {
    expect(getErrorMessage(makeAxiosError(403))).toBe("You do not have permission to perform this action.");
  });

  it("returns 404 message", () => {
    expect(getErrorMessage(makeAxiosError(404))).toBe("Resource not found.");
  });

  it("returns 429 message", () => {
    expect(getErrorMessage(makeAxiosError(429))).toBe("Too many requests. Please try again later.");
  });

  it("returns 500 message", () => {
    expect(getErrorMessage(makeAxiosError(500))).toBe("Server error. Please try again later.");
  });

  it("returns network error message", () => {
    expect(getErrorMessage(makeAxiosError(undefined, undefined, "ERR_NETWORK"))).toBe(
      "Unable to connect to server. Please check your connection."
    );
  });

  it("returns generic Error message", () => {
    expect(getErrorMessage(new Error("Oops"))).toBe("Oops");
  });

  it("returns fallback for unknown error", () => {
    expect(getErrorMessage("random")).toBe("An unexpected error occurred");
  });
});
