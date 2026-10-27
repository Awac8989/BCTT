/**
 * REST API CLIENT - PHÂN HỆ LAO ĐỘNG, NGƯỜI CÓ CÔNG & AN SINH XÃ HỘI
 * UBND Phường Phú Cường / TP. Thủ Dầu Một
 * Endpoints: /api/v1/an-sinh/*
 */

import { appStore } from "@/services/app-state";
import {
  type DoiTuongBaoTroXaHoi,
  type HoSoCuuTroDotXuat,
  type HoGheoCanGheoItem,
  type CungCauLaoDongItem,
  type CoSoKiemTraATLaoDong,
  type TreEmHoanCanhDacBiet,
  type HoSoPhongChongTeNan,
  type HoSoTTHCAnSinhItem,
  initialBaoTroList,
  initialCuuTroList,
  initialHoGheoList,
  initialCungCauLaoDongList,
  initialATLaoDongList,
  initialTreEmList,
  initialTeNanList,
  initialHoSoTTHCAnSinhList,
} from "@/data/domain-mock";

export const anSinhApi = {
  // 1. Bảo trợ xã hội (NĐ 20/2021)
  async getBaoTroList(params?: { khuPho?: string; loaiDoiTuong?: string; search?: string }) {
    if (typeof window !== "undefined") {
      try {
        const query = new URLSearchParams();
        if (params?.khuPho) query.set("khuPho", params.khuPho);
        if (params?.loaiDoiTuong) query.set("loaiDoiTuong", params.loaiDoiTuong);
        if (params?.search) query.set("search", params.search);

        const res = await fetch(`/api/v1/an-sinh/bao-tro?${query.toString()}`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().baoTroList || initialBaoTroList,
    };
  },

  async createBaoTro(payload: Partial<DoiTuongBaoTroXaHoi>) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/an-sinh/bao-tro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    const newItem: DoiTuongBaoTroXaHoi = {
      id: `BTXH-${Math.floor(100 + Math.random() * 900)}`,
      hoTen: payload.hoTen || "Hồ sơ mới",
      cccd: payload.cccd || "074099001122",
      ngaySinh: payload.ngaySinh || "1950-01-01",
      gioiTinh: payload.gioiTinh || "Nam",
      khuPho: payload.khuPho || "Khu phố 1",
      diaChi: payload.diaChi || "Phường Phú Cường",
      loaiDoiTuong: payload.loaiDoiTuong || "NGUOI_CAO_TUOI_80",
      tenLoaiDoiTuong: payload.tenLoaiDoiTuong || "Người cao tuổi đủ 80 tuổi (NĐ 20/2021)",
      heSoHuong: payload.heSoHuong || 1.0,
      mucTroCapHangThang: payload.mucTroCapHangThang || 540_000,
      hinhThucNhan: payload.hinhThucNhan || "NGAN_HANG",
      thongTinChiTra: payload.thongTinChiTra || "Vietcombank - Đề án 06",
      soQuyetDinh: payload.soQuyetDinh || `QĐ-UBND-${Math.floor(100 + Math.random() * 900)}/2026`,
      ngayHieuLuc: new Date().toLocaleDateString("vi-VN"),
      trangThai: "DANG_HUONG",
    };
    appStore.addBaoTroItem(newItem);
    return newItem;
  },

  async thoiHuongBaoTro(id: string, lyDo: string, soQuyetDinh: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/an-sinh/bao-tro/${id}/thoi-huong`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lyDo, soQuyetDinh }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    appStore.thoiHuongBaoTro(id, lyDo, soQuyetDinh);
    return { id, trangThai: "THOI_HUONG" };
  },

  // 2. Rà soát Hộ nghèo (QĐ 24/2021/QĐ-TTg)
  async getHoNgheoList(params?: { khuPho?: string; phanLoai?: string }) {
    if (typeof window !== "undefined") {
      try {
        const query = new URLSearchParams();
        if (params?.khuPho) query.set("khuPho", params.khuPho);
        if (params?.phanLoai) query.set("phanLoai", params.phanLoai);

        const res = await fetch(`/api/v1/an-sinh/ho-ngheo?${query.toString()}`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    return {
      items: appStore.getState().hoGheoList || initialHoGheoList,
    };
  },

  async chamDiemHoNgheo(
    id: string,
    phanLoai: HoGheoCanGheoItem["phanLoai"],
    chieuThieuHut: string[],
    soTienVayCSXHVND?: number
  ) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/an-sinh/ho-ngheo/${id}/cham-diem`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phanLoai, chieuThieuHut, soTienVayCSXHVND }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    appStore.chamDiemHoNgheo(id, phanLoai, chieuThieuHut, soTienVayCSXHVND);
    return { id, phanLoai, chieuThieuHut };
  },

  // 3. Cung cầu lao động & Việc làm
  async getCungCauLaoDongList() {
    return {
      items: appStore.getState().cungCauLaoDongList || initialCungCauLaoDongList,
      atLaoDong: appStore.getState().atLaoDongList || initialATLaoDongList,
    };
  },

  async ketNoiViecLam(id: string, doanhNghiepTuyenDung: string, mucLuongKyVong: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/an-sinh/cung-cau/${id}/ket-noi`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doanhNghiepTuyenDung, mucLuongKyVong }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    appStore.ketNoiViecLam(id, doanhNghiepTuyenDung, mucLuongKyVong);
    return { id, tinhTrangViecLam: "DA_KET_NOI_VIEC_LAM" };
  },

  // 4. Bảo vệ Trẻ em (Luật Trẻ em 2016)
  async getTreEmList() {
    return {
      items: appStore.getState().treEmList || initialTreEmList,
    };
  },

  async lapKeHoachCanThiepTreEm(id: string, noiDungCanThiep: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/an-sinh/tre-em/${id}/can-thiep`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noiDungCanThiep }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    appStore.lapKeHoachCanThiepTreEm(id, noiDungCanThiep);
    return { id, daDuocTangHocBong: true };
  },

  // 5. Phòng chống Tệ nạn xã hội (NĐ 116/2021)
  async getTeNanList() {
    return {
      items: appStore.getState().teNanList || initialTeNanList,
    };
  },

  async capNhatXetNghiemTeNan(id: string, ketQua: "AM_TINH" | "DUONG_TINH", hoTroMoi?: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/an-sinh/te-nan/${id}/xet-nghiem`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ketQua, hoTroMoi }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    appStore.capNhatXetNghiemTeNan(id, ketQua, hoTroMoi);
    return { id, ketQuaXetNghiemDinhKy: ketQua };
  },

  // 6. Cứu trợ đột xuất
  async getCuuTroList() {
    return {
      items: appStore.getState().cuuTroList || initialCuuTroList,
    };
  },

  async createCuuTro(payload: Partial<HoSoCuuTroDotXuat>) {
    const newItem: HoSoCuuTroDotXuat = {
      id: `CT-DX-${Math.floor(10 + Math.random() * 90)}`,
      hoTenChuHo: payload.hoTenChuHo || "Chủ hộ",
      cccd: payload.cccd || "074099001122",
      khuPho: payload.khuPho || "Khu phố 1",
      diaChi: payload.diaChi || "Phường Phú Cường",
      loaiSuCo: payload.loaiSuCo || "HOA_HOAN_CHAY_NHA",
      moTaThietHai: payload.moTaThietHai || "Sự cố đột xuất",
      ngayXayRa: new Date().toLocaleDateString("vi-VN"),
      hinhThucCuuTro: payload.hinhThucCuuTro || "TIEN_MAT_VA_GAO",
      soTienHoTroVND: payload.soTienHoTroVND || 10_000_000,
      soKgGao: payload.soKgGao || 30,
      trangThai: "DA_CHI_TRA",
      ngayPheDuyet: new Date().toLocaleDateString("vi-VN"),
      nguoiPheDuyet: "Chủ tịch UBND Phường",
    };
    appStore.addCuuTroDotXuat(newItem);
    return newItem;
  },

  // 7. TTHC Một Cửa An Sinh & Ký số SmartCA
  async getTthcList() {
    return {
      items: appStore.getState().hoSoTTHCAnSinhList || initialHoSoTTHCAnSinhList,
    };
  },

  async createTthc(payload: Partial<HoSoTTHCAnSinhItem>) {
    const newItem: HoSoTTHCAnSinhItem = {
      id: `HSO-AS-${Math.floor(10 + Math.random() * 90)}`,
      maHoSo: `HSO-TTHC-AS-2026-${Math.floor(100 + Math.random() * 900)}`,
      tenThuTuc: payload.tenThuTuc || "Thủ tục trợ cấp bảo trợ xã hội",
      maThuTuc: payload.maThuTuc || "TDM-AS-01",
      nguoiNop: payload.nguoiNop || "Công dân",
      cccd: payload.cccd || "074099001122",
      soDienThoai: payload.soDienThoai || "0900.000.000",
      khuPho: payload.khuPho || "Khu phố 1",
      diaChi: payload.diaChi || "Phường Phú Cường",
      doiTuongThuHuong: payload.doiTuongThuHuong || "Đối tượng thụ hưởng",
      loaiDoiTuong: payload.loaiDoiTuong || "Bảo trợ xã hội",
      mucTienHoTroVND: payload.mucTienHoTroVND || 540_000,
      ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
      ngayHenTra: new Date(Date.now() + 3 * 24 * 3600 * 1000).toLocaleDateString("vi-VN"),
      hinhThucNop: payload.hinhThucNop || "TRUC_TIEP_MOT_CUA",
      trangThai: "CHO_THAM_DINH",
      canBoTiepNhan: "Võ Hoàng Nam (Cán bộ Một cửa)",
      canBoThuLy: "Lê Hoàng Nam (Công chức Văn hóa - Xã hội)",
      thanhPhanHoSo: payload.thanhPhanHoSo || [
        { tenGiayTo: "Tờ khai đề nghị theo mẫu quy định", batBuoc: true, daNop: true },
        { tenGiayTo: "Bản sao CCCD định danh mức độ 2", batBuoc: true, daNop: true },
      ],
    };
    appStore.addHoSoTTHCAnSinh(newItem);
    return newItem;
  },

  async kySoTthc(id: string, quyetDinhData: NonNullable<HoSoTTHCAnSinhItem["quyetDinhKySo"]>) {
    appStore.kySoHoSoTTHCAnSinh(id, quyetDinhData);
    return { id, trangThai: "DA_KY_SO", quyetDinhKySo: quyetDinhData };
  },
};
