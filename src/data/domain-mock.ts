/**
 * DỮ LIỆU NGHIỆP VỤ ĐA MẢNG CỦA CHÍNH QUYỀN ĐỊA PHƯƠNG CẤP PHƯỜNG / XÃ
 * Tỉnh Bình Dương (TP. Thủ Dầu Một / Dĩ An / Thuận An / ...)
 * Bao gồm 3 Phân hệ Nghiệp vụ mới:
 * 1. Mảng Thông tin, Truyền thông và Chuyển đổi số cơ sở (TT_CDS)
 * 2. Mảng Lao động, Người có công và An sinh xã hội (LDTBXH)
 * 3. Mảng Giáo dục và Đào tạo cơ sở (GD_DT)
 */

export type DomainCode =
  | "ALL"
  | "TT_CDS"
  | "LDTBXH_NCC"
  | "LDTBXH_AN_SINH"
  | "GD_DT";

export interface DomainMeta {
  code: DomainCode;
  name: string;
  shortName: string;
  description: string;
  color: string;
  badgeClass: string;
  path: string;
}

export const DOMAIN_METAS: Record<DomainCode, DomainMeta> = {
  ALL: {
    code: "ALL",
    name: "Toàn quyền Điều hành Hệ thống",
    shortName: "Toàn quyền",
    description: "Quản trị toàn bộ các mảng nghiệp vụ, nhân sự, tham số và phân quyền",
    color: "#b91c1c",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    path: "/",
  },
  TT_CDS: {
    code: "TT_CDS",
    name: "Thông tin, Truyền thông & Chuyển đổi số",
    shortName: "Thông tin & CĐS",
    description: "Truyền thanh thông minh, bảng tin LED, cổ động trực quan, cổng TTĐT, đại lý Internet, Tổ CNS cộng đồng",
    color: "#0284c7",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    path: "/thong-tin-truyen-thong",
  },
  LDTBXH_NCC: {
    code: "LDTBXH_NCC",
    name: "Chính sách Người có công với cách mạng",
    shortName: "Người có công",
    description: "Hồ sơ thương bệnh binh, liệt sĩ, trợ cấp ưu đãi, điều dưỡng và Đền ơn đáp nghĩa",
    color: "#dc2626",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    path: "/ho-so",
  },
  LDTBXH_AN_SINH: {
    code: "LDTBXH_AN_SINH",
    name: "Lao động, Việc làm & An sinh xã hội",
    shortName: "Lao động & An sinh",
    description: "Bảo trợ xã hội, cứu trợ khẩn cấp, giảm nghèo đa chiều, việc làm bộ đội xuất ngũ, trẻ em, phòng chống tệ nạn",
    color: "#d97706",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    path: "/an-sinh-xa-hoi",
  },
  GD_DT: {
    code: "GD_DT",
    name: "Giáo dục và Đào tạo cơ sở",
    shortName: "Giáo dục & Đào tạo",
    description: "Cấp phép mầm non ngoài công lập, phối hợp tuyển sinh đầu cấp, an ninh trường học, phổ cập GD và khuyến học",
    color: "#059669",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    path: "/giao-duc-dao-tao",
  },
};

// ============================================================================
// 1. DỮ LIỆU MẢNG THÔNG TIN, TRUYỀN THÔNG & CHUYỂN ĐỔI SỐ
// ============================================================================

export interface CumLoaTruyenThanh {
  id: string;
  maCum: string;
  tenCum: string;
  khuPho: string;
  diaDiem: string;
  loaiThietBi: "IP_4G" | "FM_KHONG_DAY" | "KET_HOP";
  congSuatW: number;
  soLoa: number;
  amLuongPercent: number;
  trangThai: "HOAT_DONG" | "DANG_PHAT" | "MAT_KET_NOI" | "BAO_TRI";
  lanCapNhatCuoi: string;
  toaDoGps: string;
}

export interface BanTinTruyenThanh {
  id: string;
  tieuDe: string;
  linhVuc: "CHINH_TRI" | "PHAP_LUAT" | "Y_TE" | "DVC_CDS" | "AN_NINH" | "KHAN_CAP";
  nguonTin: string;
  thoiLuongPhut: number;
  khungGioPhat: string;
  ngayPhat: string;
  hinhThuc: "GIONG_DOC_AI" | "GHI_AM_CAN_BO" | "TIEP_SONG_DAI_TINH";
  trangThai: "DA_PHAT" | "DANG_PHAT" | "CHO_PHAT" | "CHO_DUYET";
  nguoiPheDuyet: string;
}

export interface BangTinDienTu {
  id: string;
  tenBang: string;
  viTri: string;
  kichThuoc: string;
  loaiManHinh: "LED_NGOAI_TROi" | "LCD_TRONG_NHA";
  noiDungHienTai: string;
  kieuTrinhChieu: "CHU_CUON" | "VIDEO_CLIP" | "SLIDE_ANH";
  trangThai: "DANG_CHIEU" | "DANG_TAT" | "LOI_TIN_HIEU";
  thoiGianBat: string;
  thoiGianTat: string;
}

export interface CoDongTrucQuanItem {
  id: string;
  tenDotTuyenTruyen: string;
  dipKyNiem: string;
  loaiHinh: "PANO_TAM_LON" | "BANG_RON" | "CO_PHUON" | "AP_PHICH";
  soLuong: number;
  diaDiemTreo: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  kinhPhiVND: number;
  donViThucHien: string;
  tinhTrangKiemTra: "DAT_YEU_CAU" | "CAN_CHINH_SUA" | "DA_THAO_DO";
}

export interface CoSoInternetBuuChinh {
  id: string;
  tenCoSo: string;
  loaiHinh: "DAI_LY_INTERNET" | "DIEM_BUU_CHINH" | "TRAM_BTS_VIEN_THONG";
  chuCoSo: string;
  diaChi: string;
  khuPho: string;
  soDienThoai: string;
  soGiayPhep: string;
  ngayCapPhep: string;
  ketQuaKiemTra: "CHAP_HANH_TOT" | "NHAC_NHO" | "XU_PHAT_HANH_CHINH";
  noiDungKiemTraCuoi: string;
  ngayKiemTraCuoi: string;
}

export interface ToCongNgheSoCongDong {
  id: string;
  tenTo: string;
  khuPho: string;
  toTruong: string;
  sdtToTruong: string;
  soThanhVien: number;
  soHoDanQuanLy: number;
  tyLeCaiVNeIDPercent: number;
  tyLeDVCPercent: number;
  tyLeThanhToanSoPercent: number;
  soBuoiRaQuan: number;
  danhGiaHoatDong: "XUAT_SAC" | "TOT" | "TRUNG_BINH";
}

export const initialCumLoaList: CumLoaTruyenThanh[] = [
  {
    id: "LOA-01",
    maCum: "TDM-TT-01",
    tenCum: "Cụm 01 - Trụ sở UBND Phường & Chợ Thủ Dầu Một",
    khuPho: "Khu phố 1",
    diaDiem: "Ngã 3 đường Quang Trung - CMT8",
    loaiThietBi: "IP_4G",
    congSuatW: 120,
    soLoa: 4,
    amLuongPercent: 75,
    trangThai: "HOAT_DONG",
    lanCapNhatCuoi: "20/10/2026 08:30",
    toaDoGps: "10.9782, 106.6541",
  },
  {
    id: "LOA-02",
    maCum: "TDM-TT-02",
    tenCum: "Cụm 02 - Khu vực Ngã 6 Bình Dương & Bưu điện",
    khuPho: "Khu phố 2",
    diaDiem: "Vòng xoay Ngã 6 trung tâm",
    loaiThietBi: "IP_4G",
    congSuatW: 150,
    soLoa: 4,
    amLuongPercent: 80,
    trangThai: "HOAT_DONG",
    lanCapNhatCuoi: "20/10/2026 08:45",
    toaDoGps: "10.9805, 106.6568",
  },
  {
    id: "LOA-03",
    maCum: "TDM-TT-03",
    tenCum: "Cụm 03 - Trường Tiểu học Lê Hồng Phong",
    khuPho: "Khu phố 3",
    diaDiem: "Đầu hẻm 45 đường Yersin",
    loaiThietBi: "IP_4G",
    congSuatW: 100,
    soLoa: 2,
    amLuongPercent: 65,
    trangThai: "DANG_PHAT",
    lanCapNhatCuoi: "20/10/2026 09:00",
    toaDoGps: "10.9754, 106.6612",
  },
  {
    id: "LOA-04",
    maCum: "TDM-TT-04",
    tenCum: "Cụm 04 - Khu dân cư Chánh Nghĩa ven sông",
    khuPho: "Khu phố 4",
    diaDiem: "Ngã 4 Bùi Quốc Khánh - Bạch Đằng",
    loaiThietBi: "IP_4G",
    congSuatW: 100,
    soLoa: 2,
    amLuongPercent: 70,
    trangThai: "HOAT_DONG",
    lanCapNhatCuoi: "20/10/2026 07:15",
    toaDoGps: "10.9712, 106.6495",
  },
  {
    id: "LOA-05",
    maCum: "TDM-TT-05",
    tenCum: "Cụm 05 - Khu phố 5 đường 30/4",
    khuPho: "Khu phố 5",
    diaDiem: "Nhà văn hóa Khu phố 5",
    loaiThietBi: "FM_KHONG_DAY",
    congSuatW: 80,
    soLoa: 2,
    amLuongPercent: 60,
    trangThai: "BAO_TRI",
    lanCapNhatCuoi: "19/10/2026 15:20",
    toaDoGps: "10.9840, 106.6630",
  },
];

export const initialBanTinList: BanTinTruyenThanh[] = [
  {
    id: "BT-2026-101",
    tieuDe: "Tuyên truyền cao điểm cài đặt tài khoản VNeID mức độ 2 và chữ ký số công dân",
    linhVuc: "DVC_CDS",
    nguonTin: "Tổ Công tác Đề án 06 Phường",
    thoiLuongPhut: 15,
    khungGioPhat: "06:30 - 06:45 & 17:00 - 17:15",
    ngayPhat: "20/10/2026",
    hinhThuc: "GIONG_DOC_AI",
    trangThai: "DANG_PHAT",
    nguoiPheDuyet: "Phó Chủ tịch UBND Phường",
  },
  {
    id: "BT-2026-102",
    tieuDe: "Thông báo lịch chi trả trợ cấp Người có công & Bảo trợ xã hội tháng 10/2026",
    linhVuc: "PHAP_LUAT",
    nguonTin: "Bộ phận Lao động - Thương binh & Xã hội",
    thoiLuongPhut: 10,
    khungGioPhat: "11:30 - 11:40",
    ngayPhat: "20/10/2026",
    hinhThuc: "GHI_AM_CAN_BO",
    trangThai: "CHO_PHAT",
    nguoiPheDuyet: "Chủ tịch UBND Phường",
  },
  {
    id: "BT-2026-103",
    tieuDe: "Khuyến cáo phòng chống cháy nổ và tai nạn điện trong mùa hanh khô",
    linhVuc: "AN_NINH",
    nguonTin: "Công an Phường phối hợp Đội PCCC",
    thoiLuongPhut: 12,
    khungGioPhat: "17:15 - 17:27",
    ngayPhat: "20/10/2026",
    hinhThuc: "TIEP_SONG_DAI_TINH",
    trangThai: "CHO_PHAT",
    nguoiPheDuyet: "Trưởng Công an Phường",
  },
];

