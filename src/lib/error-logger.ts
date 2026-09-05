/**
 * Module ghi log lỗi và giám sát sự cố hệ thống
 * Đơn vị: Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương
 */

export interface SystemErrorContext {
  boundary?: string;
  source?: string;
  route?: string;
  [key: string]: unknown;
}

export function reportAppError(error: unknown, context: SystemErrorContext = {}) {
  if (typeof window === "undefined") return;

  const timestamp = new Date().toISOString();
  const currentPath = window.location.pathname;

  const errorMessage =
    error instanceof Response
      ? `HTTP Response ${error.status}: ${error.url || currentPath}`
      : error instanceof Error
        ? error.message
        : String(error);

  const stack = error instanceof Error ? error.stack : undefined;

  // Ghi nhật ký lỗi vào console và lưu vết phục vụ quản trị kỹ thuật
  console.error(`[Hệ thống Quản lý Hồ sơ Người có công - Lỗi Client] [${timestamp}]`, {
    message: errorMessage,
    route: currentPath,
    context,
    stack,
  });
}
