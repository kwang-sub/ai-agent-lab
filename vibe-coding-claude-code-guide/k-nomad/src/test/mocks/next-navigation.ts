import { vi } from "vitest";

export const routerMock = {
  push: vi.fn(),
  refresh: vi.fn(),
};

export function resetRouterMock() {
  routerMock.push.mockReset();
  routerMock.refresh.mockReset();
}