export const initialBangTinList: BangTinDienTu[] = [
  {
    id: "LED-01",
    tenBang: "Bảng LED P10 Ngoài trời - Trụ sở UBND Phường",
    viTri: "Mặt tiền Trụ sở UBND Phường",
    kichThuoc: "Cao 1.5m x Rộng 6.0m",
    loaiManHinh: "LED_NGOAI_TROi",
    noiDungHienTai: "NHIỆT LIỆT CHÀO MỪNG CÁC NGÀY LỄ LỚN · ĐẨY MẠNH CHUYỂN ĐỔI SỐ VÀ CẢI CÁCH HÀNH CHÍNH PHỤC VỤ NHÂN DÂN",
    kieuTrinhChieu: "CHU_CUON",
    trangThai: "DANG_CHIEU",
    thoiGianBat: "05:30",
    thoiGianTat: "22:00",
  },
  {
    id: "LED-02",
    tenBang: "Bảng Màn hình LED P4 Fullcolor - Ngã 6 Trung tâm",
    viTri: "Vòng xoay Ngã 6 Thủ Dầu Một",
    kichThuoc: "Cao 3.0m x Rộng 5.0m",
    loaiManHinh: "LED_NGOAI_TROi",
    noiDungHienTai: "Video clip Tuyên truyền Đề án 06/CP và Cẩm nang Công dân số Bình Dương",
    kieuTrinhChieu: "VIDEO_CLIP",
    trangThai: "DANG_CHIEU",
    thoiGianBat: "06:00",
    thoiGianTat: "22:30",
  },
  {
    id: "LED-03",
    tenBang: "Bảng LCD Cảm ứng Kiosk Một cửa",
    viTri: "Sảnh Bộ phận Tiếp nhận & Trả kết quả Phường",
    kichThuoc: "Màn hình đứng 55 inch",
    loaiManHinh: "LCD_TRONG_NHA",
    noiDungHienTai: "Tra cứu Bộ thủ tục hành chính 25 dịch vụ công thiết yếu và Đánh giá hài lòng CSAT",
    kieuTrinhChieu: "SLIDE_ANH",
    trangThai: "DANG_CHIEU",
    thoiGianBat: "07:00",
    thoiGianTat: "17:30",
  },
];

export const initialCoDongList: CoDongTrucQuanItem[] = [
  {
    id: "CD-01",
    tenDotTuyenTruyen: "Tuyên truyền kỷ niệm 96 năm Ngày thành lập Đảng và đón chào Năm mới 2027",
    dipKyNiem: "Mừng Đảng - Mừng Xuân",
    loaiHinh: "PANO_TAM_LON",
    soLuong: 3,
    diaDiemTreo: "Ngã 6, Cổng chào đường CMT8 và Trụ sở UBND",
    thoiGianBatDau: "15/12/2026",
    thoiGianKetThuc: "20/01/2027",
    kinhPhiVND: 42_000_000,
    donViThucHien: "Công ty Quảng cáo Mỹ thuật Bình Dương",
    tinhTrangKiemTra: "DAT_YEU_CAU",
  },
  {
    id: "CD-02",
    tenDotTuyenTruyen: "Tuyên truyền Ngày Pháp luật Nước CHXHCN Việt Nam (09/11)",
    dipKyNiem: "Ngày Pháp luật Việt Nam",
    loaiHinh: "BANG_RON",
    soLuong: 18,
    diaDiemTreo: "Các tuyến đường trục chính: Yersin, CMT8, Trần Hưng Đạo",
    thoiGianBatDau: "01/11/2026",
    thoiGianKetThuc: "15/11/2026",
    kinhPhiVND: 9_500_000,
    donViThucHien: "Trung tâm VHTT phường",
    tinhTrangKiemTra: "DAT_YEU_CAU",
  },
  {
    id: "CD-03",
    tenDotTuyenTruyen: "Tuyên truyền Tháng hành động vì Bình đẳng giới và phòng chống bạo lực gia đình",
    dipKyNiem: "Tháng hành động bình đẳng giới (15/11 - 15/12)",
    loaiHinh: "CO_PHUON",
    soLuong: 60,
    diaDiemTreo: "Dọc tuyến phố văn minh đường Bạch Đằng công viên bờ sông",
    thoiGianBatDau: "15/11/2026",
    thoiGianKetThuc: "15/12/2026",
    kinhPhiVND: 12_800_000,
    donViThucHien: "Tổ Công tác Xã hội",
    tinhTrangKiemTra: "DAT_YEU_CAU",
  },
];

export const initialCoSoInternetList: CoSoInternetBuuChinh[] = [
  {
    id: "CS-01",
    tenCoSo: "Điểm Đại lý Internet Cyber Gaming Star",
    loaiHinh: "DAI_LY_INTERNET",
    chuCoSo: "Nguyễn Văn Hùng",
    diaChi: "128 Đường Yersin",
    khuPho: "Khu phố 2",
    soDienThoai: "0908.112.334",
    soGiayPhep: "GP-NET-2024/012",
    ngayCapPhep: "15/03/2024",
    ketQuaKiemTra: "CHAP_HANH_TOT",
    noiDungKiemTraCuoi: "Kiểm tra định kỳ quý 3: Cài đặt phần mềm quản lý đại lý net đúng quy chuẩn, có lối thoát hiểm PCCC, cam kết không hoạt động quá 22h00.",
    ngayKiemTraCuoi: "18/09/2026",
  },
  {
    id: "CS-02",
    tenCoSo: "Bưu cục Chuyển phát VNPost Phường",
    loaiHinh: "DIEM_BUU_CHINH",
    chuCoSo: "Bưu điện TP. Thủ Dầu Một",
    diaChi: "02 Đường CMT8",
    khuPho: "Khu phố 1",
    soDienThoai: "0274.3822.115",
    soGiayPhep: "XN-BC-2023/005",
    ngayCapPhep: "10/01/2023",
    ketQuaKiemTra: "CHAP_HANH_TOT",
    noiDungKiemTraCuoi: "Kiểm tra an toàn an ninh bưu chính, niêm yết công khai bảng giá cước dịch vụ công trực tuyến và phát trả hồ sơ tận nhà.",
    ngayKiemTraCuoi: "05/10/2026",
  },
  {
    id: "CS-03",
    tenCoSo: "Trạm thu phát sóng di động BTS Viettel TDM-08",
    loaiHinh: "TRAM_BTS_VIEN_THONG",
    chuCoSo: "Viettel Bình Dương",
    diaChi: "Nóc nhà số 79 đường Đoàn Trần Nghiệp",
    khuPho: "Khu phố 3",
    soDienThoai: "0983.555.777",
    soGiayPhep: "CP-BTS-2025/088",
    ngayCapPhep: "20/07/2025",
    ketQuaKiemTra: "CHAP_HANH_TOT",
    noiDungKiemTraCuoi: "Đạt tiêu chuẩn an toàn bức xạ điện từ trường theo QCVN, chống sét và tiếp địa hoạt động tốt.",
    ngayKiemTraCuoi: "12/08/2026",
  },
  {
    id: "CS-04",
    tenCoSo: "Đại lý Internet Game Zone X-Club",
    loaiHinh: "DAI_LY_INTERNET",
    chuCoSo: "Phạm Thành Đạt",
    diaChi: "45/2 đường Bùi Quốc Khánh",
    khuPho: "Khu phố 4",
    soDienThoai: "0912.443.211",
    soGiayPhep: "GP-NET-2025/031",
    ngayCapPhep: "05/05/2025",
    ketQuaKiemTra: "NHAC_NHO",
    noiDungKiemTraCuoi: "Nhắc nhở biển hiệu quảng cáo bị che khuất, yêu cầu bổ sung 02 bình bột chữa cháy MFZ4 và nhắc nhở học sinh mặc đồng phục trong giờ học.",
    ngayKiemTraCuoi: "08/10/2026",
  },
];

export const initialToCNSList: ToCongNgheSoCongDong[] = [
  {
    id: "CNS-01",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 1",
    khuPho: "Khu phố 1",
    toTruong: "Trần Anh Tuấn (Bí thư Chi đoàn)",
    sdtToTruong: "0977.123.456",
    soThanhVien: 8,
    soHoDanQuanLy: 420,
    tyLeCaiVNeIDPercent: 96.5,
    tyLeDVCPercent: 88.2,
    tyLeThanhToanSoPercent: 91.0,
    soBuoiRaQuan: 24,
    danhGiaHoatDong: "XUAT_SAC",
  },
  {
    id: "CNS-02",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 2",
    khuPho: "Khu phố 2",
    toTruong: "Lê Thị Bích Hạnh (Hội Phụ nữ)",
    sdtToTruong: "0909.876.543",
    soThanhVien: 7,
    soHoDanQuanLy: 380,
    tyLeCaiVNeIDPercent: 94.0,
    tyLeDVCPercent: 84.5,
    tyLeThanhToanSoPercent: 87.5,
    soBuoiRaQuan: 20,
    danhGiaHoatDong: "TOT",
  },
  {
    id: "CNS-03",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 3",
    khuPho: "Khu phố 3",
    toTruong: "Nguyễn Minh Khang (Dân quân cơ động)",
    sdtToTruong: "0918.234.567",
    soThanhVien: 9,
    soHoDanQuanLy: 450,
    tyLeCaiVNeIDPercent: 91.5,
    tyLeDVCPercent: 80.0,
    tyLeThanhToanSoPercent: 82.0,
    soBuoiRaQuan: 18,
    danhGiaHoatDong: "TOT",
  },
  {
    id: "CNS-04",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 4",
    khuPho: "Khu phố 4",
    toTruong: "Võ Hoàng Nam (Cán bộ Tư pháp)",
    sdtToTruong: "0933.998.877",
    soThanhVien: 6,
    soHoDanQuanLy: 310,
    tyLeCaiVNeIDPercent: 95.0,
    tyLeDVCPercent: 86.0,
    tyLeThanhToanSoPercent: 89.0,
    soBuoiRaQuan: 22,
    danhGiaHoatDong: "XUAT_SAC",
  },
  {
    id: "CNS-05",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 5",
    khuPho: "Khu phố 5",
    toTruong: "Đỗ Thị Thu Hương (Chi hội Khuyến học)",
    sdtToTruong: "0988.334.455",
    soThanhVien: 6,
    soHoDanQuanLy: 360,
    tyLeCaiVNeIDPercent: 89.0,
    tyLeDVCPercent: 76.0,
    tyLeThanhToanSoPercent: 78.5,
    soBuoiRaQuan: 16,
    danhGiaHoatDong: "TRUNG_BINH",
  },
];

// ============================================================================
// 2. DỮ LIỆU MẢNG LAO ĐỘNG, NGƯỜI CÓ CÔNG & AN SINH XÃ HỘI
// ============================================================================

export interface DoiTuongBaoTroXaHoi {
  id: string;
  hoTen: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: "Nam" | "Nữ";
  khuPho: string;
  diaChi: string;
  loaiDoiTuong:
    | "NGUOI_CAO_TUOI_80"
    | "KHUYET_TAT_DAC_BIET_NANG"
    | "KHUYET_TAT_NANG"
    | "TRE_MO_COI"
    | "DON_THAN_NUOI_CON_NGHEO";
  tenLoaiDoiTuong: string;
  heSoHuong: number;
  mucTroCapHangThang: number;
  hinhThucNhan: "NGAN_HANG" | "BUU_DIEN";
  thongTinChiTra: string;
  soQuyetDinh: string;
  ngayHieuLuc: string;
  trangThai: "DANG_HUONG" | "TAM_DUNG" | "THOI_HUONG";
}

