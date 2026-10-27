/**
 * THONG TIN - TRUYEN THONG & CHUYEN DOI SO CONTROLLER
 * Endpoints: /api/v1/thong-tin/*
 * Pháp lý: Quyết định 922/QĐ-BTTTT (DTI cấp Xã), Quy chế Tiếp nhận phản ánh IOC/1022 cấp Tỉnh/Thành
 */

import { appStore } from "@/services/app-state";
import {
  type PhanAnh1022Item,
  type DtiCapXaItem,
  initialPhanAnh1022List,
  initialDtiCapXaList,
} from "@/data/domain-mock";
import {
  jsonOk,
  jsonCreated,
  jsonBadRequest,
  jsonNotFound,
} from "../utils/response";

export async function handleThongTinRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/thong-tin/, "");

  // 1. Phản ánh Hiện trường IOC / 1022
  // GET /api/v1/thong-tin/phan-anh-1022
  if ((path === "/phan-anh-1022" || path === "") && req.method === "GET") {
    const linhVuc = url.searchParams.get("linhVuc");
    const trangThai = url.searchParams.get("trangThai");
    const mucDoKhan = url.searchParams.get("mucDoKhan");
    const search = url.searchParams.get("search")?.toLowerCase().trim();

    let items = appStore.getState().phanAnh1022List || initialPhanAnh1022List;

    if (linhVuc && linhVuc !== "ALL") {
      items = items.filter((p) => p.linhVuc === linhVuc);
    }
    if (trangThai && trangThai !== "ALL") {
      items = items.filter((p) => p.trangThai === trangThai);
    }
    if (mucDoKhan && mucDoKhan !== "ALL") {
      items = items.filter((p) => p.mucDoKhan === mucDoKhan);
    }
    if (search) {
      items = items.filter(
        (p) =>
          p.tieuDe.toLowerCase().includes(search) ||
          p.noiDung.toLowerCase().includes(search) ||
          p.diaDiem.toLowerCase().includes(search) ||
          p.maPhanAnh.toLowerCase().includes(search)
      );
    }

    const daXuLy = items.filter((p) => p.trangThai === "DA_XU_LY").length;
    const dangXuLy = items.filter((p) => p.trangThai === "DANG_XU_LY").length;
    const tiepNhan = items.filter((p) => p.trangThai === "TIEP_NHAN").length;

    return jsonOk({
      total: items.length,
      da_xu_ly_count: daXuLy,
      dang_xu_ly_count: dangXuLy,
      tiep_nhan_count: tiepNhan,
      ty_le_da_xu_ly_percent: items.length ? Number(((daXuLy / items.length) * 100).toFixed(1)) : 0,
      sla_24h_dung_han_percent: 96.5,
      items,
    });
  }

  // POST /api/v1/thong-tin/phan-anh-1022
  if (path === "/phan-anh-1022" && req.method === "POST") {
    try {
      const body = await req.json() as Partial<PhanAnh1022Item>;
      if (!body.tieuDe || !body.noiDung || !body.diaDiem) {
        return jsonBadRequest("Vui lòng cung cấp tiêu đề, nội dung và địa điểm phản ánh");
      }

      const newItem: PhanAnh1022Item = {
        id: `PA-${Date.now().toString().slice(-4)}`,
        maPhanAnh: `PA1022-2026-${Date.now().toString().slice(-4)}`,
        nguoiPhanAnh: body.nguoiPhanAnh || "Người dân phản ánh",
        soDienThoai: body.soDienThoai || "0908.xxx.xxx",
        diaDiem: body.diaDiem,
        linhVuc: body.linhVuc || "TRAT_TU_DO_THI",
        tieuDe: body.tieuDe,
        noiDung: body.noiDung,
        thoiGianGui: new Date().toLocaleString("vi-VN"),
        thoiHanXuLySLA: "Trong 24 giờ làm việc",
        trangThai: "TIEP_NHAN",
        mucDoKhan: body.mucDoKhan || "TRUNG_BINH",
        anhHienTruong: body.anhHienTruong,
      };

      appStore.tiepNhanPhanAnh1022(newItem);
      return jsonCreated(newItem, "Tiếp nhận phản ánh hiện trường 1022/IOC thành công");
    } catch {
      return jsonBadRequest("Dữ liệu phản ánh hiện trường không hợp lệ");
    }
  }

  // POST /api/v1/thong-tin/phan-anh-1022/:id/xu-ly
  const xuLyPaMatch = path.match(/^\/phan-anh-1022\/([^/]+)\/xu-ly$/);
  if (xuLyPaMatch && req.method === "POST") {
    const id = xuLyPaMatch[1]!;
    try {
      const body = await req.json() as {
        ketQuaXuLy: string;
        canBoXuLy: string;
        anhSauXuLy?: string;
        trangThai?: PhanAnh1022Item["trangThai"];
      };

      if (!body.ketQuaXuLy || !body.canBoXuLy) {
        return jsonBadRequest("Vui lòng cung cấp kết quả xử lý và cán bộ thụ lý");
      }

      appStore.xuLyPhanAnh1022(id, body);
      return jsonOk({ id, ...body }, "Cập nhật kết quả giải quyết phản ánh 1022 thành công");
    } catch {
      return jsonBadRequest("Dữ liệu cập nhật kết quả không hợp lệ");
    }
  }

  // 2. Bộ chỉ số Chuyển đổi số DTI Cấp Xã (QĐ 922/QĐ-BTTTT)
  // GET /api/v1/thong-tin/dti
  if (path === "/dti" && req.method === "GET") {
    const truCot = url.searchParams.get("truCot");
    let items = appStore.getState().dtiCapXaList || initialDtiCapXaList;

    if (truCot && truCot !== "ALL") {
      items = items.filter((d) => d.truCot === truCot);
    }

    const tongDiemToiDa = items.reduce((s, i) => s + (i.diemToiDa || i.chiTieuGiao || 100), 0);
    const tongDiemDat = items.reduce((s, i) => s + (i.diemDatDuoc !== undefined ? i.diemDatDuoc : (i.thucTeDat || 0)), 0);
    const datChuanCount = items.filter((i) => (i.danhGia === "VUOT_CHI_TIEU" || i.danhGia === "DAT" || (i.diemDatDuoc && i.diemDatDuoc >= (i.diemToiDa || 100) * 0.8))).length;
    const tyLeHoanThanh = Number(((tongDiemDat / tongDiemToiDa) * 100).toFixed(1));
    const xepLoai = datChuanCount === items.length || tyLeHoanThanh >= 85 ? "XUAT_SAC" : tyLeHoanThanh >= 70 ? "TOT" : "TRUNG_BINH";

    return jsonOk({
      total_chi_so: items.length,
      tong_diem_dat_duoc: tongDiemDat,
      tong_diem_toi_da: tongDiemToiDa,
      ty_le_hoan_thanh_percent: tyLeHoanThanh,
      xep_loai_dti: xepLoai,
      chi_so_dat_tot_count: datChuanCount,
      items,
    });
  }

  // POST /api/v1/thong-tin/dti/:id/cap-nhat
  const capNhatDtiMatch = path.match(/^\/dti\/([^/]+)\/cap-nhat$/);
  if (capNhatDtiMatch && req.method === "POST") {
    const id = capNhatDtiMatch[1]!;
    try {
      const body = await req.json() as {
        giaTriHienTai: string;
        diemDatDuoc: number;
        ghiChuMinhChung?: string;
      };

      appStore.capNhatChiSoDti(id, body);
      return jsonOk({ id, ...body }, "Cập nhật chỉ số DTI cấp Xã thành công");
    } catch {
      return jsonBadRequest("Dữ liệu cập nhật chỉ số DTI không hợp lệ");
    }
  }

  // 4. QUẢN TRỊ CỔNG THÔNG TIN ĐIỆN TỬ & ZALO OA (NĐ 42/2022)
  // GET /api/v1/thong-tin/tin-bai
  if (path === "/tin-bai" && req.method === "GET") {
    const list = appStore.getState().tinBaiList;
    return jsonOk({
      total: list.length,
      da_xuat_ban: list.filter((t) => t.trangThai === "DA_XUAT_BAN").length,
      cho_duyet: list.filter((t) => t.trangThai === "CHO_DUYET").length,
      tong_luot_xem: list.reduce((s, t) => s + (t.luotXem || 0), 0),
      items: list,
    }, "Lấy danh sách tin bài Cổng TTĐT thành công");
  }

  // POST /api/v1/thong-tin/tin-bai
  if (path === "/tin-bai" && req.method === "POST") {
    try {
      const body = await req.json();
      if (!body.tieuDe) {
        return jsonBadRequest("Vui lòng cung cấp tiêu đề tin bài");
      }
      appStore.themTinBaiCongThongTin(body);
      const latest = appStore.getState().tinBaiList[0];
      return jsonCreated(latest, "Gửi tin bài lên Cổng TTĐT thành công");
    } catch {
      return jsonBadRequest("Dữ liệu tin bài không hợp lệ");
    }
  }

  // POST /api/v1/thong-tin/tin-bai/:id/duyet
  const duyetTinMatch = path.match(/^\/tin-bai\/([^/]+)\/duyet$/);
  if (duyetTinMatch && req.method === "POST") {
    const id = duyetTinMatch[1]!;
    const body = await req.json().catch(() => ({}));
    appStore.duyetXuatBanTinBai(id, body.nguoiDuyet);
    const updated = appStore.getState().tinBaiList.find((t) => t.id === id);
    return jsonOk(updated, "Phê duyệt xuất bản tin bài thành công");
  }

  // POST /api/v1/thong-tin/tin-bai/:id/broadcast-zalo
  const broadcastMatch = path.match(/^\/tin-bai\/([^/]+)\/broadcast-zalo$/);
  if (broadcastMatch && req.method === "POST") {
    const id = broadcastMatch[1]!;
    const body = await req.json().catch(() => ({}));
    appStore.dongBoBroadcastZalo(id, body.luotGui);
    const updated = appStore.getState().tinBaiList.find((t) => t.id === id);
    return jsonOk(updated, "Phát tin nhắn chính sách Broadcast qua Zalo OA thành công");
  }

  // 5. GIÁM SÁT AN TOÀN THÔNG TIN & TÁC CHIẾN KHÔNG GIAN MẠNG (CT 14/CT-TTg)
  // GET /api/v1/thong-tin/khong-gian-mang
  if (path === "/khong-gian-mang" && req.method === "GET") {
    const list = appStore.getState().khongGianMangList;
    return jsonOk({
      total: list.length,
      da_xu_ly: list.filter((k) => k.bienPhapXuLy === "DA_XU_LY_XONG").length,
      nghiem_trong: list.filter((k) => k.mucDoNguyHiem === "NGHIEM_TRONG").length,
      items: list,
    }, "Lấy dữ liệu giám sát không gian mạng cơ sở thành công");
  }

  // POST /api/v1/thong-tin/khong-gian-mang
  if (path === "/khong-gian-mang" && req.method === "POST") {
    try {
      const body = await req.json();
      if (!body.tieuDeNoiDung) {
        return jsonBadRequest("Vui lòng cung cấp nội dung nghi vấn trên không gian mạng");
      }
      appStore.ghiNhanTinXauDoc(body);
      const latest = appStore.getState().khongGianMangList[0];
      return jsonCreated(latest, "Ghi nhận thông tin không gian mạng thành công");
    } catch {
      return jsonBadRequest("Dữ liệu không hợp lệ");
    }
  }

  // POST /api/v1/thong-tin/khong-gian-mang/:id/xu-ly
  const xuLyKgmMatch = path.match(/^\/khong-gian-mang\/([^/]+)\/xu-ly$/);
  if (xuLyKgmMatch && req.method === "POST") {
    const id = xuLyKgmMatch[1]!;
    const body = await req.json();
    appStore.xuLyTinXauDoc(id, body.bienPhap, body.ketQua);
    const updated = appStore.getState().khongGianMangList.find((k) => k.id === id);
    return jsonOk(updated, "Cập nhật kết quả xử lý thông tin mạng thành công");
  }

  // 3. KPI tổng hợp mảng Thông tin - Truyền thông & Chuyển đổi số
  // GET /api/v1/thong-tin/kpi
  if (path === "/kpi" && req.method === "GET") {
    const pa = appStore.getState().phanAnh1022List || initialPhanAnh1022List;
    const dti = appStore.getState().dtiCapXaList || initialDtiCapXaList;

    const daXuLy = pa.filter((p) => p.trangThai === "DA_XU_LY").length;
    const tongDiemDti = dti.reduce((s, i) => s + i.diemDatDuoc, 0);
    const tongToiDaDti = dti.reduce((s, i) => s + i.diemToiDa, 0);

    return jsonOk({
      phan_anh_1022: {
        tong_so: pa.length,
        da_xu_ly: daXuLy,
        dang_xu_ly: pa.filter((p) => p.trangThai === "DANG_XU_LY").length,
        ty_le_giai_quyet: pa.length ? Number(((daXuLy / pa.length) * 100).toFixed(1)) : 0,
        sla_24h_dat_chuan: true,
      },
      dti_chuyen_doi_so: {
        tong_chi_so: dti.length,
        diem_tong_dti: tongDiemDti,
        diem_toi_da: tongToiDaDti,
        ty_le_dat: Number(((tongDiemDti / tongToiDaDti) * 100).toFixed(1)),
        xep_loai: tongDiemDti >= 85 ? "XUAT_SAC" : "TOT",
        vietqr_thanh_toan_khong_tien_mat_percent: 94.5,
        vneid_muc2_kich_hoat_percent: 92.4,
        smartca_can_bo_chuyen_mon_percent: 100,
      },
    }, "Lấy KPI tổng hợp Mảng Thông tin - Truyền thông & Chuyển đổi số thành công");
  }

  return jsonNotFound("Endpoint phân hệ Thông tin - Truyền thông & Chuyển đổi số không tồn tại");
}
