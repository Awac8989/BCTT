/**
 * REST API CLIENT - PHÂN HỆ VĂN HÓA, THỂ THAO & ĐỜI SỐNG VĂN MINH ĐÔ THỊ
 * UBND Phường Thủ Dầu Một / TP. Thủ Dầu Một
 * Endpoints: /api/v1/van-hoa/*
 */

import { appStore } from "@/services/app-state";
import {
  type GiaDinhVanHoaItem,
  type KhuPhoVanHoaItem,
  type DiTichLeHoiItem,
  type CoSoTonGiaoItem,
  type CoSoDichVuVanHoaItem,
  type ThietCheVanHoaItem,
  type DiaChiTinCayItem,
  type LangNgheTruyenThongItem,
  type GisDiaDiemVanHoaItem,
  type HoSoBaoLucGiaDinhItem,
  type HoSoTTHCVanHoaItem,
  initialGiaDinhVanHoaList,
  initialKhuPhoVanHoaList,
  initialDiTichLeHoiList,
  initialCoSoTonGiaoList,
  initialCoSoDichVuVanHoaList,
  initialThietCheVanHoaList,
  initialDiaChiTinCayList,
  initialLangNgheList,
  initialGisDiaDiemList,
  initialBaoLucGiaDinhList,
  initialHoSoTTHCVanHoaList,
} from "@/data/domain-mock";

