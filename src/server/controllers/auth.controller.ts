/**
 * AUTHENTICATION & RBAC CONTROLLER
 * Endpoints: /api/v1/auth/*
 */

import { backendStore, USERS, type SysUser } from "../services/backend-store";
import { jsonOk, jsonUnauthorized, jsonBadRequest } from "../utils/response";

export async function handleAuthRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/auth/, "");

  // POST /api/v1/auth/login
  if (path === "/login" && req.method === "POST") {
    try {
      const body = await req.json() as { email?: string; password?: string; role?: string };
      let user: SysUser | undefined;

      if (body.role) {
        user = Object.values(USERS).find((u) => u.role === body.role);
      } else if (body.email) {
        user = USERS[body.email];
      }

      if (!user) {
        return jsonUnauthorized("Tài khoản hoặc mật khẩu không chính xác");
      }

      backendStore.currentUser = user;
      backendStore.logAudit("Đăng nhập", `Đăng nhập thành công với vai trò ${user.chucVu}`, user.tenCanBo);

      return jsonOk({
        token: `mock-jwt-token-${user.role.toLowerCase()}-${Date.now()}`,
        user: {
          email: user.email,
          role: user.role,
          tenCanBo: user.tenCanBo,
          chucVu: user.chucVu,
          donVi: user.donVi,
          phamVi: user.phamVi,
        },
      }, "Đăng nhập thành công");
    } catch {
      return jsonBadRequest("Dữ liệu đăng nhập không hợp lệ");
    }
  }

  // GET /api/v1/auth/me
  if ((path === "/me" || path === "") && req.method === "GET") {
    return jsonOk({
      user: backendStore.currentUser,
      authenticated: true,
    });
  }

  // POST /api/v1/auth/switch-role
  if (path === "/switch-role" && req.method === "POST") {
    try {
      const body = await req.json() as { role?: string };
      const targetUser = Object.values(USERS).find((u) => u.role === body.role);

      if (!targetUser) {
        return jsonBadRequest("Vai trò không hợp lệ");
      }

      backendStore.currentUser = targetUser;
      backendStore.logAudit("Chuyển vai trò", `Chuyển quyền quản trị sang ${targetUser.chucVu}`, targetUser.tenCanBo);

      return jsonOk({
        user: targetUser,
        token: `mock-jwt-token-${targetUser.role.toLowerCase()}-${Date.now()}`,
      }, `Đã chuyển sang vai trò: ${targetUser.tenCanBo}`);
    } catch {
      return jsonBadRequest("Dữ liệu chuyển vai trò không hợp lệ");
    }
  }

  // POST /api/v1/auth/logout
  if (path === "/logout" && req.method === "POST") {
    backendStore.logAudit("Đăng xuất", `Cán bộ ${backendStore.currentUser.tenCanBo} đăng xuất khỏi hệ thống`);
    return jsonOk({ loggedOut: true }, "Đăng xuất thành công");
  }

  return jsonBadRequest("Endpoint xác thực không tồn tại");
}