export interface HoSoCuuTroDotXuat {
  id: string;
  hoTenChuHo: string;
  cccd: string;
  khuPho: string;
  diaChi: string;
  loaiSuCo: "HOA_HOAN_CHAY_NHA" | "THIEN_TAI_GIONG_LOC" | "TAI_NAN_NGHIEM_TRONG" | "BENH_HIEM_NGHEO";
  moTaThietHai: string;
  ngayXayRa: string;
  hinhThucCuuTro: "TIEN_MAT_VA_GAO" | "TIEN_MAT" | "SUA_CHUA_NHA_KHAN_CAP";
  soTienHoTroVND: number;
  soKgGao: number;
  trangThai: "DA_CHI_TRA" | "DA_DUYET" | "DANG_THAM_DINH";
  ngayPheDuyet: string;
  nguoiPheDuyet: string;
}

export interface HoGheoCanGheoItem {
  id: string;
  maHo: string;
  hoTenChuHo: string;
  cccdChuHo: string;
  khuPho: string;
  soNhanKhau: number;
  phanLoai: "HO_NGHEO" | "HO_CAN_NGHEO" | "MUC_SONG_TRUNG_BINH";
  chieuThieuHut: string[];
  chinhSachDaNhan: string[];
  soTienVayCSXHVND: number;
  tinhTrangNhaO: "NHA_KAP_4_XUNG_CAP" | "DA_XAY_DAI_DOAN_KET" | "KIEN_CO";
  mucTieuThoatNgheoNam: number;
}

export interface CungCauLaoDongItem {
  id: string;
  hoTen: string;
  cccd: string;
  namSinh: number;
  khuPho: string;
  trinhDoHocVan: string;
  chuyenMon: string;
  doiTuongUuTien: "BO_DOI_XUAT_NGU" | "MAN_HAN_TU_HOAN_LUONG" | "LAO_DONG_PHO_THONG" | "THANH_NIEN_THAT_NGHIEP";
  tinhTrangViecLam: "CHUA_CO_VIEC_LAM" | "DA_KET_NOI_VIEC_LAM" | "DANG_HOC_NGHE";
  doanhNghiepTuyenDung?: string;
  mucLuongKyVong: string;
  ngayCapNhat: string;
}

export interface CoSoKiemTraATLaoDong {
  id: string;
  tenCoSo: string;
  loaiHinh: "XUONG_CO_KHI" | "MAY_GIA_CONG" | "CHE_BIEN_GO" | "CONG_TRINH_XAY_DUNG_NHA_O";
  chuCoSo: string;
  diaChi: string;
  soLaoDong: number;
  tinhTrangHopDong: "100%_KY_HDLD" | "MOT_PHAN" | "CHUA_KY";
  trangBiBaoHo: "DAT_CHUAN" | "THIEU_BHLD" | "CAN_BO_SUNG";
  soBinhPCCC: number;
  ketQuaKiemTra: "DAT" | "XU_PHAT" | "YEU_CAU_KHAC_PHUC";
  ngayKiemTra: string;
}

export interface TreEmHoanCanhDacBiet {
  id: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: "Nam" | "Nữ";
  khuPho: string;
  diaChi: string;
  hoTenNguoiGiamHo: string;
  quanHe: string;
  sdtNguoiGiamHo: string;
  loaiHoanCanh:
    | "TRE_MO_COI"
    | "TRE_KHUYET_TAT"
    | "TRE_CO_NGUY_CO_BO_HOC"
    | "HO_NGHEO_KHO_KHAN"
    | "NAN_NHAN_BAO_LUC_GIA_DINH";
  chinhSachTroCap: string;
  daDuocTangHocBong: boolean;
  daHocBoiPhongDuoiNuoc: boolean;
  ghiChuTheoDoi: string;
}

export interface HoSoPhongChongTeNan {
  id: string;
  maHoSo: string;
  hoTen: string;
  cccd: string;
  namSinh: number;
  khuPho: string;
  loaiDoiTuong: "NGUOI_NGHIEN_MA_TUY" | "NGUOI_SU_DUNG_TRAI_PHEP" | "QUAN_LY_SAU_CAI" | "CO_NGUY_CO_MAI_DAM";
  hinhThucCaiNghien: "CAI_NGHIEN_TU_NGUYEN_CONG_DONG" | "CAI_NGHIEN_BAT_BUOC" | "DIEU_TRI_METHADONE" | "HOAN_THANH_SAU_CAI";
  canBoTheoDoi: string;
  donViPhoiHop: "CONG_AN_PHUONG" | "DOAN_THANH_NIEN" | "HOI_CUU_CHIEN_BINH";
  ketQuaXetNghiemDinhKy: "AM_TINH" | "DUONG_TINH" | "CHUA_DEN_KY";
  hoTroViecLam: string;
  ngayCapNhat: string;
}

export const initialBaoTroList: DoiTuongBaoTroXaHoi[] = [
  {
    id: "BTXH-001",
    hoTen: "Cụ bà Huỳnh Thị Lành",
    cccd: "074038001122",
    ngaySinh: "10/05/1942",
    gioiTinh: "Nữ",
    khuPho: "Khu phố 1",
    diaChi: "14/2 đường Quang Trung",
    loaiDoiTuong: "NGUOI_CAO_TUOI_80",
    tenLoaiDoiTuong: "Người cao tuổi đủ 80 tuổi không có lương hưu (NĐ 20/2021)",
    heSoHuong: 1.0,
    mucTroCapHangThang: 540_000,
    hinhThucNhan: "NGAN_HANG",
    thongTinChiTra: "Vietcombank - 0121000998877",
    soQuyetDinh: "QĐ-UBND-145/2022",
    ngayHieuLuc: "01/06/2022",
    trangThai: "DANG_HUONG",
  },
  {
    id: "BTXH-002",
    hoTen: "Trần Văn Bình",
    cccd: "074092004455",
    ngaySinh: "15/08/1992",
    gioiTinh: "Nam",
    khuPho: "Khu phố 2",
    diaChi: "88 đường Yersin",
    loaiDoiTuong: "KHUYET_TAT_DAC_BIET_NANG",
    tenLoaiDoiTuong: "Người khuyết tật đặc biệt nặng dạng vận động (Có người chăm sóc)",
    heSoHuong: 2.5,
    mucTroCapHangThang: 1_350_000,
    hinhThucNhan: "BUU_DIEN",
    thongTinChiTra: "Điểm Bưu cục Chợ Thủ Dầu Một",
    soQuyetDinh: "QĐ-UBND-210/2023",
    ngayHieuLuc: "01/09/2023",
    trangThai: "DANG_HUONG",
  },
  {
    id: "BTXH-003",
    hoTen: "Nguyễn Thị Ngọc Mai",
    cccd: "074088009911",
    ngaySinh: "20/12/1988",
    gioiTinh: "Nữ",
    khuPho: "Khu phố 3",
    diaChi: "56/3 đường Cách Mạng Tháng Tám",
    loaiDoiTuong: "DON_THAN_NUOI_CON_NGHEO",
    tenLoaiDoiTuong: "Người đơn thân nuôi 02 con nhỏ thuộc diện hộ nghèo",
    heSoHuong: 2.0,
    mucTroCapHangThang: 1_080_000,
    hinhThucNhan: "NGAN_HANG",
    thongTinChiTra: "Agribank TDM - 5590205199221",
    soQuyetDinh: "QĐ-UBND-098/2024",
    ngayHieuLuc: "01/03/2024",
    trangThai: "DANG_HUONG",
  },
  {
    id: "BTXH-004",
    hoTen: "Lê Quốc Bảo (Trẻ em)",
    cccd: "074214008899",
    ngaySinh: "04/06/2014",
    gioiTinh: "Nam",
    khuPho: "Khu phố 4",
    diaChi: "102 đường Bùi Quốc Khánh",
    loaiDoiTuong: "TRE_MO_COI",
    tenLoaiDoiTuong: "Trẻ mồ côi cả cha lẫn mẹ sống cùng bà ngoại",
    heSoHuong: 2.5,
    mucTroCapHangThang: 1_350_000,
    hinhThucNhan: "NGAN_HANG",
    thongTinChiTra: "BIDV Nam Bình Dương - 6501000887711 (Người giám hộ)",
    soQuyetDinh: "QĐ-UBND-312/2021",
    ngayHieuLuc: "01/10/2021",
    trangThai: "DANG_HUONG",
  },
];

export const initialCuuTroList: HoSoCuuTroDotXuat[] = [
  {
    id: "CT-DX-01",
    hoTenChuHo: "Lê Văn Hùng",
    cccd: "074068001234",
    khuPho: "Khu phố 3",
    diaChi: "Hẻm 72 đường Trần Hưng Đạo",
    loaiSuCo: "HOA_HOAN_CHAY_NHA",
    moTaThietHai: "Chập điện gây cháy một phần gian bếp và phòng ngủ tầng 1, hư hại tài sản ước tính 65 triệu đồng, không có thiệt hại về người.",
    ngayXayRa: "08/10/2026",
    hinhThucCuuTro: "TIEN_MAT_VA_GAO",
    soTienHoTroVND: 15_000_000,
    soKgGao: 45,
    trangThai: "DA_CHI_TRA",
    ngayPheDuyet: "09/10/2026",
    nguoiPheDuyet: "Chủ tịch UBND Phường",
  },
  {
    id: "CT-DX-02",
    hoTenChuHo: "Trương Thị Thu",
    cccd: "074075005678",
    khuPho: "Khu phố 4",
    diaChi: "35/8 ven rạch Chánh Nghĩa",
    loaiSuCo: "THIEN_TAI_GIONG_LOC",
    moTaThietHai: "Mưa to kèm giông lốc làm tốc mái tôn hoàn toàn, nước ngập ướt đồ đạc và trang thiết bị học tập của con nhỏ.",
    ngayXayRa: "15/10/2026",
    hinhThucCuuTro: "SUA_CHUA_NHA_KHAN_CAP",
    soTienHoTroVND: 10_000_000,
    soKgGao: 30,
    trangThai: "DA_CHI_TRA",
    ngayPheDuyet: "16/10/2026",
    nguoiPheDuyet: "Chủ tịch UBND Phường",
  },
];

