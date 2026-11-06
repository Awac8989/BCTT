/**
 * VAN HOA - THE THAO & DOI SONG VAN MINH CONTROLLER
 * Endpoints: /api/v1/van-hoa/*
 * Pháp lý: Nghị định 86/2023/NĐ-CP, Nghị định 54/2019/NĐ-CP,
 * Luật Di sản văn hóa, Luật Tín ngưỡng tôn giáo, Luật Phòng chống bạo lực gia đình 2022
 */

import { backendStore } from "../services/backend-store";
import { appStore } from "@/services/app-state";
import {
  type GiaDinhVanHoaItem,
  type CoSoDichVuVanHoaItem,
  type DiTichLeHoiItem,
  type KiemTra814Item,
  type DoThiVanMinhTieuChiItem,
  initialGiaDinhVanHoaList,
  initialKhuPhoVanHoaList,
  initialDiTichLeHoiList,
  initialCoSoTonGiaoList,
  initialCoSoDichVuVanHoaList,
  initialThietCheVanHoaList,
  initialDiaChiTinCayList,
  initialKiemTra814List,
  initialDoThiVanMinhList,
} from "@/data/domain-mock";
import {
  jsonOk,
  jsonCreated,
  jsonBadRequest,
  jsonNotFound,
} from "../utils/response";