export const vanHoaApi = {
  // 1. Gia đình văn hóa
  async getGiaDinhList(params?: { khuPho?: string; ketQua?: string; search?: string }) {
    if (typeof window !== "undefined") {
      try {
        const query = new URLSearchParams();
        if (params?.khuPho) query.set("khuPho", params.khuPho);
        if (params?.ketQua) query.set("ketQua", params.ketQua);
        if (params?.search) query.set("search", params.search);

        const res = await fetch(`/api/v1/van-hoa/gia-dinh?${query.toString()}`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().giaDinhVanHoaList || initialGiaDinhVanHoaList,
    };
  },

  async createGiaDinh(payload: Partial<GiaDinhVanHoaItem>) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/gia-dinh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    const newItem: GiaDinhVanHoaItem = {
      id: `GDVH-${Date.now().toString().slice(-4)}`,
      maHo: `HGD-PC-${Date.now().toString().slice(-3)}`,
      chuHo: payload.chuHo || "Hộ mới",
      cccd: payload.cccd || "074000000000",
      diaChi: payload.diaChi || "Khu phố 1",
      khuPho: payload.khuPho || "Khu phố 1",
      soThanhVien: payload.soThanhVien || 4,
      namDanhGia: 2026,
      diemGuongMau: payload.diemGuongMau || 28,
      diemKinhTe: payload.diemKinhTe || 28,
      diemHoaThuan: payload.diemHoaThuan || 36,
      tongDiem: (payload.diemGuongMau || 28) + (payload.diemKinhTe || 28) + (payload.diemHoaThuan || 36),
      ketQua: "DAT_CHUAN",
      namDatLienTuc: 1,
      deNghiKhenThuong: false,
      nguoiChamDiem: "Ban điều hành Khu phố",
      ngayCham: new Date().toLocaleDateString("vi-VN"),
      ghiChu: payload.ghiChu || "",
    };
    appStore.addGiaDinhVanHoa(newItem);
    return newItem;
  },

  async binhXetGiaDinh(payload: {
    id: string;
    diemGuongMau: number;
    diemKinhTe: number;
    diemHoaThuan: number;
    deNghiKhenThuong?: boolean;
    ghiChu?: string;
  }) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/gia-dinh/${payload.id}/binh-xet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return appStore.binhXetGiaDinhVanHoa(payload);
  },

  // 2. Khu phố văn hóa
  async getKhuPhoList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/khu-pho");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().khuPhoVanHoaList || initialKhuPhoVanHoaList,
    };
  },

  // 3. Di tích & Lễ hội
  async getDiTichList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/di-tich");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().diTichLeHoiList || initialDiTichLeHoiList,
    };
  },

  async updatePcccDiTich(id: string, congTacPCCC: DiTichLeHoiItem["congTacPCCC"]) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/di-tich/${id}/pccc`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ congTacPCCC }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    appStore.capNhatPcccDiTich(id, congTacPCCC);
    return { id, congTacPCCC };
  },

  // 4. Cơ sở tôn giáo
  async getTonGiaoList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/ton-giao");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().coSoTonGiaoList || initialCoSoTonGiaoList,
    };
  },

  async dangKyTonGiao(id: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/ton-giao/${id}/thong-bao`, {
          method: "POST",
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    appStore.dangKySinhHoatTonGiao(id);
    return { id, trangThai: "DA_DANG_KY_HANG_NAM" };
  },

  // 5. Kiểm tra 814
  async getCoSoDichVuList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/co-so-dich-vu");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().coSoDichVuVanHoaList || initialCoSoDichVuVanHoaList,
    };
  },

  async kiemTraCoSoDichVu(
    id: string,
    payload: {
      ketLuan: CoSoDichVuVanHoaItem["ketLuan"];
      mucPhatVND: number;
      noiDungXuLy: string;
      pccc: CoSoDichVuVanHoaItem["tinhTrangPCCC"];
    }
  ) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/co-so-dich-vu/${id}/kiem-tra`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    appStore.kiemTraCoSoVanHoa(
      id,
      payload.ketLuan,
      payload.mucPhatVND,
      payload.noiDungXuLy,
      payload.pccc
    );
    return { id, ...payload };
  },

  // 6. Thiết chế văn hóa & CLB
  async getThietCheList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/thiet-che");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().thietCheVanHoaList || initialThietCheVanHoaList,
    };
  },

  // 7. Địa chỉ tin cậy
  async getDiaChiTinCayList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/dia-chi-tin-cay");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().diaChiTinCayList || initialDiaChiTinCayList,
    };
  },

  async hoTroDiaChiTinCay(id: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/dia-chi-tin-cay/${id}/ho-tro`, {
          method: "POST",
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    appStore.tiepNhanBaoLucGiaDinh(id);
    return { id, trangThai: "DANG_HO_TRO_NAN_NHAN" };
  },

  // 8. Làng nghề truyền thống
  async getLangNgheList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/lang-nghe");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().langNgheList || initialLangNgheList,
    };
  },

  // 9. Bản đồ GIS
  async getGisDiaDiemList(loaiHinh?: string) {
    if (typeof window !== "undefined") {
      try {
        const url = loaiHinh ? `/api/v1/van-hoa/gis-ban-do?loaiHinh=${loaiHinh}` : "/api/v1/van-hoa/gis-ban-do";
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().gisDiaDiemList || initialGisDiaDiemList,
    };
  },

  // 10. Hồ sơ Bạo lực gia đình & Cấm tiếp xúc
  async getBaoLucGiaDinhList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/bao-luc-gia-dinh");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().baoLucGiaDinhList || initialBaoLucGiaDinhList,
    };
  },

  async banHanhCamTiepXuc(id: string, thoiHanNgay = 3) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/bao-luc-gia-dinh/${id}/cam-tiep-xuc`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thoiHanNgay }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return appStore.banHanhQuyetDinhCamTiepXuc(id, thoiHanNgay);
  },

  // 11. TTHC Một cửa & Ký số SmartCA
  async getTthcList() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/tthc");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return {
      items: appStore.getState().hoSoTTHCVanHoaList || initialHoSoTTHCVanHoaList,
    };
  },

  async tiepNhanTthc(data: {
    tenThuTuc: string;
    maThuTuc: string;
    nguoiNop: string;
    sdt: string;
    cccd: string;
    diaChi: string;
    khuPho: string;
    ngayHenTra: string;
    ketQuaVanBan: string;
  }) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/tthc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return appStore.tiepNhanTthcVanHoa({
      ...data,
      ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
      canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
      canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    });
  },

  async kySoTthcSmartCA(id: string, nguoiKy?: string, chucVu?: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/van-hoa/tthc/${id}/ky-so`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nguoiKy, chucVu }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback store
      }
    }
    return appStore.kySoTthcVanHoa(id, nguoiKy, chucVu);
  },

  // 12. KPI tổng hợp
  async getKpi() {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/van-hoa/kpi");
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    return null;
  },
};
