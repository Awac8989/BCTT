/**
 * BACKEND CONTROLLER - PHÂN HỆ LAO ĐỘNG, NGƯỜI CÓ CÔNG & AN SINH XÃ HỘI
 * UBND Phường Phú Cường / TP. Thủ Dầu Một
 * Endpoints: /api/v1/an-sinh/*
 */

import { jsonOk, jsonCreated, jsonBadRequest, jsonNotFound } from "../utils/response";
import { appStore } from "@/services/app-state";
import {
  type DoiTuongBaoTroXaHoi,
  type HoGheoCanGheoItem,
  type CungCauLaoDongItem,
  type TreEmHoanCanhDacBiet,
  type HoSoPhongChongTeNan,
  type HoSoCuuTroDotXuat,
  type HoSoTTHCAnSinhItem,
  initialBaoTroList,
  initialCuuTroList,
  initialHoGheoList,
  initialCungCauLaoDongList,
  initialATLaoDongList,
  initialTreEmList,
  initialTeNanList,
  initialHoSoTTHCAnSinhList,
} from "../../data/domain-mock";

// In-memory controller state
let baoTroState: DoiTuongBaoTroXaHoi[] = [...initialBaoTroList];
let hoGheoState: HoGheoCanGheoItem[] = [...initialHoGheoList];
let cungCauState: CungCauLaoDongItem[] = [...initialCungCauLaoDongList];
let treEmState: TreEmHoanCanhDacBiet[] = [...initialTreEmList];
let teNanState: HoSoPhongChongTeNan[] = [...initialTeNanList];
let cuuTroState: HoSoCuuTroDotXuat[] = [...initialCuuTroList];
let tthcAnSinhState: HoSoTTHCAnSinhItem[] = [...initialHoSoTTHCAnSinhList];

export function resetAnSinhBackendState() {
  baoTroState = [...initialBaoTroList];
  hoGheoState = [...initialHoGheoList];
  cungCauState = [...initialCungCauLaoDongList];
  treEmState = [...initialTreEmList];
  teNanState = [...initialTeNanList];
  cuuTroState = [...initialCuuTroList];
  tthcAnSinhState = [...initialHoSoTTHCAnSinhList];
}