export const initialHoGheoList: HoGheoCanGheoItem[] = [
  {
    id: "HG-01",
    maHo: "TDM-HN-001",
    hoTenChuHo: "Võ Văn Kiệt",
    cccdChuHo: "074065003322",
    khuPho: "Khu phố 1",
    soNhanKhau: 4,
    phanLoai: "HO_NGHEO",
    chieuThieuHut: ["Thu nhập bình quân < 2.000.000đ/tháng", "Bảo hiểm y tế", "Chất lượng nhà ở"],
    chinhSachDaNhan: ["Cấp thẻ BHYT miễn phí 100%", "Miễn học phí cho 02 con nhỏ", "Vay vốn NHCSXH"],
    soTienVayCSXHVND: 50_000_000,
    tinhTrangNhaO: "NHA_KAP_4_XUNG_CAP",
    mucTieuThoatNgheoNam: 2027,
  },
  {
    id: "HG-02",
    maHo: "TDM-HCN-002",
    hoTenChuHo: "Phan Thị Lan",
    cccdChuHo: "074072008844",
    khuPho: "Khu phố 2",
    soNhanKhau: 3,
    phanLoai: "HO_CAN_NGHEO",
    chieuThieuHut: ["Nước sạch sinh hoạt", "Đào tạo nghề việc làm"],
    chinhSachDaNhan: ["Hỗ trợ 70% BHYT (UBND phường hỗ trợ 30% còn lại)", "Học nghề may công nghiệp"],
    soTienVayCSXHVND: 40_000_000,
    tinhTrangNhaO: "DA_XAY_DAI_DOAN_KET",
    mucTieuThoatNgheoNam: 2026,
  },
  {
    id: "HG-03",
    maHo: "TDM-MSTB-003",
    hoTenChuHo: "Đặng Văn Hậu",
    cccdChuHo: "074080007711",
    khuPho: "Khu phố 5",
    soNhanKhau: 5,
    phanLoai: "MUC_SONG_TRUNG_BINH",
    chieuThieuHut: ["Thu nhập nông nghiệp bấp bênh"],
    chinhSachDaNhan: ["Hỗ trợ 30% mức đóng BHYT theo chuẩn tỉnh Bình Dương"],
    soTienVayCSXHVND: 0,
    tinhTrangNhaO: "KIEN_CO",
    mucTieuThoatNgheoNam: 2026,
  },
];

export const initialCungCauLaoDongList: CungCauLaoDongItem[] = [
  {
    id: "LD-01",
    hoTen: "Nguyễn Tuấn Kiệt",
    cccd: "074202001999",
    namSinh: 2002,
    khuPho: "Khu phố 1",
    trinhDoHocVan: "12/12",
    chuyenMon: "Sửa chữa ô tô / Lái xe B2",
    doiTuongUuTien: "BO_DOI_XUAT_NGU",
    tinhTrangViecLam: "DA_KET_NOI_VIEC_LAM",
    doanhNghiepTuyenDung: "Công ty Cổ phần Vận tải & Logistics Becamex",
    mucLuongKyVong: "9.000.000 - 12.000.000đ",
    ngayCapNhat: "14/10/2026",
  },
  {
    id: "LD-02",
    hoTen: "Trần Hữu Danh",
    cccd: "074198007722",
    namSinh: 1998,
    khuPho: "Khu phố 3",
    trinhDoHocVan: "9/12",
    chuyenMon: "Hàn cơ khí / Sơn tĩnh điện",
    doiTuongUuTien: "MAN_HAN_TU_HOAN_LUONG",
    tinhTrangViecLam: "DA_KET_NOI_VIEC_LAM",
    doanhNghiepTuyenDung: "Xưởng Cơ khí Tân Thành Đạt (Tổ dân phố bảo lãnh)",
    mucLuongKyVong: "8.500.000đ",
    ngayCapNhat: "02/10/2026",
  },
  {
    id: "LD-03",
    hoTen: "Lê Hoàng Phúc",
    cccd: "074205004411",
    namSinh: 2005,
    khuPho: "Khu phố 4",
    trinhDoHocVan: "Trung cấp Điện công nghiệp",
    chuyenMon: "Kỹ thuật điện xí nghiệp",
    doiTuongUuTien: "THANH_NIEN_THAT_NGHIEP",
    tinhTrangViecLam: "CHUA_CO_VIEC_LAM",
    mucLuongKyVong: "8.000.000 - 10.000.000đ",
    ngayCapNhat: "18/10/2026",
  },
];

export const initialATLaoDongList: CoSoKiemTraATLaoDong[] = [
  {
    id: "ATL-01",
    tenCoSo: "Xưởng Gia công Cơ khí Tân Thành Đạt",
    loaiHinh: "XUONG_CO_KHI",
    chuCoSo: "Nguyễn Văn Đạt",
    diaChi: "78 Đường Bạch Đằng",
    soLaoDong: 12,
    tinhTrangHopDong: "100%_KY_HDLD",
    trangBiBaoHo: "DAT_CHUAN",
    soBinhPCCC: 6,
    ketQuaKiemTra: "DAT",
    ngayKiemTra: "12/09/2026",
  },
  {
    id: "ATL-02",
    tenCoSo: "Công trình xây dựng nhà phố kiên cố số 45 Yersin",
    loaiHinh: "CONG_TRINH_XAY_DUNG_NHA_O",
    chuCoSo: "Chủ thầu: Trần Đình Nam",
    diaChi: "45 Đường Yersin, Khu phố 2",
    soLaoDong: 18,
    tinhTrangHopDong: "MOT_PHAN",
    trangBiBaoHo: "CAN_BO_SUNG",
    soBinhPCCC: 2,
    ketQuaKiemTra: "YEU_CAU_KHAC_PHUC",
    ngayKiemTra: "05/10/2026",
  },
];

export const initialTreEmList: TreEmHoanCanhDacBiet[] = [
  {
    id: "TE-01",
    hoTen: "Nguyễn Mai Anh",
    ngaySinh: "15/09/2012",
    gioiTinh: "Nữ",
    khuPho: "Khu phố 1",
    diaChi: "28/4 Quang Trung",
    hoTenNguoiGiamHo: "Nguyễn Văn Tuấn",
    quanHe: "Bác ruột",
    sdtNguoiGiamHo: "0908.223.344",
    loaiHoanCanh: "TRE_MO_COI",
    chinhSachTroCap: "Trợ cấp bảo trợ xã hội hàng tháng 1.350.000đ + Thẻ BHYT miễn phí",
    daDuocTangHocBong: true,
    daHocBoiPhongDuoiNuoc: true,
    ghiChuTheoDoi: "Đang học Lớp 9 trường THCS Chu Văn An, học lực Giỏi, nhận đỡ đầu học bổng 2.000.000đ/năm.",
  },
  {
    id: "TE-02",
    hoTen: "Lê Quốc Thái",
    ngaySinh: "20/03/2016",
    gioiTinh: "Nam",
    khuPho: "Khu phố 3",
    diaChi: "92/1 Yersin",
    hoTenNguoiGiamHo: "Lê Thị Hồng",
    quanHe: "Mẹ đơn thân",
    sdtNguoiGiamHo: "0934.556.677",
    loaiHoanCanh: "HO_NGHEO_KHO_KHAN",
    chinhSachTroCap: "Hỗ trợ chi phí học tập theo NĐ 81/2021",
    daDuocTangHocBong: true,
    daHocBoiPhongDuoiNuoc: true,
    ghiChuTheoDoi: "Được Đoàn Thanh niên phường tặng xe đạp đến trường trong Tháng hành động vì trẻ em 2026.",
  },
];

export const initialTeNanList: HoSoPhongChongTeNan[] = [
  {
    id: "TN-01",
    maHoSo: "TDM-MT-001",
    hoTen: "Trần Văn Toàn",
    cccd: "074090001234",
    namSinh: 1990,
    khuPho: "Khu phố 2",
    loaiDoiTuong: "NGUOI_NGHIEN_MA_TUY",
    hinhThucCaiNghien: "DIEU_TRI_METHADONE",
    canBoTheoDoi: "Đ/c Trung úy Nguyễn Tuấn Hải (CSKV) & Lê Hoàng Nam (LĐ-TBXH)",
    donViPhoiHop: "CONG_AN_PHUONG",
    ketQuaXetNghiemDinhKy: "AM_TINH",
    hoTroViecLam: "Đang phụ việc tại xưởng may gia công, có thu nhập ổn định",
    ngayCapNhat: "10/10/2026",
  },
  {
    id: "TN-02",
    maHoSo: "TDM-MT-002",
    hoTen: "Lê Hoàng Minh",
    cccd: "074095007788",
    namSinh: 1995,
    khuPho: "Khu phố 4",
    loaiDoiTuong: "QUAN_LY_SAU_CAI",
    hinhThucCaiNghien: "HOAN_THANH_SAU_CAI",
    canBoTheoDoi: "Đoàn Thanh niên phường & Hội CCB phường kèm cặp",
    donViPhoiHop: "DOAN_THANH_NIEN",
    ketQuaXetNghiemDinhKy: "AM_TINH",
    hoTroViecLam: "Được hỗ trợ vay 30 triệu đồng vốn Quỹ Hoàn lương mở quầy tạp hóa",
    ngayCapNhat: "15/10/2026",
  },
];

// ============================================================================
// 3. DỮ LIỆU MẢNG GIÁO DỤC VÀ ĐÀO TẠO CƠ SỞ
// ============================================================================

export interface CoSoMamNonTuThuc {
  id: string;
  maCoSo: string;
  tenCoSo: string;
  loaiHinh: "NHOM_TRE_DOC_LAP" | "LOP_MAU_GIAO_DOC_LAP" | "TRUONG_MAM_NON_TU_THUC";
  chuCoSo: string;
  nguoiPhuTrachChuyenMon: string;
  diaChi: string;
  khuPho: string;
  soDienThoai: string;
  soQuyetDinhCapPhep: string;
  ngayCapPhep: string;
  soTreDangGiu: number;
  soGiaoVienBaoMau: number;
  dienTichPhongHocM2: number;
  coCameraGiamSat: boolean;
  bepAnMotChieu: boolean;
  ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN" | "NHAC_NHO_KHAC_PHUC" | "TAM_DINH_CHI";
  ngayKiemTraCuoi: string;
  noiDungKiemTra: string;
}

export interface TruongHocCongLap {
  id: string;
  tenTruong: string;
  capHoc: "MAM_NON" | "TIEU_HOC" | "THCS";
  diaChi: string;
  hieuTruong: string;
  soDienThoai: string;
  tongSoHocSinh: number;
  tongSoLop: number;
  chiTieuTuyenSinhDauCap: number;
  daTuyenDauCap: number;
  tuyenKhuPho: string[];
  tyLeDangKyTrucTuyenVNeID: number;
  gioCaoDiemPhanLuong: string;
  lucLuongTrucATGT: string;
  anNinhCongTruong: "AN_TOAN_TOT" | "CAN_DIEU_TIET_GIAO_THONG";
  moHinhCongTruongATGT: boolean;
}

export interface SoLieuPhoCapGiaoDuc {
  capPhoCap: "PCGD_MAM_NON_5T" | "PCGD_TIEU_HOC" | "PCGD_THCS" | "XOA_MU_CHU";
  tenChiTieu: string;
  mucDoDatChuan: string;
  doTuoiDieuTra: string;
  tongSoTrongDoTuoi: number;
  soHuyDongDenTruong: number;
  tyLeHuyDongPercent: number;
  soHoanThanhChuongTrinh: number;
  tyLeHoanThanhPercent: number;
  namCongNhan: number;
}

export interface HoatDongKhuyenHoc {
  id: string;
  tenChuongTrinh: string;
  loaiHoatDong: "TRAO_HOC_BONG" | "TRUNG_TAM_HTCD" | "GIA_DINH_HOC_TAP" | "VAN_DONG_BO_HOC";
  kinhPhiVND: number;
  soNguoiThuHuong: number;
  diaDiem: string;
  ngayToChuc: string;
  ketQuaDatDuoc: string;
}

export interface MoHinhHocTap {
  id: string;
  tenMoHinh: string;
  soDangKy: number;
  soDatChuan: number;
  tyLePercent: number;
  tieuChuanDanhGia: string;
  namCongNhan: number;
}

