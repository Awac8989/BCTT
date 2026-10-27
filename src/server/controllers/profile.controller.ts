/**
 * PROFILE CONTROLLER (HỒ SƠ NGƯỜI CÓ CÔNG)
 * Endpoints: /api/v1/profiles/*
 * Implements: TC-PRF-01, TC-PRF-02, TC-PRF-03, TC-PRF-04, TC-APR-01, TC-APR-02, TC-APR-03
 */

import { backendStore, WARDS } from "../services/backend-store";
import {
  jsonOk,
  jsonCreated,
  jsonBadRequest,
  jsonNotFound,
  jsonConflict,
} from "../utils/response";
import { createProfileSchema } from "@/services/profile.validation";
import { calculateAllowance } from "@/services/calculator.service";
import type { HoSo, TrangThai, LoaiDoiTuong } from "@/data/mock";

export async function handleProfileRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/profiles/, "");
  const method = req.method;

  // 1. GET /api/v1/profiles - Danh sách hồ sơ với bộ lọc và phân trang
  if ((path === "" || path === "/") && method === "GET") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const phuong = url.searchParams.get("phuong") || "";
    const wardId = url.searchParams.get("ward_id");
    const loaiDt = url.searchParams.get("loai_dt") || "";
    const trangThai = url.searchParams.get("trang_thai") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10)));

    let filtered = backendStore.profiles;

    if (search) {
      filtered = filtered.filter(
        (h) =>
          h.hoTen.toLowerCase().includes(search) ||
          h.cccd.includes(search) ||
          h.id.toLowerCase().includes(search) ||
          (h.soHoSoTinh && h.soHoSoTinh.toLowerCase().includes(search))
      );
    }

    if (wardId && wardId !== "all") {
      const ward = WARDS.find((w) => String(w.ward_id) === String(wardId));
      if (ward) {
        filtered = filtered.filter((h) => h.phuong.includes(ward.ward_name) || ward.ward_name.includes(h.phuong));
      }
    } else if (phuong && phuong !== "ALL") {
      filtered = filtered.filter((h) => h.phuong.includes(phuong) || phuong.includes(h.phuong));
    }

    if (loaiDt && loaiDt !== "ALL") {
      filtered = filtered.filter((h) => h.loaiDoiTuong.toLowerCase().includes(loaiDt.toLowerCase()));
    }

    if (trangThai && trangThai !== "ALL") {
      filtered = filtered.filter((h) => h.trangThai === trangThai);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return jsonOk({
      total,
      page,
      limit,
      totalPages,
      items,
    });
  }

  // 2. POST /api/v1/profiles - Tạo mới hồ sơ với Zod Validation & chống trùng CCCD (TC-PRF-01 -> TC-PRF-04)
  if ((path === "" || path === "/") && method === "POST") {
    try {
      const rawBody = await req.json();

      // Bước 1: Zod Validation (TC-PRF-03 & TC-PRF-04)
      const parseResult = createProfileSchema.safeParse(rawBody);
      if (!parseResult.success) {
        const errorMessages = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        return jsonBadRequest("Dữ liệu hồ sơ không hợp lệ: " + errorMessages.join(", "), parseResult.error.format());
      }

      const data = parseResult.data;

      // Bước 2: Kiểm tra trùng lặp CCCD (TC-PRF-02)
      const existing = backendStore.profiles.find((h) => h.cccd === data.so_cccd);
      if (existing) {
        return jsonConflict(
          `Số CCCD ${data.so_cccd} đã tồn tại trong hồ sơ ${existing.id} (${existing.hoTen})!`
        );
      }

      // Bước 3: Tính toán chế độ trợ cấp sơ bộ
      const calcResult = calculateAllowance({
        maLoaiDt: data.ma_loai_dt,
        tyLeThuongTat: data.ty_le_thuong_tat,
        coNguoiChamSoc: data.co_nguoi_cham_soc,
      });

      // Xác định tên phường
      const ward = WARDS.find((w) => w.ward_id === data.ward_id);
      const tenPhuong = data.phuong || (ward ? ward.ward_name.replace("Phường ", "") : "Phú Cường");

      // Bước 4: Tạo hồ sơ mới
      const newId = `HS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const hanXuLyDate = new Date();
      hanXuLyDate.setDate(hanXuLyDate.getDate() + 15);

      const loaiMap: Record<string, LoaiDoiTuong> = {
        THUONG_BINH: "Thương binh",
        BENH_BINH: "Bệnh binh",
        ME_VNAH: "Mẹ VNAH",
        LIET_SI: "Thân nhân liệt sĩ",
        CHAT_DOC_HOA_HOC: "Nhiễm chất độc hóa học",
        TIEN_KHOI_NGHIA: "Cán bộ tiền khởi nghĩa",
      };

      const newProfile: HoSo = {
        id: newId,
        soHoSoTinh: data.so_ho_so_tinh || `BD/${Math.floor(10000 + Math.random() * 90000)}-1`,
        hoTen: data.ho_ten,
        cccd: data.so_cccd,
        ngaySinh: data.ngay_sinh,
        namSinh: data.ngay_sinh.split("-")[0],
        gioiTinh: data.gioi_tinh === "NAM" ? "Nam" : "Nữ",
        huyen: data.huyen || "TP. Thủ Dầu Một",
        phuong: tenPhuong,
        khuPho: data.khu_pho || "Khu phố 1",
        diaChiTiepNhan: `${tenPhuong} - TP. Thủ Dầu Một`,
        loaiDoiTuong: loaiMap[data.ma_loai_dt] || "Thương binh",
        banSaoBanGoc: data.ban_sao_ban_goc,
        soBhyt: data.so_bhyt || `HT2740${Math.floor(1000000 + Math.random() * 9000000)}`,
        danToc: data.dan_toc || "Kinh",
        tyLeTonThuong: data.ty_le_thuong_tat,
        trangThai: "MỚI_TIẾP_NHẬN",
        ngayTiepNhan: now.toLocaleDateString("vi-VN"),
        hanXuLy: hanXuLyDate.toLocaleDateString("vi-VN"),
        quaHanNgay: 0,
        canBoTiepNhan: backendStore.currentUser.tenCanBo,
        mucTroCap: calcResult.troCapHangThang,
        phuCapPhucVu: calcResult.phuCapChamSoc,
        troCapDieuDuong: calcResult.troCapDieuDuong,
        taiLieu: ["Đơn đề nghị", "Bản sao CCCD", "Biên bản giám định y khoa"],
      };

      backendStore.profiles.unshift(newProfile);
      backendStore.logAudit("Tạo mới hồ sơ", `Thêm mới hồ sơ ${newProfile.id} cho ông/bà ${newProfile.hoTen} (${newProfile.cccd})`);

      return jsonCreated({
        ho_so_id: newProfile.id,
        ma_so_quan_ly: newProfile.id,
        trang_thai_hs: newProfile.trangThai,
        ho_so: newProfile,
      }, "Tạo hồ sơ thành công");
    } catch (err) {
      return jsonBadRequest("Lỗi xử lý yêu cầu tạo hồ sơ", err instanceof Error ? err.message : String(err));
    }
  }

  // 3. POST /api/v1/profiles/:id/approve - Thẩm định & Phê duyệt hồ sơ ACID (TC-APR-01, TC-APR-02)
  const approveMatch = path.match(/^\/([^/]+)\/approve$/);
  if (approveMatch && method === "POST") {
    const id = decodeURIComponent(approveMatch[1]);
    const hoSo = backendStore.profiles.find((h) => h.id === id || h.cccd === id);

    if (!hoSo) {
      return jsonNotFound(`Không tìm thấy hồ sơ có mã: ${id}`);
    }

    try {
      const body = await req.json().catch(() => ({}));
      const coNguoiChamSoc = body.coNguoiChamSoc ?? (hoSo.tyLeTonThuong >= 81 || hoSo.loaiDoiTuong === "Mẹ VNAH");

      // Tính tiền theo chuẩn Nghị định 75/2021
      const calc = calculateAllowance({
        maLoaiDt: hoSo.loaiDoiTuong === "Mẹ VNAH" ? "ME_VNAH" : "THUONG_BINH",
        tyLeThuongTat: hoSo.tyLeTonThuong,
        coNguoiChamSoc,
      });

      // Tạo Quyết định hưởng trợ cấp
      const soQuyetDinh = `QĐ-UBND-2026/${Math.floor(1000 + Math.random() * 9000)}`;
      hoSo.trangThai = "ĐÃ_DUYỆT";
      hoSo.mucTroCap = calc.troCapHangThang;
      hoSo.phuCapPhucVu = calc.phuCapChamSoc;
      hoSo.troCapDieuDuong = calc.troCapDieuDuong;

      backendStore.logAudit(
        "Phê duyệt hồ sơ",
        `Ban hành Quyết định hưởng trợ cấp số ${soQuyetDinh} cho hồ sơ ${hoSo.id} (${hoSo.hoTen}), trợ cấp: ${calc.tongTienThucNhan.toLocaleString("vi-VN")} đ/tháng`,
        backendStore.currentUser.tenCanBo
      );

      return jsonOk({
        success: true,
        ho_so_id: hoSo.id,
        trang_thai: hoSo.trangThai,
        so_quyet_dinh: soQuyetDinh,
        ngay_ban_hanh: new Date().toLocaleDateString("vi-VN"),
        tien_tro_cap_thang: calc.troCapHangThang,
        phu_cap_phuc_vu: calc.phuCapChamSoc,
        tong_tien: calc.tongTienThucNhan,
        ho_so: hoSo,
      }, `Đã phê duyệt và ban hành Quyết định ${soQuyetDinh}`);
    } catch (err) {
      return jsonBadRequest("Lỗi trong quá trình phê duyệt hồ sơ", err instanceof Error ? err.message : String(err));
    }
  }

  // 4. PATCH /api/v1/profiles/:id/status - Cập nhật trạng thái hồ sơ
  const statusMatch = path.match(/^\/([^/]+)\/status$/);
  if (statusMatch && method === "PATCH") {
    const id = decodeURIComponent(statusMatch[1]);
    const hoSo = backendStore.profiles.find((h) => h.id === id);

    if (!hoSo) {
      return jsonNotFound(`Không tìm thấy hồ sơ có mã: ${id}`);
    }

    try {
      const body = await req.json() as { status?: TrangThai; ghiChu?: string };
      if (!body.status) {
        return jsonBadRequest("Thiếu trạng thái cập nhật (status)");
      }

      hoSo.trangThai = body.status;
      if (body.ghiChu) hoSo.ghiChuThamDinh = body.ghiChu;

      backendStore.logAudit("Cập nhật trạng thái", `Chuyển hồ sơ ${hoSo.id} sang trạng thái '${body.status}'`);
      return jsonOk(hoSo, "Cập nhật trạng thái hồ sơ thành công");
    } catch {
      return jsonBadRequest("Dữ liệu cập nhật không hợp lệ");
    }
  }

  // 5. GET /api/v1/profiles/:id - Chi tiết 1 hồ sơ
  const singleMatch = path.match(/^\/([^/]+)$/);
  if (singleMatch && method === "GET") {
    const id = decodeURIComponent(singleMatch[1]);
    const hoSo = backendStore.profiles.find(
      (h) => h.id === id || h.cccd === id || h.soHoSoTinh === id
    );

    if (!hoSo) {
      return jsonNotFound(`Không tìm thấy hồ sơ có mã hoặc CCCD: ${id}`);
    }

    return jsonOk(hoSo);
  }

  // 6. DELETE /api/v1/profiles/:id - Xóa hồ sơ
  if (singleMatch && method === "DELETE") {
    const id = decodeURIComponent(singleMatch[1]);
    const idx = backendStore.profiles.findIndex((h) => h.id === id);

    if (idx === -1) {
      return jsonNotFound(`Không tìm thấy hồ sơ có mã: ${id}`);
    }

    const removed = backendStore.profiles.splice(idx, 1)[0];
    backendStore.logAudit("Xóa hồ sơ", `Đã xóa hồ sơ ${removed.id} (${removed.hoTen})`);
    return jsonOk({ deletedId: id }, "Xóa hồ sơ thành công");
  }

  return jsonNotFound();
}