export async function handleAnSinhRoutes(request: Request, url: URL): Promise<Response> {
  const pathname = url.pathname;
  const method = request.method;

  // 1. Bảo trợ xã hội (NĐ 20/2021)
  if (pathname === "/api/v1/an-sinh/bao-tro") {
    if (method === "GET") {
      const khuPho = url.searchParams.get("khuPho");
      const loai = url.searchParams.get("loaiDoiTuong");
      let filtered = baoTroState;
      if (khuPho && khuPho !== "ALL") filtered = filtered.filter((b) => b.khuPho === khuPho);
      if (loai && loai !== "ALL") filtered = filtered.filter((b) => b.loaiDoiTuong === loai);
      return jsonOk({ items: filtered, total: filtered.length });
    }

    if (method === "POST") {
      const body = (await request.json()) as Partial<DoiTuongBaoTroXaHoi>;
      if (!body.hoTen || !body.cccd) {
        return jsonBadRequest("Họ tên và số CCCD là bắt buộc.");
      }
      const newItem: DoiTuongBaoTroXaHoi = {
        id: `BTXH-${Math.floor(100 + Math.random() * 900)}`,
        hoTen: body.hoTen.trim(),
        cccd: body.cccd.trim(),
        ngaySinh: body.ngaySinh || "1950-01-01",
        gioiTinh: body.gioiTinh || "Nam",
        khuPho: body.khuPho || "Khu phố 1",
        diaChi: body.diaChi || "Phường Phú Cường",
        loaiDoiTuong: body.loaiDoiTuong || "NGUOI_CAO_TUOI_80",
        tenLoaiDoiTuong: body.tenLoaiDoiTuong || "Người cao tuổi đủ 80 tuổi (NĐ 20/2021)",
        heSoHuong: body.heSoHuong || 1.0,
        mucTroCapHangThang: body.mucTroCapHangThang || 540_000,
        hinhThucNhan: body.hinhThucNhan || "NGAN_HANG",
        thongTinChiTra: body.thongTinChiTra || "Vietcombank - Đề án 06",
        soQuyetDinh: `QĐ-UBND-${Math.floor(100 + Math.random() * 900)}/2026`,
        ngayHieuLuc: new Date().toLocaleDateString("vi-VN"),
        trangThai: "DANG_HUONG",
      };
      baoTroState = [newItem, ...baoTroState];
      return jsonCreated(newItem, "Tiếp nhận hồ sơ bảo trợ xã hội và ban hành quyết định thành công");
    }
  }

  // Thôi hưởng bảo trợ
  if (pathname.match(/^\/api\/v1\/an-sinh\/bao-tro\/([^/]+)\/thoi-huong$/) && method === "POST") {
    const id = pathname.split("/")[5];
    const body = (await request.json()) as { lyDo: string; soQuyetDinh: string };
    const item = baoTroState.find((b) => b.id === id);
    if (!item) return jsonNotFound(`Không tìm thấy đối tượng BTXH mã ${id}`);
    item.trangThai = "THOI_HUONG";
    item.thongTinChiTra = `Đã thôi hưởng: ${body.lyDo}`;
    item.soQuyetDinh = body.soQuyetDinh;
    return jsonOk(item, "Ban hành quyết định thôi hưởng trợ cấp thành công");
  }

  // 2. Rà soát Hộ nghèo (QĐ 24/2021)
  if (pathname === "/api/v1/an-sinh/ho-ngheo" && method === "GET") {
    return jsonOk({ items: hoGheoState, total: hoGheoState.length });
  }

  if (pathname.match(/^\/api\/v1\/an-sinh\/ho-ngheo\/([^/]+)\/cham-diem$/) && method === "POST") {
    const id = pathname.split("/")[5];
    const body = (await request.json()) as {
      phanLoai: HoGheoCanGheoItem["phanLoai"];
      chieuThieuHut: string[];
      soTienVayCSXHVND?: number;
    };
    const item = hoGheoState.find((h) => h.id === id);
    if (!item) return jsonNotFound(`Không tìm thấy hộ gia đình mã ${id}`);
    item.phanLoai = body.phanLoai;
    item.chieuThieuHut = body.chieuThieuHut;
    if (body.soTienVayCSXHVND !== undefined) item.soTienVayCSXHVND = body.soTienVayCSXHVND;
    return jsonOk(item, "Cập nhật kết quả rà soát chấm điểm hộ nghèo thành công");
  }

  // 3. Cung cầu lao động & Việc làm
  if (pathname === "/api/v1/an-sinh/cung-cau" && method === "GET") {
    return jsonOk({
      cungCau: cungCauState,
      atLaoDong: initialATLaoDongList,
    });
  }

  if (pathname.match(/^\/api\/v1\/an-sinh\/cung-cau\/([^/]+)\/ket-noi$/) && method === "POST") {
    const id = pathname.split("/")[5];
    const body = (await request.json()) as { doanhNghiepTuyenDung: string; mucLuongKyVong: string };
    const item = cungCauState.find((c) => c.id === id);
    if (!item) return jsonNotFound(`Không tìm thấy hồ sơ người lao động mã ${id}`);
    item.tinhTrangViecLam = "DA_KET_NOI_VIEC_LAM";
    item.doanhNghiepTuyenDung = body.doanhNghiepTuyenDung;
    item.mucLuongKyVong = body.mucLuongKyVong;
    item.ngayCapNhat = new Date().toLocaleDateString("vi-VN");
    return jsonOk(item, "Kết nối việc làm cho người lao động thành công");
  }

  // 4. Trẻ em hoàn cảnh đặc biệt
  if (pathname === "/api/v1/an-sinh/tre-em" && method === "GET") {
    return jsonOk({ items: treEmState, total: treEmState.length });
  }

  if (pathname.match(/^\/api\/v1\/an-sinh\/tre-em\/([^/]+)\/can-thiep$/) && method === "POST") {
    const id = pathname.split("/")[5];
    const body = (await request.json()) as { noiDungCanThiep: string };
    const item = treEmState.find((t) => t.id === id);
    if (!item) return jsonNotFound(`Không tìm thấy hồ sơ trẻ em mã ${id}`);
    item.chinhSachTroCap = body.noiDungCanThiep;
    item.daDuocTangHocBong = true;
    item.ghiChuTheoDoi = `Kế hoạch can thiệp phê duyệt ngày ${new Date().toLocaleDateString("vi-VN")}: ${body.noiDungCanThiep}`;
    return jsonOk(item, "Ban hành kế hoạch hỗ trợ can thiệp trẻ em thành công");
  }

  // 5. Phòng chống Tệ nạn xã hội
  if (pathname === "/api/v1/an-sinh/te-nan" && method === "GET") {
    return jsonOk({ items: teNanState, total: teNanState.length });
  }

  if (pathname.match(/^\/api\/v1\/an-sinh\/te-nan\/([^/]+)\/xet-nghiem$/) && method === "POST") {
    const id = pathname.split("/")[5];
    const body = (await request.json()) as { ketQua: "AM_TINH" | "DUONG_TINH"; hoTroMoi?: string };
    const item = teNanState.find((t) => t.id === id);
    if (!item) return jsonNotFound(`Không tìm thấy hồ sơ quản lý tệ nạn mã ${id}`);
    item.ketQuaXetNghiemDinhKy = body.ketQua;
    if (body.hoTroMoi) item.hoTroViecLam = body.hoTroMoi;
    item.ngayCapNhat = new Date().toLocaleDateString("vi-VN");
    return jsonOk(item, "Cập nhật kết quả xét nghiệm định kỳ thành công");
  }

  // 6. Cứu trợ đột xuất
  if (pathname === "/api/v1/an-sinh/cuu-tro") {
    if (method === "GET") {
      return jsonOk({ items: cuuTroState, total: cuuTroState.length });
    }

    if (method === "POST") {
      const body = (await request.json()) as Partial<HoSoCuuTroDotXuat>;
      const newItem: HoSoCuuTroDotXuat = {
        id: `CT-DX-${Math.floor(10 + Math.random() * 90)}`,
        hoTenChuHo: body.hoTenChuHo || "Chủ hộ",
        cccd: body.cccd || "074099001122",
        khuPho: body.khuPho || "Khu phố 1",
        diaChi: body.diaChi || "Phường Phú Cường",
        loaiSuCo: body.loaiSuCo || "HOA_HOAN_CHAY_NHA",
        moTaThietHai: body.moTaThietHai || "Sự cố rủi ro đột xuất",
        ngayXayRa: new Date().toLocaleDateString("vi-VN"),
        hinhThucCuuTro: body.hinhThucCuuTro || "TIEN_MAT_VA_GAO",
        soTienHoTroVND: body.soTienHoTroVND || 10_000_000,
        soKgGao: body.soKgGao || 30,
        trangThai: "DA_CHI_TRA",
        ngayPheDuyet: new Date().toLocaleDateString("vi-VN"),
        nguoiPheDuyet: "Chủ tịch UBND Phường",
      };
      cuuTroState = [newItem, ...cuuTroState];
      return jsonCreated(newItem, "Phê duyệt và phát tiền/gạo cứu trợ đột xuất thành công");
    }
  }

  // 7. TTHC Một cửa An Sinh & Ký số SmartCA
  if (pathname === "/api/v1/an-sinh/tthc") {
    if (method === "GET") {
      return jsonOk({ items: tthcAnSinhState, total: tthcAnSinhState.length });
    }

    if (method === "POST") {
      const body = (await request.json()) as Partial<HoSoTTHCAnSinhItem>;
      const newItem: HoSoTTHCAnSinhItem = {
        id: `HSO-AS-${Math.floor(10 + Math.random() * 90)}`,
        maHoSo: `HSO-TTHC-AS-2026-${Math.floor(100 + Math.random() * 900)}`,
        tenThuTuc: body.tenThuTuc || "Thủ tục trợ cấp bảo trợ xã hội",
        maThuTuc: body.maThuTuc || "TDM-AS-01",
        nguoiNop: body.nguoiNop || "Công dân",
        cccd: body.cccd || "074099001122",
        soDienThoai: body.soDienThoai || "0900.000.000",
        khuPho: body.khuPho || "Khu phố 1",
        diaChi: body.diaChi || "Phường Phú Cường",
        doiTuongThuHuong: body.doiTuongThuHuong || "Đối tượng thụ hưởng",
        loaiDoiTuong: body.loaiDoiTuong || "Bảo trợ xã hội",
        mucTienHoTroVND: body.mucTienHoTroVND || 540_000,
        ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
        ngayHenTra: new Date(Date.now() + 3 * 24 * 3600 * 1000).toLocaleDateString("vi-VN"),
        hinhThucNop: body.hinhThucNop || "TRUC_TIEP_MOT_CUA",
        trangThai: "CHO_THAM_DINH",
        canBoTiepNhan: "Võ Hoàng Nam (Cán bộ Một cửa)",
        canBoThuLy: "Lê Hoàng Nam (Công chức Văn hóa - Xã hội)",
        thanhPhanHoSo: body.thanhPhanHoSo || [
          { tenGiayTo: "Tờ khai đề nghị theo mẫu quy định", batBuoc: true, daNop: true },
          { tenGiayTo: "Bản sao CCCD định danh mức độ 2", batBuoc: true, daNop: true },
        ],
      };
      tthcAnSinhState = [newItem, ...tthcAnSinhState];
      return jsonCreated(newItem, "Tiếp nhận hồ sơ Một cửa ngành An sinh Xã hội thành công (Mẫu 01)");
    }
  }

  if (pathname.match(/^\/api\/v1\/an-sinh\/tthc\/([^/]+)\/ky-so$/) && method === "POST") {
    const id = pathname.split("/")[5];
    const body = (await request.json()) as NonNullable<HoSoTTHCAnSinhItem["quyetDinhKySo"]>;
    const item = tthcAnSinhState.find((h) => h.id === id);
    if (!item) return jsonNotFound(`Không tìm thấy hồ sơ TTHC mã ${id}`);
    item.trangThai = "DA_KY_SO";
    item.quyetDinhKySo = body;
    return jsonOk(item, "Lãnh đạo ký số SmartCA điện tử phê duyệt hồ sơ thành công");
  }

  // 8. ĐIỀU DƯỠNG NGƯỜI CÓ CÔNG (PHÁP LỆNH 02/2020)
  // GET /api/v1/an-sinh/dieu-duong-ncc
  if (method === "GET" && pathname === "/api/v1/an-sinh/dieu-duong-ncc") {
    const list = appStore.getState().dieuDuongNccList;
    const khuPho = url.searchParams.get("khuPho");
    const trangThai = url.searchParams.get("trangThai");
    let items = list;
    if (khuPho && khuPho !== "ALL") items = items.filter((d) => d.khuPho === khuPho);
    if (trangThai && trangThai !== "ALL") items = items.filter((d) => d.trangThai === trangThai);
    return jsonOk({
      total: items.length,
      tong_ncc_nam_2026: items.length,
      tap_trung_count: items.filter((d) => d.hinhThucDangKy === "TAP_TRUNG").length,
      tai_nha_count: items.filter((d) => d.hinhThucDangKy === "TAI_NHA").length,
      tong_kinh_phi_vnd: items.reduce((acc, d) => acc + d.kinhPhiVND, 0),
      items,
    }, "Lấy danh sách điều dưỡng Người có công thành công");
  }

  // POST /api/v1/an-sinh/dieu-duong-ncc - Đăng ký hồ sơ điều dưỡng mới
  if (method === "POST" && pathname === "/api/v1/an-sinh/dieu-duong-ncc") {
    const body = await request.json();
    if (!body.hoTen || !body.cccd) return jsonBadRequest("Vui lòng cung cấp họ tên và số CCCD");
    const hinhThucDangKy = body.hinhThucDangKy || body.hinhThuc || "TAI_NHA";
    const kinhPhiVND = body.kinhPhiVND || (hinhThucDangKy === "TAP_TRUNG" ? 4363000 : 2181500);
    const payload: any = {
      hoTen: body.hoTen,
      namSinh: body.namSinh || 1950,
      cccd: body.cccd,
      khuPho: body.khuPho || "Khu phố 1",
      dienDoiTuong: body.dienDoiTuong || (body.doiTuongNcc === "THUONG_BINH" ? "THUONG_BINH_21_80" : "BENH_BINH"),
      cheDoDieuDuong: body.cheDoDieuDuong || body.chuKyDieuDuong || "2_NAM_1_LAN",
      namThucHienGanNhat: body.namThucHienGanNhat || 2024,
      namHienTai: 2026,
      hinhThucDangKy,
      kinhPhiVND,
      mucChiVND: kinhPhiVND,
      trangThai: "CHO_DUYET",
    };
    appStore.dangKyDieuDuongNcc(payload);
    const latest = {
      ...appStore.getState().dieuDuongNccList[0],
      mucChiVND: kinhPhiVND,
    };
    return jsonCreated(latest, "Đăng ký hồ sơ điều dưỡng thành công");
  }

  // POST /api/v1/an-sinh/dieu-duong-ncc/:id/phe-duyet
  const ddPheDuyetMatch = pathname.match(/^\/api\/v1\/an-sinh\/dieu-duong-ncc\/([^/]+)\/phe-duyet$/);
  if (method === "POST" && ddPheDuyetMatch) {
    const id = ddPheDuyetMatch[1];
    const body = await request.json();
    appStore.pheDuyetDieuDuongNcc(id, {
      soQuyetDinh: body.soQuyetDinh || `QĐ-SLDTBXH-${Date.now().toString().slice(-3)}/2026`,
      hinhThuc: body.hinhThuc,
    });
    const updated = appStore.getState().dieuDuongNccList.find((d) => d.id === id);
    return jsonOk(updated, "Phê duyệt chế độ điều dưỡng thành công");
  }

  // POST /api/v1/an-sinh/dieu-duong-ncc/:id/chi-tra
  const ddChiTraMatch = pathname.match(/^\/api\/v1\/an-sinh\/dieu-duong-ncc\/([^/]+)\/chi-tra$/);
  if (method === "POST" && ddChiTraMatch) {
    const id = ddChiTraMatch[1];
    appStore.chiTraDieuDuongNcc(id);
    const updated = appStore.getState().dieuDuongNccList.find((d) => d.id === id);
    return jsonOk(updated, "Hoàn tất chi trả kinh phí điều dưỡng");
  }

  // 9. KHẢO SÁT HỌC NGHỀ & VIỆC LÀM KCN
  // GET /api/v1/an-sinh/khao-sat-hoc-nghe
  if (method === "GET" && pathname === "/api/v1/an-sinh/khao-sat-hoc-nghe") {
    const list = appStore.getState().khaoSatHocNgheList;
    return jsonOk({
      total: list.length,
      items: list,
    }, "Lấy danh sách khảo sát học nghề thành công");
  }

  // POST /api/v1/an-sinh/khao-sat-hoc-nghe
  if (method === "POST" && pathname === "/api/v1/an-sinh/khao-sat-hoc-nghe") {
    const body = await request.json();
    const nguyenVong = body.nguyenVongHocNghe || body.nhuCauHocNghe;
    if (!body.hoTen || !nguyenVong) return jsonBadRequest("Vui lòng cung cấp họ tên và nguyện vọng học nghề");
    const payload: any = {
      hoTen: body.hoTen,
      namSinh: body.namSinh || 2000,
      cccd: body.cccd || "074000000000",
      khuPho: body.khuPho || "Khu phố 1",
      dienDoiTuong: body.dienDoiTuong || body.doiTuong || "BO_DOI_XUAT_NGU",
      nguyenVongHocNghe: nguyenVong,
      trinhDoHocVan: body.trinhDoHocVan || body.trinhDoHienTai || "12/12",
      chinhSachHoTro: body.chinhSachHoTro || "Hỗ trợ học phí & giới thiệu KCN",
      doanhNghiepLienKet: body.doanhNghiepLienKet || body.nguyenVongViecLam || "Doanh nghiệp KCN VSIP 1",
      tinhTrang: body.tinhTrang || "DA_KHAO_SAT",
    };
    appStore.themKhaoSatHocNghe(payload);
    const latest = appStore.getState().khaoSatHocNgheList[0];
    return jsonCreated(latest, "Tiếp nhận phiếu khảo sát học nghề thành công");
  }

  // 10. TRỢ CẤP THỜ CÚNG LIỆT SĨ (NĐ 131/2021)
  if (method === "GET" && pathname === "/api/v1/an-sinh/tho-cung-liet-si") {
    const list = appStore.getState().thoCungLietSiList;
    const daChiTra = list.filter((i) => i.trangThaiChiTra === "DA_CHI_TRA").length;
    const tongKinhPhi = list.reduce((acc, i) => acc + (i.dinhMucNamVND || 1400000), 0);
    return jsonOk({
      total: list.length,
      da_chi_tra: daChiTra,
      cho_chi_tra: list.length - daChiTra,
      tong_kinh_phi_vnd: tongKinhPhi,
      dinh_muc_chuan_vnd: 1400000,
      items: list,
    }, "Lấy danh sách thờ cúng liệt sĩ thành công");
  }

  if (method === "POST" && pathname === "/api/v1/an-sinh/tho-cung-liet-si") {
    const body = await request.json();
    if (!body.hoTenLietSi || !body.hoTenNguoiThoCung) {
      return jsonBadRequest("Vui lòng cung cấp tên liệt sĩ và người thờ cúng");
    }
    appStore.dangKyThoCungLietSi(body);
    const latest = appStore.getState().thoCungLietSiList[0];
    return jsonCreated(latest, "Tiếp nhận hồ sơ thờ cúng liệt sĩ thành công");
  }

  const tcChiTraMatch = pathname.match(/^\/api\/v1\/an-sinh\/tho-cung-liet-si\/([^/]+)\/chi-tra$/);
  if (method === "POST" && tcChiTraMatch) {
    const id = tcChiTraMatch[1];
    const body = await request.json().catch(() => ({}));
    appStore.chiTraThoCungLietSi(id, body.hinhThuc);
    const updated = appStore.getState().thoCungLietSiList.find((i) => i.id === id);
    return jsonOk(updated, "Chi trả trợ cấp thờ cúng liệt sĩ thành công");
  }

  // 11. HỘI ĐỒNG XÁC ĐỊNH MỨC ĐỘ KHUYẾT TẬT (TT 01/2019)
  if (method === "GET" && pathname === "/api/v1/an-sinh/hoi-dong-khuyet-tat") {
    const list = appStore.getState().hoiDongKhuyetTatList;
    return jsonOk({
      total: list.length,
      dac_biet_nang: list.filter((i) => i.mucDoKhuyetTat === "DAC_BIET_NANG").length,
      nang: list.filter((i) => i.mucDoKhuyetTat === "NANG").length,
      nhe: list.filter((i) => i.mucDoKhuyetTat === "NHE").length,
      da_cap_giay: list.filter((i) => i.trangThaiCapGiay === "DA_CAP_GIAY").length,
      items: list,
    }, "Lấy danh sách hồ sơ Hội đồng xét duyệt khuyết tật thành công");
  }

  if (method === "POST" && pathname === "/api/v1/an-sinh/hoi-dong-khuyet-tat") {
    const body = await request.json();
    if (!body.hoTen || !body.dangTat) {
      return jsonBadRequest("Vui lòng cung cấp họ tên và dạng tật");
    }
    appStore.hopHoiDongKhuyetTat(body);
    const latest = appStore.getState().hoiDongKhuyetTatList[0];
    return jsonCreated(latest, "Ghi nhận hồ sơ xét duyệt khuyết tật thành công");
  }

  const hdktCapGiayMatch = pathname.match(/^\/api\/v1\/an-sinh\/hoi-dong-khuyet-tat\/([^/]+)\/cap-giay$/);
  if (method === "POST" && hdktCapGiayMatch) {
    const id = hdktCapGiayMatch[1];
    const body = await request.json().catch(() => ({}));
    appStore.capGiayXacNhanKhuyetTat(id, body.soGiay, body.ketLuan);
    const updated = appStore.getState().hoiDongKhuyetTatList.find((i) => i.id === id);
    return jsonOk(updated, "Cấp Giấy xác nhận mức độ khuyết tật thành công");
  }

  // 12. QUỸ ĐỀN ƠN ĐÁP NGHĨA (NĐ 45/2017)
  if (method === "GET" && pathname === "/api/v1/an-sinh/quy-den-on") {
    const list = appStore.getState().quyDenOnList;
    const tongThu = list.filter((i) => i.loaiGiaoDich === "THU_QUY").reduce((acc, i) => acc + (i.soTienVND || 0), 0);
    const tongChi = list.filter((i) => i.loaiGiaoDich === "CHI_HO_TRO").reduce((acc, i) => acc + (i.soTienVND || 0), 0);
    return jsonOk({
      total_giao_dich: list.length,
      tong_thu_vnd: tongThu,
      tong_chi_vnd: tongChi,
      ton_quy_vnd: tongThu - tongChi,
      items: list,
    }, "Lấy sổ theo dõi Quỹ Đền ơn đáp nghĩa thành công");
  }

  if (method === "POST" && pathname === "/api/v1/an-sinh/quy-den-on") {
    const body = await request.json();
    if (!body.noiDung || !body.soTienVND) {
      return jsonBadRequest("Vui lòng cung cấp nội dung và số tiền giao dịch");
    }
    appStore.dongGopQuyDenOn(body);
    const latest = appStore.getState().quyDenOnList[0];
    return jsonCreated(latest, "Ghi nhận giao dịch Quỹ Đền ơn đáp nghĩa thành công");
  }

  // 13. HỖ TRỢ NHÀ TÌNH NGHĨA & ĐẠI ĐOÀN KẾT
  if (method === "GET" && pathname === "/api/v1/an-sinh/nha-tinh-nghia") {
    const list = appStore.getState().nhaTinhNghiaList;
    const daBanGiao = list.filter((i) => i.trangThai === "DA_BAN_GIAO").length;
    return jsonOk({
      total: list.length,
      da_ban_giao: daBanGiao,
      dang_thi_cong: list.filter((i) => i.trangThai === "DANG_THI_CONG").length,
      items: list,
    }, "Lấy danh sách hỗ trợ Nhà Tình nghĩa thành công");
  }

  if (method === "POST" && pathname === "/api/v1/an-sinh/nha-tinh-nghia") {
    const body = await request.json();
    if (!body.hoTenChuHo) {
      return jsonBadRequest("Vui lòng cung cấp họ tên chủ hộ chính sách");
    }
    appStore.dangKyNhaTinhNghia(body);
    const latest = appStore.getState().nhaTinhNghiaList[0];
    return jsonCreated(latest, "Lập hồ sơ hỗ trợ Nhà Tình nghĩa thành công");
  }

  const ntnTienDoMatch = pathname.match(/^\/api\/v1\/an-sinh\/nha-tinh-nghia\/([^/]+)\/tien-do$/);
  if (method === "POST" && ntnTienDoMatch) {
    const id = ntnTienDoMatch[1];
    const body = await request.json();
    appStore.capNhatTienDoNhaTinhNghia(id, Number(body.tienDo || body.tienDoThiCongPercent || 100), body.trangThai);
    const updated = appStore.getState().nhaTinhNghiaList.find((i) => i.id === id);
    return jsonOk(updated, "Cập nhật tiến độ thi công Nhà Tình nghĩa thành công");
  }

  return jsonNotFound(`Không tìm thấy endpoint ${pathname}`);
}