export interface LopHocTrungTamHTCD {
  id: string;
  tenChuyenDe: string;
  giangVien: string;
  thoiGian: string;
  diaDiem: string;
  soHocVien: number;
  trangThai: "SAP_TO_CHUC" | "DANG_DIEN_RA" | "DA_HOAN_THANH";
  ketQua: string;
}

export const initialMamNonList: CoSoMamNonTuThuc[] = [
  {
    id: "MN-01",
    maCoSo: "MN-TT-001",
    tenCoSo: "Nhóm trẻ Ban Mai Xanh",
    loaiHinh: "NHOM_TRE_DOC_LAP",
    chuCoSo: "Bà Lê Thị Kim Tuyến",
    nguoiPhuTrachChuyenMon: "Lê Thị Kim Tuyến (ĐH Sư phạm Mầm non)",
    diaChi: "34/6 Đường CMT8",
    khuPho: "Khu phố 1",
    soDienThoai: "0903.887.665",
    soQuyetDinhCapPhep: "QĐ-UBND-89/2023",
    ngayCapPhep: "12/04/2023",
    soTreDangGiu: 28,
    soGiaoVienBaoMau: 4,
    dienTichPhongHocM2: 120,
    coCameraGiamSat: true,
    bepAnMotChieu: true,
    ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN",
    ngayKiemTraCuoi: "15/09/2026",
    noiDungKiemTra: "Kiểm tra liên ngành đầu năm học: Đảm bảo tỷ lệ 1 giáo viên/7 trẻ, thực đơn dinh dưỡng niêm yết công khai, lưu mẫu thức ăn 24h đúng quy định, hệ thống camera phụ huynh xem trực tuyến hoạt động tốt.",
  },
  {
    id: "MN-02",
    maCoSo: "MN-TT-002",
    tenCoSo: "Lớp mẫu giáo độc lập Tuổi Thơ Vàng",
    loaiHinh: "LOP_MAU_GIAO_DOC_LAP",
    chuCoSo: "Ông Trần Đình Trọng",
    nguoiPhuTrachChuyenMon: "Nguyễn Thị Phương Thảo (Cử nhân Mầm non)",
    diaChi: "112 Đường Yersin",
    khuPho: "Khu phố 2",
    soDienThoai: "0918.445.566",
    soQuyetDinhCapPhep: "QĐ-UBND-115/2024",
    ngayCapPhep: "20/06/2024",
    soTreDangGiu: 45,
    soGiaoVienBaoMau: 6,
    dienTichPhongHocM2: 210,
    coCameraGiamSat: true,
    bepAnMotChieu: true,
    ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN",
    ngayKiemTraCuoi: "22/09/2026",
    noiDungKiemTra: "Đồ chơi mầm non an toàn không độc hại, trang bị bình chữa cháy và tiêu lệnh PCCC đúng vị trí, kiểm tra định kỳ sức khỏe trẻ em quý 3.",
  },
  {
    id: "MN-03",
    maCoSo: "MN-TT-003",
    tenCoSo: "Nhóm trẻ gia đình Họa Mi Nhỏ",
    loaiHinh: "NHOM_TRE_DOC_LAP",
    chuCoSo: "Bà Đặng Thu Thủy",
    nguoiPhuTrachChuyenMon: "Đặng Thu Thủy (Cao đẳng SP Mầm non)",
    diaChi: "67/3 Đường Bùi Quốc Khánh",
    khuPho: "Khu phố 4",
    soDienThoai: "0976.223.311",
    soQuyetDinhCapPhep: "QĐ-UBND-201/2022",
    ngayCapPhep: "08/11/2022",
    soTreDangGiu: 18,
    soGiaoVienBaoMau: 3,
    dienTichPhongHocM2: 85,
    coCameraGiamSat: true,
    bepAnMotChieu: false,
    ketQuaKiemTraCuoi: "TAM_DINH_CHI",
    ngayKiemTraCuoi: "04/10/2026",
    noiDungKiemTra: "Tạm đình chỉ 02 tháng theo Quyết định số 89/QĐ-UBND do vi phạm an toàn PCCC (chưa mở lối thoát nạn thứ 2) và chưa hoàn thiện bếp ăn một chiều.",
  },
  {
    id: "MN-04",
    maCoSo: "MN-TT-004",
    tenCoSo: "Lớp mầm non độc lập Búp Sen Hồng",
    loaiHinh: "LOP_MAU_GIAO_DOC_LAP",
    chuCoSo: "Bà Hoàng Thị Minh Nguyệt",
    nguoiPhuTrachChuyenMon: "Hoàng Thị Minh Nguyệt (ĐHSP Mầm non TP.HCM)",
    diaChi: "88 Đường Đoàn Trần Nghiệp",
    khuPho: "Khu phố 3",
    soDienThoai: "0938.112.443",
    soQuyetDinhCapPhep: "QĐ-UBND-52/2025",
    ngayCapPhep: "15/03/2025",
    soTreDangGiu: 36,
    soGiaoVienBaoMau: 5,
    dienTichPhongHocM2: 165,
    coCameraGiamSat: true,
    bepAnMotChieu: true,
    ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN",
    ngayKiemTraCuoi: "28/09/2026",
    noiDungKiemTra: "Cơ sở vật chất khang trang, sân chơi có mái che và thảm chống trượt, 100% giáo viên có chứng nhận tập huấn kỹ năng sơ cấp cứu ban đầu.",
  },
  {
    id: "MN-05",
    maCoSo: "MN-TT-005",
    tenCoSo: "Nhóm trẻ tư thục Ngôi Sao Nhỏ",
    loaiHinh: "NHOM_TRE_DOC_LAP",
    chuCoSo: "Ông Vũ Quang Huy",
    nguoiPhuTrachChuyenMon: "Nguyễn Bích Loan (Cử nhân Giáo dục Mầm non)",
    diaChi: "14/2B Đường Ngô Quyền",
    khuPho: "Khu phố 5",
    soDienThoai: "0908.776.554",
    soQuyetDinhCapPhep: "QĐ-UBND-140/2024",
    ngayCapPhep: "18/08/2024",
    soTreDangGiu: 24,
    soGiaoVienBaoMau: 3,
    dienTichPhongHocM2: 105,
    coCameraGiamSat: true,
    bepAnMotChieu: true,
    ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN",
    ngayKiemTraCuoi: "01/10/2026",
    noiDungKiemTra: "Hợp đồng thực phẩm rau sạch và thịt gia súc có nguồn gốc kiểm dịch rõ ràng, bình chữa cháy còn hạn sử dụng, camera 4 mắt kết nối ổn định.",
  },
];

export const initialTruongCongLapList: TruongHocCongLap[] = [
  {
    id: "TR-01",
    tenTruong: "Trường Mầm non Công lập Hoa Mai",
    capHoc: "MAM_NON",
    diaChi: "Số 10 Đường Quang Trung, Khu phố 1",
    hieuTruong: "Cô Đỗ Thị Mai Liên",
    soDienThoai: "0274.3822.450",
    tongSoHocSinh: 480,
    tongSoLop: 14,
    chiTieuTuyenSinhDauCap: 150,
    daTuyenDauCap: 150,
    tuyenKhuPho: ["Khu phố 1", "Khu phố 2", "Khu phố 5"],
    tyLeDangKyTrucTuyenVNeID: 98.6,
    gioCaoDiemPhanLuong: "07:00 - 07:30 & 16:30 - 17:15",
    lucLuongTrucATGT: "Dân quân tự vệ (2 đ/c) + Đoàn thanh niên",
    anNinhCongTruong: "AN_TOAN_TOT",
    moHinhCongTruongATGT: true,
  },
  {
    id: "TR-02",
    tenTruong: "Trường Tiểu học Lê Hồng Phong",
    capHoc: "TIEU_HOC",
    diaChi: "Số 25 Đường Yersin, Khu phố 2",
    hieuTruong: "Thầy Nguyễn Hữu Dũng",
    soDienThoai: "0274.3824.112",
    tongSoHocSinh: 1250,
    tongSoLop: 32,
    chiTieuTuyenSinhDauCap: 280,
    daTuyenDauCap: 280,
    tuyenKhuPho: ["Khu phố 2", "Khu phố 3"],
    tyLeDangKyTrucTuyenVNeID: 99.2,
    gioCaoDiemPhanLuong: "06:45 - 07:15 & 16:45 - 17:30",
    lucLuongTrucATGT: "Công an phường (1 đ/c) + Trật tự đô thị + Bảo vệ dân phố",
    anNinhCongTruong: "AN_TOAN_TOT",
    moHinhCongTruongATGT: true,
  },
  {
    id: "TR-03",
    tenTruong: "Trường Tiểu học Phú Cường",
    capHoc: "TIEU_HOC",
    diaChi: "Số 42 Đường CMT8, Khu phố 1",
    hieuTruong: "Cô Vũ Thị Hải Yến",
    soDienThoai: "0274.3825.990",
    tongSoHocSinh: 980,
    tongSoLop: 26,
    chiTieuTuyenSinhDauCap: 210,
    daTuyenDauCap: 210,
    tuyenKhuPho: ["Khu phố 1", "Khu phố 4"],
    tyLeDangKyTrucTuyenVNeID: 97.8,
    gioCaoDiemPhanLuong: "06:45 - 07:15 & 16:45 - 17:30",
    lucLuongTrucATGT: "Tổ tự quản khu phố 1 + Đoàn thanh niên phường",
    anNinhCongTruong: "AN_TOAN_TOT",
    moHinhCongTruongATGT: true,
  },
  {
    id: "TR-04",
    tenTruong: "Trường THCS Chu Văn An",
    capHoc: "THCS",
    diaChi: "Số 56 Đường Đoàn Trần Nghiệp, Khu phố 3",
    hieuTruong: "Cô Phạm Thị Thu Hà",
    soDienThoai: "0274.3831.556",
    tongSoHocSinh: 1420,
    tongSoLop: 34,
    chiTieuTuyenSinhDauCap: 360,
    daTuyenDauCap: 360,
    tuyenKhuPho: ["Khu phố 1", "Khu phố 2", "Khu phố 3", "Khu phố 4", "Khu phố 5"],
    tyLeDangKyTrucTuyenVNeID: 99.5,
    gioCaoDiemPhanLuong: "06:30 - 07:00 & 17:00 - 17:45",
    lucLuongTrucATGT: "Công an phường + Dân quân cơ động phân luồng xe buýt",
    anNinhCongTruong: "AN_TOAN_TOT",
    moHinhCongTruongATGT: true,
  },
];