export async function handleVanHoaRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/van-hoa/, "");

  // 1. Gia đình văn hóa
  // GET /api/v1/van-hoa/gia-dinh
  if ((path === "/gia-dinh" || path === "") && req.method === "GET") {
    const khuPho = url.searchParams.get("khuPho");
    const ketQua = url.searchParams.get("ketQua");
    const search = url.searchParams.get("search")?.toLowerCase().trim();

    let items = appStore.getState().giaDinhVanHoaList || initialGiaDinhVanHoaList;

    if (khuPho && khuPho !== "ALL") {
      items = items.filter((g) => g.khuPho === khuPho);
    }
    if (ketQua && ketQua !== "ALL") {
      items = items.filter((g) => g.ketQua === ketQua);
    }
    if (search) {
      items = items.filter((g) =>
        g.chuHo.toLowerCase().includes(search) ||
        g.cccd.includes(search) ||
        g.diaChi.toLowerCase().includes(search)
      );
    }

    const datCount = items.filter((g) => g.ketQua === "DAT_CHUAN").length;
    return jsonOk({
      total: items.length,
      dat_chuan_count: datCount,
      chua_dat_count: items.length - datCount,
      ty_le_dat: items.length ? Number(((datCount / items.length) * 100).toFixed(1)) : 0,
      items,
    });
  }

  // POST /api/v1/van-hoa/gia-dinh
  if (path === "/gia-dinh" && req.method === "POST") {
    try {
      const body = await req.json() as Partial<GiaDinhVanHoaItem>;
      if (!body.chuHo || !body.cccd) {
        return jsonBadRequest("Vui lòng cung cấp họ tên chủ hộ và số CCCD");
      }

      const diemGuongMau = body.diemGuongMau ?? 28;
      const diemKinhTe = body.diemKinhTe ?? 28;
      const diemHoaThuan = body.diemHoaThuan ?? 36;
      const tongDiem = diemGuongMau + diemKinhTe + diemHoaThuan;
      const ketQua = tongDiem >= 85 ? "DAT_CHUAN" : "CHUA_DAT";

      const newItem: GiaDinhVanHoaItem = {
        id: `GDVH-${Date.now().toString().slice(-4)}`,
        maHo: `HGD-PC-${Date.now().toString().slice(-3)}`,
        chuHo: body.chuHo,
        cccd: body.cccd,
        diaChi: body.diaChi || "Khu phố 1, Phường Thủ Dầu Một",
        khuPho: body.khuPho || "Khu phố 1",
        soThanhVien: body.soThanhVien || 4,
        namDanhGia: 2026,
        diemGuongMau,
        diemKinhTe,
        diemHoaThuan,
        tongDiem,
        ketQua,
        namDatLienTuc: body.namDatLienTuc || 1,
        deNghiKhenThuong: body.deNghiKhenThuong ?? false,
        nguoiChamDiem: "Ban điều hành Khu phố",
        ngayCham: new Date().toLocaleDateString("vi-VN"),
        ghiChu: body.ghiChu || "",
      };

      appStore.addGiaDinhVanHoa(newItem);
      return jsonCreated(newItem, "Đăng ký danh hiệu Gia đình văn hóa thành công (NĐ 86/2023)");
    } catch {
      return jsonBadRequest("Dữ liệu đầu vào không hợp lệ");
    }
  }

  // POST /api/v1/van-hoa/gia-dinh/:id/binh-xet
  const binhXetMatch = path.match(/^\/gia-dinh\/([^/]+)\/binh-xet$/);
  if (binhXetMatch && req.method === "POST") {
    const id = binhXetMatch[1]!;
    try {
      const body = await req.json() as {
        diemGuongMau: number;
        diemKinhTe: number;
        diemHoaThuan: number;
        deNghiKhenThuong?: boolean;
        ghiChu?: string;
      };

      const res = appStore.binhXetGiaDinhVanHoa({
        id,
        diemGuongMau: body.diemGuongMau,
        diemKinhTe: body.diemKinhTe,
        diemHoaThuan: body.diemHoaThuan,
        deNghiKhenThuong: body.deNghiKhenThuong,
        ghiChu: body.ghiChu,
      });

      return jsonOk(res, "Hoàn tất bình xét Gia đình văn hóa theo thang điểm 100");
    } catch {
      return jsonBadRequest("Lỗi xử lý tham số chấm điểm");
    }
  }

  // 2. Khu phố văn hóa
  // GET /api/v1/van-hoa/khu-pho
  if (path === "/khu-pho" && req.method === "GET") {
    const items = appStore.getState().khuPhoVanHoaList || initialKhuPhoVanHoaList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // 3. Di tích & Lễ hội
  // GET /api/v1/van-hoa/di-tich
  if (path === "/di-tich" && req.method === "GET") {
    const items = appStore.getState().diTichLeHoiList || initialDiTichLeHoiList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // PATCH /api/v1/van-hoa/di-tich/:id/pccc
  const diTichMatch = path.match(/^\/di-tich\/([^/]+)\/pccc$/);
  if (diTichMatch && req.method === "PATCH") {
    const id = diTichMatch[1]!;
    try {
      const body = await req.json() as { congTacPCCC: DiTichLeHoiItem["congTacPCCC"] };
      appStore.capNhatPcccDiTich(id, body.congTacPCCC || "DAM_BAO_100%");
      return jsonOk({ id, congTacPCCC: body.congTacPCCC }, "Cập nhật an toàn PCCC Di tích thành công");
    } catch {
      return jsonBadRequest("Dữ liệu không hợp lệ");
    }
  }

  // 4. Cơ sở tôn giáo
  // GET /api/v1/van-hoa/ton-giao
  if (path === "/ton-giao" && req.method === "GET") {
    const items = appStore.getState().coSoTonGiaoList || initialCoSoTonGiaoList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // POST /api/v1/van-hoa/ton-giao/:id/thong-bao
  const tonGiaoMatch = path.match(/^\/ton-giao\/([^/]+)\/thong-bao$/);
  if (tonGiaoMatch && req.method === "POST") {
    const id = tonGiaoMatch[1]!;
    appStore.dangKySinhHoatTonGiao(id);
    return jsonOk({ id, trangThai: "DA_DANG_KY_HANG_NAM" }, "Tiếp nhận thông báo hoạt động tôn giáo hàng năm thành công");
  }

  // 5. Kiểm tra cơ sở dịch vụ văn hóa (Karaoke, bar, gym, biển hiệu)
  // GET /api/v1/van-hoa/co-so-dich-vu
  if (path === "/co-so-dich-vu" && req.method === "GET") {
    const items = appStore.getState().coSoDichVuVanHoaList || initialCoSoDichVuVanHoaList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // POST /api/v1/van-hoa/co-so-dich-vu/:id/kiem-tra
  const ktMatch = path.match(/^\/co-so-dich-vu\/([^/]+)\/kiem-tra$/);
  if (ktMatch && req.method === "POST") {
    const id = ktMatch[1]!;
    try {
      const body = await req.json() as {
        ketLuan: CoSoDichVuVanHoaItem["ketLuan"];
        mucPhatVND?: number;
        noiDungXuLy?: string;
        pccc?: CoSoDichVuVanHoaItem["tinhTrangPCCC"];
      };

      appStore.kiemTraCoSoVanHoa(
        id,
        body.ketLuan || "CHUP_HANH_TOT",
        body.mucPhatVND || 0,
        body.noiDungXuLy || "Đã kiểm tra chấp hành tốt quy định",
        body.pccc || "DAT_TIEU_CHUAN"
      );

      return jsonOk({ id, ketLuan: body.ketLuan }, "Ghi nhận kết quả kiểm tra liên ngành thành công");
    } catch {
      return jsonBadRequest("Dữ liệu kiểm tra không hợp lệ");
    }
  }

  // 6. Thiết chế văn hóa & CLB
  // GET /api/v1/van-hoa/thiet-che
  if (path === "/thiet-che" && req.method === "GET") {
    const items = appStore.getState().thietCheVanHoaList || initialThietCheVanHoaList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // 7. Địa chỉ tin cậy & Phòng chống bạo lực gia đình
  // GET /api/v1/van-hoa/dia-chi-tin-cay
  if (path === "/dia-chi-tin-cay" && req.method === "GET") {
    const items = appStore.getState().diaChiTinCayList || initialDiaChiTinCayList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // POST /api/v1/van-hoa/dia-chi-tin-cay/:id/ho-tro
  const baoLucMatch = path.match(/^\/dia-chi-tin-cay\/([^/]+)\/ho-tro$/);
  if (baoLucMatch && req.method === "POST") {
    const id = baoLucMatch[1]!;
    appStore.tiepNhanBaoLucGiaDinh(id);
    return jsonOk({ id, trangThai: "DANG_HO_TRO_NAN_NHAN" }, "Tiếp nhận và kích hoạt bảo vệ khẩn cấp nạn nhân bạo lực gia đình");
  }

  // 8. Làng nghề truyền thống
  // GET /api/v1/van-hoa/lang-nghe
  if (path === "/lang-nghe" && req.method === "GET") {
    const items = appStore.getState().langNgheList;
    return jsonOk({
      total: items.length,
      di_san_quoc_gia: items.filter((l) => l.loaiDiSan === "QUOC_GIA").length,
      items,
    });
  }

  // 9. Bản đồ số GIS Văn hóa & Du lịch Thủ Dầu Một
  // GET /api/v1/van-hoa/gis-ban-do
  if (path === "/gis-ban-do" && req.method === "GET") {
    const loaiHinh = url.searchParams.get("loaiHinh");
    let items = appStore.getState().gisDiaDiemList;
    if (loaiHinh && loaiHinh !== "ALL") {
      items = items.filter((g) => g.loaiHinh === loaiHinh);
    }
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // 10. Hồ sơ Bạo lực gia đình (Luật 2022)
  // GET /api/v1/van-hoa/bao-luc-gia-dinh
  if (path === "/bao-luc-gia-dinh" && req.method === "GET") {
    const items = appStore.getState().baoLucGiaDinhList;
    return jsonOk({
      total: items.length,
      items,
    });
  }

  // POST /api/v1/van-hoa/bao-luc-gia-dinh/:id/cam-tiep-xuc
  const ctxMatch = path.match(/^\/bao-luc-gia-dinh\/([^/]+)\/cam-tiep-xuc$/);
  if (ctxMatch && req.method === "POST") {
    const id = ctxMatch[1]!;
    try {
      const body = await req.json() as { thoiHanNgay?: number };
      const res = appStore.banHanhQuyetDinhCamTiepXuc(id, body.thoiHanNgay || 3);
      return jsonOk(res, "Chủ tịch UBND Phường ban hành Quyết định cấm tiếp xúc thành công (Luật PCBLGĐ 2022)");
    } catch {
      return jsonBadRequest("Lỗi tham số quyết định cấm tiếp xúc");
    }
  }

  // 11. Thủ tục hành chính Một cửa Văn hóa (NĐ 61/2018)
  // GET /api/v1/van-hoa/tthc
  if (path === "/tthc" && req.method === "GET") {
    const items = appStore.getState().hoSoTTHCVanHoaList;
    return jsonOk({
      total: items.length,
      da_hoan_thanh: items.filter((h) => h.trangThai === "DA_HOAN_THANH").length,
      dang_xu_ly: items.filter((h) => h.trangThai !== "DA_HOAN_THANH").length,
      items,
    });
  }

  // POST /api/v1/van-hoa/tthc
  if (path === "/tthc" && req.method === "POST") {
    try {
      const body = await req.json() as {
        tenThuTuc: string;
        maThuTuc: string;
        nguoiNop: string;
        sdt: string;
        cccd: string;
        diaChi: string;
        khuPho: string;
        ngayHenTra: string;
        ketQuaVanBan: string;
      };

      if (!body.tenThuTuc || !body.nguoiNop || !body.cccd) {
        return jsonBadRequest("Thiếu thông tin bắt buộc của hồ sơ TTHC");
      }

      const newHs = appStore.tiepNhanTthcVanHoa({
        tenThuTuc: body.tenThuTuc,
        maThuTuc: body.maThuTuc || "TTHC-VH/01",
        nguoiNop: body.nguoiNop,
        sdt: body.sdt || "0908.123.456",
        cccd: body.cccd,
        diaChi: body.diaChi || "Phường Thủ Dầu Một",
        khuPho: body.khuPho || "Khu phố 1",
        ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
        ngayHenTra: body.ngayHenTra || "10 ngày làm việc",
        canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
        canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
        ketQuaVanBan: body.ketQuaVanBan || "Quyết định phê duyệt của UBND Phường",
      });

      return jsonCreated(newHs, "Tiếp nhận hồ sơ TTHC Văn hóa Một cửa thành công (Mẫu 01)");
    } catch {
      return jsonBadRequest("Dữ liệu tiếp nhận TTHC không hợp lệ");
    }
  }

  // POST /api/v1/van-hoa/tthc/:id/ky-so
  const kySoMatch = path.match(/^\/tthc\/([^/]+)\/ky-so$/);
  if (kySoMatch && req.method === "POST") {
    const id = kySoMatch[1]!;
    try {
      const body = await req.json().catch(() => ({})) as { nguoiKy?: string; chucVu?: string };
      const res = appStore.kySoTthcVanHoa(id, body.nguoiKy, body.chucVu);
      return jsonOk(res, "Lãnh đạo ký số SmartCA điện tử phê duyệt kết quả TTHC thành công");
    } catch {
      return jsonBadRequest("Lỗi xử lý chữ ký số SmartCA");
    }
  }

  // 12. Đội Kiểm tra Liên ngành 814 (Nghị định 54/2019 & Nghị định 38/2021)
  // GET /api/v1/van-hoa/kiem-tra-814
  if (path === "/kiem-tra-814" && req.method === "GET") {
    const ketLuan = url.searchParams.get("ketLuan");
    let items = appStore.getState().kiemTra814List || initialKiemTra814List;
    if (ketLuan && ketLuan !== "ALL") {
      items = items.filter((k) => k.ketLuan === ketLuan);
    }
    const tongTienPhat = items.reduce((sum, item) => sum + (item.soTienPhatVND || 0), 0);
    return jsonOk({
      total: items.length,
      chap_hanh_tot: items.filter((k) => k.ketLuan === "CHUP_HANH_TOT").length,
      nhac_nho: items.filter((k) => k.ketLuan === "NHAC_NHO").length,
      phat_tien: items.filter((k) => k.ketLuan === "PHAT_TIEN").length,
      dinh_chi: items.filter((k) => k.ketLuan === "DINH_CHI_HOAT_DONG").length,
      tong_tien_phat_vnd: tongTienPhat,
      items,
    });
  }

  // POST /api/v1/van-hoa/kiem-tra-814
  if (path === "/kiem-tra-814" && req.method === "POST") {
    try {
      const body = await req.json() as Partial<KiemTra814Item>;
      if (!body.tenCoSo || !body.loaiHinh) {
        return jsonBadRequest("Vui lòng cung cấp tên cơ sở và loại hình kinh doanh (Karaoke/Internet/Quảng cáo)");
      }
      const newItem: KiemTra814Item = {
        id: `814-${Date.now().toString().slice(-4)}`,
        tenCoSo: body.tenCoSo,
        diaChi: body.diaChi || "Khu phố 1, Phường Thủ Dầu Một",
        loaiHinh: body.loaiHinh,
        ngayKiemTra: body.ngayKiemTra || new Date().toISOString().split("T")[0],
        thanhPhanDoan: body.thanhPhanDoan || ["Công an Phường", "Công chức VH-XH", "Bảo vệ dân phố"],
        noiDungKiemTra: body.noiDungKiemTra || "Kiểm tra chấp hành quy chế văn hóa và an toàn PCCC",
        ketLuan: body.ketLuan || "CHUP_HANH_TOT",
        soTienPhatVND: body.soTienPhatVND || 0,
        bienPhapKhac: body.bienPhapKhac,
        daNopPhat: body.daNopPhat ?? (body.soTienPhatVND ? false : true),
        nguoiLapBienBan: body.nguoiLapBienBan || "Tổ trưởng Đội 814",
      };
      appStore.themKiemTra814(newItem);
      return jsonCreated(newItem, "Lập biên bản kiểm tra Đội 814 liên ngành thành công");
    } catch {
      return jsonBadRequest("Dữ liệu biên bản kiểm tra không hợp lệ");
    }
  }

  // POST /api/v1/van-hoa/kiem-tra-814/:id/xu-ly
  const xuLy814Match = path.match(/^\/kiem-tra-814\/([^/]+)\/xu-ly$/);
  if (xuLy814Match && req.method === "POST") {
    const id = xuLy814Match[1]!;
    try {
      const body = await req.json() as {
        ketLuan: KiemTra814Item["ketLuan"];
        soTienPhatVND?: number;
        bienPhapKhac?: string;
        daNopPhat?: boolean;
      };
      appStore.xuLyViPham814(id, body);
      return jsonOk({ id, ...body }, "Cập nhật quyết định xử lý vi phạm Đội 814 thành công");
    } catch {
      return jsonBadRequest("Dữ liệu xử lý vi phạm không hợp lệ");
    }
  }

  // 13. Đô thị Văn minh Chuẩn Quốc gia (Quyết định 04/2022/QĐ-TTg)
  // GET /api/v1/van-hoa/do-thi-van-minh
  if (path === "/do-thi-van-minh" && req.method === "GET") {
    const items = appStore.getState().doThiVanMinhList || initialDoThiVanMinhList;
    const datChuanCount = items.filter((t) => t.datChuan).length;
    const tongDiemToiDa = items.reduce((sum, item) => sum + item.diemToiDa, 0);
    const tongDiemDanhGia = items.reduce((sum, item) => sum + item.diemDanhGia, 0);
    const tyLeDatChuanPercent = Number(((datChuanCount / items.length) * 100).toFixed(1));
    return jsonOk({
      total_tieu_chi: items.length,
      dat_chuan_count: datChuanCount,
      chua_dat_count: items.length - datChuanCount,
      ty_le_dat_chuan_percent: tyLeDatChuanPercent,
      tong_diem_danh_gia: tongDiemDanhGia,
      tong_diem_toi_da: tongDiemToiDa,
      du_dieu_kien_cong_nhan: datChuanCount === items.length,
      items,
    });
  }

  // POST /api/v1/van-hoa/do-thi-van-minh/:id/danh-gia
  const danhGiaDtvmMatch = path.match(/^\/do-thi-van-minh\/([^/]+)\/danh-gia$/);
  if (danhGiaDtvmMatch && req.method === "POST") {
    const id = danhGiaDtvmMatch[1]!;
    try {
      const body = await req.json() as {
        datChuan: boolean;
        diemDanhGia: number;
        ghiChu?: string;
        nguoiDanhGia?: string;
      };
      appStore.danhGiaDoThiVanMinh(id, body);
      return jsonOk({ id, ...body }, "Cập nhật đánh giá Tiêu chí Đô thị văn minh QĐ 04/2022 thành công");
    } catch {
      return jsonBadRequest("Dữ liệu đánh giá tiêu chí không hợp lệ");
    }
  }

  // 14. NGHỆ NHÂN DI SẢN VĂN HÓA PHI VẬT THỂ (NĐ 109/2015)
  // GET /api/v1/van-hoa/nghe-nhan-di-san
  if (path === "/nghe-nhan-di-san" && req.method === "GET") {
    const list = appStore.getState().ngheNhanDiSanList;
    return jsonOk({
      total: list.length,
      nghe_nhan_uu_tu: list.filter((n) => n.danhHieu === "NGHE_NHAN_UU_TU").length,
      nghe_nhan_nhan_dan: list.filter((n) => n.danhHieu === "NGHE_NHAN_NHAN_DAN").length,
      nghe_nhan_dan_gian: list.filter((n) => n.danhHieu === "NGHE_NHAN_DAN_GIAN").length,
      tong_tro_cap_thang_vnd: list.reduce((sum, n) => sum + (n.mucTroCapThangVND || 0), 0),
      items: list,
    }, "Lấy danh sách Nghệ nhân Di sản thành công");
  }

  // POST /api/v1/van-hoa/nghe-nhan-di-san
  if (path === "/nghe-nhan-di-san" && req.method === "POST") {
    try {
      const body = await req.json();
      if (!body.hoTen || !body.loaiHinhDiSan) {
        return jsonBadRequest("Vui lòng cung cấp họ tên và loại hình di sản");
      }
      appStore.themNgheNhanDiSan(body);
      const latest = appStore.getState().ngheNhanDiSanList[0];
      return jsonCreated(latest, "Ghi nhận thông tin Nghệ nhân di sản thành công");
    } catch {
      return jsonBadRequest("Dữ liệu nghệ nhân không hợp lệ");
    }
  }

  // 15. QUẢN LÝ CƠ SỞ KINH DOANH THỂ DỤC THỂ THAO & BỂ BƠI (NĐ 36/2019 & TT 04/2018)
  // GET /api/v1/van-hoa/co-so-the-thao
  if (path === "/co-so-the-thao" && req.method === "GET") {
    const list = appStore.getState().coSoTheThaoList;
    const datChuan = list.filter((c) => c.ketQuaKiemTra === "DAT_CHUAN").length;
    return jsonOk({
      total: list.length,
      be_boi_count: list.filter((c) => c.loaiHinh === "BE_BOI").length,
      phong_gym_count: list.filter((c) => c.loaiHinh === "PHONG_GYM_FITNESS").length,
      dat_chuan_count: datChuan,
      can_khac_phuc_count: list.length - datChuan,
      items: list,
    }, "Lấy danh sách cơ sở kinh doanh thể dục thể thao thành công");
  }

  // POST /api/v1/van-hoa/co-so-the-thao
  if (path === "/co-so-the-thao" && req.method === "POST") {
    try {
      const body = await req.json();
      if (!body.tenCoSo || !body.loaiHinh) {
        return jsonBadRequest("Vui lòng cung cấp tên cơ sở và loại hình thể thao");
      }
      appStore.themCoSoTheThao(body);
      const latest = appStore.getState().coSoTheThaoList[0];
      return jsonCreated(latest, "Đăng ký cơ sở thể thao thành công");
    } catch {
      return jsonBadRequest("Dữ liệu cơ sở thể thao không hợp lệ");
    }
  }

  // POST /api/v1/van-hoa/co-so-the-thao/:id/kiem-tra
  const csKiemTraMatch = path.match(/^\/co-so-the-thao\/([^/]+)\/kiem-tra$/);
  if (csKiemTraMatch && req.method === "POST") {
    const id = csKiemTraMatch[1]!;
    try {
      const body = await req.json();
      appStore.kiemTraCoSoTheThao(id, body.ketQua, body.ghiChu);
      const updated = appStore.getState().coSoTheThaoList.find((c) => c.id === id);
      return jsonOk(updated, "Cập nhật kết quả kiểm tra điều kiện hoạt động TDTT thành công");
    } catch {
      return jsonBadRequest("Dữ liệu kiểm tra thể thao không hợp lệ");
    }
  }

  // KPI tổng hợp mảng Văn hóa & Xã hội
  // GET /api/v1/van-hoa/kpi
  if (path === "/kpi" && req.method === "GET") {
    const gd = appStore.getState().giaDinhVanHoaList || initialGiaDinhVanHoaList;
    const kp = appStore.getState().khuPhoVanHoaList || initialKhuPhoVanHoaList;
    const dt = appStore.getState().diTichLeHoiList || initialDiTichLeHoiList;
    const cs = appStore.getState().coSoDichVuVanHoaList || initialCoSoDichVuVanHoaList;
    const dc = appStore.getState().diaChiTinCayList || initialDiaChiTinCayList;
    const ln = appStore.getState().langNgheList;
    const bl = appStore.getState().baoLucGiaDinhList;
    const th = appStore.getState().hoSoTTHCVanHoaList;
    const doi814 = appStore.getState().kiemTra814List || initialKiemTra814List;
    const dtvm = appStore.getState().doThiVanMinhList || initialDoThiVanMinhList;

    const datGdvCount = gd.filter((g) => g.ketQua === "DAT_CHUAN").length;
    const tyLeGdv = gd.length ? Number(((datGdvCount / gd.length) * 100).toFixed(1)) : 0;
    const viPhamCount = cs.filter((c) => c.ketLuan === "LAP_BIEN_BAN_XU_PHAT" || c.ketLuan === "TAM_DINH_CHI").length;
    const dtvmDat = dtvm.filter((t) => t.datChuan).length;

    return jsonOk({
      gia_dinh_van_hoa: {
        tong_so_ho: gd.length,
        dat_chuan: datGdvCount,
        ty_le_dat: tyLeGdv,
        khen_thuong: gd.filter((g) => g.deNghiKhenThuong).length,
      },
      khu_pho_van_hoa: {
        tong_so_khu_pho: kp.length,
        khu_pho_xuat_sac: kp.filter((k) => k.danhHieu === "KHU_PHO_VAN_HOA_XUAT_SAC").length,
        tuyen_duong_van_minh_count: kp.length,
      },
      di_tich_le_hoi: {
        tong_so_di_tich: dt.length,
        di_tich_quoc_gia: dt.filter((d) => d.phanLoai === "DI_TICH_QUOC_GIA").length,
        le_hoi_chua_ba_luot_khach: 1500000,
        so_hoa_qr_rate: 100,
      },
      lang_nghe_truyen_thong: {
        tong_lang_nghe: ln.length,
        di_san_quoc_gia: ln.filter((l) => l.loaiDiSan === "QUOC_GIA").length,
      },
      kiem_tra_dich_vu: {
        tong_so_co_so: cs.length,
        co_so_chap_hanh_tot: cs.filter((c) => c.ketLuan === "CHUP_HANH_TOT").length,
        so_co_so_vi_pham: viPhamCount,
      },
      doi_kiem_tra_814: {
        tong_luot_kiem_tra: doi814.length,
        phat_tien_count: doi814.filter((k) => k.ketLuan === "PHAT_TIEN").length,
        tong_tien_phat_vnd: doi814.reduce((s, k) => s + (k.soTienPhatVND || 0), 0),
      },
      do_thi_van_minh_qd04: {
        tong_tieu_chi: dtvm.length,
        dat_chuan: dtvmDat,
        ty_le_dat: Number(((dtvmDat / dtvm.length) * 100).toFixed(1)),
        du_dieu_kien: dtvmDat === dtvm.length,
      },
      phong_chong_bao_luc_gia_dinh: {
        tong_dia_chi_tin_cay: dc.length,
        tong_vu_viec_blgd: bl.length,
        quyet_dinh_cam_tiep_xuc: bl.filter((b) => b.bienPhapBaoVe === "CAM_TIEP_XUC_UBND").length,
      },
      tthc_mot_cua_van_hoa: {
        tong_ho_so: th.length,
        da_hoan_thanh: th.filter((h) => h.trangThai === "DA_HOAN_THANH").length,
      },
    }, "Lấy KPI tổng hợp Mảng Văn hóa - Thể thao & Đời sống văn minh thành công");
  }

  return jsonNotFound("Endpoint phân hệ Văn hóa - Thể thao không tồn tại");
}
