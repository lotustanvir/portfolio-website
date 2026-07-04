import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "@/components/common/Pagination";

describe("Pagination", () => {
  it("renders null for single page", () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders page buttons", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("calls onPageChange on click", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables prev on first page", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    const prev = screen.getAllByRole("button")[0];
    expect(prev).toBeDisabled();
  });

  it("disables next on last page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[buttons.length - 1]).toBeDisabled();
  });

  it("shows ellipsis when needed", () => {
    render(<Pagination page={5} totalPages={10} onPageChange={vi.fn()} />);
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBe(2);
  });
});