export const initialPhoCapList: SoLieuPhoCapGiaoDuc[] = [
  {
    capPhoCap: "PCGD_MAM_NON_5T",
    tenChiTieu: "Phổ cập giáo dục Mầm non cho trẻ 5 tuổi (PCGDMN5T)",
    mucDoDatChuan: "Đạt chuẩn phổ cập MN 5 tuổi (99.8%)",
    doTuoiDieuTra: "Trẻ sinh năm 2021 (5 tuổi)",
    tongSoTrongDoTuoi: 382,
    soHuyDongDenTruong: 381,
    tyLeHuyDongPercent: 99.74,
    soHoanThanhChuongTrinh: 381,
    tyLeHoanThanhPercent: 100.0,
    namCongNhan: 2026,
  },
  {
    capPhoCap: "PCGD_TIEU_HOC",
    tenChiTieu: "Phổ cập giáo dục Tiểu học",
    mucDoDatChuan: "Đạt chuẩn Mức độ 3 (Mức tối đa)",
    doTuoiDieuTra: "Độ tuổi 6 - 11 tuổi (sinh 2015 - 2020)",
    tongSoTrongDoTuoi: 1890,
    soHuyDongDenTruong: 1888,
    tyLeHuyDongPercent: 99.89,
    soHoanThanhChuongTrinh: 1882,
    tyLeHoanThanhPercent: 99.68,
    namCongNhan: 2026,
  },
  {
    capPhoCap: "PCGD_THCS",
    tenChiTieu: "Phổ cập giáo dục Trung học cơ sở",
    mucDoDatChuan: "Đạt chuẩn Mức độ 3 (Mức tối đa)",
    doTuoiDieuTra: "Độ tuổi 11 - 15 tuổi (sinh 2011 - 2015)",
    tongSoTrongDoTuoi: 1640,
    soHuyDongDenTruong: 1628,
    tyLeHuyDongPercent: 99.27,
    soHoanThanhChuongTrinh: 1618,
    tyLeHoanThanhPercent: 99.39,
    namCongNhan: 2026,
  },
  {
    capPhoCap: "XOA_MU_CHU",
    tenChiTieu: "Công tác Xóa mù chữ trên địa bàn",
    mucDoDatChuan: "Đạt chuẩn Xóa mù chữ Mức độ 2",
    doTuoiDieuTra: "Độ tuổi 15 - 60 tuổi",
    tongSoTrongDoTuoi: 14200,
    soHuyDongDenTruong: 14195,
    tyLeHuyDongPercent: 99.96,
    soHoanThanhChuongTrinh: 14195,
    tyLeHoanThanhPercent: 100.0,
    namCongNhan: 2026,
  },
];

export const initialKhuyenHocList: HoatDongKhuyenHoc[] = [
  {
    id: "KH-01",
    tenChuongTrinh: "Lễ Trao học bổng Khuyến học 'Thắp sáng ước mơ tuổi trẻ' năm học 2026 - 2027",
    loaiHoatDong: "TRAO_HOC_BONG",
    kinhPhiVND: 65_000_000,
    soNguoiThuHuong: 45,
    diaDiem: "Hội trường UBND Phường",
    ngayToChuc: "05/09/2026",
    ketQuaDatDuoc: "Đã trao 45 suất học bổng (từ 1.000.000đ đến 2.000.000đ/suất) cho học sinh vượt khó học giỏi, không có học sinh bỏ học vì hoàn cảnh kinh tế.",
  },
  {
    id: "KH-02",
    tenChuongTrinh: "Lớp Phổ cập Kỹ năng Công nghệ số & Ứng dụng VNeID cho Người cao tuổi",
    loaiHoatDong: "TRUNG_TAM_HTCD",
    kinhPhiVND: 8_500_000,
    soNguoiThuHuong: 60,
    diaDiem: "Trung tâm Học tập cộng đồng Phường",
    ngayToChuc: "12/10/2026",
    ketQuaDatDuoc: "Hướng dẫn 60 hội viên Người cao tuổi và Cựu chiến binh sử dụng điện thoại thông minh tra cứu sổ sức khỏe điện tử VssID và nộp dịch vụ công.",
  },
  {
    id: "KH-03",
    tenChuongTrinh: "Tập huấn Kỹ năng Phòng chống đuối nước & Sơ cấp cứu ban đầu cho học sinh hè",
    loaiHoatDong: "TRUNG_TAM_HTCD",
    kinhPhiVND: 12_000_000,
    soNguoiThuHuong: 120,
    diaDiem: "Hồ bơi Thầy giáo Thể dục & Trường TH Lê Hồng Phong",
    ngayToChuc: "15/06/2026",
    ketQuaDatDuoc: "120 học sinh tiểu học và THCS nắm vững kỹ năng nổi ngửa, kỹ năng thoát hiểm dưới nước và sơ cứu ngừng tim phổi, 0 vụ đuối nước xảy ra.",
  },
];

export const initialMoHinhHocTapList: MoHinhHocTap[] = [
  {
    id: "MH-01",
    tenMoHinh: "Gia đình học tập",
    soDangKy: 3100,
    soDatChuan: 2850,
    tyLePercent: 91.9,
    tieuChuanDanhGia: "Quyết định 1373/QĐ-TTg & Thông tư 22/2020/TT-BGDĐT: Các thành viên có thói quen tự học, con em học tập tốt, có góc học tập.",
    namCongNhan: 2026,
  },
  {
    id: "MH-02",
    tenMoHinh: "Dòng họ học tập",
    soDangKy: 15,
    soDatChuan: 14,
    tyLePercent: 93.3,
    tieuChuanDanhGia: "100% dòng họ có Ban Khuyến học dòng họ, xây dựng quỹ khen thưởng hàng năm, không có con em bỏ học hoặc vi phạm pháp luật.",
    namCongNhan: 2026,
  },
  {
    id: "MH-03",
    tenMoHinh: "Cộng đồng học tập (Khu phố học tập)",
    soDangKy: 5,
    soDatChuan: 5,
    tyLePercent: 100.0,
    tieuChuanDanhGia: "5/5 Khu phố có Chi hội khuyến học hoạt động hiệu quả, điểm đọc sách cộng đồng, tổ công nghệ số cộng đồng hoạt động tích cực.",
    namCongNhan: 2026,
  },
  {
    id: "MH-04",
    tenMoHinh: "Đơn vị học tập (Cơ quan, trường học, trạm y tế)",
    soDangKy: 8,
    soDatChuan: 8,
    tyLePercent: 100.0,
    tieuChuanDanhGia: "100% cán bộ công chức, viên chức hoàn thành chỉ tiêu bồi dưỡng chuyên môn nghiệp vụ và kỹ năng số hàng năm.",
    namCongNhan: 2026,
  },
];

export const initialLopHocHTCDList: LopHocTrungTamHTCD[] = [
  {
    id: "LH-01",
    tenChuyenDe: "Kỹ năng Khai thác Dịch vụ công trực tuyến & Thanh toán số cho tiểu thương",
    giangVien: "ThS. Nguyễn Văn Đức (Chuyên viên Phòng VH-TT & CNTT)",
    thoiGian: "Tối Thứ Bảy (19h00 - 21h00), ngày 24/10/2026",
    diaDiem: "Phòng họp số 2 - Trung tâm Học tập cộng đồng Phường",
    soHocVien: 45,
    trangThai: "SAP_TO_CHUC",
    ketQua: "Mục tiêu 100% tiểu thương chợ Phú Cường thành thạo tạo mã QR thanh toán động và nộp thuế điện tử.",
  },
  {
    id: "LH-02",
    tenChuyenDe: "Pháp luật về Đất đai năm 2024 & Trình tự thủ tục thừa kế nhà đất cơ sở",
    giangVien: "Luật sư Trần Quốc Tuấn (Hội Luật gia Tỉnh Bình Dương)",
    thoiGian: "Sáng Chủ Nhật (08h00 - 11h00), ngày 11/10/2026",
    diaDiem: "Hội trường UBND Phường",
    soHocVien: 82,
    trangThai: "DA_HOAN_THANH",
    ketQua: "Tư vấn và giải đáp trực tiếp 18 lượt câu hỏi về chuyển nhượng, cấp giấy chứng nhận QSDĐ cho người dân.",
  },
  {
    id: "LH-03",
    tenChuyenDe: "Kỹ năng Nuôi dạy con tuổi dậy thì & Phòng ngừa bạo lực học đường, thuốc lá điện tử",
    giangVien: "Chuyên gia Tâm lý Lê Thị Mai Trinh (Đại học Thủ Dầu Một)",
    thoiGian: "Sáng Thứ Bảy (08h30 - 11h00), ngày 18/10/2026",
    diaDiem: "Hội trường Trường THCS Chu Văn An",
    soHocVien: 110,
    trangThai: "DA_HOAN_THANH",
    ketQua: "110 phụ huynh học sinh ký cam kết đồng hành cùng nhà trường giám sát, không để con em tiếp xúc thuốc lá điện tử.",
  },
];

// ============================================================================
// HỒ SƠ & THỦ TỤC HÀNH CHÍNH (TTHC) GIẢI QUYẾT GIẤY TỜ MẢNG GIÁO DỤC CƠ SỞ
// Thực hiện theo cơ chế Một cửa / Một cửa điện tử (Nghị định 61/2018/NĐ-CP & Nghị định 107/2021/NĐ-CP)
// Thẩm quyền Chủ tịch UBND cấp xã (Nghị định 46/2017/NĐ-CP, Thông tư 49/2021/TT-BGDĐT)
// ============================================================================

export type TrangThaiHoSoGD =
  | "MOI_TIEP_NHAN"          // Mới tiếp nhận tại Bộ phận Một cửa
  | "DANG_THAM_DINH"         // Công chức GD-ĐT đang thẩm tra văn bằng, pháp lý
  | "YEU_CAU_BO_SUNG"        // Phát hành Phiếu yêu cầu bổ sung hoàn thiện hồ sơ (Mẫu 02)
  | "KIEM_TRA_THUC_DIA"      // Lập đoàn kiểm tra liên ngành thực tế cơ sở
  | "CHO_PHE_DUYET"          // Đã lập Tờ trình, chờ Chủ tịch UBND ký số
  | "DA_PHE_DUYET"           // Đã ký số Quyết định, chuyển Một cửa trả kết quả
  | "DA_TRA_KET_QUA";        // Công dân đã nhận Quyết định & Giấy phép

export interface ThanhPhanGiayTo {
  id: string;
  tenGiayTo: string;
  batBuoc: boolean;
  daNop: boolean;
  soLuong: number;
  loaiBan: "BAN_CHINH" | "BAN_SAO_CONG_CHUNG" | "DOI_CHIEU_VNEID";
  ghiChu?: string;
}

export interface HoSoTTHCGiaoDuc {
  id: string;
  maHoSo: string;
  tenThuTuc: string;
  maThuTuc: string;
  nguoiNop: string;
  soDienThoai: string;
  cccd: string;
  diaChiLienHe: string;
  tenCoSoDeNghi: string;
  diaDiemCoSo: string;
  khuPho: string;
  ngayTiepNhan: string;
  ngayHenTra: string;
  hinhThucNop: "TRUC_TIEP_MOT_CUA" | "DVC_TRUC_TUYEN_QUOC_GIA";
  canBoTiepNhan: string;
  canBoThuLy: string;
  trangThai: TrangThaiHoSoGD;
  thanhPhanHoSo: ThanhPhanGiayTo[];
  lyDoBoSung?: string;
  hanBoSung?: string;
  // Kết quả kiểm tra thực tế
  ketQuaThucDia?: {
    ngayKiemTra: string;
    truongDoan: string;
    daiDienYTe: string;
    daiDienCongAnPCCC: string;
    ketLuan: "DAT_YEU_CAU" | "CHUA_DAT_YEU_CAU";
    bienBanSo: string;
    noiDungKiemTra: string;
  };
  // Tờ trình của công chức chuyên môn
  toTrinh?: {
    soToTrinh: string;
    ngayTrinh: string;
    nguoiTrinh: string;
    chucVu: string;
    noiDungTrinh: string;
  };
  // Quyết định thành lập / giải quyết có ký số
  quyetDinh?: {
    soQuyetDinh: string;
    ngayBanHanh: string;
    nguoiKy: string;
    chucVu: string;
    maXacThucKySo: string;
    noiDungQuyetDinh: string;
    daKySo: boolean;
  };
  // Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04 - Nghị định 61/2018/NĐ-CP)
  phieuXinLoi?: {
    soPhieu: string;
    ngayLap: string;
    lyDo: string;
    ngayHenMoi: string;
    nguoiKy: string;
    chucVu: string;
  };
}

