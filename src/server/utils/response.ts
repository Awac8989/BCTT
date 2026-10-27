/**
 * BACKEND HTTP RESPONSE UTILITIES
 * Standardized JSON responses, status codes, and CORS headers
 */

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

export function jsonResponse(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export function jsonOk<T>(data: T, message?: string): Response {
  return jsonResponse({
    success: true,
    message: message || "Thao tác thành công",
    data,
  }, 200);
}

export function jsonCreated<T>(data: T, message?: string): Response {
  return jsonResponse({
    success: true,
    message: message || "Tạo mới thành công",
    data,
  }, 201);
}

export function jsonBadRequest(message: string, errors?: unknown): Response {
  return jsonResponse({
    success: false,
    message,
    errors,
  }, 400);
}

export function jsonUnauthorized(message = "Chưa đăng nhập hoặc phiên làm việc đã hết hạn"): Response {
  return jsonResponse({
    success: false,
    message,
  }, 401);
}

export function jsonForbidden(message = "Bạn không có quyền thực hiện thao tác này"): Response {
  return jsonResponse({
    success: false,
    message,
  }, 403);
}

export function jsonNotFound(message = "Không tìm thấy tài nguyên yêu cầu"): Response {
  return jsonResponse({
    success: false,
    message,
  }, 404);
}

export function jsonConflict(message: string, details?: unknown): Response {
  return jsonResponse({
    success: false,
    message,
    details,
  }, 409);
}

export function jsonServerError(message = "Lỗi máy chủ nội bộ", error?: unknown): Response {
  console.error("[Backend Error]:", error);
  return jsonResponse({
    success: false,
    message,
    error: error instanceof Error ? error.message : String(error),
  }, 500);
}

export function handleCorsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
