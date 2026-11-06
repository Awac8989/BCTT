/**
 * EDUCATION & TTHC ADMINISTRATIVE PROCEDURE CONTROLLER (MẢNG 4)
 * Endpoints: /api/v1/giao-duc/*
 * Implements: Nghị định 61/2018/NĐ-CP, Thông tư 49/2021/TT-BGDĐT, Ký số SmartCA
 */

import { backendStore } from "../services/backend-store";
import { appStore } from "@/services/app-state";
import { jsonOk, jsonCreated, jsonNotFound, jsonBadRequest } from "../utils/response";
import type { HoSoTTHCGiaoDuc, TrangThaiHoSoGD } from "@/data/domain-mock";

export async function handleGiaoDucRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/giao-duc/, "");
  const method = req.method;

  // 1. GET /api/v1/giao-duc/ho-so - Danh sách hồ sơ TTHC Giáo dục Một cửa
  if ((path === "/ho-so" || path === "") && method === "GET") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const trangThai = url.searchParams.get("trang_thai");
    const thuTuc = url.searchParams.get("thu_tuc");

    let items = backendStore.hoSoGiaoDuc;
    if (search) {
      items = items.filter(
        (h) =>
          h.maHoSo.toLowerCase().includes(search) ||
          h.nguoiNop.toLowerCase().includes(search) ||
          h.tenCoSoDeNghi.toLowerCase().includes(search) ||
          h.cccd.includes(search)
      );
    }
    if (trangThai && trangThai !== "ALL") {
      items = items.filter((h) => h.trangThai === trangThai);
    }
    if (thuTuc && thuTuc !== "ALL") {
      items = items.filter((h) => h.maThuTuc === thuTuc);
    }

    return jsonOk({
      total: items.length,
      pending_review: items.filter((h) => h.trangThai === "CHO_PHE_DUYET").length,
      items,
    });
  }

  // 2. POST /api/v1/giao-duc/ho-so - Tiếp nhận hồ sơ TTHC Mới (B1 - Mẫu 01)
  if (path === "/ho-so" && method === "POST") {
    try {
      const body = await req.json() as Partial<HoSoTTHCGiaoDuc>;
      if (!body.nguoiNop || !body.soDienThoai || !body.tenCoSoDeNghi) {
        return jsonBadRequest("Vui lòng điền đủ người nộp, số điện thoại và tên cơ sở đề nghị");
      }

      const nextIdx = backendStore.hoSoGiaoDuc.length + 1;
      const newId = `HSO-GD-00${nextIdx}`;
      const newMaHoSo = `HSO-GD-2026-00${nextIdx}`;
      const now = new Date();
      const henTra = new Date();
      henTra.setDate(henTra.getDate() + 15);

      const newDossier: HoSoTTHCGiaoDuc = {
        id: newId,
        maHoSo: newMaHoSo,
        tenThuTuc: body.tenThuTuc || "Thành lập nhóm trẻ, lớp mẫu giáo độc lập tư thục",
        maThuTuc: body.maThuTuc || "TTHC-GD-BGD/01",
        nguoiNop: body.nguoiNop.trim(),
        soDienThoai: body.soDienThoai.trim(),
        cccd: body.cccd?.trim() || "0740" + Math.floor(10000000 + Math.random() * 90000000),
        diaChiLienHe: body.diaChiLienHe || "Phường Thủ Dầu Một, TP. Thủ Dầu Một",
        tenCoSoDeNghi: body.tenCoSoDeNghi.trim(),
        diaDiemCoSo: body.diaDiemCoSo || "Phường Thủ Dầu Một, TP. Thủ Dầu Một",
        khuPho: body.khuPho || "Khu phố 1",
        ngayTiepNhan: now.toLocaleDateString("vi-VN"),
        ngayHenTra: henTra.toLocaleDateString("vi-VN"),
        hinhThucNop: body.hinhThucNop || "TRUC_TIEP_MOT_CUA",
        canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
        canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
        trangThai: "DANG_THAM_DINH",
        thanhPhanHoSo: body.thanhPhanHoSo || [],
      };

      backendStore.hoSoGiaoDuc.unshift(newDossier);
      backendStore.logAudit(
        "Tiếp nhận hồ sơ GD",
        `Một cửa tiếp nhận hồ sơ ${newDossier.maHoSo} (${newDossier.tenCoSoDeNghi}) do ${newDossier.nguoiNop} nộp`,
        "Nguyễn Văn An"
      );

      return jsonCreated(newDossier, "Tiếp nhận hồ sơ Một cửa thành công");
    } catch (err) {
      return jsonBadRequest("Lỗi trong quá trình tiếp nhận hồ sơ", err instanceof Error ? err.message : String(err));
    }
  }

  // 3. POST /api/v1/giao-duc/ho-so/:id/ky-so - Lãnh đạo ký số SmartCA phê duyệt Quyết định (B5)
  const kySoMatch = path.match(/^\/ho-so\/([^/]+)\/ky-so$/);
  if (kySoMatch && method === "POST") {
    const id = decodeURIComponent(kySoMatch[1]);
    const dossier = backendStore.hoSoGiaoDuc.find((h) => h.id === id);

    if (!dossier) {
      return jsonNotFound(`Không tìm thấy hồ sơ TTHC Giáo dục: ${id}`);
    }

    const soQuyetDinh = `QĐ-UBND/${Math.floor(100 + Math.random() * 900)}/2026`;
    const maXacThuc = `CA-TDM-SHA256-${Date.now().toString(16).toUpperCase()}`;
    const ngayKy = new Date().toLocaleDateString("vi-VN");

    dossier.trangThai = "DA_PHE_DUYET";
    dossier.quyetDinh = {
      soQuyetDinh,
      ngayBanHanh: ngayKy,
      nguoiKy: "TS. Nguyễn Văn Hùng",
      chucVu: "Chủ tịch UBND Phường Thủ Dầu Một",
      noiDungQuyetDinh: `Cho phép thành lập ${dossier.tenCoSoDeNghi} tại ${dossier.diaDiemCoSo}`,
      daKySo: true,
      thoiGianKySo: new Date().toLocaleString("vi-VN"),
      maXacThucKySo: maXacThuc,
    };

    backendStore.logAudit(
      "Ký số SmartCA",
      `Lãnh đạo ký số phê duyệt Quyết định ${soQuyetDinh} cho hồ sơ ${dossier.maHoSo} (Mã CA: ${maXacThuc})`,
      "TS. Nguyễn Văn Hùng"
    );

    return jsonOk({
      so_quyet_dinh: soQuyetDinh,
      ma_xac_thuc: maXacThuc,
      ngay_ky: ngayKy,
      ho_so: dossier,
    }, "Lãnh đạo đã Ký số điện tử thành công!");
  }

  // 4. PATCH /api/v1/giao-duc/ho-so/:id/status - Chuyển bước luân chuyển (1->6)
  const statusMatch = path.match(/^\/ho-so\/([^/]+)\/status$/);
  if (statusMatch && method === "PATCH") {
    const id = decodeURIComponent(statusMatch[1]);
    const dossier = backendStore.hoSoGiaoDuc.find((h) => h.id === id);

    if (!dossier) {
      return jsonNotFound(`Không tìm thấy hồ sơ TTHC Giáo dục: ${id}`);
    }

    try {
      const body = await req.json() as { status?: TrangThaiHoSoGD };
      if (!body.status) {
        return jsonBadRequest("Vui lòng cung cấp status hợp lệ");
      }

      dossier.trangThai = body.status;
      backendStore.logAudit("Chuyển bước Một cửa", `Hồ sơ ${dossier.maHoSo} chuyển sang bước ${body.status}`);

      return jsonOk(dossier, `Chuyển bước thành công: ${body.status}`);
    } catch {
      return jsonBadRequest("Dữ liệu cập nhật trạng thái không hợp lệ");
    }
  }

  // 5. GET /api/v1/giao-duc/kpi - Thống kê KPI mầm non, trường học, phổ cập
  if (path === "/kpi" && method === "GET") {
    const mamNon = backendStore.mamNonList;
    const truong = backendStore.truongCongLapList;
    const totalTre = mamNon.reduce((acc, m) => acc + m.soTreDangGiu, 0);

    return jsonOk({
      mam_non: {
        total_co_so: mamNon.length,
        total_tre: totalTre,
        camera_online_rate: 100,
        bep_an_mot_chieu_rate: Number(((mamNon.filter((m) => m.bepAnMotChieu).length / mamNon.length) * 100).toFixed(1)),
      },
      truong_cong_lap: {
        total_truong: truong.length,
        total_hoc_sinh: 3150,
        tuyen_sinh_online_rate: 98.5,
      },
      pho_cap_gd: {
        pho_cap_mn_5_tuoi: 99.8,
        muc_do_chuan_qg: "Mức 3 (Cao nhất)",
      },
      ho_so_tthc: {
        total_ho_so: backendStore.hoSoGiaoDuc.length,
        cho_ky_so: backendStore.hoSoGiaoDuc.filter((h) => h.trangThai === "CHO_PHE_DUYET").length,
      },
    });
  }

  // 6. GET /api/v1/giao-duc/kiem-thuc-3-buoc - Lập sổ kiểm thực 3 bước ATTP bếp ăn bán trú
  if (path === "/kiem-thuc-3-buoc" && method === "GET") {
    const list = appStore.getState().kiemThuc3BuocList;
    const khuPho = url.searchParams.get("khuPho");
    let items = list;
    if (khuPho && khuPho !== "ALL") {
      items = items.filter((k) => k.khuPho === khuPho);
    }
    return jsonOk({
      total: items.length,
      an_toan_count: items.filter((k) => k.ketLuanChung === "DU_DIEU_KIEN_AN_TOAN").length,
      can_khac_phuc_count: items.filter((k) => k.ketLuanChung !== "DU_DIEU_KIEN_AN_TOAN").length,
      ty_le_luu_mau_dat: 100,
      items,
    }, "Lấy danh sách sổ kiểm thực 3 bước ATTP thành công");
  }

  // 7. POST /api/v1/giao-duc/kiem-thuc-3-buoc - Tiếp nhận biên bản kiểm thực 3 bước mới
  if (path === "/kiem-thuc-3-buoc" && method === "POST") {
    try {
      const body = await req.json();
      const tenCoSo = body.tenCoSo || body.tenTruong;
      if (!tenCoSo || !body.soSuatAn) {
        return jsonBadRequest("Vui lòng cung cấp tên cơ sở và số suất ăn");
      }

      const payload: any = {
        tenCoSo,
        loaiCoSo: body.loaiCoSo || "MAM_NON_TU_THUC",
        khuPho: body.khuPho || "Khu phố 1",
        ngayKiemTra: body.ngayKiemTra || new Date().toLocaleDateString("vi-VN"),
        soSuatAn: Number(body.soSuatAn),
        buoc1_NhapNguyenLieu: body.buoc1_NhapNguyenLieu || {
          nguonGocThucPham: body.buoc1_KiemTraNhap?.nguonGocNguonHang || "Hợp tác xã rau sạch",
          donViCungCap: body.buoc1_KiemTraNhap?.nguoiGiao || "Công ty Cung ứng Thực phẩm",
          hoaDonGiayAttp: true,
          tinhTrangBaoGoiTemMac: true,
          danhGia: "DAT",
        },
        buoc2_CheBien: body.buoc2_CheBien || {
          quyTrinhBep1Chieu: true,
          trangPhucTapDeBaoHo: true,
          nguonNuocSachDatChuan: true,
          nhietDoCheBienDamBao: true,
          danhGia: "DAT",
        },
        buoc3_TruocKhiAnVaLuuMau: body.buoc3_TruocKhiAnVaLuuMau || {
          camQuanMuiViDoChuc: "Mùi vị đặc trưng, chín kỹ",
          tuLanhLuuMauRieng: true,
          nhietDoTuLanhLuuDoC: 4,
          niemPhongHopMau24h: true,
          danhGia: "DAT",
        },
        ketLuanChung: body.ketLuanChung === "DAT_ATTP" ? "DU_DIEU_KIEN_AN_TOAN" : (body.ketLuanChung || "DU_DIEU_KIEN_AN_TOAN"),
        truongDoanKiemTra: body.truongDoanKiemTra || body.canBoKiemTra || "Ban Giám hiệu & Y tế học đường",
        canBoYTePhuTrach: body.canBoYTePhuTrach || "Trần Thu Hà (Y tế dự phòng)",
      };

      appStore.themKiemThuc3Buoc(payload);
      const latest = appStore.getState().kiemThuc3BuocList[0];
      return jsonCreated(latest, "Ghi nhận kiểm thực 3 bước an toàn thực phẩm thành công");
    } catch {
      return jsonBadRequest("Dữ liệu kiểm thực 3 bước không hợp lệ");
    }
  }

  // 8. GET /api/v1/giao-duc/pho-cap - Thống kê phổ cập giáo dục & xóa mù chữ (NĐ 20/2014 & TT 07/2016)
  if (path === "/pho-cap" && method === "GET") {
    const list = appStore.getState().phoCapGiaoDucList;
    const tongTre = list.reduce((acc, i) => acc + (i.tongSoTre || 0), 0);
    const tongDiHoc = list.reduce((acc, i) => acc + (i.soTreDiHoc || 0), 0);
    const tongBoHoc = list.reduce((acc, i) => acc + (i.soTreBoHoc || 0), 0);
    const tongNguyCo = list.reduce((acc, i) => acc + (i.soTreNguyCoBoHoc || 0), 0);
    const tyLeChung = tongTre > 0 ? +((tongDiHoc / tongTre) * 100).toFixed(2) : 100;
    return jsonOk({
      total_khu_pho: list.length,
      tong_so_tre: tongTre,
      so_tre_di_hoc: tongDiHoc,
      so_tre_bo_hoc: tongBoHoc,
      so_tre_nguy_co_bo_hoc: tongNguyCo,
      ty_le_huy_dong_chung: tyLeChung,
      dat_chuan_pcgd_muc_3: true,
      items: list,
    }, "Lấy dữ liệu phổ cập giáo dục và xóa mù chữ thành công");
  }

  // 9. POST /api/v1/giao-duc/pho-cap - Cập nhật số liệu điều tra phổ cập mới
  if (path === "/pho-cap" && method === "POST") {
    try {
      const body = await req.json();
      appStore.themDieuTraPhoCap(body);
      const latest = appStore.getState().phoCapGiaoDucList[0];
      return jsonCreated(latest, "Ghi nhận số liệu điều tra phổ cập giáo dục thành công");
    } catch {
      return jsonBadRequest("Dữ liệu điều tra phổ cập không hợp lệ");
    }
  }

  // 10. GET /api/v1/giao-duc/cong-dong-hoc-tap - Đánh giá 15 tiêu chí Cộng đồng học tập cấp xã (TT 44/2014)
  if (path === "/cong-dong-hoc-tap" && method === "GET") {
    const list = appStore.getState().congDongHocTapList;
    const tongDiemTuCham = list.reduce((acc, i) => acc + (i.diemTuDanhGia || 0), 0);
    const tongDiemDoanKiemTra = list.reduce((acc, i) => acc + (i.diemDoanKiemTra || 0), 0);
    const xepLoai = tongDiemDoanKiemTra >= 85 ? "TOT" : (tongDiemDoanKiemTra >= 70 ? "KHA" : "DAT");
    return jsonOk({
      total_tieu_chi: list.length,
      tong_diem_tu_cham: tongDiemTuCham,
      tong_diem_doan_kiem_tra: tongDiemDoanKiemTra,
      xep_loai: xepLoai,
      items: list,
    }, "Lấy bảng tiêu chí đánh giá Cộng đồng học tập thành công");
  }

  // 11. POST /api/v1/giao-duc/cong-dong-hoc-tap/:id/danh-gia - Chấm điểm tiêu chí
  const cdhtMatch = path.match(/^\/cong-dong-hoc-tap\/([^/]+)\/danh-gia$/);
  if (cdhtMatch && method === "POST") {
    const id = cdhtMatch[1];
    try {
      const body = await req.json();
      appStore.danhGiaCongDongHocTap(id, body);
      const updated = appStore.getState().congDongHocTapList.find((i) => i.id === id);
      return jsonOk(updated, "Cập nhật đánh giá tiêu chí Cộng đồng học tập thành công");
    } catch {
      return jsonBadRequest("Dữ liệu đánh giá không hợp lệ");
    }
  }

  return jsonNotFound();
}