export interface ThuTucGiaoDucInfo {
  maThuTuc: string;
  tenThuTuc: string;
  thoiHanNgayLamViec: number;
  thoiHanNgayLich: number;
  phiLePhi: string;
  canCuPhapLy: string;
  placeholderCoSo: string;
  placeholderNguoiNop: string;
  standardDocs: ThanhPhanGiayTo[];
}

export const THU_TUC_GD_CONFIGS: Record<string, ThuTucGiaoDucInfo> = {
  "TTHC-GD-BGD/01": {
    maThuTuc: "TTHC-GD-BGD/01",
    tenThuTuc: "Cho phép thành lập nhóm trẻ độc lập tư thục",
    thoiHanNgayLamViec: 15,
    thoiHanNgayLich: 21,
    phiLePhi: "Miễn phí (Nghị quyết HĐND tỉnh Bình Dương)",
    canCuPhapLy: "Thông tư 49/2021/TT-BGDĐT & Nghị định 61/2018/NĐ-CP",
    placeholderCoSo: "VD: Nhóm trẻ tư thục Hoa Hướng Dương Cơ sở 2",
    placeholderNguoiNop: "VD: Bà Lê Thị Kim Tuyến (Chủ nhóm trẻ)",
    standardDocs: [
      {
        id: "GT-01",
        tenGiayTo: "Tờ trình / Đơn đề nghị cho phép thành lập nhóm trẻ độc lập tư thục (Mẫu số 01 - TT 49/2021)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-02",
        tenGiayTo: "Đề án thành lập nhóm trẻ (Mục tiêu, quy mô số trẻ, định mức phòng học, trang thiết bị đồ chơi)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-03",
        tenGiayTo: "Bản sao chứng thực văn bằng chuyên môn sư phạm mầm non người phụ trách (≥ Cao đẳng SPMN)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-04",
        tenGiayTo: "Hợp đồng thuê địa điểm tối thiểu 03 năm hoặc Giấy chứng nhận QSDĐ hợp pháp",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-05",
        tenGiayTo: "Biên bản kiểm tra an toàn PCCC & CNCH của cơ quan Công an có thẩm quyền",
        batBuoc: true,
        daNop: false,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
        ghiChu: "Bắt buộc có trước khi ban hành Quyết định",
      },
      {
        id: "GT-06",
        tenGiayTo: "Bản cam kết vệ sinh an toàn thực phẩm & Giấy khám sức khỏe người nuôi dưỡng",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
    ],
  },
  "TTHC-GD-BGD/02": {
    maThuTuc: "TTHC-GD-BGD/02",
    tenThuTuc: "Cho phép thành lập lớp mẫu giáo độc lập tư thục",
    thoiHanNgayLamViec: 15,
    thoiHanNgayLich: 21,
    phiLePhi: "Miễn phí",
    canCuPhapLy: "Thông tư 49/2021/TT-BGDĐT & Điều 10 Nghị định 46/2017/NĐ-CP",
    placeholderCoSo: "VD: Lớp mẫu giáo độc lập Tuổi Thơ Xanh",
    placeholderNguoiNop: "VD: Bà Phạm Thu Hằng (Phụ trách chuyên môn)",
    standardDocs: [
      {
        id: "GT-11",
        tenGiayTo: "Tờ trình / Đơn đề nghị cho phép thành lập lớp mẫu giáo độc lập (Mẫu số 01 - TT 49/2021)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-12",
        tenGiayTo: "Đề án tổ chức lớp mẫu giáo độc lập (Chương trình GDMN từ 3-6 tuổi, sân chơi an toàn)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-13",
        tenGiayTo: "Bản sao chứng thực văn bằng Cử nhân Sư phạm mầm non của giáo viên đứng lớp",
        batBuoc: true,
        daNop: true,
        soLuong: 2,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-14",
        tenGiayTo: "Hợp đồng thuê mặt bằng diện tích phòng học ≥ 1.5m²/trẻ, sân chơi an toàn ≥ 0.5m²/trẻ",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-15",
        tenGiayTo: "Văn bản thẩm duyệt / Biên bản kiểm tra an toàn PCCC cơ sở mẫu giáo tư thục",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-16",
        tenGiayTo: "Giấy chứng nhận cơ sở đủ điều kiện VSATTP hoặc Hợp đồng cung ứng suất ăn bán trú",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
    ],
  },
  "TTHC-GD-BGD/03": {
    maThuTuc: "TTHC-GD-BGD/03",
    tenThuTuc: "Chuyển địa điểm và mở rộng quy mô lớp mầm non độc lập",
    thoiHanNgayLamViec: 10,
    thoiHanNgayLich: 14,
    phiLePhi: "Miễn phí",
    canCuPhapLy: "Thông tư 49/2021/TT-BGDĐT của Bộ GD&ĐT",
    placeholderCoSo: "VD: Nhóm trẻ mầm non Thỏ Trắng (Chuyển sang cơ sở mới)",
    placeholderNguoiNop: "VD: Ông Hoàng Đức Minh (Chủ cơ sở)",
    standardDocs: [
      {
        id: "GT-21",
        tenGiayTo: "Đơn đề nghị chuyển địa điểm / điều chỉnh quy mô nhóm lớp mầm non (Mẫu số 02)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-22",
        tenGiayTo: "Bản sao Quyết định cho phép thành lập cơ sở mầm non cũ của UBND Phường",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-23",
        tenGiayTo: "Hợp đồng thuê địa điểm mới (thời hạn ≥ 03 năm) kèm Giấy tờ nhà đất hợp pháp",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-24",
        tenGiayTo: "Phương án bảo đảm an toàn tính mạng, sức khỏe cho trẻ trong quá trình chuyển địa điểm",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-25",
        tenGiayTo: "Biên bản kiểm tra an toàn PCCC & CNCH tại trụ sở địa điểm mới",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
    ],
  },
  "TTHC-GD-BGD/04": {
    maThuTuc: "TTHC-GD-BGD/04",
    tenThuTuc: "Hỗ trợ tiền ăn trưa cho trẻ em mầm non và chi phí học tập",
    thoiHanNgayLamViec: 7,
    thoiHanNgayLich: 10,
    phiLePhi: "Miễn phí",
    canCuPhapLy: "Nghị định số 105/2020/NĐ-CP & Nghị định số 81/2021/NĐ-CP",
    placeholderCoSo: "VD: Trường Mầm non Công lập Hoa Mai / Phụ huynh em Nguyễn Văn An",
    placeholderNguoiNop: "VD: Bà Đỗ Thị Mai Liên (Hiệu trưởng) hoặc Phụ huynh",
    standardDocs: [
      {
        id: "GT-31",
        tenGiayTo: "Đơn đề nghị hỗ trợ tiền ăn trưa cho trẻ em mẫu giáo (Mẫu số 01 - Nghị định 105/2020/NĐ-CP)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-32",
        tenGiayTo: "Bản sao Giấy khai sinh của trẻ em hoặc trích lục hộ tịch điện tử VNeID",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "DOI_CHIEU_VNEID",
      },
      {
        id: "GT-33",
        tenGiayTo: "Bản sao Giấy chứng nhận hộ nghèo / hộ cận nghèo có chứng thực còn hiệu lực",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-34",
        tenGiayTo: "Giấy xác nhận trẻ mồ côi cả cha lẫn mẹ hoặc trẻ khuyết tật (nếu thuộc diện)",
        batBuoc: false,
        daNop: false,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-35",
        tenGiayTo: "Giấy xác nhận trẻ đang theo học tại cơ sở GDMN có xác nhận của Hiệu trưởng",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
    ],
  },
};

export const initialHoSoTTHCGiaoDucList: HoSoTTHCGiaoDuc[] = [
  {
    id: "HSO-GD-001",
    maHoSo: "HSO-GD-2026-001",
    tenThuTuc: "Cho phép thành lập nhóm trẻ độc lập tư thục",
    maThuTuc: "TTHC-GD-BGD/01",
    nguoiNop: "Bà Lê Thị Kim Tuyến",
    soDienThoai: "0903.887.665",
    cccd: "074182005432",
    diaChiLienHe: "Số 34/6 đường CMT8, Phường Phú Cường, TP. Thủ Dầu Một",
    tenCoSoDeNghi: "Nhóm trẻ Ban Mai Xanh Cơ sở 2",
    diaDiemCoSo: "Số 52 đường Đoàn Trần Nghiệp, Khu phố 3, Phường Phú Cường",
    khuPho: "Khu phố 3",
    ngayTiepNhan: "02/10/2026",
    ngayHenTra: "20/10/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    trangThai: "DA_PHE_DUYET",
    thanhPhanHoSo: [
      {
        id: "GT-01",
        tenGiayTo: "Tờ trình / Đơn đề nghị cho phép thành lập nhóm trẻ độc lập (Mẫu số 01)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-02",
        tenGiayTo: "Đề án thành lập nhóm trẻ (Mục tiêu, quy mô, cơ sở vật chất, giáo viên)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-03",
        tenGiayTo: "Bản sao chứng thực văn bằng chuyên môn của người phụ trách & giáo viên mầm non",
        batBuoc: true,
        daNop: true,
        soLuong: 4,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-04",
        tenGiayTo: "Hợp đồng thuê địa điểm cơ sở thời hạn tối thiểu 03 năm & Giấy tờ QSDĐ",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-05",
        tenGiayTo: "Biên bản kiểm tra điều kiện an toàn Phòng cháy chữa cháy & Cứu nạn cứu hộ",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-06",
        tenGiayTo: "Bản cam kết bảo đảm vệ sinh an toàn thực phẩm & Hợp đồng cung ứng thực phẩm sạch",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
    ],
    ketQuaThucDia: {
      ngayKiemTra: "10/10/2026",
      truongDoan: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
      daiDienYTe: "BS. Nguyễn Văn Hào (Trưởng Trạm Y tế)",
      daiDienCongAnPCCC: "Đại úy Phạm Quốc Tuấn (Công an phường)",
      ketLuan: "DAT_YEU_CAU",
      bienBanSo: "08/BB-LN/2026",
      noiDungKiemTra: "Diện tích phòng nuôi giữ trẻ đạt 120m2 (bình quân 4.2m2/trẻ), có 4 camera phụ huynh xem trực tiếp, bếp ăn một chiều có tủ sấy tiệt trùng, bình bọt chữa cháy đầy đủ.",
    },
    toTrinh: {
      soToTrinh: "14/TTr-VHXH",
      ngayTrinh: "14/10/2026",
      nguoiTrinh: "ThS. Trần Thị Kim Oanh",
      chucVu: "Công chức Văn hóa - Xã hội phụ trách Giáo dục",
      noiDungTrinh: "Đề nghị Chủ tịch UBND Phường ban hành Quyết định cho phép thành lập Nhóm trẻ tư thục Ban Mai Xanh 2 do đủ điều kiện theo Thông tư 49/2021/TT-BGDĐT.",
    },
    quyetDinh: {
      soQuyetDinh: "168/QĐ-UBND",
      ngayBanHanh: "18/10/2026",
      nguoiKy: "TS. Nguyễn Văn Hùng",
      chucVu: "Chủ tịch UBND Phường Phú Cường",
      maXacThucKySo: "SHA256:88AF2C11-UBND-2026-PC",
      noiDungQuyetDinh: "Cho phép thành lập Nhóm trẻ độc lập Ban Mai Xanh Cơ sở 2 tại 52 Đoàn Trần Nghiệp, Khu phố 3, do bà Lê Thị Kim Tuyến làm chủ cơ sở.",
      daKySo: true,
    },
  },
  {
    id: "HSO-GD-002",
    maHoSo: "HSO-GD-2026-002",
    tenThuTuc: "Cho phép thành lập lớp mẫu giáo độc lập tư thục",
    maThuTuc: "TTHC-GD-BGD/02",
    nguoiNop: "Bà Phạm Thu Hằng",
    soDienThoai: "0918.455.789",
    cccd: "074185002134",
    diaChiLienHe: "Số 89 đường Bùi Quốc Khánh, Khu phố 4",
    tenCoSoDeNghi: "Lớp mẫu giáo độc lập Sen Vàng",
    diaDiemCoSo: "Số 104 đường Yersin, Khu phố 2, Phường Phú Cường",
    khuPho: "Khu phố 2",
    ngayTiepNhan: "08/10/2026",
    ngayHenTra: "26/10/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    trangThai: "CHO_PHE_DUYET",
    thanhPhanHoSo: [
      {
        id: "GT-11",
        tenGiayTo: "Đơn đề nghị thành lập lớp mẫu giáo độc lập tư thục",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-12",
        tenGiayTo: "Đề án chi tiết tổ chức hoạt động và chương trình giáo dục mầm non",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-13",
        tenGiayTo: "Bản sao bằng tốt nghiệp Cử nhân Sư phạm mầm non người phụ trách",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-14",
        tenGiayTo: "Hợp đồng thuê nhà 05 năm & Bản vẽ mặt bằng phòng học 180m2",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-15",
        tenGiayTo: "Giấy thẩm duyệt PCCC và trang thiết bị PCCC cơ sở",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
    ],
    ketQuaThucDia: {
      ngayKiemTra: "15/10/2026",
      truongDoan: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
      daiDienYTe: "BS. Hoàng Minh Tuấn (Trạm Y tế)",
      daiDienCongAnPCCC: "Thiếu tá Lê Hồng Sơn (Công an phường)",
      ketLuan: "DAT_YEU_CAU",
      bienBanSo: "11/BB-LN/2026",
      noiDungKiemTra: "Phòng học thông thoáng, đồ chơi an toàn đạt chuẩn TT 32/2012, cầu thang có rào chắn inox chắc chắn, hồ sơ kiểm tra sức khỏe 100% bảo mẫu hợp lệ.",
    },
    toTrinh: {
      soToTrinh: "21/TTr-VHXH",
      ngayTrinh: "19/10/2026",
      nguoiTrinh: "ThS. Trần Thị Kim Oanh",
      chucVu: "Công chức Văn hóa - Xã hội phụ trách Giáo dục",
      noiDungTrinh: "Kính trình Chủ tịch UBND Phường xem xét, ký số ban hành Quyết định cho phép thành lập Lớp mẫu giáo độc lập Sen Vàng (Quy mô 40 trẻ, 5 giáo viên).",
    },
    quyetDinh: {
      soQuyetDinh: "172/QĐ-UBND",
      ngayBanHanh: "20/10/2026",
      nguoiKy: "TS. Nguyễn Văn Hùng",
      chucVu: "Chủ tịch UBND Phường Phú Cường",
      maXacThucKySo: "SHA256:99B81A-UBND-2026",
      noiDungQuyetDinh: "Cho phép thành lập Lớp mẫu giáo độc lập Sen Vàng tại 104 Yersin, Khu phố 2, do bà Phạm Thu Hằng làm chủ cơ sở.",
      daKySo: false,
    },
  },
  {
    id: "HSO-GD-003",
    maHoSo: "HSO-GD-2026-003",
    tenThuTuc: "Cho phép thành lập nhóm trẻ độc lập tư thục",
    maThuTuc: "TTHC-GD-BGD/01",
    nguoiNop: "Bà Vũ Mai Hoa",
    soDienThoai: "0908.332.112",
    cccd: "074190003456",
    diaChiLienHe: "Số 15/4 đường Ngô Quyền, Khu phố 5",
    tenCoSoDeNghi: "Nhóm trẻ tư thục Nụ Cười Xinh",
    diaDiemCoSo: "Số 68 đường Đoàn Trần Nghiệp, Khu phố 3",
    khuPho: "Khu phố 3",
    ngayTiepNhan: "14/10/2026",
    ngayHenTra: "31/10/2026",
    hinhThucNop: "DVC_TRUC_TUYEN_QUOC_GIA",
    canBoTiepNhan: "Hệ thống Cổng Dịch vụ công Quốc gia",
    canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    trangThai: "KIEM_TRA_THUC_DIA",
    thanhPhanHoSo: [
      {
        id: "GT-21",
        tenGiayTo: "Đơn đề nghị thành lập nhóm trẻ độc lập (nộp trực tuyến)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-22",
        tenGiayTo: "Đề án cơ sở vật chất và danh sách bảo mẫu dự kiến",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-23",
        tenGiayTo: "Bằng Cao đẳng Sư phạm mầm non của chủ cơ sở",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-24",
        tenGiayTo: "Hồ sơ thiết kế PCCC cơ sở hộ kinh doanh cá thể",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
    ],
  },
  {
    id: "HSO-GD-004",
    maHoSo: "HSO-GD-2026-004",
    tenThuTuc: "Chuyển địa điểm và mở rộng quy mô lớp mầm non độc lập",
    maThuTuc: "TTHC-GD-BGD/03",
    nguoiNop: "Ông Hoàng Đức Minh",
    soDienThoai: "0913.778.990",
    cccd: "074088001222",
    diaChiLienHe: "Số 45 đường Bùi Quốc Khánh, Khu phố 4",
    tenCoSoDeNghi: "Lớp mầm non độc lập Thỏ Trắng",
    diaDiemCoSo: "Số 120 đường Bùi Quốc Khánh, Khu phố 4",
    khuPho: "Khu phố 4",
    ngayTiepNhan: "12/10/2026",
    ngayHenTra: "23/10/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    trangThai: "YEU_CAU_BO_SUNG",
    lyDoBoSung: "1) Hợp đồng thuê mặt bằng mới chỉ có thời hạn 1 năm (quy định tối thiểu 3 năm); 2) Bổ sung Giấy khám sức khỏe định kỳ và Chứng nhận tập huấn VSATTP của 02 nhân viên cấp dưỡng mới tuyển.",
    hanBoSung: "25/10/2026",
    thanhPhanHoSo: [
      {
        id: "GT-31",
        tenGiayTo: "Đơn xin thay đổi địa điểm và quy mô hoạt động nhóm lớp",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-32",
        tenGiayTo: "Quyết định thành lập cũ số 88/QĐ-UBND",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-33",
        tenGiayTo: "Hợp đồng thuê mặt bằng mới (chưa đủ thời hạn tối thiểu 3 năm)",
        batBuoc: true,
        daNop: false,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
        ghiChu: "Cần công chứng phụ lục gia hạn ≥ 3 năm",
      },
      {
        id: "GT-34",
        tenGiayTo: "Chứng nhận tập huấn an toàn thực phẩm nhân viên cấp dưỡng",
        batBuoc: true,
        daNop: false,
        soLuong: 2,
        loaiBan: "BAN_SAO_CONG_CHUNG",
        ghiChu: "Thiếu chứng nhận cấp dưỡng mới",
      },
    ],
  },
  {
    id: "HSO-GD-005",
    maHoSo: "HSO-GD-2026-005",
    tenThuTuc: "Hỗ trợ tiền ăn trưa cho trẻ em mầm non và hỗ trợ chi phí học tập (Nghị định 81 & 105)",
    maThuTuc: "TTHC-GD-BGD/04",
    nguoiNop: "Trường Mầm non Hoa Mai (Đại diện: Cô Đỗ Thị Mai Liên)",
    soDienThoai: "0274.3822.450",
    cccd: "074175004321",
    diaChiLienHe: "Số 10 đường Quang Trung, Khu phố 1",
    tenCoSoDeNghi: "Trường Mầm non Công lập Hoa Mai",
    diaDiemCoSo: "Số 10 đường Quang Trung, Khu phố 1",
    khuPho: "Khu phố 1",
    ngayTiepNhan: "16/10/2026",
    ngayHenTra: "28/10/2026",
    hinhThucNop: "DVC_TRUC_TUYEN_QUOC_GIA",
    canBoTiepNhan: "Cổng DVC Tỉnh Bình Dương",
    canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    trangThai: "MOI_TIEP_NHAN",
    thanhPhanHoSo: [
      {
        id: "GT-41",
        tenGiayTo: "Danh sách tổng hợp 12 trẻ em thuộc diện hộ nghèo, cận nghèo đề nghị hỗ trợ tiền ăn trưa học kỳ I",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-42",
        tenGiayTo: "Bản sao Sổ hộ nghèo/cận nghèo và trích lục CCCD/VNeID của phụ huynh",
        batBuoc: true,
        daNop: true,
        soLuong: 12,
        loaiBan: "DOI_CHIEU_VNEID",
      },
      {
        id: "GT-43",
        tenGiayTo: "Đơn xin hỗ trợ chi phí học tập của cha mẹ trẻ có xác nhận của UBND xã/phường",
        batBuoc: true,
        daNop: true,
        soLuong: 12,
        loaiBan: "BAN_CHINH",
      },
    ],
  },
  {
    id: "HSO-GD-006",
    maHoSo: "HSO-GD-2026-006",
    tenThuTuc: "Cho phép thành lập nhóm trẻ độc lập tư thục",
    maThuTuc: "TTHC-GD-BGD/01",
    nguoiNop: "Bà Đặng Thị Bích Thủy",
    soDienThoai: "0909.112.334",
    cccd: "074189004567",
    diaChiLienHe: "Số 78 đường Cách Mạng Tháng Tám, Khu phố 1",
    tenCoSoDeNghi: "Nhóm trẻ tư thục Ong Vàng",
    diaDiemCoSo: "Số 92 đường Cách Mạng Tháng Tám, Khu phố 1",
    khuPho: "Khu phố 1",
    ngayTiepNhan: "25/09/2026",
    ngayHenTra: "16/10/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    trangThai: "DANG_THAM_DINH",
    thanhPhanHoSo: [
      {
        id: "GT-01",
        tenGiayTo: "Tờ trình / Đơn đề nghị cho phép thành lập nhóm trẻ độc lập tư thục (Mẫu số 01)",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-02",
        tenGiayTo: "Đề án thành lập nhóm trẻ",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
      },
      {
        id: "GT-03",
        tenGiayTo: "Bằng Cao đẳng Sư phạm mầm non",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-04",
        tenGiayTo: "Hợp đồng thuê địa điểm 3 năm",
        batBuoc: true,
        daNop: true,
        soLuong: 1,
        loaiBan: "BAN_SAO_CONG_CHUNG",
      },
      {
        id: "GT-05",
        tenGiayTo: "Biên bản kiểm tra an toàn PCCC (đang chờ cấp đổi)",
        batBuoc: true,
        daNop: false,
        soLuong: 1,
        loaiBan: "BAN_CHINH",
        ghiChu: "Chờ Công an PCCC phúc tra lại lối thoát hiểm",
      },
    ],
  },
];


