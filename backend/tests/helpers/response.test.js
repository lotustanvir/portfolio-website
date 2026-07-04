import { describe, it, expect, jest } from "@jest/globals";
import { successResponse, errorResponse, paginatedResponse, createdResponse } from "../../src/helpers/response.js";

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Response Helpers", () => {
  describe("successResponse", () => {
    it("should return 200 with data by default", () => {
      const res = mockRes();
      successResponse(res, { data: { user: "test" } });
      expect(res.status).toHaveBeenCalledWith(200);
      const call = res.json.mock.calls[0][0];
      expect(call.success).toBe(true);
      expect(call.data).toEqual({ user: "test" });
    });

    it("should use custom status code", () => {
      const res = mockRes();
      successResponse(res, { message: "Created", statusCode: 201 });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("createdResponse", () => {
    it("should return 201", () => {
      const res = mockRes();
      createdResponse(res, { data: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("errorResponse", () => {
    it("should return 500 with error message", () => {
      const res = mockRes();
      errorResponse(res, { message: "Something went wrong" });
      expect(res.status).toHaveBeenCalledWith(500);
      const call = res.json.mock.calls[0][0];
      expect(call.success).toBe(false);
      expect(call.error.message).toBe("Something went wrong");
    });
  });

  describe("paginatedResponse", () => {
    it("should return paginated structure", () => {
      const res = mockRes();
      paginatedResponse(res, { data: [1, 2], total: 20, page: 1, limit: 10 });
      const call = res.json.mock.calls[0][0];
      expect(call.success).toBe(true);
      expect(call.pagination.page).toBe(1);
      expect(call.pagination.total).toBe(20);
      expect(call.pagination.totalPages).toBe(2);
      expect(call.pagination.hasNextPage).toBe(true);
    });
  });
});
