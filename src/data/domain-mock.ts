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
  | "GD_DT"
  | "VH_TT_DL";

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
  VH_TT_DL: {
    code: "VH_TT_DL",
    name: "Văn hóa, Thể thao & Đời sống Văn minh Đô thị",
    shortName: "Văn hóa & Thể thao",
    description: "Gia đình văn hóa NĐ 86/2023, Di tích & Lễ hội Chùa Bà, Tôn giáo, Kiểm tra Karaoke & Quảng cáo, Thiết chế văn hóa, Phòng chống bạo lực gia đình",
    color: "#7c3aed",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    path: "/van-hoa-xa-hoi",
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
  {
    id: "CNS-06",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 6",
    khuPho: "Khu phố 6",
    toTruong: "Phạm Văn Thành (Hội Cựu chiến binh)",
    sdtToTruong: "0912.345.678",
    soThanhVien: 8,
    soHoDanQuanLy: 410,
    tyLeCaiVNeIDPercent: 93.8,
    tyLeDVCPercent: 83.2,
    tyLeThanhToanSoPercent: 86.0,
    soBuoiRaQuan: 19,
    danhGiaHoatDong: "TOT",
  },
  {
    id: "CNS-07",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 7",
    khuPho: "Khu phố 7",
    toTruong: "Hoàng Thị Mai (Đoàn thanh niên)",
    sdtToTruong: "0945.678.901",
    soThanhVien: 7,
    soHoDanQuanLy: 395,
    tyLeCaiVNeIDPercent: 92.4,
    tyLeDVCPercent: 81.5,
    tyLeThanhToanSoPercent: 84.0,
    soBuoiRaQuan: 17,
    danhGiaHoatDong: "TOT",
  },
  {
    id: "CNS-08",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 8",
    khuPho: "Khu phố 8",
    toTruong: "Đặng Quốc Huy (Cán bộ CNTT)",
    sdtToTruong: "0978.901.234",
    soThanhVien: 9,
    soHoDanQuanLy: 460,
    tyLeCaiVNeIDPercent: 96.0,
    tyLeDVCPercent: 89.0,
    tyLeThanhToanSoPercent: 92.5,
    soBuoiRaQuan: 23,
    danhGiaHoatDong: "XUAT_SAC",
  },
  {
    id: "CNS-09",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 9",
    khuPho: "Khu phố 9",
    toTruong: "Bùi Thị Ngọc Loan (Hội Phụ nữ)",
    sdtToTruong: "0934.567.890",
    soThanhVien: 6,
    soHoDanQuanLy: 330,
    tyLeCaiVNeIDPercent: 91.0,
    tyLeDVCPercent: 78.5,
    tyLeThanhToanSoPercent: 80.0,
    soBuoiRaQuan: 15,
    danhGiaHoatDong: "TRUNG_BINH",
  },
  {
    id: "CNS-10",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 10",
    khuPho: "Khu phố 10",
    toTruong: "Nguyễn Hải Đăng (Chi đoàn)",
    sdtToTruong: "0967.890.123",
    soThanhVien: 8,
    soHoDanQuanLy: 405,
    tyLeCaiVNeIDPercent: 95.2,
    tyLeDVCPercent: 87.0,
    tyLeThanhToanSoPercent: 90.0,
    soBuoiRaQuan: 21,
    danhGiaHoatDong: "XUAT_SAC",
  },
  {
    id: "CNS-11",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 11",
    khuPho: "Khu phố 11",
    toTruong: "Trần Văn Phúc (Tổ trưởng dân phố)",
    sdtToTruong: "0989.012.345",
    soThanhVien: 7,
    soHoDanQuanLy: 375,
    tyLeCaiVNeIDPercent: 93.0,
    tyLeDVCPercent: 82.0,
    tyLeThanhToanSoPercent: 85.0,
    soBuoiRaQuan: 18,
    danhGiaHoatDong: "TOT",
  },
  {
    id: "CNS-12",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 12",
    khuPho: "Khu phố 12",
    toTruong: "Vũ Minh Tâm (Thanh niên tình nguyện)",
    sdtToTruong: "0913.456.789",
    soThanhVien: 8,
    soHoDanQuanLy: 415,
    tyLeCaiVNeIDPercent: 94.5,
    tyLeDVCPercent: 85.0,
    tyLeThanhToanSoPercent: 88.0,
    soBuoiRaQuan: 20,
    danhGiaHoatDong: "TOT",
  },
  {
    id: "CNS-13",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 13",
    khuPho: "Khu phố 13",
    toTruong: "Lâm Thị Cẩm Tú (Hội CTĐ)",
    sdtToTruong: "0946.789.012",
    soThanhVien: 7,
    soHoDanQuanLy: 350,
    tyLeCaiVNeIDPercent: 90.5,
    tyLeDVCPercent: 79.0,
    tyLeThanhToanSoPercent: 81.0,
    soBuoiRaQuan: 16,
    danhGiaHoatDong: "TRUNG_BINH",
  },
  {
    id: "CNS-14",
    tenTo: "Tổ Công nghệ số cộng đồng Khu phố 14",
    khuPho: "Khu phố 14",
    toTruong: "Đoàn Tấn Phát (Phó Bí thư Chi đoàn)",
    sdtToTruong: "0979.123.890",
    soThanhVien: 9,
    soHoDanQuanLy: 440,
    tyLeCaiVNeIDPercent: 95.8,
    tyLeDVCPercent: 88.5,
    tyLeThanhToanSoPercent: 91.5,
    soBuoiRaQuan: 22,
    danhGiaHoatDong: "XUAT_SAC",
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

export type TrangThaiHoSoAnSinh =
  | "CHO_THAM_DINH"
  | "DANG_XU_LY"
  | "CHO_LANH_DAO_KY"
  | "DA_KY_SO"
  | "DA_TRA_KET_QUA"
  | "YEU_CAU_BO_SUNG";

export interface HoSoTTHCAnSinhItem {
  id: string;
  maHoSo: string;
  tenThuTuc: string;
  maThuTuc: string;
  nguoiNop: string;
  cccd: string;
  soDienThoai: string;
  khuPho: string;
  diaChi: string;
  doiTuongThuHuong: string;
  loaiDoiTuong: string;
  mucTienHoTroVND: number;
  ngayTiepNhan: string;
  ngayHenTra: string;
  hinhThucNop: "TRUC_TIEP_MOT_CUA" | "DVC_TRUC_TUYEN_QUOC_GIA";
  trangThai: TrangThaiHoSoAnSinh;
  canBoTiepNhan: string;
  canBoThuLy: string;
  thanhPhanHoSo: Array<{
    tenGiayTo: string;
    batBuoc: boolean;
    daNop: boolean;
  }>;
  lyDoBoSung?: string;
  hanBoSung?: string;
  hoiDongThamDinh?: {
    ngayHop: string;
    chuTichHoiDong: string;
    ketLuan: "DAP_UNG_DIEU_KIEN" | "CHUA_DU_DIEU_KIEN";
    bienBanSo: string;
    mucHuongDeXuat: string;
  };
  quyetDinhKySo?: {
    soQuyetDinh: string;
    ngayKy: string;
    nguoiKy: string;
    chucVu: string;
    maXacThucSha256: string;
    noiDung: string;
    daKySo: boolean;
  };
  phieuXinLoi?: {
    soPhieu: string;
    ngayLap: string;
    lyDo: string;
    ngayHenMoi: string;
  };
}

export const initialHoSoTTHCAnSinhList: HoSoTTHCAnSinhItem[] = [
  {
    id: "HSO-AS-01",
    maHoSo: "HSO-TTHC-AS-2026-001",
    tenThuTuc: "Hỗ trợ chi phí mai táng cho đối tượng bảo trợ xã hội (Nghị định 20/2021/NĐ-CP)",
    maThuTuc: "TDM-AS-01",
    nguoiNop: "Lê Văn Hùng (Con trai)",
    cccd: "074068001234",
    soDienThoai: "0903.112.233",
    khuPho: "Khu phố 1",
    diaChi: "14/2 đường Quang Trung, Phường Thủ Dầu Một",
    doiTuongThuHuong: "Cụ bà Huỳnh Thị Lành (Từ trần ngày 18/10/2026)",
    loaiDoiTuong: "Người cao tuổi 80+ hưởng BTXH từ trần",
    mucTienHoTroVND: 7_200_000,
    ngayTiepNhan: "20/10/2026",
    ngayHenTra: "23/10/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    trangThai: "DA_KY_SO",
    canBoTiepNhan: "Võ Hoàng Nam (Cán bộ Một cửa)",
    canBoThuLy: "Lê Hoàng Nam (Công chức Văn hóa - Xã hội)",
    thanhPhanHoSo: [
      { tenGiayTo: "Tờ khai đề nghị hỗ trợ chi phí mai táng (Mẫu số 04 - NĐ 20)", batBuoc: true, daNop: true },
      { tenGiayTo: "Trích lục khai tử bản chính hoặc bản sao chứng thực", batBuoc: true, daNop: true },
      { tenGiayTo: "Bản sao CCCD và Sổ hộ khẩu của người đứng tên nhận hỗ trợ", batBuoc: true, daNop: true },
      { tenGiayTo: "Hóa đơn/hợp đồng dịch vụ tang lễ hoặc hỏa táng", batBuoc: false, daNop: true },
    ],
    hoiDongThamDinh: {
      ngayHop: "21/10/2026",
      chuTichHoiDong: "Nguyễn Văn Hùng (Chủ tịch Hội đồng xét duyệt xã hội)",
      ketLuan: "DAP_UNG_DIEU_KIEN",
      bienBanSo: "BB-HĐ-142/2026",
      mucHuongDeXuat: "Cấp hỗ trợ mai táng phí 7.200.000 VNĐ cho thân nhân",
    },
    quyetDinhKySo: {
      soQuyetDinh: "QĐ-UBND-198/QĐ-UBND",
      ngayKy: "22/10/2026",
      nguoiKy: "Nguyễn Văn Hùng",
      chucVu: "Chủ tịch UBND Phường Thủ Dầu Một",
      maXacThucSha256: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      noiDung: "Về việc trợ cấp chi phí mai táng cho thân nhân đối tượng bảo trợ xã hội từ trần theo Nghị định 20/2021/NĐ-CP",
      daKySo: true,
    },
  },
  {
    id: "HSO-AS-02",
    maHoSo: "HSO-TTHC-AS-2026-002",
    tenThuTuc: "Xác định mức độ khuyết tật và cấp Giấy xác nhận mức độ khuyết tật (Thông tư 01/2019/TT-BLĐTBXH)",
    maThuTuc: "TDM-AS-02",
    nguoiNop: "Trần Văn Bình",
    cccd: "074092004455",
    soDienThoai: "0912.889.900",
    khuPho: "Khu phố 2",
    diaChi: "88 đường Yersin, Phường Thủ Dầu Một",
    doiTuongThuHuong: "Trần Văn Bình",
    loaiDoiTuong: "Người khuyết tật vận động",
    mucTienHoTroVND: 1_350_000,
    ngayTiepNhan: "22/10/2026",
    ngayHenTra: "29/10/2026",
    hinhThucNop: "DVC_TRUC_TUYEN_QUOC_GIA",
    trangThai: "CHO_LANH_DAO_KY",
    canBoTiepNhan: "Cổng DVC Quốc gia (Liên thông)",
    canBoThuLy: "Lê Hoàng Nam (Công chức Văn hóa - Xã hội)",
    thanhPhanHoSo: [
      { tenGiayTo: "Đơn đề nghị xác định mức độ khuyết tật (Mẫu số 01 - TT 01/2019)", batBuoc: true, daNop: true },
      { tenGiayTo: "Bản tóm tắt bệnh án hoặc kết luận y khoa của Bệnh viện Đa khoa tỉnh", batBuoc: true, daNop: true },
      { tenGiayTo: "Bản sao CCCD 12 số định danh điện tử", batBuoc: true, daNop: true },
    ],
    hoiDongThamDinh: {
      ngayHop: "25/10/2026",
      chuTichHoiDong: "BS. Nguyễn Văn Hào (Trưởng trạm Y tế) & Lê Hoàng Nam",
      ketLuan: "DAP_UNG_DIEU_KIEN",
      bienBanSo: "BB-GĐ-KT-08/2026",
      mucHuongDeXuat: "Xác nhận mức độ khuyết tật: ĐẶC BIỆT NẶNG dạng Vận động",
    },
  },
  {
    id: "HSO-AS-03",
    maHoSo: "HSO-TTHC-AS-2026-003",
    tenThuTuc: "Trợ cấp xã hội hàng tháng cho người cao tuổi đủ 80 tuổi không có lương hưu (Nghị định 20/2021/NĐ-CP)",
    maThuTuc: "TDM-AS-03",
    nguoiNop: "Nguyễn Văn Hòa",
    cccd: "074046003322",
    soDienThoai: "0938.445.566",
    khuPho: "Khu phố 3",
    diaChi: "105 đường Cách Mạng Tháng Tám, Phường Thủ Dầu Một",
    doiTuongThuHuong: "Cụ ông Nguyễn Văn Hòa (Sinh ngày 02/09/1946 - đủ 80 tuổi)",
    loaiDoiTuong: "Người cao tuổi đủ 80 tuổi",
    mucTienHoTroVND: 540_000,
    ngayTiepNhan: "24/10/2026",
    ngayHenTra: "28/10/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    trangThai: "DANG_XU_LY",
    canBoTiepNhan: "Võ Hoàng Nam (Cán bộ Một cửa)",
    canBoThuLy: "Lê Hoàng Nam (Công chức Văn hóa - Xã hội)",
    thanhPhanHoSo: [
      { tenGiayTo: "Tờ khai thông tin người cao tuổi hưởng trợ cấp BTXH", batBuoc: true, daNop: true },
      { tenGiayTo: "Bản sao CCCD gắn chip (xác thực qua CSDLQG về Dân cư)", batBuoc: true, daNop: true },
      { tenGiayTo: "Giấy ủy quyền mở tài khoản an sinh xã hội Vietcombank", batBuoc: true, daNop: true },
    ],
  },
  {
    id: "HSO-AS-04",
    maHoSo: "HSO-TTHC-AS-2026-004",
    tenThuTuc: "Công nhận hộ nghèo, hộ cận nghèo phát sinh trong năm (Quyết định 24/2021/QĐ-TTg)",
    maThuTuc: "TDM-AS-04",
    nguoiNop: "Nguyễn Thị Lan",
    cccd: "074082008877",
    soDienThoai: "0977.123.456",
    khuPho: "Khu phố 4",
    diaChi: "Hẻm 45 đường Bạch Đằng, Phường Thủ Dầu Một",
    doiTuongThuHuong: "Hộ gia đình bà Nguyễn Thị Lan (3 nhân khẩu)",
    loaiDoiTuong: "Hộ gia đình gặp biến cố bệnh tật đột xuất",
    mucTienHoTroVND: 0,
    ngayTiepNhan: "26/10/2026",
    ngayHenTra: "05/11/2026",
    hinhThucNop: "TRUC_TIEP_MOT_CUA",
    trangThai: "CHO_THAM_DINH",
    canBoTiepNhan: "Võ Hoàng Nam (Cán bộ Một cửa)",
    canBoThuLy: "Lê Hoàng Nam (Công chức Văn hóa - Xã hội)",
    thanhPhanHoSo: [
      { tenGiayTo: "Giấy đề nghị rà soát hộ nghèo, hộ cận nghèo (Mẫu số 01 - QĐ 24)", batBuoc: true, daNop: true },
      { tenGiayTo: "Bản sao CCCD của các thành viên trong hộ gia đình", batBuoc: true, daNop: true },
      { tenGiayTo: "Phiếu khảo sát sơ bộ mức độ thiếu hụt việc làm và y tế", batBuoc: true, daNop: true },
    ],
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
    diaChiLienHe: "Số 34/6 đường CMT8, Phường Thủ Dầu Một, TP. Thủ Dầu Một",
    tenCoSoDeNghi: "Nhóm trẻ Ban Mai Xanh Cơ sở 2",
    diaDiemCoSo: "Số 52 đường Đoàn Trần Nghiệp, Khu phố 3, Phường Thủ Dầu Một",
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
      chucVu: "Chủ tịch UBND Phường Thủ Dầu Một",
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
    diaDiemCoSo: "Số 104 đường Yersin, Khu phố 2, Phường Thủ Dầu Một",
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
      chucVu: "Chủ tịch UBND Phường Thủ Dầu Một",
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

// ============================================================================
// 4. DỮ LIỆU MẢNG VĂN HÓA, THỂ THAO & ĐỜI SỐNG VĂN MINH ĐÔ THỊ (VH_TT_DL)
// Căn cứ: Nghị định 86/2023/NĐ-CP, Nghị định 54/2019/NĐ-CP, Luật Di sản VH,
// Luật Tín ngưỡng tôn giáo, Luật Phòng chống bạo lực gia đình 2022
// ============================================================================

export interface GiaDinhVanHoaItem {
  id: string;
  maHo: string;
  chuHo: string;
  cccd: string;
  diaChi: string;
  khuPho: string;
  soThanhVien: number;
  namDanhGia: number;
  diemGuongMau: number; // max 30đ
  diemKinhTe: number; // max 30đ
  diemHoaThuan: number; // max 40đ
  tongDiem: number; // max 100đ
  ketQua: "DAT_CHUAN" | "CHUA_DAT";
  namDatLienTuc: number;
  deNghiKhenThuong: boolean;
  nguoiChamDiem: string;
  ngayCham: string;
  ghiChu?: string;
}

export interface KhuPhoVanHoaItem {
  id: string;
  tenKhuPho: string;
  truongKhuPho: string;
  sdt: string;
  tongSoHo: number;
  soHoDatGiaDinhVanHoa: number;
  tyLeDatPercent: number;
  danhHieu: "KHU_PHO_VAN_HOA_XUAT_SAC" | "KHU_PHO_VAN_HOA" | "DANG_PHAN_DAU";
  tuyenDuongVanMinh: string;
  tieuChiDoThiVanMinh: {
    khongRac: boolean;
    khongLanChiemLongLeDuong: boolean;
    tuyenPhoCoHoa: boolean;
    anNinhTratTu: boolean;
  };
}

export interface DiTichLeHoiItem {
  id: string;
  tenDiTich: string;
  phanLoai: "DI_TICH_QUOC_GIA" | "DI_TICH_CAP_TINH" | "DANH_THANG" | "DI_SAN_PHI_VAT_THE";
  diaChi: string;
  phuong: string;
  namXepHang: number;
  banQuanLy: string;
  nguoiDaiDien: string;
  sdt: string;
  leHoiTieuBieu: string;
  thoiGianLeHoi: string;
  luongKhachUocTinh: number;
  congTacPCCC: "DAM_BAO_100%" | "DANG_BO_SUNG";
  soHoaQrAudioGuide: boolean;
  quanLyTienCongDuc: {
    tongThuNam2025: number;
    congKhaiMinhBach: boolean;
    soTaiKhoanKhoBac: string;
  };
}

export interface CoSoTonGiaoItem {
  id: string;
  tenCoSo: string;
  hePhai: "PHAT_GIAO" | "CONG_GIAO" | "TIN_LANH" | "CAO_DAI" | "TIN_NGUONG_DAN_GIAN";
  diaChi: string;
  khuPho: string;
  truTriChucSac: string;
  chucVu: string;
  sdt: string;
  soTinDoThuongXuyen: number;
  tinhTrangDangKy: "DA_DANG_KY_HANG_NAM" | "CHUA_DANG_KY";
  hoatDongTuThienNam: number;
  camKetAnNinhTratTu: boolean;
}

export interface CoSoDichVuVanHoaItem {
  id: string;
  tenCoSo: string;
  loaiHinh: "KARAOKE" | "QUAN_BAR_PUB" | "BI_A_CLUB" | "PHONG_GYM_FITNESS" | "BIEN_HIEU_QUANG_CAO";
  diaChi: string;
  khuPho: string;
  chuCoSo: string;
  sdt: string;
  giayPhepSo: string;
  ngayCap: string;
  tinhTrangPCCC: "DAT_TIEU_CHUAN" | "CHUA_DAT" | "DANG_KHAC_PHUC";
  lanKiemTraGanNhat: string;
  doanKiemTra: string;
  ketLuan: "CHUP_HANH_TOT" | "NHAC_NHO" | "LAP_BIEN_BAN_XU_PHAT" | "TAM_DINH_CHI";
  mucPhatVND: number;
  noiDungXuLy: string;
}

export interface ThietCheVanHoaItem {
  id: string;
  tenThietChe: string;
  loaiHinh: "TRUNG_TAM_VHTTCĐ" | "NHA_VAN_HOA_KHU_PHO" | "CLB_DON_CA_TAI_TU" | "DOI_LAN_SU_RONG" | "CLB_DUONG_SINH_NCT";
  diaDiem: string;
  khuPho: string;
  chuNhiem: string;
  sdt: string;
  soLuongThanhVien: number;
  lichSinhHoat: string;
  kinhPhiHoTroNam: number;
}

export interface DiaChiTinCayItem {
  id: string;
  tenDiaChi: string;
  loaiHinh: "NHA_DAN_TIEU_BIEU" | "VAN_PHONG_KHU_PHO" | "TRAM_Y_TE_PHUONG" | "HOI_LIEN_HIEP_PHU_NU";
  diaChi: string;
  khuPho: string;
  nguoiPhuTrach: string;
  chucVu: string;
  hotline: string;
  soVuViecTiepNhan: number;
  choTamLanhKhauCap: boolean;
  trangThai: "SAN_SANG_TIEP_NHAN" | "DANG_HO_TRO_NAN_NHAN";
}

// -------------------------------------------------------------
// DỮ LIỆU BAN ĐẦU: VĂN HÓA, THỂ THAO & NẾP SỐNG VĂN MINH ĐÔ THỊ
// -------------------------------------------------------------

export const initialGiaDinhVanHoaList: GiaDinhVanHoaItem[] = [
  {
    id: "GDVH-001",
    maHo: "HGD-PC-01-089",
    chuHo: "Ông Nguyễn Văn Hùng",
    cccd: "074060001234",
    diaChi: "Số 15/4 đường Đoàn Trần Nghiệp",
    khuPho: "Khu phố 1",
    soThanhVien: 4,
    namDanhGia: 2026,
    diemGuongMau: 30,
    diemKinhTe: 29,
    diemHoaThuan: 39,
    tongDiem: 98,
    ketQua: "DAT_CHUAN",
    namDatLienTuc: 5,
    deNghiKhenThuong: true,
    nguoiChamDiem: "Tổ trưởng TDP & Ban CTMT Khu phố 1",
    ngayCham: "15/10/2026",
    ghiChu: "Gia đình mẫu mực, con cháu hiếu thảo, tích cực ủng hộ Quỹ Khuyến học",
  },
  {
    id: "GDVH-002",
    maHo: "HGD-PC-02-142",
    chuHo: "Bà Lê Thị Hồng Thắm",
    cccd: "074165005678",
    diaChi: "Số 42 đường Thích Quảng Đức",
    khuPho: "Khu phố 2",
    soThanhVien: 3,
    namDanhGia: 2026,
    diemGuongMau: 28,
    diemKinhTe: 28,
    diemHoaThuan: 38,
    tongDiem: 94,
    ketQua: "DAT_CHUAN",
    namDatLienTuc: 3,
    deNghiKhenThuong: false,
    nguoiChamDiem: "Ban điều hành Khu phố 2",
    ngayCham: "16/10/2026",
  },
  {
    id: "GDVH-003",
    maHo: "HGD-PC-03-021",
    chuHo: "Ông Trần Quốc Toản",
    cccd: "074070009911",
    diaChi: "Số 89 đường Bạch Đằng",
    khuPho: "Khu phố 3",
    soThanhVien: 5,
    namDanhGia: 2026,
    diemGuongMau: 22,
    diemKinhTe: 24,
    diemHoaThuan: 25,
    tongDiem: 71,
    ketQua: "CHUA_DAT",
    namDatLienTuc: 0,
    deNghiKhenThuong: false,
    nguoiChamDiem: "Ban điều hành Khu phố 3",
    ngayCham: "18/10/2026",
    ghiChu: "Còn để rác thải sinh hoạt lấn chiếm lề đường, có phản ánh mâu thuẫn gia đình",
  },
  {
    id: "GDVH-004",
    maHo: "HGD-PC-04-055",
    chuHo: "Bà Phạm Thị Mỹ Lệ",
    cccd: "074158003322",
    diaChi: "Số 104 đường Yersin",
    khuPho: "Khu phố 4",
    soThanhVien: 4,
    namDanhGia: 2026,
    diemGuongMau: 30,
    diemKinhTe: 30,
    diemHoaThuan: 38,
    tongDiem: 98,
    ketQua: "DAT_CHUAN",
    namDatLienTuc: 7,
    deNghiKhenThuong: true,
    nguoiChamDiem: "Ban điều hành Khu phố 4",
    ngayCham: "19/10/2026",
    ghiChu: "Gia đình văn hóa tiêu biểu cấp Thành phố năm 2025",
  },
];

export const initialKhuPhoVanHoaList: KhuPhoVanHoaItem[] = [
  {
    id: "KPVH-01",
    tenKhuPho: "Khu phố 1, Phường Thủ Dầu Một",
    truongKhuPho: "Ông Đỗ Thanh Hải",
    sdt: "0913.882.112",
    tongSoHo: 540,
    soHoDatGiaDinhVanHoa: 528,
    tyLeDatPercent: 97.8,
    danhHieu: "KHU_PHO_VAN_HOA_XUAT_SAC",
    tuyenDuongVanMinh: "Tuyến đường Cách Mạng Tháng Tám (Đoạn qua KP1)",
    tieuChiDoThiVanMinh: {
      khongRac: true,
      khongLanChiemLongLeDuong: true,
      tuyenPhoCoHoa: true,
      anNinhTratTu: true,
    },
  },
  {
    id: "KPVH-02",
    tenKhuPho: "Khu phố 2, Phường Thủ Dầu Một",
    truongKhuPho: "Bà Vũ Thị Tuyết",
    sdt: "0908.445.667",
    tongSoHo: 620,
    soHoDatGiaDinhVanHoa: 598,
    tyLeDatPercent: 96.5,
    danhHieu: "KHU_PHO_VAN_HOA",
    tuyenDuongVanMinh: "Tuyến đường Thích Quảng Đức",
    tieuChiDoThiVanMinh: {
      khongRac: true,
      khongLanChiemLongLeDuong: false,
      tuyenPhoCoHoa: true,
      anNinhTratTu: true,
    },
  },
  {
    id: "KPVH-03",
    tenKhuPho: "Khu phố 3, Phường Thủ Dầu Một",
    truongKhuPho: "Ông Nguyễn Văn Nhơn",
    sdt: "0918.776.554",
    tongSoHo: 480,
    soHoDatGiaDinhVanHoa: 462,
    tyLeDatPercent: 96.3,
    danhHieu: "KHU_PHO_VAN_HOA",
    tuyenDuongVanMinh: "Tuyến phố đi bộ ven sông Bạch Đằng",
    tieuChiDoThiVanMinh: {
      khongRac: true,
      khongLanChiemLongLeDuong: true,
      tuyenPhoCoHoa: true,
      anNinhTratTu: true,
    },
  },
  {
    id: "KPVH-04",
    tenKhuPho: "Khu phố 4, Phường Thủ Dầu Một",
    truongKhuPho: "Ông Hoàng Văn Thái",
    sdt: "0983.221.998",
    tongSoHo: 510,
    soHoDatGiaDinhVanHoa: 489,
    tyLeDatPercent: 95.9,
    danhHieu: "KHU_PHO_VAN_HOA",
    tuyenDuongVanMinh: "Tuyến đường Yersin (Đoạn chợ hoa)",
    tieuChiDoThiVanMinh: {
      khongRac: true,
      khongLanChiemLongLeDuong: true,
      tuyenPhoCoHoa: false,
      anNinhTratTu: true,
    },
  },
];

export const initialDiTichLeHoiList: DiTichLeHoiItem[] = [
  {
    id: "DT-01",
    tenDiTich: "Miếu Bà Thiên Hậu (Chùa Bà Bình Dương)",
    phanLoai: "CO_SO_TIN_NGUONG",
    diaChi: "Số 04 đường Nguyễn Du, Phường Thủ Dầu Một, TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    namXepHang: 1993,
    banQuanLy: "Ban Trị sự Chùa Bà Thiên Hậu TP. Thủ Dầu Một",
    nguoiDaiDien: "Ông Vương Vĩnh Hiệp (Trưởng ban)",
    sdt: "0274.3822.451",
    leHoiTieuBieu: "Lễ hội Rằm tháng Giêng (Lễ hội Chùa Bà miễn phí lớn nhất Nam Bộ)",
    thoiGianLeHoi: "Từ ngày 13 đến 15 tháng Giêng Âm lịch hàng năm",
    luongKhachUocTinh: 1500000,
    congTacPCCC: "DAM_BAO_100%",
    soHoaQrAudioGuide: true,
    quanLyTienCongDuc: {
      tongThuNam2025: 4850000000,
      congKhaiMinhBach: true,
      soTaiKhoanKhoBac: "KB-TDM-7744112",
    },
  },
  {
    id: "DT-02",
    tenDiTich: "Chùa Hội Khánh (Di tích Lịch sử - Kiến trúc Nghệ thuật)",
    phanLoai: "DI_TICH_QUOC_GIA",
    diaChi: "Số 35 đường Yersin, Phường Thủ Dầu Một, TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    namXepHang: 1993,
    banQuanLy: "Giáo hội Phật giáo Việt Nam tỉnh Bình Dương",
    nguoiDaiDien: "Hòa thượng Thích Huệ Thông (Trụ trì)",
    sdt: "0274.3822.389",
    leHoiTieuBieu: "Đại lễ Phật đản & Tượng Phật nằm trên mái dài 52m kỷ lục châu Á",
    thoiGianLeHoi: "Rằm tháng 4 Âm lịch (Phật Đản) & Rằm tháng 7 (Vu Lan)",
    luongKhachUocTinh: 350000,
    congTacPCCC: "DAM_BAO_100%",
    soHoaQrAudioGuide: true,
    quanLyTienCongDuc: {
      tongThuNam2025: 1850000000,
      congKhaiMinhBach: true,
      soTaiKhoanKhoBac: "KB-TDM-9988221",
    },
  },
  {
    id: "DT-03",
    tenDiTich: "Đình Phú Cường (Ngôi đình cổ trên đồi Phú Cường)",
    phanLoai: "DI_TICH_CAP_TINH",
    diaChi: "Khu phố 2, Phường Thủ Dầu Một, TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    namXepHang: 2004,
    banQuanLy: "Ban Quý tế Đình Thần Phú Cường",
    nguoiDaiDien: "Cụ Trương Văn Lộc (Trưởng ban Quý tế)",
    sdt: "0918.445.123",
    leHoiTieuBieu: "Lễ hội Kỳ Yên Đình Phú Cường",
    thoiGianLeHoi: "Ngày 16 - 17 tháng 11 Âm lịch",
    luongKhachUocTinh: 45000,
    congTacPCCC: "DAM_BAO_100%",
    soHoaQrAudioGuide: true,
    quanLyTienCongDuc: {
      tongThuNam2025: 320000000,
      congKhaiMinhBach: true,
      soTaiKhoanKhoBac: "KB-TDM-1122334",
    },
  },
  {
    id: "DT-04",
    tenDiTich: "Chùa Tây Tạng (Kiến trúc Mật tông Tây Tạng độc đáo)",
    phanLoai: "DI_TICH_CAP_TINH",
    diaChi: "Số 46 đường Thích Quảng Đức, Phường Chánh Nghĩa, TP. Thủ Dầu Một",
    phuong: "Chánh Nghĩa",
    namXepHang: 2007,
    banQuanLy: "Hạ trường Chùa Tây Tạng",
    nguoiDaiDien: "Thượng tọa Thích Chơn Phát",
    sdt: "0274.3824.112",
    leHoiTieuBieu: "Kỷ lục Tượng Bồ Đề Đạt Ma bằng tóc lớn nhất Việt Nam",
    thoiGianLeHoi: "Lễ Vía Tổ Bồ Đề Đạt Ma tháng 10 Âm lịch",
    luongKhachUocTinh: 120000,
    congTacPCCC: "DAM_BAO_100%",
    soHoaQrAudioGuide: true,
    quanLyTienCongDuc: {
      tongThuNam2025: 680000000,
      congKhaiMinhBach: true,
      soTaiKhoanKhoBac: "KB-TDM-3344556",
    },
  },
];

export const initialCoSoTonGiaoList: CoSoTonGiaoItem[] = [
  {
    id: "TG-01",
    tenCoSo: "Chùa Bà Thiên Hậu",
    hePhai: "TIN_NGUONG_DAN_GIAN",
    diaChi: "Số 04 Nguyễn Du, Phường Thủ Dầu Một",
    khuPho: "Khu phố 1",
    truTriChucSac: "Ông Vương Vĩnh Hiệp",
    chucVu: "Trưởng Ban Trị sự",
    sdt: "0274.3822.451",
    soTinDoThuongXuyen: 25000,
    tinhTrangDangKy: "DA_DANG_KY_HANG_NAM",
    hoatDongTuThienNam: 1200000000,
    camKetAnNinhTratTu: true,
  },
  {
    id: "TG-02",
    tenCoSo: "Nhà thờ Chánh tòa Phú Cường (Giáo phận Phú Cường)",
    hePhai: "CONG_GIAO",
    diaChi: "Số 104 đường Lạc Long Quân, Phường Thủ Dầu Một",
    khuPho: "Khu phố 2",
    truTriChucSac: "Linh mục Antôn Hà Văn Minh",
    chucVu: "Chánh xứ Giáo xứ Phú Cường",
    sdt: "0274.3822.577",
    soTinDoThuongXuyen: 8500,
    tinhTrangDangKy: "DA_DANG_KY_HANG_NAM",
    hoatDongTuThienNam: 450000000,
    camKetAnNinhTratTu: true,
  },
  {
    id: "TG-03",
    tenCoSo: "Chùa Hội Khánh",
    hePhai: "PHAT_GIAO",
    diaChi: "Số 35 đường Yersin, Phường Thủ Dầu Một",
    khuPho: "Khu phố 3",
    truTriChucSac: "Hòa thượng Thích Huệ Thông",
    chucVu: "Phó Chủ tịch HĐTS TW GHPGVN, Trụ trì",
    sdt: "0274.3822.389",
    soTinDoThuongXuyen: 12000,
    tinhTrangDangKy: "DA_DANG_KY_HANG_NAM",
    hoatDongTuThienNam: 890000000,
    camKetAnNinhTratTu: true,
  },
  {
    id: "TG-04",
    tenCoSo: "Hội thánh Tin Lành Việt Nam - Chi hội Thủ Dầu Một",
    hePhai: "TIN_LANH",
    diaChi: "Số 12 đường Đoàn Trần Nghiệp, Phường Thủ Dầu Một",
    khuPho: "Khu phố 1",
    truTriChucSac: "Mục sư Nguyễn Văn Toàn",
    chucVu: "Quản nhiệm Chi hội",
    sdt: "0274.3833.441",
    soTinDoThuongXuyen: 1200,
    tinhTrangDangKy: "DA_DANG_KY_HANG_NAM",
    hoatDongTuThienNam: 150000000,
    camKetAnNinhTratTu: true,
  },
];

export const initialCoSoDichVuVanHoaList: CoSoDichVuVanHoaItem[] = [
  {
    id: "DVVH-01",
    tenCoSo: "Karaoke Họa Mi 3",
    loaiHinh: "KARAOKE",
    diaChi: "Số 18 đường Thích Quảng Đức, Khu phố 2",
    khuPho: "Khu phố 2",
    chuCoSo: "Ông Đinh Quang Minh",
    sdt: "0903.667.889",
    giayPhepSo: "GP-VH-2022/88",
    ngayCap: "12/05/2022",
    tinhTrangPCCC: "DAT_TIEU_CHUAN",
    lanKiemTraGanNhat: "14/09/2026",
    doanKiemTra: "Đoàn Kiểm tra Liên ngành 814 Phường Thủ Dầu Một",
    ketLuan: "CHUP_HANH_TOT",
    mucPhatVND: 0,
    noiDungXuLy: "Đảm bảo đúng giờ quy định (trước 24h00), không chốt cửa trong phòng hát, hệ thống báo cháy tự động hoạt động tốt",
  },
  {
    id: "DVVH-02",
    tenCoSo: "Bida Club Đại Nam",
    loaiHinh: "BI_A_CLUB",
    diaChi: "Số 125 đường Cách Mạng Tháng Tám, Khu phố 1",
    khuPho: "Khu phố 1",
    chuCoSo: "Bà Nguyễn Thị Kim Ngân",
    sdt: "0918.554.332",
    giayPhepSo: "GP-KD-2023/104",
    ngayCap: "04/08/2023",
    tinhTrangPCCC: "DAT_TIEU_CHUAN",
    lanKiemTraGanNhat: "18/09/2026",
    doanKiemTra: "Công an phường & Công chức Văn hóa",
    ketLuan: "CHUP_HANH_TOT",
    mucPhatVND: 0,
    noiDungXuLy: "Không phát hiện hiện tượng đánh bạc trá hình, niêm yết bảng giá dịch vụ đầy đủ",
  },
  {
    id: "DVVH-03",
    tenCoSo: "Bảng quảng cáo thẩm mỹ viện Seoul Center",
    loaiHinh: "BIEN_HIEU_QUANG_CAO",
    diaChi: "Số 68 đường Yersin, Khu phố 4",
    khuPho: "Khu phố 4",
    chuCoSo: "Công ty TNHH Seoul Center",
    sdt: "0909.112.233",
    giayPhepSo: "Chưa thông báo nội dung quảng cáo",
    ngayCap: "Chưa cấp",
    tinhTrangPCCC: "CHUA_DAT",
    lanKiemTraGanNhat: "22/09/2026",
    doanKiemTra: "Tổ Quản lý Trật tự đô thị & Văn hóa phường",
    ketLuan: "LAP_BIEN_BAN_XU_PHAT",
    mucPhatVND: 7500000,
    noiDungXuLy: "Lắp đặt biển quảng cáo vượt quá kích thước quy định (chiều cao 5m lấn chiếm khoảng không chỉ giới đường đỏ). Buộc tháo dỡ trong 3 ngày.",
  },
  {
    id: "DVVH-04",
    tenCoSo: "Phòng Gym & Fitness BodyFit",
    loaiHinh: "PHONG_GYM_FITNESS",
    diaChi: "Số 39 đường Bạch Đằng, Khu phố 3",
    khuPho: "Khu phố 3",
    chuCoSo: "Ông Lê Hoàng Tuấn",
    sdt: "0977.889.001",
    giayPhepSo: "GP-TT-2024/15",
    ngayCap: "15/01/2024",
    tinhTrangPCCC: "DAT_TIEU_CHUAN",
    lanKiemTraGanNhat: "05/09/2026",
    doanKiemTra: "Đoàn Kiểm tra TDTT phường",
    ketLuan: "CHUP_HANH_TOT",
    mucPhatVND: 0,
    noiDungXuLy: "Huấn luyện viên có chứng chỉ chuyên môn, trang bị đầy đủ tủ thuốc sơ cứu chấn thương",
  },
];

export const initialThietCheVanHoaList: ThietCheVanHoaItem[] = [
  {
    id: "TCVH-01",
    tenThietChe: "Trung tâm Văn hóa - Thể thao & Học tập cộng đồng Phường Thủ Dầu Một",
    loaiHinh: "TRUNG_TAM_VHTTCĐ",
    diaDiem: "Số 02 đường Cách Mạng Tháng Tám, Phường Thủ Dầu Một",
    khuPho: "Khu phố 1",
    chuNhiem: "Bà Nguyễn Thị Ngọc Giàu (Phó Chủ tịch UBND)",
    sdt: "0274.3822.459",
    soLuongThanhVien: 120,
    lichSinhHoat: "Hàng ngày (06h00 - 21h30)",
    kinhPhiHoTroNam: 150000000,
  },
  {
    id: "TCVH-02",
    tenThietChe: "Câu lạc bộ Đờn ca tài tử Nam Bộ Phường Thủ Dầu Một",
    loaiHinh: "CLB_DON_CA_TAI_TU",
    diaDiem: "Hội trường Nhà văn hóa Khu phố 3 (Bờ kè Bạch Đằng)",
    khuPho: "Khu phố 3",
    chuNhiem: "Nghệ nhân Ưu tú Trần Văn Sang",
    sdt: "0913.774.221",
    soLuongThanhVien: 28,
    lichSinhHoat: "Tối thứ Bảy & Chủ nhật hàng tuần (19h00 - 21h00)",
    kinhPhiHoTroNam: 45000000,
  },
  {
    id: "TCVH-03",
    tenThietChe: "Đội Lân Sư Rồng Hào Dũng Đường Phú Cường",
    loaiHinh: "DOI_LAN_SU_RONG",
    diaDiem: "Sân vận động Trung tâm VHTT phường",
    khuPho: "Khu phố 2",
    chuNhiem: "Võ sư Huỳnh Văn Dũng",
    sdt: "0908.113.445",
    soLuongThanhVien: 42,
    lichSinhHoat: "Thứ Ba, Năm, Bảy (18h30 - 20h30)",
    kinhPhiHoTroNam: 35000000,
  },
  {
    id: "TCVH-04",
    tenThietChe: "Câu lạc bộ Thể dục Dưỡng sinh Người cao tuổi",
    loaiHinh: "CLB_DUONG_SINH_NCT",
    diaDiem: "Công viên Bạch Đằng, Khu phố 3",
    khuPho: "Khu phố 3",
    chuNhiem: "Bà Lương Thị Mai (Chủ tịch Hội Người cao tuổi)",
    sdt: "0982.556.778",
    soLuongThanhVien: 65,
    lichSinhHoat: "Mỗi sáng sớm (05h15 - 06h30)",
    kinhPhiHoTroNam: 20000000,
  },
];

export const initialDiaChiTinCayList: DiaChiTinCayItem[] = [
  {
    id: "DCTC-01",
    tenDiaChi: "Địa chỉ tin cậy Nhà bà Lê Thị Hòa (Chi hội trưởng Phụ nữ KP1)",
    loaiHinh: "NHA_DAN_TIEU_BIEU",
    diaChi: "Số 23 đường Đoàn Trần Nghiệp, Khu phố 1",
    khuPho: "Khu phố 1",
    nguoiPhuTrach: "Bà Lê Thị Hòa",
    chucVu: "Chi hội trưởng Phụ nữ Khu phố 1",
    hotline: "0918.223.445",
    soVuViecTiepNhan: 4,
    choTamLanhKhauCap: true,
    trangThai: "SAN_SANG_TIEP_NHAN",
  },
  {
    id: "DCTC-02",
    tenDiaChi: "Văn phòng Ban Điều hành Khu phố 2",
    loaiHinh: "VAN_PHONG_KHU_PHO",
    diaChi: "Số 56 đường Thích Quảng Đức, Khu phố 2",
    khuPho: "Khu phố 2",
    nguoiPhuTrach: "Ông Nguyễn Văn Thành",
    chucVu: "Tổ trưởng Tổ Hòa giải cơ sở KP2",
    hotline: "0903.887.665",
    soVuViecTiepNhan: 6,
    choTamLanhKhauCap: true,
    trangThai: "SAN_SANG_TIEP_NHAN",
  },
  {
    id: "DCTC-03",
    tenDiaChi: "Trạm Y tế Phường Thủ Dầu Một (Điểm sơ cứu & hỗ trợ y tế nạn nhân)",
    loaiHinh: "TRAM_Y_TE_PHUONG",
    diaChi: "Số 14 đường Cách Mạng Tháng Tám, Khu phố 1",
    khuPho: "Khu phố 1",
    nguoiPhuTrach: "Bác sĩ Nguyễn Văn Hào",
    chucVu: "Trưởng Trạm Y tế phường",
    hotline: "0274.3822.311",
    soVuViecTiepNhan: 2,
    choTamLanhKhauCap: true,
    trangThai: "SAN_SANG_TIEP_NHAN",
  },
  {
    id: "DCTC-04",
    tenDiaChi: "Hội Liên hiệp Phụ nữ Phường Thủ Dầu Một",
    loaiHinh: "HOI_LIEN_HIEP_PHU_NU",
    diaChi: "Tầng 2, Trụ sở UBND Phường Thủ Dầu Một, số 02 CMT8",
    khuPho: "Khu phố 1",
    nguoiPhuTrach: "Bà Trần Thị Ngọc Lan",
    chucVu: "Chủ tịch Hội LHPN phường",
    hotline: "0908.991.223",
    soVuViecTiepNhan: 8,
    choTamLanhKhauCap: true,
    trangThai: "DANG_HO_TRO_NAN_NHAN",
  },
];

// ============================================================================
// 5. LÀNG NGHỀ TRUYỀN THỐNG, BẢN ĐỒ SỐ GIS VĂN HÓA & HỒ SƠ TTHC VĂN HÓA
// ============================================================================

export interface LangNgheTruyenThongItem {
  id: string;
  tenLangNghe: string;
  loaiDiSan: "QUOC_GIA" | "CAP_TINH";
  sanPhamChinh: string;
  diaBan: string;
  phuong: string;
  soHoSanXuat: number;
  soNgeNhanUuTu: number;
  namCongNhan: number;
  nguoiDaiDienHoiNghe: string;
  sdt: string;
  tinhTrangBaoTon: "PHAT_TRIEN_TOT" | "CAN_HO_TRO_MAT_BANG" | "NGUY_CO_MAI_MOT";
  moTa: string;
}

export interface GisDiaDiemVanHoaItem {
  id: string;
  tenDiaDiem: string;
  loaiHinh: "DI_TICH_LICH_SU" | "DI_SAN_VAN_HOA" | "CO_SO_TON_GIAO" | "LANG_NGHE" | "THIET_CHE_THE_THAO" | "DIEM_DU_LICH_CHECKIN";
  toaDo: { lat: number; lng: number };
  diaChi: string;
  phuong: string;
  gioMoCua: string;
  giaVe: string;
  soDienThoai: string;
  qrAudioGuideUrl: string;
  luotKhachThang: number;
  danhGiaSao: number;
  moTaNgan: string;
  hinhAnhUrl?: string;
}

export interface HoSoBaoLucGiaDinhItem {
  id: string;
  maVuViec: string;
  ngayTiepNhan: string;
  nguoiBaoTin: string;
  nanNhan: {
    hoTen: string;
    cccd: string;
    quanHe: string;
    tinhTrangThuongTich: string;
  };
  nguoiGayBaoLuc: {
    hoTen: string;
    cccd: string;
    hanhVi: string;
  };
  diaChiVuViec: string;
  khuPho: string;
  bienPhapBaoVe: "TAM_LANH_DIA_CHI_TIN_CAY" | "HOA_GIAI_CO_SO" | "CAM_TIEP_XUC_UBND";
  soQuyetDinhCamTiepXuc?: string;
  thoiHanCamNgay?: number;
  canBoThuLy: string;
  trangThai: "DANG_XU_LY" | "DA_HOA_GIAI_ON_DINH" | "CHUYEN_CO_QUAN_CONG_AN";
  bienBanGhiNhan: string;
}

export interface HoSoTTHCVanHoaItem {
  id: string;
  maHoSo: string;
  tenThuTuc: string;
  maThuTuc: string;
  nguoiNop: string;
  sdt: string;
  cccd: string;
  diaChi: string;
  khuPho: string;
  ngayTiepNhan: string;
  ngayHenTra: string;
  canBoTiepNhan: string;
  canBoThuLy: string;
  trangThai: "TIEP_NHAN" | "DANG_THAM_DINH" | "TRINH_LANH_DAO" | "CHO_TRA_KET_QUA" | "DA_HOAN_THANH";
  kySoSmartCA?: {
    nguoiKy: string;
    chucVu: string;
    ngayKy: string;
    maXacThuc: string;
  };
  ketQuaVanBan: string;
}

export const initialLangNgheList: LangNgheTruyenThongItem[] = [
  {
    id: "LN-01",
    tenLangNghe: "Làng nghề Sơn mài Tương Bình Hiệp",
    loaiDiSan: "QUOC_GIA",
    sanPhamChinh: "Tranh sơn mài khảm ốc, đĩa sơn mài cẩn trứng, bình gốm sơn mài nghệ thuật",
    diaBan: "Khu phố 1 & 2, Phường Tương Bình Hiệp, TP. Thủ Dầu Một",
    phuong: "Tương Bình Hiệp",
    soHoSanXuat: 85,
    soNgeNhanUuTu: 12,
    namCongNhan: 2016,
    nguoiDaiDienHoiNghe: "Nghệ nhân Ưu tú Lê Bá Linh (Phó Chủ tịch Hiệp hội Sơn mài)",
    sdt: "0913.998.776",
    tinhTrangBaoTon: "PHAT_TRIEN_TOT",
    moTa: "Di sản văn hóa phi vật thể Quốc gia với hơn 300 năm hình thành và phát triển, nổi danh khắp trong nước và quốc tế.",
  },
  {
    id: "LN-02",
    tenLangNghe: "Lò lu Đại Hưng (Lò gốm cổ hơn 160 năm tuổi)",
    loaiDiSan: "CAP_TINH",
    sanPhamChinh: "Lu, khạp, hũ, chậu gốm nung củi truyền thống",
    diaBan: "Ấp 1, Phường Tương Bình Hiệp, TP. Thủ Dầu Một",
    phuong: "Tương Bình Hiệp",
    soHoSanXuat: 1,
    soNgeNhanUuTu: 3,
    namCongNhan: 2006,
    nguoiDaiDienHoiNghe: "Ông Bùi Văn Giang (Chủ cơ sở Lò lu Đại Hưng)",
    sdt: "0274.3829.445",
    tinhTrangBaoTon: "CAN_HO_TRO_MAT_BANG",
    moTa: "Cơ sở sản xuất gốm gia dụng thủ công cổ nhất vùng đất Nam Bộ còn giữ nguyên vẹn phương pháp nung lu bằng lò rồng truyền thống.",
  },
  {
    id: "LN-03",
    tenLangNghe: "Làng nghề Điêu khắc mộc Chánh Nghĩa - Phú Thọ",
    loaiDiSan: "CAP_TINH",
    sanPhamChinh: "Bàn ghế gỗ gõ đỏ, tủ thờ cẩn xà cừ, hoành phi câu đối truyền thống",
    diaBan: "Khu phố 4, Phường Chánh Nghĩa & Phường Phú Thọ",
    phuong: "Chánh Nghĩa",
    soHoSanXuat: 45,
    soNgeNhanUuTu: 4,
    namCongNhan: 2008,
    nguoiDaiDienHoiNghe: "Nghệ nhân Nguyễn Văn Cảnh",
    sdt: "0908.445.112",
    tinhTrangBaoTon: "PHAT_TRIEN_TOT",
    moTa: "Nghề điêu khắc gỗ tinh xảo gắn liền với kiến trúc nhà cổ Nam Bộ trên đất Thủ.",
  },
  {
    id: "LN-04",
    tenLangNghe: "Làng nghề Guốc mộc Phú Văn",
    loaiDiSan: "CAP_TINH",
    sanPhamChinh: "Guốc mộc vẽ hoa văn sơn mài, guốc mộc truyền thống Nam Bộ",
    diaBan: "Khu phố Phú Văn, Phường Phú Thọ, TP. Thủ Dầu Một",
    phuong: "Phú Thọ",
    soHoSanXuat: 18,
    soNgeNhanUuTu: 2,
    namCongNhan: 2010,
    nguoiDaiDienHoiNghe: "Bà Trần Thị Thanh Thúy",
    sdt: "0918.776.331",
    tinhTrangBaoTon: "NGUY_CO_MAI_MOT",
    moTa: "Làng nghề guốc mộc lâu đời phục vụ xuất khẩu sang Pháp, Nhật và các tỉnh miền Tây trước đây, đang được hỗ trợ đào tạo nghề giữ gìn di sản.",
  },
];

export const initialGisDiaDiemList: GisDiaDiemVanHoaItem[] = [
  {
    id: "GIS-01",
    tenDiaDiem: "Miếu Bà Thiên Hậu (Chùa Bà Bình Dương)",
    loaiHinh: "DI_SAN_VAN_HOA",
    toaDo: { lat: 10.9805, lng: 106.6543 },
    diaChi: "Số 04 đường Nguyễn Du, Phường Thủ Dầu Một",
    phuong: "Phú Cường",
    gioMoCua: "05:00 - 21:00 (Mở 24/24 mùa lễ hội Rằm tháng Giêng)",
    giaVe: "Miễn phí",
    soDienThoai: "0274.3822.451",
    qrAudioGuideUrl: "https://dichvucong.binhduong.gov.vn/qr/chua-ba",
    luotKhachThang: 180000,
    danhGiaSao: 4.9,
    moTaNgan: "Điểm đến tâm linh nổi tiếng bậc nhất Đông Nam Bộ, nổi tiếng với Lễ hội nghĩa tình miễn phí.",
  },
  {
    id: "GIS-02",
    tenDiaDiem: "Chùa Hội Khánh & Tượng Phật nằm kỷ lục châu Á",
    loaiHinh: "DI_TICH_LICH_SU",
    toaDo: { lat: 10.9789, lng: 106.6582 },
    diaChi: "Số 35 đường Yersin, Phường Thủ Dầu Một",
    phuong: "Phú Cường",
    gioMoCua: "06:00 - 18:30",
    giaVe: "Miễn phí",
    soDienThoai: "0274.3822.389",
    qrAudioGuideUrl: "https://dichvucong.binhduong.gov.vn/qr/chua-hoi-khanh",
    luotKhachThang: 65000,
    danhGiaSao: 4.8,
    moTaNgan: "Di tích Lịch sử - Văn hóa cấp Quốc gia với tượng Phật nhập niết bàn trên mái dài 52m lớn nhất châu Á.",
  },
  {
    id: "GIS-03",
    tenDiaDiem: "Đình Thần Phú Cường",
    loaiHinh: "DI_TICH_LICH_SU",
    toaDo: { lat: 10.9812, lng: 106.6511 },
    diaChi: "Khu phố 2, Phường Thủ Dầu Một",
    phuong: "Phú Cường",
    gioMoCua: "07:00 - 17:00",
    giaVe: "Miễn phí",
    soDienThoai: "0918.445.123",
    qrAudioGuideUrl: "https://dichvucong.binhduong.gov.vn/qr/dinh-phu-cuong",
    luotKhachThang: 12000,
    danhGiaSao: 4.7,
    moTaNgan: "Ngôi đình cổ tọa lạc trên gò đồi trung tâm Thủ Dầu Một, lưu giữ nhiều hiện vật quý và lễ hội Kỳ Yên truyền thống.",
  },
  {
    id: "GIS-04",
    tenDiaDiem: "Nhà thờ Chánh tòa Giáo phận Phú Cường",
    loaiHinh: "CO_SO_TON_GIAO",
    toaDo: { lat: 10.9819, lng: 106.6534 },
    diaChi: "Số 104 đường Lạc Long Quân, Phường Thủ Dầu Một",
    phuong: "Phú Cường",
    gioMoCua: "05:00 - 19:30",
    giaVe: "Miễn phí",
    soDienThoai: "0274.3822.577",
    qrAudioGuideUrl: "https://dichvucong.binhduong.gov.vn/qr/nha-tho-phu-cuong",
    luotKhachThang: 45000,
    danhGiaSao: 4.8,
    moTaNgan: "Nhà thờ kiến trúc Gothic hiện đại tráng lệ tại trung tâm Ngã Sáu Phú Cường.",
  },
  {
    id: "GIS-05",
    tenDiaDiem: "Phố đi bộ & Công viên ven sông Bạch Đằng",
    loaiHinh: "DIEM_DU_LICH_CHECKIN",
    toaDo: { lat: 10.9795, lng: 106.6508 },
    diaChi: "Đường Bạch Đằng, Phường Thủ Dầu Một",
    phuong: "Phú Cường",
    gioMoCua: "Mở cả ngày (Chợ đêm & ẩm thực từ 17:00 - 23:00)",
    giaVe: "Miễn phí",
    soDienThoai: "0274.3822.459",
    qrAudioGuideUrl: "https://dichvucong.binhduong.gov.vn/qr/pho-di-bo-bach-dang",
    luotKhachThang: 125000,
    danhGiaSao: 4.8,
    moTaNgan: "Không gian sinh hoạt văn hóa ngoài trời, biểu diễn Đờn ca tài tử và ngắm hoàng hôn sông Sài Gòn.",
  },
  {
    id: "GIS-06",
    tenDiaDiem: "Lò lu Đại Hưng - Gốm nung củi truyền thống",
    loaiHinh: "LANG_NGHE",
    toaDo: { lat: 11.0145, lng: 106.6465 },
    diaChi: "Phường Tương Bình Hiệp, TP. Thủ Dầu Một",
    phuong: "Tương Bình Hiệp",
    gioMoCua: "07:30 - 17:00",
    giaVe: "Miễn phí",
    soDienThoai: "0274.3829.445",
    qrAudioGuideUrl: "https://dichvucong.binhduong.gov.vn/qr/lo-lu-dai-hung",
    luotKhachThang: 18000,
    danhGiaSao: 4.9,
    moTaNgan: "Lò gốm cổ bậc nhất Đông Nam Bộ, điểm check-in di sản văn hóa và trải nghiệm làm gốm bằng tay.",
  },
];

export const initialBaoLucGiaDinhList: HoSoBaoLucGiaDinhItem[] = [
  {
    id: "BLGD-2026-001",
    maVuViec: "BLGD-PC-2026/01",
    ngayTiepNhan: "12/09/2026",
    nguoiBaoTin: "Bà Lê Thị Hòa (Chi hội trưởng Phụ nữ KP1)",
    nanNhan: {
      hoTen: "Chị Nguyễn Thị Mai",
      cccd: "074189004512",
      quanHe: "Vợ",
      tinhTrangThuongTich: "Bầm tím cánh tay, hoảng loạn tinh thần",
    },
    nguoiGayBaoLuc: {
      hoTen: "Trần Văn Bình",
      cccd: "074085002341",
      hanhVi: "Bạo lực thể xác và tinh thần sau khi sử dụng rượu bia",
    },
    diaChiVuViec: "Số 28/3 đường Đoàn Trần Nghiệp, Khu phố 1",
    khuPho: "Khu phố 1",
    bienPhapBaoVe: "CAM_TIEP_XUC_UBND",
    soQuyetDinhCamTiepXuc: "QĐ-UBND-CTX/08",
    thoiHanCamNgay: 3,
    canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    trangThai: "DA_HOA_GIAI_ON_DINH",
    bienBanGhiNhan: "Chủ tịch UBND Phường ban hành Quyết định cấm tiếp xúc 03 ngày; người chồng đã viết bản cam kết không tái phạm.",
  },
  {
    id: "BLGD-2026-002",
    maVuViec: "BLGD-PC-2026/02",
    ngayTiepNhan: "24/09/2026",
    nguoiBaoTin: "Tổ bảo vệ an ninh trật tự cơ sở Khu phố 3",
    nanNhan: {
      hoTen: "Bà Vũ Thị Lan",
      cccd: "074160007890",
      quanHe: "Mẹ đẻ",
      tinhTrangThuongTich: "Bị đe dọa, xúc phạm danh dự",
    },
    nguoiGayBaoLuc: {
      hoTen: "Vũ Quốc Hùng",
      cccd: "074092003344",
      hanhVi: "Đập phá tài sản gia đình, xúc phạm người cao tuổi",
    },
    diaChiVuViec: "Số 64 đường Bạch Đằng, Khu phố 3",
    khuPho: "Khu phố 3",
    bienPhapBaoVe: "TAM_LANH_DIA_CHI_TIN_CAY",
    canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    trangThai: "DANG_XU_LY",
    bienBanGhiNhan: "Đã bố trí bà Lan tạm lánh an toàn tại Văn phòng Ban điều hành KP3, Công an phường đang xử lý hành vi đập phá tài sản.",
  },
];

export const initialHoSoTTHCVanHoaList: HoSoTTHCVanHoaItem[] = [
  {
    id: "TTHC-VH-01",
    maHoSo: "HSO-VH-2026-001",
    tenThuTuc: "Đăng ký thành lập Câu lạc bộ văn hóa, thể dục thể thao cơ sở",
    maThuTuc: "TTHC-VHTT-UBND/01",
    nguoiNop: "Ông Trần Văn Sang (Nghệ nhân Ưu tú)",
    sdt: "0913.774.221",
    cccd: "074055001234",
    diaChi: "Số 15 đường Bạch Đằng, Khu phố 3",
    khuPho: "Khu phố 3",
    ngayTiepNhan: "18/09/2026",
    ngayHenTra: "25/09/2026",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    trangThai: "DA_HOAN_THANH",
    kySoSmartCA: {
      nguoiKy: "Nguyễn Thị Ngọc Giàu",
      chucVu: "Phó Chủ tịch UBND Phường Thủ Dầu Một",
      ngayKy: "24/09/2026 15:42",
      maXacThuc: "SHA256:77AA11BC-20260924",
    },
    ketQuaVanBan: "Quyết định số 142/QĐ-UBND công nhận Ban Chủ nhiệm CLB Đờn ca tài tử Phường Thủ Dầu Một",
  },
  {
    id: "TTHC-VH-02",
    maHoSo: "HSO-VH-2026-002",
    tenThuTuc: "Thông báo tổ chức hoạt động biểu diễn nghệ thuật quần chúng",
    maThuTuc: "TTHC-VHTT-UBND/02",
    nguoiNop: "Bà Lương Thị Mai (Chủ tịch Hội Người cao tuổi)",
    sdt: "0982.556.778",
    cccd: "074152009988",
    diaChi: "Số 02 đường Cách Mạng Tháng Tám",
    khuPho: "Khu phố 1",
    ngayTiepNhan: "26/09/2026",
    ngayHenTra: "01/10/2026",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    trangThai: "DANG_THAM_DINH",
    ketQuaVanBan: "Giấy xác nhận thông báo biểu diễn văn nghệ Mừng ngày Quốc tế Người cao tuổi 01/10",
  },
  {
    id: "TTHC-VH-03",
    maHoSo: "HSO-VH-2026-003",
    tenThuTuc: "Đăng ký sinh hoạt tôn giáo tập trung",
    maThuTuc: "TTHC-TG-UBND/01",
    nguoiNop: "Mục sư Nguyễn Văn Toàn",
    sdt: "0274.3833.441",
    cccd: "074068005544",
    diaChi: "Số 12 đường Đoàn Trần Nghiệp, Khu phố 1",
    khuPho: "Khu phố 1",
    ngayTiepNhan: "28/09/2026",
    ngayHenTra: "12/10/2026",
    canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
    canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    trangThai: "DANG_THAM_DINH",
    ketQuaVanBan: "Văn bản chấp thuận địa điểm đăng ký sinh hoạt tôn giáo tập trung (Điểm nhóm Phú Cường)",
  },
];

// ============================================================================
// 6. ĐIỀU HÀNH LÃNH ĐẠO, CHECK-IN SẢN PHẨM KPI, CHAT NỘI BỘ & HỌP TRỰC TUYẾN
// ============================================================================

export interface ProductCheckInItem {
  id: string;
  maSanPham: string;
  tenSanPham: string;
  loaiSanPham: "BIEN_BAN" | "QUYET_DINH" | "TO_TRINH" | "BAO_CAO" | "KE_HOACH" | "GIAY_PHEP";
  canBoNop: string;
  chucVu: string;
  domain: DomainCode;
  ngayNop: string;
  fileDinhKem: string;
  moTa: string;
  trangThai: "CHO_LANH_DAO_DUYET" | "DA_PHE_CHUAN" | "YEU_CAU_BO_SUNG";
  yKienLanhDao?: string;
  diemDanhGia?: number; // 1-5 sao
  ngayPheDuyet?: string;
  lanhDaoPheDuyet?: string;
}

export interface TaskAssignmentItem {
  id: string;
  maCongViec: string;
  tieuDe: string;
  canBoPhuTrach: string;
  chucVu: string;
  domain: DomainCode;
  nguoiGiaoViec: string;
  chucVuNguoiGiao: string;
  ngayGiao: string;
  hanChot: string;
  mucDoUuTien: "HOA_TOC" | "KHAN" | "THUONG";
  sanPhamYeuCau: string;
  trangThai: "MOI_GIAO" | "DANG_THUC_HIEN" | "CHO_DUYET_CHECKIN" | "HOAN_THANH";
  tienDoPercent: number;
  checkInId?: string;
}

export interface InternalChatMessage {
  id: string;
  channelId: string; // "toan-phuong" | "van-hoa-814" | "giao-duc" | "mot-cua" | "direct-tung" | "direct-oanh"
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  timestamp: string;
  content: string;
  isImportant?: boolean;
  attachedTask?: {
    id: string;
    title: string;
    deadline: string;
  };
}

export interface OnlineMeetingItem {
  id: string;
  maCuocHop: string;
  tieuDe: string;
  thoiGian: string;
  chuTri: string;
  thanhPhanThamDu: string[];
  diaDiem: string;
  phongHopOnlineUrl: string;
  trangThai: "SAP_DIEN_RA" | "DANG_HOP" | "DA_KET_THUC";
  taiLieuDinhKem: string[];
  noiDungTomTat: string;
  ketLuanCuocHop?: string;
}

export const initialProductCheckInList: ProductCheckInItem[] = [
  {
    id: "PROD-001",
    maSanPham: "SP-VH-2026-088",
    tenSanPham: "Biên bản kiểm tra liên ngành 814 Karaoke Họa Mi 3 (Đảm bảo giờ giấc & PCCC)",
    loaiSanPham: "BIEN_BAN",
    canBoNop: "Nguyễn Thanh Tùng",
    chucVu: "Công chức Văn hóa - Xã hội",
    domain: "VH_TT_DL",
    ngayNop: "26/10/2026 16:30",
    fileDinhKem: "Bien_ban_814_Karaoke_HoaMi3_2026.pdf",
    moTa: "Đã phối hợp Công an phường hậu kiểm phòng hát, hệ thống báo cháy tự động hoạt động tốt, cơ sở chấp hành đóng cửa trước 24h00.",
    trangThai: "DA_PHE_CHUAN",
    yKienLanhDao: "Đồng ý phê chuẩn kết quả kiểm tra. Đội 814 tiếp tục rà soát các quán pub âm thanh lớn trên đường Bạch Đằng.",
    diemDanhGia: 5,
    ngayPheDuyet: "26/10/2026 17:15",
    lanhDaoPheDuyet: "TS. Nguyễn Văn Hùng",
  },
  {
    id: "PROD-002",
    maSanPham: "SP-VH-2026-089",
    tenSanPham: "Tờ trình phê duyệt kết quả bình xét 528 Gia đình văn hóa Khu phố 1 (NĐ 86/2023)",
    loaiSanPham: "TO_TRINH",
    canBoNop: "Nguyễn Thanh Tùng",
    chucVu: "Công chức Văn hóa - Xã hội",
    domain: "VH_TT_DL",
    ngayNop: "27/10/2026 08:45",
    fileDinhKem: "To_trinh_Gia_dinh_van_hoa_KP1.pdf",
    moTa: "Danh sách 528 hộ đạt chuẩn (97.8%) kèm danh sách 12 hộ đề nghị Chủ tịch UBND khen thưởng tiêu biểu.",
    trangThai: "CHO_LANH_DAO_DUYET",
    yKienLanhDao: "",
  },
  {
    id: "PROD-003",
    maSanPham: "SP-GD-2026-042",
    tenSanPham: "Báo cáo kiểm tra vệ sinh an toàn thực phẩm 14 nhóm trẻ mầm non tư thục",
    loaiSanPham: "BAO_CAO",
    canBoNop: "ThS. Trần Thị Kim Oanh",
    chucVu: "Công chức phụ trách GD-ĐT",
    domain: "GD_DT",
    ngayNop: "25/10/2026 14:20",
    fileDinhKem: "Bao_cao_VSATTP_MamNon_Thang10.pdf",
    moTa: "14/14 nhóm trẻ có lưu mẫu thức ăn 24h đúng quy định, hợp đồng nguồn gốc thực phẩm rõ ràng.",
    trangThai: "DA_PHE_CHUAN",
    yKienLanhDao: "Ghi nhận hoàn thành tốt KPI tuần. Tiếp tục hậu kiểm cơ sở Ánh Dương trước ngày 05/11.",
    diemDanhGia: 5,
    ngayPheDuyet: "25/10/2026 16:00",
    lanhDaoPheDuyet: "TS. Nguyễn Văn Hùng",
  },
  {
    id: "PROD-004",
    maSanPham: "SP-AS-2026-105",
    tenSanPham: "Phương án chi trả trợ cấp người có công tháng 11 qua tài khoản thẻ ATM (98.6%)",
    loaiSanPham: "KE_HOACH",
    canBoNop: "Lê Hoàng Nam",
    chucVu: "Công chức LĐ-TB&XH",
    domain: "LDTBXH_AN_SINH",
    ngayNop: "27/10/2026 09:15",
    fileDinhKem: "Phuong_an_Chi_tra_ATM_Thang11.pdf",
    moTa: "Lập danh sách 642 đối tượng nhận qua Vietcombank, còn 9 đối tượng nhận tại nhà do già yếu neo đơn.",
    trangThai: "CHO_LANH_DAO_DUYET",
  },
];

export const initialTaskAssignmentList: TaskAssignmentItem[] = [
  {
    id: "TASK-001",
    maCongViec: "CV-UBND-2026-140",
    tieuDe: "Hậu kiểm PCCC & trật tự an toàn Lễ hội Rằm tháng Giêng Miếu Bà Thiên Hậu",
    canBoPhuTrach: "Nguyễn Thanh Tùng",
    chucVu: "Công chức Văn hóa - Xã hội",
    domain: "VH_TT_DL",
    nguoiGiaoViec: "TS. Nguyễn Văn Hùng",
    chucVuNguoiGiao: "Lãnh đạo UBND Phường",
    ngayGiao: "20/10/2026",
    hanChot: "30/10/2026",
    mucDoUuTien: "HOA_TOC",
    sanPhamYeuCau: "Kế hoạch phối hợp đảm bảo ANTT, PCCC và điều tiết giao thông mùa Lễ hội",
    trangThai: "DANG_THUC_HIEN",
    tienDoPercent: 85,
  },
  {
    id: "TASK-002",
    maCongViec: "CV-UBND-2026-141",
    tieuDe: "Hoàn tất bình xét Gia đình văn hóa 4 Khu phố theo thang điểm 100 NĐ 86/2023",
    canBoPhuTrach: "Nguyễn Thanh Tùng",
    chucVu: "Công chức Văn hóa - Xã hội",
    domain: "VH_TT_DL",
    nguoiGiaoViec: "TS. Nguyễn Văn Hùng",
    chucVuNguoiGiao: "Lãnh đạo UBND Phường",
    ngayGiao: "15/10/2026",
    hanChot: "28/10/2026",
    mucDoUuTien: "KHAN",
    sanPhamYeuCau: "Tờ trình phê duyệt kết quả bình xét kèm hồ sơ khen thưởng tiêu biểu",
    trangThai: "CHO_DUYET_CHECKIN",
    tienDoPercent: 95,
    checkInId: "PROD-002",
  },
  {
    id: "TASK-003",
    maCongViec: "CV-UBND-2026-142",
    tieuDe: "Rà soát trẻ em có hoàn cảnh đặc biệt khó khăn chuẩn bị trao học bổng Khuyến học",
    canBoPhuTrach: "ThS. Trần Thị Kim Oanh",
    chucVu: "Công chức phụ trách GD-ĐT",
    domain: "GD_DT",
    nguoiGiaoViec: "TS. Nguyễn Văn Hùng",
    chucVuNguoiGiao: "Lãnh đạo UBND Phường",
    ngayGiao: "18/10/2026",
    hanChot: "31/10/2026",
    mucDoUuTien: "THUONG",
    sanPhamYeuCau: "Danh sách 35 học sinh nghèo vượt khó nhận học bổng Quỹ Khuyến học",
    trangThai: "DANG_THUC_HIEN",
    tienDoPercent: 70,
  },
  {
    id: "TASK-004",
    maCongViec: "CV-UBND-2026-143",
    tieuDe: "Xây dựng phương án chi trả an sinh xã hội không dùng tiền mặt tháng 11/2026",
    canBoPhuTrach: "Lê Hoàng Nam",
    chucVu: "Công chức LĐ-TB&XH",
    domain: "LDTBXH_AN_SINH",
    nguoiGiaoViec: "TS. Nguyễn Văn Hùng",
    chucVuNguoiGiao: "Lãnh đạo UBND Phường",
    ngayGiao: "22/10/2026",
    hanChot: "29/10/2026",
    mucDoUuTien: "KHAN",
    sanPhamYeuCau: "Báo cáo đối soát tài khoản ngân hàng và lịch chi trả trực tiếp tận nhà",
    trangThai: "CHO_DUYET_CHECKIN",
    tienDoPercent: 90,
    checkInId: "PROD-004",
  },
];

export const initialChatMessagesList: InternalChatMessage[] = [
  {
    id: "MSG-001",
    channelId: "toan-phuong",
    senderName: "TS. Nguyễn Văn Hùng",
    senderRole: "Lãnh đạo UBND Phường",
    senderAvatar: "NVH",
    timestamp: "27/10/2026 08:00",
    content: "Đề nghị các bộ phận tập trung rà soát chỉ tiêu KPI tháng 10. Bộ phận Văn hóa khẩn trương hoàn tất hồ sơ bình xét Gia đình văn hóa để UBND họp thông qua vào sáng thứ Năm.",
    isImportant: true,
  },
  {
    id: "MSG-002",
    channelId: "toan-phuong",
    senderName: "Nguyễn Thanh Tùng",
    senderRole: "Công chức Văn hóa - Xã hội",
    senderAvatar: "NTT",
    timestamp: "27/10/2026 08:47",
    content: "Báo cáo Sếp, em vừa check-in Tờ trình bình xét 528 hộ KP1 đạt 97.8% lên hệ thống rồi ạ. Em xin ý kiến phê duyệt của Lãnh đạo.",
  },
  {
    id: "MSG-003",
    channelId: "van-hoa-814",
    senderName: "Nguyễn Thanh Tùng",
    senderRole: "Công chức Văn hóa - Xã hội",
    senderAvatar: "NTT",
    timestamp: "26/10/2026 21:30",
    content: "Tổ 814 vừa kết thúc kiểm tra đợt 1 các quán Karaoke trên trục đường Thích Quảng Đức. Cơ sở Họa Mi 3 chấp hành rất tốt, không có phát sinh vi phạm.",
  },
  {
    id: "MSG-004",
    channelId: "van-hoa-814",
    senderName: "Đội CS Quản lý Hành chính",
    senderRole: "Công an Phường Thủ Dầu Một",
    senderAvatar: "CA",
    timestamp: "26/10/2026 21:40",
    content: "Đồng chí Tùng lưu ý nhắc nhở biển quảng cáo của thẩm mỹ viện Seoul Center vượt kích thước quy định, yêu cầu tự tháo dỡ trong 3 ngày.",
  },
  {
    id: "MSG-005",
    channelId: "direct-tung",
    senderName: "TS. Nguyễn Văn Hùng",
    senderRole: "Lãnh đạo UBND Phường",
    senderAvatar: "NVH",
    timestamp: "27/10/2026 09:00",
    content: "Tùng kiểm tra lại vụ việc bạo lực gia đình ở KP3 hôm qua nhé, xem tình trạng tạm lánh tại Địa chỉ tin cậy đã ổn định chưa.",
  },
  {
    id: "MSG-006",
    channelId: "direct-tung",
    senderName: "Nguyễn Thanh Tùng",
    senderRole: "Công chức Văn hóa - Xã hội",
    senderAvatar: "NTT",
    timestamp: "27/10/2026 09:05",
    content: "Dạ thưa Sếp, bà Lan đã an tâm tạm lánh tại Văn phòng KP3, người con đã ký cam kết. Em đang soạn dự thảo quyết định cấm tiếp xúc để trình Sếp ký ạ.",
  },
];

export const initialOnlineMeetingList: OnlineMeetingItem[] = [
  {
    id: "MEET-001",
    maCuocHop: "HOP-UBND-2026-44",
    tieuDe: "Họp Giao ban Tuần UBND Phường & Đánh giá Tiến độ KPI Tháng 10",
    thoiGian: "Thứ Hai, 28/10/2026 (08h00 - 10h30)",
    chuTri: "Chủ tịch UBND Phường & TS. Nguyễn Văn Hùng",
    thanhPhanThamDu: [
      "Ban Lãnh đạo UBND Phường",
      "Công chức Văn hóa - Xã hội",
      "Công chức Giáo dục - Đào tạo",
      "Công chức LĐ-TB&XH",
      "Công chức Tư pháp - Hộ tịch",
      "Trưởng 4 Khu phố",
    ],
    diaDiem: "Phòng họp số 1 & Phòng họp trực tuyến E-Meeting",
    phongHopOnlineUrl: "https://hopso.binhduong.gov.vn/phucuong-giaoban-t10",
    trangThai: "SAP_DIEN_RA",
    taiLieuDinhKem: [
      "Bao_cao_KPI_T10_UBND.pdf",
      "To_trinh_Gia_dinh_van_hoa_2026.pdf",
      "Ke_hoach_An_toan_Le_hoi_Chua_Ba.pdf",
    ],
    noiDungTomTat: "Đánh giá kết quả thực hiện 18 chỉ tiêu phát triển kinh tế - xã hội, duyệt danh hiệu GĐVH và kế hoạch an toàn mùa lễ hội.",
  },
  {
    id: "MEET-002",
    maCuocHop: "HOP-UBND-2026-45",
    tieuDe: "Họp Ban Chỉ đạo Lễ hội Rằm tháng Giêng Miếu Bà Thiên Hậu",
    thoiGian: "Thứ Tư, 30/10/2026 (14h00 - 16h30)",
    chuTri: "Phó Chủ tịch UBND Phường",
    thanhPhanThamDu: [
      "Ban Trị sự Chùa Bà Thiên Hậu",
      "Công an Phường",
      "Công chức Văn hóa - Xã hội",
      "Đội Quản lý Trật tự Đô thị",
      "Trạm Y tế Phường",
    ],
    diaDiem: "Hội trường Chùa Bà Thiên Hậu & Họp trực tuyến",
    phongHopOnlineUrl: "https://hopso.binhduong.gov.vn/phucuong-lehoi-chuaba",
    trangThai: "SAP_DIEN_RA",
    taiLieuDinhKem: [
      "Phuong_an_PCCC_Luu_Dong.pdf",
      "So_do_phan_luong_giao_thong_le_hoi.pdf",
    ],
    noiDungTomTat: "Bố trí các điểm phát nước suối, khăn lạnh miễn phí, bãi giữ xe không thu tiền và an toàn PCCC tuyệt đối.",
  },
];

// ============================================================================
// HỆ THỐNG VĂN PHÒNG ĐIỆN TỬ, MỘT CỬA LIÊN THÔNG & ĐIỀU HÀNH HÀNH CHÍNH
// Căn cứ pháp lý: Nghị định 30/2020/NĐ-CP, Nghị định 61/2018/NĐ-CP, Nghị định 107/2021/NĐ-CP
// ============================================================================

export interface VanBanDenItem {
  id: string;
  soDen: number;
  soKyHieu: string;
  ngayBanHanh: string;
  ngayDen: string;
  coQuanBanHanh: string;
  trichYeu: string;
  loaiVanBan: "CONG_VAN" | "CHI_THI" | "QUYET_DINH" | "KE_HOACH" | "THONG_TRI" | "TO_TRINH";
  doKhan: "HOA_TOC" | "THUONG_KHAN" | "KHAN" | "THUONG";
  doMat: "MAT" | "TUYET_MAT" | "BINH_THUONG";
  hanXuLy: string;
  trangThai: "CHO_PHAN_CONG" | "DANG_XU_LY" | "DA_HOAN_THANH" | "QUA_HAN";
  canBoChuTriId?: string;
  canBoChuTriName?: string;
  canBoPhoiHop?: string[];
  butPheLanhDao?: string;
  tepDinhKem: string;
  maVdxp?: string;
}

export interface VanBanDiItem {
  id: string;
  soDi?: number;
  soKyHieu: string;
  trichYeu: string;
  loaiVanBan: "BAO_CAO" | "TO_TRINH" | "QUYET_DINH" | "KE_HOACH" | "CONG_VAN";
  nguoiSoan: string;
  boPhanSoan: string;
  ngaySoan: string;
  nguoiKiemTraTheThuc?: string;
  theThucHopLe: boolean;
  lanhDaoKyDuyet?: string;
  chucVuNguoiKy?: string;
  ngayKy?: string;
  maKySoSmartCA?: string;
  trangThai: "DU_THAO" | "CHO_THAM_TRA" | "CHO_KY_SO" | "DA_KY_SO" | "DA_PHAT_HANH";
  noiNhan: string[];
  tepDinhKem: string;
  vanBanDenLienQuanId?: string;
  ngayPhatHanh?: string;
  dongDauCoQuan: boolean;
}

export interface TiepCongDanItem {
  id: string;
  maSoDon: string;
  ngayTiep: string;
  nguoiTiep: string;
  hoTenCongDan: string;
  cccd: string;
  diaChi: string;
  khuPho: string;
  soDienThoai: string;
  phanLoai: "KHIEU_NAI" | "TO_CAO" | "KIEN_NGHI_PHAN_ANH";
  linhVuc: "DAT_DAI_XAY_DUNG" | "VAN_HOA_XA_HOI" | "CHINH_SACH_NCC" | "MOI_TRUONG" | "KHAC";
  noiDung: string;
  yKienKetLuan: string;
  canBoThuLy: string;
  hanGiaiQuyet: string;
  trangThai: "DANG_XAC_MINH" | "DA_BAN_HANH_TRA_LOI" | "CHUYEN_CO_QUAN_KHAC";
  ketQuaXuLy?: string;
}

export interface HoSoMotCuaLienThongItem {
  id: string;
  maHoSo: string;
  tenThuTuc: string;
  maTthc: string;
  linhVuc: "HO_TICH" | "VAN_HOA" | "GIAO_DUC" | "LAO_DONG_TBXH" | "DIA_CHINH_XAY_DUNG";
  mucDoDvc: "TOAN_TRINH" | "MOT_PHAN" | "TRUC_TIEP";
  nguoiNop: string;
  cccd: string;
  soDienThoai: string;
  diaChi: string;
  ngayTiepNhan: string;
  ngayHenTra: string;
  ngayTraThucTe?: string;
  canBoThuLy: string;
  trangThai: "CHO_TIEP_NHAN" | "DANG_THU_LY" | "CHO_BO_SUNG" | "CHO_KY_SO" | "DA_HOAN_THANH" | "TU_CHOI";
  trangThaiThanhToan: "MIEN_PHI" | "DA_THANH_TOAN_TRUC_TUYEN" | "THANH_TOAN_TRUC_TIEP" | "CHUA_THANH_TOAN";
  lePhiVND: number;
  mauBieuSuDung?: "MAU_01_GIAY_HEN" | "MAU_02_PHIEU_BO_SUNG" | "MAU_03_TU_CHOI" | "MAU_04_PHIEU_XIN_LOI";
  lyDoBoSungHoacXinLoi?: string;
  ngayHenTraMoi?: string;
  soKyHieuKetQua?: string;
  maXacThucDienTu?: string;
}

export interface LichTuanItem {
  id: string;
  thuTrongTuan: "THU_HAI" | "THU_BA" | "THU_TU" | "THU_NAM" | "THU_SAU" | "THU_BAY" | "CHU_NHAT";
  ngay: string;
  buoi: "SANG" | "CHIEU";
  gio: string;
  noiDung: string;
  chuTri: string;
  thanhPhan: string;
  diaDiem: string;
  chuanBi: string;
  loaiLich: "HOP_UBND" | "TIEP_DAN" | "KIEM_TRA_CO_SO" | "HOP_TINH_THANH_PHO" | "DAI_HOI_HOI_NGHI";
}

export const initialVanBanDenList: VanBanDenItem[] = [
  {
    id: "VBD-2026-001",
    soDen: 342,
    soKyHieu: "189/UBND-VX",
    ngayBanHanh: "24/10/2026",
    ngayDen: "25/10/2026",
    coQuanBanHanh: "Ủy ban nhân dân TP. Thủ Dầu Một",
    trichYeu: "Về việc tăng cường kiểm tra liên ngành 814 và đảm bảo an toàn PCCC các cơ sở dịch vụ karaoke, vũ trường trước Tết Dương lịch 2027",
    loaiVanBan: "CONG_VAN",
    doKhan: "HOA_TOC",
    doMat: "BINH_THUONG",
    hanXuLy: "29/10/2026",
    trangThai: "DANG_XU_LY",
    canBoChuTriId: "cb_van_hoa",
    canBoChuTriName: "Nguyễn Thanh Tùng",
    canBoPhoiHop: ["Công an Phường Thủ Dầu Một", "Đội Quản lý TTĐT"],
    butPheLanhDao: "Giao Đ/c Tùng chủ trì phối hợp Công an Phường kiểm tra đột xuất 4 cơ sở Karaoke, báo cáo trước 17h ngày 29/10.",
    tepDinhKem: "189_UBND_VX_Kiem_tra_814_PCCC.pdf",
    maVdxp: "VDXP-BDU-TDM-2026-00189",
  },
  {
    id: "VBD-2026-002",
    soDen: 343,
    soKyHieu: "78/STTTT-BCVT",
    ngayBanHanh: "25/10/2026",
    ngayDen: "26/10/2026",
    coQuanBanHanh: "Sở Thông tin và Truyền thông Tỉnh Bình Dương",
    trichYeu: "Hướng dẫn triển khai nâng cấp Trục liên thông văn bản quốc gia VDXP và tích hợp chữ ký số cá nhân SmartCA theo Đề án 06",
    loaiVanBan: "CONG_VAN",
    doKhan: "THUONG_KHAN",
    doMat: "BINH_THUONG",
    hanXuLy: "31/10/2026",
    trangThai: "CHO_PHAN_CONG",
    tepDinhKem: "78_STTTT_Huong_dan_SmartCA_VDXP.pdf",
    maVdxp: "VDXP-BDU-STTTT-2026-0078",
  },
  {
    id: "VBD-2026-003",
    soDen: 344,
    soKyHieu: "112/SGDĐT-VP",
    ngayBanHanh: "23/10/2026",
    ngayDen: "24/10/2026",
    coQuanBanHanh: "Sở Giáo dục và Đào tạo Tỉnh Bình Dương",
    trichYeu: "Về việc rà soát hồ sơ thành lập phân hiệu và kiểm tra an toàn vệ sinh thực phẩm tại các nhóm trẻ độc lập tư thục",
    loaiVanBan: "KE_HOACH",
    doKhan: "KHAN",
    doMat: "BINH_THUONG",
    hanXuLy: "05/11/2026",
    trangThai: "DANG_XU_LY",
    canBoChuTriId: "cb_giao_duc",
    canBoChuTriName: "ThS. Trần Thị Kim Oanh",
    canBoPhoiHop: ["Trạm Y tế Phường"],
    butPheLanhDao: "Giao Đ/c Oanh lập đoàn kiểm tra 6 nhóm trẻ tư thục, chấn chỉnh ngay các cơ sở thiếu bếp ăn một chiều.",
    tepDinhKem: "112_SGDDT_Kiem_tra_nhom_tre.pdf",
    maVdxp: "VDXP-BDU-SGD-2026-00112",
  },
  {
    id: "VBD-2026-004",
    soDen: 345,
    soKyHieu: "450/SLĐTBXH-CSNCC",
    ngayBanHanh: "22/10/2026",
    ngayDen: "23/10/2026",
    coQuanBanHanh: "Sở Lao động - Thương binh và Xã hội Bình Dương",
    trichYeu: "Đôn đốc hoàn thành chi trả trợ cấp ưu đãi người có công không dùng tiền mặt đạt chỉ tiêu 100% trong Quý 4/2026",
    loaiVanBan: "CONG_VAN",
    doKhan: "THUONG_KHAN",
    doMat: "BINH_THUONG",
    hanXuLy: "28/10/2026",
    trangThai: "DA_HOAN_THANH",
    canBoChuTriId: "cb_chinh_sach",
    canBoChuTriName: "Lê Hoàng Nam",
    canBoPhoiHop: ["Ngân hàng CSXH", "Bưu điện Phường"],
    butPheLanhDao: "Đ/c Nam khẩn trương phối hợp Bưu điện mở tài khoản cho 8 đối tượng còn lại. Đã hoàn thành đạt 95.8%.",
    tepDinhKem: "450_SLDTBXH_Chi_tra_khong_dung_tien_mat.pdf",
    maVdxp: "VDXP-BDU-SLD-2026-00450",
  },
];

export const initialVanBanDiList: VanBanDiItem[] = [
  {
    id: "VBD-DI-2026-001",
    soDi: 118,
    soKyHieu: "118/BC-UBND",
    trichYeu: "Báo cáo kết quả kiểm tra liên ngành văn hóa 814 và công tác PCCC tại các điểm kinh doanh Karaoke Quý 3/2026",
    loaiVanBan: "BAO_CAO",
    nguoiSoan: "Nguyễn Thanh Tùng",
    boPhanSoan: "Bộ phận Văn hóa - Xã hội",
    ngaySoan: "26/10/2026",
    nguoiKiemTraTheThuc: "Văn phòng HĐND-UBND Phường",
    theThucHopLe: true,
    lanhDaoKyDuyet: "Chủ tịch UBND Phường",
    chucVuNguoiKy: "Chủ tịch",
    ngayKy: "26/10/2026 15:45",
    maKySoSmartCA: "CA-BDU-TDM-89412948-2026",
    trangThai: "DA_PHAT_HANH",
    noiNhan: ["UBND Thành phố Thủ Dầu Một", "Phòng VHTT TP", "Công an TP Thủ Dầu Một", "Lưu: VT, VHXH"],
    tepDinhKem: "118_BC_UBND_Kiem_tra_814_Q3.pdf",
    vanBanDenLienQuanId: "VBD-2026-001",
    ngayPhatHanh: "26/10/2026 16:00",
    dongDauCoQuan: true,
  },
  {
    id: "VBD-DI-2026-002",
    soDi: 119,
    soKyHieu: "119/TTr-UBND",
    trichYeu: "Tờ trình đề nghị UBND Thành phố công nhận 4/4 Khu phố đạt danh hiệu Khu phố văn hóa năm 2026 (Nghị định 86/2023/NĐ-CP)",
    loaiVanBan: "TO_TRINH",
    nguoiSoan: "Nguyễn Thanh Tùng",
    boPhanSoan: "Bộ phận Văn hóa - Xã hội",
    ngaySoan: "27/10/2026",
    nguoiKiemTraTheThuc: "Văn phòng HĐND-UBND Phường",
    theThucHopLe: true,
    lanhDaoKyDuyet: "Chủ tịch UBND Phường",
    chucVuNguoiKy: "Chủ tịch",
    trangThai: "CHO_KY_SO",
    noiNhan: ["UBND Thành phố Thủ Dầu Một", "Phòng VHTT TP", "Ban Chỉ đạo Phong trào TDĐKXDĐSVH TP"],
    tepDinhKem: "119_TTr_UBND_Cong_nhan_Khu_pho_VH.pdf",
    dongDauCoQuan: false,
  },
  {
    id: "VBD-DI-2026-003",
    soKyHieu: "120/KH-UBND",
    trichYeu: "Kế hoạch tổ chức Lễ hội Đền Bình Nhâm và ngày hội Đờn ca tài tử Nam Bộ năm 2026",
    loaiVanBan: "KE_HOACH",
    nguoiSoan: "Nguyễn Thanh Tùng",
    boPhanSoan: "Bộ phận Văn hóa - Xã hội",
    ngaySoan: "27/10/2026",
    theThucHopLe: false,
    trangThai: "CHO_THAM_TRA",
    noiNhan: ["Các Khu phố", "CLB Đờn ca tài tử Phường", "UBND TP"],
    tepDinhKem: "120_KH_UBND_Le_hoi_Don_ca_tai_tu.docx",
    dongDauCoQuan: false,
  },
];

export const initialTiepCongDanList: TiepCongDanItem[] = [
  {
    id: "TCD-2026-001",
    maSoDon: "TCD-PC-2026-015",
    ngayTiep: "24/10/2026 (Thứ Năm)",
    nguoiTiep: "Đ/c Chủ tịch UBND Phường Thủ Dầu Một",
    hoTenCongDan: "Nguyễn Thị Mai Lan",
    cccd: "074185002931",
    diaChi: "Số 45 đường Yersin",
    khuPho: "Khu phố 1",
    soDienThoai: "0918.234.567",
    phanLoai: "KIEN_NGHI_PHAN_ANH",
    linhVuc: "VAN_HOA_XA_HOI",
    noiDung: "Phản ánh quán ăn đêm trên đường Bạch Đằng thường xuyên mở loa kéo công suất lớn gây ồn ào sau 22h đêm, ảnh hưởng người già và học sinh ôn thi.",
    yKienKetLuan: "Giao Đội Kiểm tra liên ngành 814 phối hợp Công an Phường kiểm tra đo độ ồn ngay trong tối 25/10, xử phạt nghiêm theo Nghị định 144/2021/NĐ-CP.",
    canBoThuLy: "Nguyễn Thanh Tùng (Công chức VH-XH)",
    hanGiaiQuyet: "29/10/2026",
    trangThai: "DANG_XAC_MINH",
    ketQuaXuLy: "Đã cử đoàn kiểm tra nhắc nhở lập biên bản yêu cầu cam kết không sử dụng loa kéo sau 22h.",
  },
  {
    id: "TCD-2026-002",
    maSoDon: "TCD-PC-2026-016",
    ngayTiep: "17/10/2026 (Thứ Năm)",
    nguoiTiep: "Đ/c Phó Chủ tịch UBND Phường (Khối VH-XH)",
    hoTenCongDan: "Lê Văn Hùng",
    cccd: "074078001844",
    diaChi: "Số 120/4 đường Đoàn Trần Nghiệp",
    khuPho: "Khu phố 3",
    soDienThoai: "0903.882.119",
    phanLoai: "KIEN_NGHI_PHAN_ANH",
    linhVuc: "CHINH_SACH_NCC",
    noiDung: "Đề nghị hướng dẫn thủ tục xin cấp đổi sổ theo dõi trang cấp Dụng cụ chỉnh hình (xe lăn) đã hết niên hạn 5 năm cho thân nhân là thương binh nặng 81%.",
    yKienKetLuan: "Tiếp nhận hồ sơ, giao Bộ phận LĐ-TB&XH hướng dẫn hoàn tất Mẫu số 08/NĐ 131 và cấp phát mới xe lăn trước ngày 25/10.",
    canBoThuLy: "Lê Hoàng Nam (Cán bộ LĐ-TB&XH)",
    hanGiaiQuyet: "25/10/2026",
    trangThai: "DA_BAN_HANH_TRA_LOI",
    ketQuaXuLy: "Đã hoàn thành thủ tục cấp xe lăn tay hợp kim nhôm niên hạn 2026-2031 cho công dân ngày 23/10/2026.",
  },
];

export const initialHoSoMotCuaLienThongList: HoSoMotCuaLienThongItem[] = [
  {
    id: "MC-2026-001",
    maHoSo: "H50.01-261025-0001",
    tenThuTuc: "Cấp đổi Giấy chứng nhận Gia đình văn hóa (Nghị định 86/2023/NĐ-CP)",
    maTthc: "TTHC-VH-01",
    linhVuc: "VAN_HOA",
    mucDoDvc: "TOAN_TRINH",
    nguoiNop: "Phạm Quốc Bảo",
    cccd: "074088001299",
    soDienThoai: "0903.112.334",
    diaChi: "18 Nguyễn Du, Khu phố 2",
    ngayTiepNhan: "25/10/2026 09:15",
    ngayHenTra: "28/10/2026 16:30",
    canBoThuLy: "Nguyễn Thanh Tùng",
    trangThai: "CHO_KY_SO",
    trangThaiThanhToan: "MIEN_PHI",
    lePhiVND: 0,
    mauBieuSuDung: "MAU_01_GIAY_HEN",
  },
  {
    id: "MC-2026-002",
    maHoSo: "H50.01-261026-0002",
    tenThuTuc: "Đăng ký thành lập Nhóm trẻ, lớp mẫu giáo độc lập tư thục (Nghị định 46/2017)",
    maTthc: "TTHC-GD-03",
    linhVuc: "GIAO_DUC",
    mucDoDvc: "MOT_PHAN",
    nguoiNop: "Ngô Thị Thu Hà",
    cccd: "074192004512",
    soDienThoai: "0938.456.789",
    diaChi: "204 Cách Mạng Tháng 8, Khu phố 4",
    ngayTiepNhan: "26/10/2026 14:00",
    ngayHenTra: "05/11/2026 16:30",
    canBoThuLy: "ThS. Trần Thị Kim Oanh",
    trangThai: "CHO_BO_SUNG",
    trangThaiThanhToan: "THANH_TOAN_TRUC_TIEP",
    lePhiVND: 150000,
    mauBieuSuDung: "MAU_02_PHIEU_BO_SUNG",
    lyDoBoSungHoacXinLoi: "Bổ sung Giấy chứng nhận thẩm duyệt thiết kế PCCC và Hợp đồng thuê mặt bằng công chứng còn thời hạn tối thiểu 3 năm.",
  },
  {
    id: "MC-2026-003",
    maHoSo: "H50.01-261020-0003",
    tenThuTuc: "Giải quyết chế độ Mai táng phí Người có công với cách mạng từ trần",
    maTthc: "TTHC-NCC-05",
    linhVuc: "LAO_DONG_TBXH",
    mucDoDvc: "TOAN_TRINH",
    nguoiNop: "Hoàng Minh Tuấn",
    cccd: "074069000147",
    soDienThoai: "0912.778.899",
    diaChi: "78 Ngô Quyền, Khu phố 1",
    ngayTiepNhan: "20/10/2026 08:30",
    ngayHenTra: "25/10/2026 16:30",
    ngayTraThucTe: "26/10/2026 10:00",
    canBoThuLy: "Lê Hoàng Nam",
    trangThai: "DA_HOAN_THANH",
    trangThaiThanhToan: "MIEN_PHI",
    lePhiVND: 0,
    mauBieuSuDung: "MAU_04_PHIEU_XIN_LOI",
    lyDoBoSungHoacXinLoi: "Do hệ thống xác thực cơ sở dữ liệu quốc gia về bảo hiểm xã hội bảo trì đột xuất ngày 24/10, UBND Phường xin lỗi và gia hạn trả kết quả vào 26/10.",
    ngayHenTraMoi: "26/10/2026",
    soKyHieuKetQua: "QĐ-UBND-2026-MTP-08",
    maXacThucDienTu: "SHA256:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
  },
  {
    id: "MC-2026-004",
    maHoSo: "H50.01-261027-0004",
    tenThuTuc: "Cấp bản sao trích lục khai sinh từ Sổ hộ tịch điện tử",
    maTthc: "TTHC-TP-01",
    linhVuc: "HO_TICH",
    mucDoDvc: "TOAN_TRINH",
    nguoiNop: "Vũ Hải Đăng",
    cccd: "074095007812",
    soDienThoai: "0989.123.456",
    diaChi: "56 Trần Hưng Đạo, Khu phố 3",
    ngayTiepNhan: "27/10/2026 10:00",
    ngayHenTra: "27/10/2026 16:30",
    canBoThuLy: "Vũ Đình Cường",
    trangThai: "DANG_THU_LY",
    trangThaiThanhToan: "DA_THANH_TOAN_TRUC_TUYEN",
    lePhiVND: 10000,
    mauBieuSuDung: "MAU_01_GIAY_HEN",
  },
];

export const initialLichTuanList: LichTuanItem[] = [
  {
    id: "LT-001",
    thuTrongTuan: "THU_HAI",
    ngay: "27/10/2026",
    buoi: "SANG",
    gio: "08h00 - 11h30",
    noiDung: "Họp Giao ban Thường trực Đảng ủy, HĐND, UBND Phường đầu tuần",
    chuTri: "Bí thư Đảng ủy & Chủ tịch UBND Phường",
    thanhPhan: "Thường trực Đảng ủy, TT HĐND, Lãnh đạo UBND, Trưởng các ban ngành đoàn thể",
    diaDiem: "Phòng họp số 1 - UBND Phường",
    chuanBi: "Văn phòng chuẩn bị Báo cáo tuần và lịch công tác",
    loaiLich: "HOP_UBND",
  },
  {
    id: "LT-002",
    thuTrongTuan: "THU_HAI",
    ngay: "27/10/2026",
    buoi: "CHIEU",
    gio: "14h00 - 16h30",
    noiDung: "Kiểm tra thực địa tiến độ chuẩn bị chỉnh trang đô thị và an toàn PCCC Chùa Bà",
    chuTri: "Phó Chủ tịch UBND (Văn hóa - Xã hội)",
    thanhPhan: "Công chức Văn hóa - Xã hội, Đội TTĐT, Công an Phường",
    diaDiem: "Khu vực Chùa Bà Thiên Hậu & Chợ Thủ Dầu Một",
    chuanBi: "Đ/c Tùng chuẩn bị biên bản và sơ đồ bố trí",
    loaiLich: "KIEM_TRA_CO_SO",
  },
  {
    id: "LT-003",
    thuTrongTuan: "THU_BA",
    ngay: "28/10/2026",
    buoi: "SANG",
    gio: "08h30 - 11h00",
    noiDung: "Dự Hội nghị trực tuyến toàn tỉnh triển khai nâng cấp Trục liên thông VDXP",
    chuTri: "Chủ tịch UBND Phường",
    thanhPhan: "Lãnh đạo UBND, Cán bộ CNTT, Văn thư",
    diaDiem: "Phòng họp trực tuyến UBND Phường",
    chuanBi: "Bộ phận Văn phòng kết nối đường truyền VDXP",
    loaiLich: "HOP_TINH_THANH_PHO",
  },
  {
    id: "LT-004",
    thuTrongTuan: "THU_NAM",
    ngay: "30/10/2026",
    buoi: "SANG",
    gio: "08h00 - 11h30",
    noiDung: "CHỦ TỊCH UBND PHƯỜNG TIẾP CÔNG DÂN ĐỊNH KỲ THỨ 5 HÀNG TUẦN",
    chuTri: "Chủ tịch UBND Phường",
    thanhPhan: "Thanh tra nhân dân, Công chức Địa chính, Tư pháp, VH-XH, Ban CHQS, Công an Phường",
    diaDiem: "Phòng Tiếp công dân UBND Phường",
    chuanBi: "Văn phòng chuẩn bị sổ tiếp công dân, hồ sơ đơn thư tồn đọng",
    loaiLich: "TIEP_DAN",
  },
  {
    id: "LT-005",
    thuTrongTuan: "THU_SAU",
    ngay: "31/10/2026",
    buoi: "CHIEU",
    gio: "14h00 - 16h30",
    noiDung: "Hội nghị bình xét danh hiệu Gia đình văn hóa, Khu phố văn hóa năm 2026",
    chuTri: "Phó Chủ tịch UBND Phường (Trưởng BCĐ Phong trào)",
    thanhPhan: "Thành viên Ban chỉ đạo, Bí thư chi bộ, Trưởng 4 Khu phố, MTTQ và các đoàn thể",
    diaDiem: "Hội trường lớn UBND Phường",
    chuanBi: "Đ/c Tùng chuẩn bị hồ sơ 2.450 hộ và tờ trình công nhận",
    loaiLich: "HOP_UBND",
  },
];

// ============================================================================
// HỆ THỐNG QUẢN LÝ MỘ LIỆT SĨ & CHỖ THỜ LIỆT SĨ KHU PHỐ
// Căn cứ pháp lý: Nghị định 131/2021/NĐ-CP, Pháp lệnh Ưu đãi Người có công 2020
// ============================================================================

export interface ChoThoKhuPhoItem {
  id: string;
  tenCongTrinh: string;
  loaiCongTrinh: "NHA_BIA_GHI_DANH" | "DEN_THO_LIET_SI" | "DAI_TUONG_NIEM" | "KHU_MO_GIA_DINH";
  khuPho: "Khu phố 1" | "Khu phố 2" | "Khu phố 3" | "Khu phố 4" | "Toàn phường";
  diaChi: string;
  soLuongLietSiGhiDanh: number;
  soMoTrongNghiaTrang: number;
  soMoNgoaiNghiaTrang: number;
  soMoChuaTimThay: number;
  soMoChuaXacDinhDanhTinh: number;
  nguoiQuanLy: string;
  sdtNguoiQuanLy: string;
  tinhTrangCongTrinh: "KHANG_TRANG" | "CAN_TU_BO" | "DANG_TRUNG_TU";
  namXayDung: number;
  namTuBoGanNhat: number;
  kinhPhiDuyTuHangNamVND: number;
  luotDangHuong: number;
  hinhAnhUrl: string;
}

export interface LichSuXuLyMoItem {
  id: string;
  ngayThucHien: string;
  loaiXuLy: "TU_BO_VO_MO" | "DINH_CHINH_BIA" | "DI_CHUYEN_HAI_COT" | "GIAM_DINH_ADN" | "CAP_KINH_PHI_THO_CUNG";
  noiDungChiTiet: string;
  canBoThucHien: string;
  kinhPhiHoTroVND: number;
  soQuyetDinh?: string;
  trangThai: "DA_HOAN_THANH" | "DANG_XU_LY";
}

export interface LietSiKhuPhoItem {
  id: string;
  maHoSoLietSi: string;
  hoTen: string;
  biDanh?: string;
  namSinh: string;
  ngayHySinh: string;
  queQuan: string;
  khuPhoCuTru: "Khu phố 1" | "Khu phố 2" | "Khu phố 3" | "Khu phố 4";
  choThoId: string;
  tenChoTho: string;
  donViKhiHySinh: string;
  chucVuKhiHySinh?: string;
  bangToQuocGhiCongSo: string;
  viTriPhanMo: "NGHIA_TRANG_TINH" | "NGHIA_TRANG_TP" | "MO_GIA_DINH_KHU_PHO" | "CHUA_TIM_THAY" | "CHUA_XAC_DINH_ADN";
  chiTietViTriMo: string;
  soMo?: string;
  khuMo?: string;
  hangMo?: number;
  tinhTrangMo: "TOT" | "XUONG_CAP_CAN_TU_BO" | "DANG_TU_BO" | "DA_DI_CHUYEN";
  tinhTrangBia: "RO_NET" | "MO_CHU_NUT_VO" | "SAI_THONG_TIN";
  thongTinThoCung: {
    nguoiThoCung: string;
    cccd: string;
    quanHe: string;
    soDienThoai: string;
    diaChiThuongTru: string;
    soTaiKhoanNganHang?: string;
    tenNganHang?: string;
    daNhanTroCap277: boolean;
    mucTroCapNam: number;
  };
  lichSuXuLy: LichSuXuLyMoItem[];
}

export interface YeuCauXuLyMoItem {
  id: string;
  maHoSoYeuCau: string;
  lietsiId: string;
  tenLietSi: string;
  khuPho: string;
  nguoiYeuCau: string;
  cccdNguoiYeuCau: string;
  soDienThoai: string;
  loaiYeuCau: "TU_BO_MO" | "DINH_CHINH_THONG_TIN_BIA" | "DI_CHUYEN_HAI_COT" | "GIAM_DINH_ADN_XAC_DINH_DANH_TINH";
  lyDoVaCanCu: string;
  noiDungDinhChinhHoacNoiDen?: string;
  kinhPhiDeXuatVND: number;
  ngayNop: string;
  hanXuLy: string;
  trangThai: "CHO_KHAO_SAT" | "DA_PHE_DUYET" | "DANG_THI_CONG" | "DA_HOAN_THANH" | "TU_CHOI";
  canBoThuLy: string;
  soQuyetDinhUbnd?: string;
}

export const initialChoThoKhuPhoList: ChoThoKhuPhoItem[] = [
  {
    id: "CT-KP1",
    tenCongTrinh: "Nhà bia ghi danh Liệt sĩ Khu phố 1 - Phường Thủ Dầu Một",
    loaiCongTrinh: "NHA_BIA_GHI_DANH",
    khuPho: "Khu phố 1",
    diaChi: "Số 12 đường Ngô Quyền, Khu phố 1",
    soLuongLietSiGhiDanh: 42,
    soMoTrongNghiaTrang: 28,
    soMoNgoaiNghiaTrang: 6,
    soMoChuaTimThay: 6,
    soMoChuaXacDinhDanhTinh: 2,
    nguoiQuanLy: "Ông Nguyễn Văn Bảy (Trưởng Ban Điều hành KP1)",
    sdtNguoiQuanLy: "0913.882.114",
    tinhTrangCongTrinh: "KHANG_TRANG",
    namXayDung: 1998,
    namTuBoGanNhat: 2024,
    kinhPhiDuyTuHangNamVND: 15000000,
    luotDangHuong: 480,
    hinhAnhUrl: "/images/nha-bia-kp1.jpg",
  },
  {
    id: "CT-KP2",
    tenCongTrinh: "Đền tưởng niệm Liệt sĩ Bến đò Phú Cường - Khu phố 2",
    loaiCongTrinh: "DEN_THO_LIET_SI",
    khuPho: "Khu phố 2",
    diaChi: "Đường Bạch Đằng ven sông Sài Gòn, Khu phố 2",
    soLuongLietSiGhiDanh: 38,
    soMoTrongNghiaTrang: 24,
    soMoNgoaiNghiaTrang: 5,
    soMoChuaTimThay: 7,
    soMoChuaXacDinhDanhTinh: 2,
    nguoiQuanLy: "Bà Trần Thị Kim Phượng (Chi hội trưởng CCB KP2)",
    sdtNguoiQuanLy: "0908.223.445",
    tinhTrangCongTrinh: "KHANG_TRANG",
    namXayDung: 2005,
    namTuBoGanNhat: 2025,
    kinhPhiDuyTuHangNamVND: 20000000,
    luotDangHuong: 620,
    hinhAnhUrl: "/images/den-tho-kp2.jpg",
  },
  {
    id: "CT-KP3",
    tenCongTrinh: "Nhà bia tưởng niệm Liệt sĩ Khu phố 3 (Ngã ba Lò Chén)",
    loaiCongTrinh: "NHA_BIA_GHI_DANH",
    khuPho: "Khu phố 3",
    diaChi: "Đường Yersin giao Đoàn Trần Nghiệp, Khu phố 3",
    soLuongLietSiGhiDanh: 51,
    soMoTrongNghiaTrang: 35,
    soMoNgoaiNghiaTrang: 8,
    soMoChuaTimThay: 5,
    soMoChuaXacDinhDanhTinh: 3,
    nguoiQuanLy: "Ông Lê Văn Hùng (Trưởng Ban công tác Mặt trận KP3)",
    sdtNguoiQuanLy: "0903.882.119",
    tinhTrangCongTrinh: "CAN_TU_BO",
    namXayDung: 1995,
    namTuBoGanNhat: 2021,
    kinhPhiDuyTuHangNamVND: 12000000,
    luotDangHuong: 390,
    hinhAnhUrl: "/images/nha-bia-kp3.jpg",
  },
  {
    id: "CT-KP4",
    tenCongTrinh: "Nhà bia ghi danh Liệt sĩ Khu phố 4 (Chợ Thủ Dầu Một)",
    loaiCongTrinh: "NHA_BIA_GHI_DANH",
    khuPho: "Khu phố 4",
    diaChi: "Đường Cách Mạng Tháng 8, Khu phố 4",
    soLuongLietSiGhiDanh: 47,
    soMoTrongNghiaTrang: 31,
    soMoNgoaiNghiaTrang: 7,
    soMoChuaTimThay: 6,
    soMoChuaXacDinhDanhTinh: 3,
    nguoiQuanLy: "Bà Vũ Thị Lành (Trưởng Ban Điều hành KP4)",
    sdtNguoiQuanLy: "0989.123.789",
    tinhTrangCongTrinh: "KHANG_TRANG",
    namXayDung: 2002,
    namTuBoGanNhat: 2024,
    kinhPhiDuyTuHangNamVND: 15000000,
    luotDangHuong: 510,
    hinhAnhUrl: "/images/nha-bia-kp4.jpg",
  },
];

export const initialLietSiKhuPhoList: LietSiKhuPhoItem[] = [
  {
    id: "LS-KP1-001",
    maHoSoLietSi: "LS-BD-00124",
    hoTen: "Hồ Văn Lên",
    biDanh: "Bảy Lên",
    namSinh: "1926",
    ngayHySinh: "15/07/1949",
    queQuan: "Xã Chánh Hiệp, Châu Thành, Thủ Dầu Một",
    khuPhoCuTru: "Khu phố 1",
    choThoId: "CT-KP1",
    tenChoTho: "Nhà bia ghi danh Liệt sĩ Khu phố 1 - Phường Thủ Dầu Một",
    donViKhiHySinh: "Ban Tuyên huấn Tỉnh ủy Thủ Dầu Một",
    chucVuKhiHySinh: "Ủy viên Ban Tuyên huấn tỉnh",
    bangToQuocGhiCongSo: "TQGC-1958/012-TTg",
    viTriPhanMo: "NGHIA_TRANG_TINH",
    chiTietViTriMo: "Nghĩa trang Liệt sĩ Tỉnh Bình Dương · Khu A, Hàng 1, Mộ số 01",
    soMo: "A1-01",
    khuMo: "Khu A",
    hangMo: 1,
    tinhTrangMo: "TOT",
    tinhTrangBia: "RO_NET",
    thongTinThoCung: {
      nguoiThoCung: "Hồ Văn Đức",
      cccd: "074052001988",
      quanHe: "Cháu ruột thờ cúng",
      soDienThoai: "0918.334.556",
      diaChiThuongTru: "Số 45 đường Ngô Quyền, Khu phố 1",
      soTaiKhoanNganHang: "0121000889922",
      tenNganHang: "Vietcombank CN Bình Dương",
      daNhanTroCap277: true,
      mucTroCapNam: 1400000,
    },
    lichSuXuLy: [
      {
        id: "LSXL-001",
        ngayThucHien: "20/07/2026",
        loaiXuLy: "CAP_KINH_PHI_THO_CUNG",
        noiDungChiTiet: "Chi trả trợ cấp thờ cúng liệt sĩ dịp 27/7 qua tài khoản ngân hàng Vietcombank theo Nghị định 131/2021",
        canBoThucHien: "Lê Hoàng Nam (Cán bộ LĐ-TB&XH)",
        kinhPhiHoTroVND: 1400000,
        soQuyetDinh: "QĐ-UBND-2026/TC-012",
        trangThai: "DA_HOAN_THANH",
      },
    ],
  },
  {
    id: "LS-KP2-002",
    maHoSoLietSi: "LS-BD-00189",
    hoTen: "Trần Văn Bé",
    namSinh: "1942",
    ngayHySinh: "24/03/1968",
    queQuan: "Phú Cường, Thủ Dầu Một, Bình Dương",
    khuPhoCuTru: "Khu phố 2",
    choThoId: "CT-KP2",
    tenChoTho: "Đền tưởng niệm Liệt sĩ Bến đò Phú Cường - Khu phố 2",
    donViKhiHySinh: "Đại đội 1, Tiểu đoàn Phú Lợi anh hùng",
    chucVuKhiHySinh: "Trung đội phó",
    bangToQuocGhiCongSo: "TQGC-1976/445-TTg",
    viTriPhanMo: "MO_GIA_DINH_KHU_PHO",
    chiTietViTriMo: "Vườn gia đình thân nhân quản lý tại Hẻm 88 đường Bạch Đằng, Khu phố 2",
    tinhTrangMo: "XUONG_CAP_CAN_TU_BO",
    tinhTrangBia: "MO_CHU_NUT_VO",
    thongTinThoCung: {
      nguoiThoCung: "Trần Thị Mai Lan",
      cccd: "074185002931",
      quanHe: "Con gái thờ cúng",
      soDienThoai: "0918.234.567",
      diaChiThuongTru: "Số 88/4 đường Bạch Đằng, Khu phố 2",
      soTaiKhoanNganHang: "5590205128841",
      tenNganHang: "Agribank Thủ Dầu Một",
      daNhanTroCap277: true,
      mucTroCapNam: 1400000,
    },
    lichSuXuLy: [
      {
        id: "LSXL-002",
        ngayThucHien: "15/10/2026",
        loaiXuLy: "TU_BO_VO_MO",
        noiDungChiTiet: "Lập hồ sơ đề nghị cấp kinh phí hỗ trợ xây vỏ mộ liệt sĩ do gia đình quản lý (10.000.000đ theo Điều 152 NĐ 131)",
        canBoThucHien: "Lê Hoàng Nam (Cán bộ LĐ-TB&XH)",
        kinhPhiHoTroVND: 10000000,
        trangThai: "DANG_XU_LY",
      },
    ],
  },
  {
    id: "LS-KP3-003",
    maHoSoLietSi: "LS-BD-00215",
    hoTen: "Nguyễn Văn Hưng",
    biDanh: "Út Hưng",
    namSinh: "1950",
    ngayHySinh: "12/04/1972",
    queQuan: "Phú Cường, Thủ Dầu Một",
    khuPhoCuTru: "Khu phố 3",
    choThoId: "CT-KP3",
    tenChoTho: "Nhà bia tưởng niệm Liệt sĩ Khu phố 3 (Ngã ba Lò Chén)",
    donViKhiHySinh: "Trung đoàn 271, Phân khu 1",
    bangToQuocGhiCongSo: "TQGC-1979/812-TTg",
    viTriPhanMo: "NGHIA_TRANG_TP",
    chiTietViTriMo: "Nghĩa trang Liệt sĩ TP. Thủ Dầu Một · Khu C, Hàng 4, Mộ 18",
    soMo: "C4-18",
    khuMo: "Khu C",
    hangMo: 4,
    tinhTrangMo: "TOT",
    tinhTrangBia: "SAI_THONG_TIN",
    thongTinThoCung: {
      nguoiThoCung: "Nguyễn Văn Hùng",
      cccd: "074078001844",
      quanHe: "Em trai thờ cúng",
      soDienThoai: "0903.882.119",
      diaChiThuongTru: "120 Đoàn Trần Nghiệp, Khu phố 3",
      soTaiKhoanNganHang: "65010001889944",
      tenNganHang: "BIDV Nam Bình Dương",
      daNhanTroCap277: true,
      mucTroCapNam: 1400000,
    },
    lichSuXuLy: [
      {
        id: "LSXL-003",
        ngayThucHien: "25/10/2026",
        loaiXuLy: "DINH_CHINH_BIA",
        noiDungChiTiet: "Đính chính năm sinh trên bia mộ từ 1948 thành 1950 theo đúng Bằng Tổ quốc ghi công và hồ sơ lưu trữ",
        canBoThucHien: "Lê Hoàng Nam",
        kinhPhiHoTroVND: 0,
        soQuyetDinh: "QĐ-UBND-2026/ĐC-04",
        trangThai: "DA_HOAN_THANH",
      },
    ],
  },
  {
    id: "LS-KP4-004",
    maHoSoLietSi: "LS-BD-00302",
    hoTen: "Lê Hoàng Tuấn",
    namSinh: "1953",
    ngayHySinh: "1975",
    queQuan: "Phú Cường, Thủ Dầu Một",
    khuPhoCuTru: "Khu phố 4",
    choThoId: "CT-KP4",
    tenChoTho: "Nhà bia ghi danh Liệt sĩ Khu phố 4 (Chợ Thủ Dầu Một)",
    donViKhiHySinh: "Chiến dịch Hồ Chí Minh 1975",
    bangToQuocGhiCongSo: "TQGC-1977/220-TTg",
    viTriPhanMo: "CHUA_XAC_DINH_ADN",
    chiTietViTriMo: "Mộ số B2-14 Nghĩa trang Liệt sĩ Tỉnh · Chưa xác định danh tính (Đang giám định ADN)",
    soMo: "B2-14",
    khuMo: "Khu B",
    hangMo: 2,
    tinhTrangMo: "TOT",
    tinhTrangBia: "RO_NET",
    thongTinThoCung: {
      nguoiThoCung: "Lê Thị Ngọc Bích",
      cccd: "074195003321",
      quanHe: "Chị gái thờ cúng",
      soDienThoai: "0989.123.456",
      diaChiThuongTru: "102 Cách Mạng Tháng 8, Khu phố 4",
      daNhanTroCap277: false,
      mucTroCapNam: 1400000,
    },
    lichSuXuLy: [
      {
        id: "LSXL-004",
        ngayThucHien: "18/10/2026",
        loaiXuLy: "GIAM_DINH_ADN",
        noiDungChiTiet: "Thu thập mẫu sinh phẩm niêm mạc miệng của thân nhân gửi Viện Pháp y Quân đội đối khớp mẫu ADN hài cốt liệt sĩ theo Đề án 06",
        canBoThucHien: "Lê Hoàng Nam (Cán bộ LĐ-TB&XH)",
        kinhPhiHoTroVND: 0,
        trangThai: "DANG_XU_LY",
      },
    ],
  },
];

export const initialYeuCauXuLyMoList: YeuCauXuLyMoItem[] = [
  {
    id: "YC-MO-001",
    maHoSoYeuCau: "HS-TUBO-2026-08",
    lietsiId: "LS-KP2-002",
    tenLietSi: "Trần Văn Bé",
    khuPho: "Khu phố 2",
    nguoiYeuCau: "Trần Thị Mai Lan",
    cccdNguoiYeuCau: "074185002931",
    soDienThoai: "0918.234.567",
    loaiYeuCau: "TU_BO_MO",
    lyDoVaCanCu: "Vỏ mộ gia đình quản lý ngoài nghĩa trang xây dựng từ năm 1985 bị nứt vỡ, sụt lún nghiêm trọng sau mùa mưa bão. Đề nghị hỗ trợ theo Điều 152 NĐ 131/2021/NĐ-CP.",
    kinhPhiDeXuatVND: 10000000,
    ngayNop: "15/10/2026",
    hanXuLy: "05/11/2026",
    trangThai: "CHO_KHAO_SAT",
    canBoThuLy: "Lê Hoàng Nam (Cán bộ LĐ-TB&XH)",
  },
  {
    id: "YC-MO-002",
    maHoSoYeuCau: "HS-DICHUYEN-2026-03",
    lietsiId: "LS-KP3-003",
    tenLietSi: "Nguyễn Văn Hưng",
    khuPho: "Khu phố 3",
    nguoiYeuCau: "Nguyễn Văn Hùng",
    cccdNguoiYeuCau: "074078001844",
    soDienThoai: "0903.882.119",
    loaiYeuCau: "DINH_CHINH_THONG_TIN_BIA",
    lyDoVaCanCu: "Bia mộ hiện khắc năm sinh 1948, gia đình xuất trình Giấy khai sinh gốc và Bằng Tổ quốc ghi công xác nhận năm sinh đúng là 1950.",
    noiDungDinhChinhHoacNoiDen: "Đính chính năm sinh trên bia mộ thành 1950",
    kinhPhiDeXuatVND: 0,
    ngayNop: "20/10/2026",
    hanXuLy: "28/10/2026",
    trangThai: "DA_HOAN_THANH",
    canBoThuLy: "Lê Hoàng Nam",
    soQuyetDinhUbnd: "QĐ-UBND-2026/ĐC-04",
  },
  {
    id: "YC-MO-003",
    maHoSoYeuCau: "HS-ADN-2026-12",
    lietsiId: "LS-KP4-004",
    tenLietSi: "Lê Hoàng Tuấn",
    khuPho: "Khu phố 4",
    nguoiYeuCau: "Lê Thị Ngọc Bích",
    cccdNguoiYeuCau: "074195003321",
    soDienThoai: "0989.123.456",
    loaiYeuCau: "GIAM_DINH_ADN_XAC_DINH_DANH_TINH",
    lyDoVaCanCu: "Gia đình có thông tin liệt sĩ hy sinh tại mặt trận Dầu Tiếng, khớp với hồ sơ quy tập mộ số B2-14 Nghĩa trang Tỉnh. Đề nghị lấy mẫu ADN đối khớp.",
    kinhPhiDeXuatVND: 0,
    ngayNop: "18/10/2026",
    hanXuLy: "18/11/2026",
    trangThai: "DANG_THI_CONG",
    canBoThuLy: "Lê Hoàng Nam",
  },
];

// ============================================================================
// CHẤM ĐIỂM KPI CÔNG VỤ ĐA CHIỀU & CƠ CHẾ THƯỞNG PHẠT TỰ ĐỘNG
// Căn cứ pháp lý: Nghị định 90/2020/NĐ-CP, Nghị định 48/2023/NĐ-CP, Quyết định 766/QĐ-TTg
// ============================================================================

export interface DiemThuongPhatItem {
  id: string;
  loai: "THUONG" | "PHAT";
  soDiem: number; // e.g. +3, -5
  maLoiHoacSangKien: string;
  lyDo: string;
  ngayGhiNhan: string;
  nguoiQuyetDinh: string;
  chungTuLienQuan?: string;
}

export interface ChiTietTieuChiKpi {
  diemToiDa: number;
  diemTuCham: number;
  diemHeThongAuto: number;
  diemLanhDaoCham: number;
  canCuDanhGia: string;
}

export interface KpiEvaluationItem {
  id: string;
  maPhieuDanhGia: string;
  canBoId: string;
  canBoName: string;
  chucVu: string;
  phongBan: string;
  domain: DomainCode;
  avatarText: string;
  kyDanhGia: string;
  namDanhGia: number;

  // 5 Nhóm tiêu chí chuẩn Nghị định 90/2020 & 48/2023
  tieuChi1_NhiemVuChuyenMon: ChiTietTieuChiKpi; // 40 điểm tối đa
  tieuChi2_MotCuaDvcQd766: ChiTietTieuChiKpi;   // 25 điểm tối đa
  tieuChi3_CsatHaiLongDan: ChiTietTieuChiKpi;   // 15 điểm tối đa
  tieuChi4_KyLuatVanHoaCongSo: ChiTietTieuChiKpi;// 10 điểm tối đa
  tieuChi5_SangKienChuyenDoiSo: ChiTietTieuChiKpi;// 10 điểm tối đa

  // Thưởng & Phạt
  danhSachThuongPhat: DiemThuongPhatItem[];
  tongDiemThuong: number;
  tongDiemTru: number;

  // Điểm tổng hợp
  diemTuChamTong: number;
  diemHeThongAutoTong: number;
  diemLanhDaoTong: number;
  diemTongKetCuoiCung: number;

  // Xếp loại chất lượng công chức
  xepLoai: "HOAN_THANH_XUAT_SAC" | "HOAN_THANH_TOT" | "HOAN_THANH" | "KHONG_HOAN_THANH";
  trangThai: "DU_THAO" | "CHO_LANH_DAO_DUYET" | "DA_PHE_DUYET" | "KHIEU_NAI";

  // Thẩm định & Bút phê của Lãnh đạo
  lanhDaoThamDinh?: {
    nguoiDuyet: string;
    chucVu: string;
    ngayDuyet: string;
    nhanXetButPhe: string;
    deXuatKhenThuong?: string;
    maKySoSmartCA?: string;
  };

  // Thống kê tự động từ hệ thống
  heThongMetrics: {
    tyLeDungHanMotCua: number;
    soLuongHoSoDaXuLy: number;
    soSanPhamCheckInHoanThanh: number;
    diemCsatTrungBinh: number;
    soPhanHoiTieuCuc: number;
  };
}

export const initialKpiEvaluationList: KpiEvaluationItem[] = [
  {
    id: "KPI-2026-10-01",
    maPhieuDanhGia: "KPI-T10-NTT-01",
    canBoId: "CB_VAN_HOA",
    canBoName: "Nguyễn Thanh Tùng",
    chucVu: "Công chức Văn hóa - Xã hội (Văn hóa, Thể thao, Du lịch & Gia đình)",
    phongBan: "Bộ phận Văn hóa - Xã hội UBND Phường",
    domain: "VH_TT_DL",
    avatarText: "NTT",
    kyDanhGia: "Tháng 10/2026",
    namDanhGia: 2026,
    tieuChi1_NhiemVuChuyenMon: {
      diemToiDa: 40,
      diemTuCham: 39,
      diemHeThongAuto: 38.5,
      diemLanhDaoCham: 39,
      canCuDanhGia: "Hoàn thành 5/5 sản phẩm check-in: Tờ trình bình xét 528 hộ GĐVH KP1 (97.8%), Biên bản kiểm tra 814, Hồ sơ địa chỉ tin cậy",
    },
    tieuChi2_MotCuaDvcQd766: {
      diemToiDa: 25,
      diemTuCham: 24.5,
      diemHeThongAuto: 24,
      diemLanhDaoCham: 24,
      canCuDanhGia: "100% hồ sơ TTHC giải quyết đúng và trước hạn (12/12 hồ sơ), 100% kết quả số hóa ký số SmartCA",
    },
    tieuChi3_CsatHaiLongDan: {
      diemToiDa: 15,
      diemTuCham: 14.5,
      diemHeThongAuto: 14.5,
      diemLanhDaoCham: 14.5,
      canCuDanhGia: "Điểm CSAT đánh giá Kiosk & QR đạt 4.86/5.0 sao. 0 phản ánh tiêu cực về thái độ công vụ",
    },
    tieuChi4_KyLuatVanHoaCongSo: {
      diemToiDa: 10,
      diemTuCham: 10,
      diemHeThongAuto: 10,
      diemLanhDaoCham: 10,
      canCuDanhGia: "Chấp hành nghiêm giờ giấc công sở, trang phục lịch sự, tham gia đầy đủ 100% cuộc họp giao ban",
    },
    tieuChi5_SangKienChuyenDoiSo: {
      diemToiDa: 10,
      diemTuCham: 9,
      diemHeThongAuto: 8.5,
      diemLanhDaoCham: 8.5,
      canCuDanhGia: "Ứng dụng mã QR Audio Guide cho 6 điểm di tích và số hóa bản đồ di sản số Phú Cường",
    },
    danhSachThuongPhat: [
      {
        id: "TP-01",
        loai: "THUONG",
        soDiem: 3,
        maLoiHoacSangKien: "SK-2026-VH-02",
        lyDo: "Có sáng kiến gắn mã QR Audio Guide thuyết minh đa ngữ tại Di tích Chùa Bà Thiên Hậu phục vụ du khách",
        ngayGhiNhan: "20/10/2026",
        nguoiQuyetDinh: "TS. Nguyễn Văn Hùng",
        chungTuLienQuan: "QĐ-UBND-2026/SK-08",
      },
      {
        id: "TP-02",
        loai: "THUONG",
        soDiem: 2,
        maLoiHoacSangKien: "TRUOC_HAN_40",
        lyDo: "Tỷ lệ hồ sơ Một cửa trả trước hạn đạt trên 50% tổng số hồ sơ tiếp nhận trong tháng",
        ngayGhiNhan: "25/10/2026",
        nguoiQuyetDinh: "Bộ phận Một cửa",
        chungTuLienQuan: "Báo cáo QĐ 766 Tháng 10",
      },
    ],
    tongDiemThuong: 5,
    tongDiemTru: 0,
    diemTuChamTong: 97,
    diemHeThongAutoTong: 95.5,
    diemLanhDaoTong: 96,
    diemTongKetCuoiCung: 100, // 96 + 5 = 101, max 100
    xepLoai: "HOAN_THANH_XUAT_SAC",
    trangThai: "DA_PHE_DUYET",
    lanhDaoThamDinh: {
      nguoiDuyet: "TS. Nguyễn Văn Hùng",
      chucVu: "Lãnh đạo UBND Phường",
      ngayDuyet: "27/10/2026",
      nhanXetButPhe: "Đồng chí Tùng chủ động, năng động, hoàn thành xuất sắc các chỉ tiêu công vụ tháng 10. Đề nghị khen thưởng đột xuất khối VH-XH.",
      deXuatKhenThuong: "Đề nghị Chủ tịch UBND Phường tặng Giấy khen Công chức Xuất sắc Tháng 10",
      maKySoSmartCA: "SHA256:7e8a9b21f09c...nvhung",
    },
    heThongMetrics: {
      tyLeDungHanMotCua: 100,
      soLuongHoSoDaXuLy: 12,
      soSanPhamCheckInHoanThanh: 5,
      diemCsatTrungBinh: 4.86,
      soPhanHoiTieuCuc: 0,
    },
  },
  {
    id: "KPI-2026-10-02",
    maPhieuDanhGia: "KPI-T10-TKO-02",
    canBoId: "CB_GIAO_DUC",
    canBoName: "ThS. Trần Thị Kim Oanh",
    chucVu: "Công chức phụ trách Giáo dục - Đào tạo cơ sở & Khuyến học",
    phongBan: "Bộ phận Giáo dục & Đào tạo UBND Phường",
    domain: "GD_DT",
    avatarText: "TKO",
    kyDanhGia: "Tháng 10/2026",
    namDanhGia: 2026,
    tieuChi1_NhiemVuChuyenMon: {
      diemToiDa: 40,
      diemTuCham: 40,
      diemHeThongAuto: 39.5,
      diemLanhDaoCham: 40,
      canCuDanhGia: "Hoàn thành 100% kế hoạch phổ cập GDMN 5 tuổi (99.8%), quản lý tốt 14 nhóm trẻ tư thục đảm bảo VSATTP",
    },
    tieuChi2_MotCuaDvcQd766: {
      diemToiDa: 25,
      diemTuCham: 25,
      diemHeThongAuto: 24.5,
      diemLanhDaoCham: 24.5,
      canCuDanhGia: "100% hồ sơ cấp phép và trợ cấp trẻ mầm non xử lý trước hạn trên Cổng DVCQG",
    },
    tieuChi3_CsatHaiLongDan: {
      diemToiDa: 15,
      diemTuCham: 15,
      diemHeThongAuto: 15,
      diemLanhDaoCham: 15,
      canCuDanhGia: "Điểm CSAT phụ huynh học sinh đạt tuyệt đối 5.0/5.0 sao, giải đáp ân cần chu đáo",
    },
    tieuChi4_KyLuatVanHoaCongSo: {
      diemToiDa: 10,
      diemTuCham: 10,
      diemHeThongAuto: 10,
      diemLanhDaoCham: 10,
      canCuDanhGia: "Gương mẫu, tác phong chuẩn mực nhà giáo, thực hiện tốt quy chế văn hóa công sở",
    },
    tieuChi5_SangKienChuyenDoiSo: {
      diemToiDa: 10,
      diemTuCham: 9,
      diemHeThongAuto: 9.2,
      diemLanhDaoCham: 9.5,
      canCuDanhGia: "Xây dựng cổng tra cứu bản đồ số trường học và cơ sở mầm non ngoài công lập trên địa bàn",
    },
    danhSachThuongPhat: [
      {
        id: "TP-03",
        loai: "THUONG",
        soDiem: 3,
        maLoiHoacSangKien: "PHO_CAP_99",
        lyDo: "Đạt chỉ tiêu phổ cập giáo dục mầm non 5 tuổi và xóa mù chữ vượt kế hoạch thành phố giao",
        ngayGhiNhan: "22/10/2026",
        nguoiQuyetDinh: "TS. Nguyễn Văn Hùng",
        chungTuLienQuan: "Báo cáo Ban Chỉ đạo Phổ cập",
      },
    ],
    tongDiemThuong: 3,
    tongDiemTru: 0,
    diemTuChamTong: 99,
    diemHeThongAutoTong: 98.2,
    diemLanhDaoTong: 99,
    diemTongKetCuoiCung: 100,
    xepLoai: "HOAN_THANH_XUAT_SAC",
    trangThai: "DA_PHE_DUYET",
    lanhDaoThamDinh: {
      nguoiDuyet: "TS. Nguyễn Văn Hùng",
      chucVu: "Lãnh đạo UBND Phường",
      ngayDuyet: "27/10/2026",
      nhanXetButPhe: "Đồng chí Oanh có năng lực chuyên môn vững vàng, tinh thần trách nhiệm cao. Đề xuất biểu dương gương sáng công vụ.",
      deXuatKhenThuong: "Đề nghị Giám đốc Sở GD-ĐT tặng Giấy khen chuyên đề",
      maKySoSmartCA: "SHA256:4b2c1d99e0...nvhung",
    },
    heThongMetrics: {
      tyLeDungHanMotCua: 100,
      soLuongHoSoDaXuLy: 18,
      soSanPhamCheckInHoanThanh: 6,
      diemCsatTrungBinh: 5.0,
      soPhanHoiTieuCuc: 0,
    },
  },
  {
    id: "KPI-2026-10-03",
    maPhieuDanhGia: "KPI-T10-LHN-03",
    canBoId: "CB_LD_TBXH",
    canBoName: "Lê Hoàng Nam",
    chucVu: "Công chức Lao động, Việc làm & An sinh xã hội",
    phongBan: "Bộ phận Lao động - Thương binh & Xã hội",
    domain: "LDTBXH_AN_SINH",
    avatarText: "LHN",
    kyDanhGia: "Tháng 10/2026",
    namDanhGia: 2026,
    tieuChi1_NhiemVuChuyenMon: {
      diemToiDa: 40,
      diemTuCham: 37,
      diemHeThongAuto: 36.5,
      diemLanhDaoCham: 37,
      canCuDanhGia: "Chi trả đúng kỳ trợ cấp cho 1.240 đối tượng BTXH, rà soát giảm 4 hộ nghèo, thẩm định 28 hồ sơ mai táng phí",
    },
    tieuChi2_MotCuaDvcQd766: {
      diemToiDa: 25,
      diemTuCham: 23,
      diemHeThongAuto: 22.8,
      diemLanhDaoCham: 23,
      canCuDanhGia: "Giải quyết 26/27 hồ sơ đúng hạn. Có 1 hồ sơ xác nhận mức độ khuyết tật trễ hẹn 1 ngày do chờ kết quả giám định y khoa",
    },
    tieuChi3_CsatHaiLongDan: {
      diemToiDa: 15,
      diemTuCham: 14,
      diemHeThongAuto: 13.5,
      diemLanhDaoCham: 13.5,
      canCuDanhGia: "Điểm CSAT đạt 4.72/5.0 sao. Có 1 phản ánh đề nghị hướng dẫn thêm thủ tục cấp thẻ BHYT",
    },
    tieuChi4_KyLuatVanHoaCongSo: {
      diemToiDa: 10,
      diemTuCham: 10,
      diemHeThongAuto: 10,
      diemLanhDaoCham: 10,
      canCuDanhGia: "Chấp hành tốt kỷ luật lao động, tinh thần vì nhân dân phục vụ",
    },
    tieuChi5_SangKienChuyenDoiSo: {
      diemToiDa: 10,
      diemTuCham: 8,
      diemHeThongAuto: 8.0,
      diemLanhDaoCham: 8.0,
      canCuDanhGia: "Triển khai hiệu quả mô hình chi trả an sinh xã hội không dùng tiền mặt đạt 98.6% qua thẻ ATM Vietcombank",
    },
    danhSachThuongPhat: [
      {
        id: "TP-04",
        loai: "THUONG",
        soDiem: 3,
        maLoiHoacSangKien: "CHI_TRA_ATM_98",
        lyDo: "Tỷ lệ chi trả an sinh xã hội không dùng tiền mặt đạt 98.6%, vượt chỉ tiêu UBND Thành phố giao (chỉ tiêu 90%)",
        ngayGhiNhan: "24/10/2026",
        nguoiQuyetDinh: "TS. Nguyễn Văn Hùng",
        chungTuLienQuan: "Báo cáo chi trả Sở LĐTBXH",
      },
      {
        id: "TP-05",
        loai: "PHAT",
        soDiem: 3,
        maLoiHoacSangKien: "TRE_HEN_MOT_CUA",
        lyDo: "Để 01 hồ sơ xác định khuyết tật trễ hạn 01 ngày (Mã HS: BTXH-2026-088) do không kịp thời gửi thư xin lỗi công dân",
        ngayGhiNhan: "26/10/2026",
        nguoiQuyetDinh: "Bộ phận Một cửa UBND Phường",
        chungTuLienQuan: "Biên bản kiểm tra giải quyết TTHC",
      },
    ],
    tongDiemThuong: 3,
    tongDiemTru: 3,
    diemTuChamTong: 92,
    diemHeThongAutoTong: 90.8,
    diemLanhDaoTong: 91.5,
    diemTongKetCuoiCung: 91.5,
    xepLoai: "HOAN_THANH_XUAT_SAC",
    trangThai: "DA_PHE_DUYET",
    lanhDaoThamDinh: {
      nguoiDuyet: "TS. Nguyễn Văn Hùng",
      chucVu: "Lãnh đạo UBND Phường",
      ngayDuyet: "27/10/2026",
      nhanXetButPhe: "Đồng chí Nam làm tốt khâu an sinh xã hội và chi trả ATM. Cần rút kinh nghiệm khâu theo dõi hạn TTHC để không phát sinh trễ hẹn.",
      maKySoSmartCA: "SHA256:3a1b7e88c0...nvhung",
    },
    heThongMetrics: {
      tyLeDungHanMotCua: 96.3,
      soLuongHoSoDaXuLy: 27,
      soSanPhamCheckInHoanThanh: 4,
      diemCsatTrungBinh: 4.72,
      soPhanHoiTieuCuc: 1,
    },
  },
  {
    id: "KPI-2026-10-04",
    maPhieuDanhGia: "KPI-T10-VDC-04",
    canBoId: "CB_THONG_TIN",
    canBoName: "Vũ Đình Cường",
    chucVu: "Chuyên viên Văn hóa - Thông tin & Chuyển đổi số cơ sở",
    phongBan: "Bộ phận CNTT & Truyền thông Phường",
    domain: "TT_CDS",
    avatarText: "VDC",
    kyDanhGia: "Tháng 10/2026",
    namDanhGia: 2026,
    tieuChi1_NhiemVuChuyenMon: {
      diemToiDa: 40,
      diemTuCham: 36,
      diemHeThongAuto: 35.0,
      diemLanhDaoCham: 35,
      canCuDanhGia: "Vận hành hệ thống 16 cụm loa thông minh IP/4G, phát thanh 62 bản tin an ninh trật tự và PCCC",
    },
    tieuChi2_MotCuaDvcQd766: {
      diemToiDa: 25,
      diemTuCham: 23,
      diemHeThongAuto: 22.5,
      diemLanhDaoCham: 22.5,
      canCuDanhGia: "Hỗ trợ 100% công chức Một cửa vận hành ký số SmartCA và liên thông dữ liệu DVCQG",
    },
    tieuChi3_CsatHaiLongDan: {
      diemToiDa: 15,
      diemTuCham: 13,
      diemHeThongAuto: 13.0,
      diemLanhDaoCham: 13.0,
      canCuDanhGia: "Khảo sát ý kiến người dân về thời lượng và âm lượng loa truyền thanh đạt 91% hài lòng",
    },
    tieuChi4_KyLuatVanHoaCongSo: {
      diemToiDa: 10,
      diemTuCham: 9,
      diemHeThongAuto: 8.0,
      diemLanhDaoCham: 8.0,
      canCuDanhGia: "Chậm nộp Báo cáo an toàn thông tin cơ sở quý III/2026 quá 2 ngày so với quy định",
    },
    tieuChi5_SangKienChuyenDoiSo: {
      diemToiDa: 10,
      diemTuCham: 8,
      diemHeThongAuto: 10.0,
      diemLanhDaoCham: 9.5,
      canCuDanhGia: "Triển khai hiệu quả 4 Tổ công nghệ số cộng đồng hướng dẫn người dân định danh VNeID mức 2",
    },
    danhSachThuongPhat: [
      {
        id: "TP-06",
        loai: "THUONG",
        soDiem: 3,
        maLoiHoacSangKien: "TO_CNS_CONG_DONG",
        lyDo: "Kích hoạt 100% tài khoản VNeID mức 2 cho nhân dân 4 Khu phố vượt chỉ tiêu Công an Thành phố",
        ngayGhiNhan: "21/10/2026",
        nguoiQuyetDinh: "TS. Nguyễn Văn Hùng",
        chungTuLienQuan: "Báo cáo Đề án 06 Tháng 10",
      },
      {
        id: "TP-07",
        loai: "PHAT",
        soDiem: 2,
        maLoiHoacSangKien: "CHAM_NOP_BAO_CAO",
        lyDo: "Chậm nộp Báo cáo đánh giá an toàn thông tin mạng cấp xã/phường quý III về Sở TT&TT quá 02 ngày",
        ngayGhiNhan: "15/10/2026",
        nguoiQuyetDinh: "Văn phòng UBND Phường",
        chungTuLienQuan: "Phiếu đôn đốc số 12/PĐĐ-UBND",
      },
    ],
    tongDiemThuong: 3,
    tongDiemTru: 2,
    diemTuChamTong: 89,
    diemHeThongAutoTong: 88.5,
    diemLanhDaoTong: 88,
    diemTongKetCuoiCung: 89,
    xepLoai: "HOAN_THANH_TOT",
    trangThai: "DA_PHE_DUYET",
    lanhDaoThamDinh: {
      nguoiDuyet: "TS. Nguyễn Văn Hùng",
      chucVu: "Lãnh đạo UBND Phường",
      ngayDuyet: "27/10/2026",
      nhanXetButPhe: "Đồng chí Cường có chuyên môn công nghệ tốt, nhiệt tình với Tổ CNS cộng đồng. Chú ý tính kịp thời trong các báo cáo hành chính định kỳ.",
      maKySoSmartCA: "SHA256:9c8d7e66a1...nvhung",
    },
    heThongMetrics: {
      tyLeDungHanMotCua: 100,
      soLuongHoSoDaXuLy: 15,
      soSanPhamCheckInHoanThanh: 4,
      diemCsatTrungBinh: 4.65,
      soPhanHoiTieuCuc: 0,
    },
  },
];

// ============================================================================
// GÓI 1: BẾP ĂN BÁN TRÚ HỌC ĐƯỜNG & SỔ KIỂM THỰC 3 BƯỚC (QĐ 1246/QĐ-BYT)
// ============================================================================

export interface KiemThuc3BuocItem {
  id: string;
  maPhieu: string;
  tenCoSo: string;
  loaiCoSo: "MAM_NON_CONG_LAP" | "MAM_NON_TU_THUC" | "TIEU_HOC_BAN_TRU";
  khuPho: string;
  ngayKiemTra: string;
  soSuatAn: number;
  buoc1_NhapNguyenLieu: {
    nguonGocThucPham: string;
    donViCungCap: string;
    hoaDonGiayAttp: boolean;
    tinhTrangBaoGoiTemMac: boolean;
    danhGia: "DAT" | "KHONG_DAT";
  };
  buoc2_CheBien: {
    quyTrinhBep1Chieu: boolean;
    trangPhucTapDeBaoHo: boolean;
    nguonNuocSachDatChuan: boolean;
    nhietDoCheBienDamBao: boolean;
    danhGia: "DAT" | "KHONG_DAT";
  };
  buoc3_TruocKhiAnVaLuuMau: {
    camQuanMuiViDoChuc: string;
    tuLanhLuuMauRieng: boolean;
    nhietDoTuLanhLuuDoC: number;
    niemPhongHopMau24h: boolean;
    danhGia: "DAT" | "KHONG_DAT";
  };
  ketLuanChung: "DU_DIEU_KIEN_AN_TOAN" | "YEU_CAU_KHAC_PHUC" | "DINH_CHI_BEP_AN";
  truongDoanKiemTra: string;
  canBoYTePhuTrach: string;
  bienPhapXuLy?: string;
}

export const initialKiemThuc3BuocList: KiemThuc3BuocItem[] = [
  {
    id: "KT3B-01",
    maPhieu: "KT3B-2026-10-01",
    tenCoSo: "Trường Mầm non Tuổi Thơ (Khu phố 1)",
    loaiCoSo: "MAM_NON_TU_THUC",
    khuPho: "Khu phố 1",
    ngayKiemTra: "26/10/2026",
    soSuatAn: 185,
    buoc1_NhapNguyenLieu: {
      nguonGocThucPham: "Thịt heo Vissan, Rau củ quả Hợp tác xã Nông nghiệp công nghệ cao Phú Hòa",
      donViCungCap: "Công ty TNHH Thực phẩm Sạch Bình Dương",
      hoaDonGiayAttp: true,
      tinhTrangBaoGoiTemMac: true,
      danhGia: "DAT",
    },
    buoc2_CheBien: {
      quyTrinhBep1Chieu: true,
      trangPhucTapDeBaoHo: true,
      nguonNuocSachDatChuan: true,
      nhietDoCheBienDamBao: true,
      danhGia: "DAT",
    },
    buoc3_TruocKhiAnVaLuuMau: {
      camQuanMuiViDoChuc: "Cơm mềm, canh bí đỏ sườn heo thơm ngon, màu sắc tự nhiên không phẩm màu",
      tuLanhLuuMauRieng: true,
      nhietDoTuLanhLuuDoC: 4.2,
      niemPhongHopMau24h: true,
      danhGia: "DAT",
    },
    ketLuanChung: "DU_DIEU_KIEN_AN_TOAN",
    truongDoanKiemTra: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    canBoYTePhuTrach: "BS. Nguyễn Văn Hào (Trạm Trưởng Trạm Y tế Phường)",
    bienPhapXuLy: "Biên bản kiểm tra đạt chuẩn an toàn vệ sinh thực phẩm bếp ăn bán trú học đường",
  },
  {
    id: "KT3B-02",
    maPhieu: "KT3B-2026-10-02",
    tenCoSo: "Nhóm trẻ gia đình Họa Mi (Khu phố 3)",
    loaiCoSo: "MAM_NON_TU_THUC",
    khuPho: "Khu phố 3",
    ngayKiemTra: "25/10/2026",
    soSuatAn: 45,
    buoc1_NhapNguyenLieu: {
      nguonGocThucPham: "Mua lẻ tại Chợ Thủ Dầu Một chưa có hợp đồng chuỗi thực phẩm an toàn",
      donViCungCap: "Hộ kinh doanh sạp thịt rau chợ truyền thống",
      hoaDonGiayAttp: false,
      tinhTrangBaoGoiTemMac: false,
      danhGia: "KHONG_DAT",
    },
    buoc2_CheBien: {
      quyTrinhBep1Chieu: false,
      trangPhucTapDeBaoHo: true,
      nguonNuocSachDatChuan: true,
      nhietDoCheBienDamBao: true,
      danhGia: "KHONG_DAT",
    },
    buoc3_TruocKhiAnVaLuuMau: {
      camQuanMuiViDoChuc: "Thức ăn nấu chín, nhưng tủ lạnh lưu mẫu chưa dán nhãn niêm phong thời gian cụ thể",
      tuLanhLuuMauRieng: false,
      nhietDoTuLanhLuuDoC: 8.5,
      niemPhongHopMau24h: false,
      danhGia: "KHONG_DAT",
    },
    ketLuanChung: "YEU_CAU_KHAC_PHUC",
    truongDoanKiemTra: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
    canBoYTePhuTrach: "Y sĩ Trần Thị Mai (Trạm Y tế)",
    bienPhapXuLy: "Lập biên bản yêu cầu ký hợp đồng chuỗi thực phẩm có kiểm dịch, trang bị tủ lạnh lưu mẫu chuẩn trong 07 ngày",
  },
];

// ============================================================================
// GÓI 2: ĐIỀU DƯỠNG NGƯỜI CÓ CÔNG (PHÁP LỆNH 02/2020) & HỌC NGHỀ KCN
// ============================================================================

export interface DieuDuongNccItem {
  id: string;
  maHoSo: string;
  hoTen: string;
  namSinh: number;
  cccd: string;
  khuPho: string;
  dienDoiTuong: "THUONG_BINH_NANG_81" | "ME_VNAH" | "NHIEM_CDHH_NANG" | "THUONG_BINH_21_80" | "BENH_BINH";
  cheDoDieuDuong: "1_NAM_1_LAN" | "2_NAM_1_LAN";
  namThucHienGanNhat: number;
  namHienTai: number;
  hinhThucDangKy: "TAP_TRUNG" | "TAI_NHA";
  diaDiemTapTrung?: string;
  kinhPhiVND: number;
  trangThai: "CHO_DUYET" | "DA_PHE_DUYET" | "DA_CHI_TRA_HOAN_TAT";
  soQuyetDinh?: string;
  ngayQuyetDinh?: string;
}

export const initialDieuDuongNccList: DieuDuongNccItem[] = [
  {
    id: "DD-01",
    maHoSo: "NCC-DD-2026-001",
    hoTen: "Mẹ VNAH Nguyễn Thị Mười",
    namSinh: 1934,
    cccd: "074034000189",
    khuPho: "Khu phố 1",
    dienDoiTuong: "ME_VNAH",
    cheDoDieuDuong: "1_NAM_1_LAN",
    namThucHienGanNhat: 2025,
    namHienTai: 2026,
    hinhThucDangKy: "TAI_NHA",
    kinhPhiVND: 2181500,
    trangThai: "DA_CHI_TRA_HOAN_TAT",
    soQuyetDinh: "QĐ-UBND-115/QĐ-NCC",
    ngayQuyetDinh: "15/07/2026",
  },
  {
    id: "DD-02",
    maHoSo: "NCC-DD-2026-002",
    hoTen: "Thương binh 1/4 Lê Văn Lợi (Tỷ lệ 85%)",
    namSinh: 1952,
    cccd: "074052000213",
    khuPho: "Khu phố 2",
    dienDoiTuong: "THUONG_BINH_NANG_81",
    cheDoDieuDuong: "1_NAM_1_LAN",
    namThucHienGanNhat: 2025,
    namHienTai: 2026,
    hinhThucDangKy: "TAP_TRUNG",
    diaDiemTapTrung: "Trung tâm Điều dưỡng Người có công Long Đất (Bà Rịa - Vũng Tàu)",
    kinhPhiVND: 4363000,
    trangThai: "DA_PHE_DUYET",
    soQuyetDinh: "QĐ-SLDTBXH-892/2026",
    ngayQuyetDinh: "10/08/2026",
  },
  {
    id: "DD-03",
    maHoSo: "NCC-DD-2026-003",
    hoTen: "Bệnh binh 2/3 Phạm Quốc Toản (Tỷ lệ 61%)",
    namSinh: 1958,
    cccd: "074058000344",
    khuPho: "Khu phố 4",
    dienDoiTuong: "BENH_BINH",
    cheDoDieuDuong: "2_NAM_1_LAN",
    namThucHienGanNhat: 2024,
    namHienTai: 2026,
    hinhThucDangKy: "TAI_NHA",
    kinhPhiVND: 2181500,
    trangThai: "CHO_DUYET",
  },
];

export interface KhaoSatHocNgheItem {
  id: string;
  hoTen: string;
  namSinh: number;
  cccd: string;
  khuPho: string;
  dienDoiTuong: "BO_DOI_XUAT_NGU" | "HO_NGHEO_CAN_NGHEO" | "SAU_CAI_NGHIEN" | "LAO_DONG_NONG_THON";
  nguyenVongHocNghe: string;
  trinhDoHocVan: string;
  chinhSachHoTro: string;
  doanhNghiepLienKet: string;
  tinhTrang: "DA_KHAO_SAT" | "DANG_HOC_NGHE" | "DA_CO_VIEC_LAM";
}

export const initialKhaoSatHocNgheList: KhaoSatHocNgheItem[] = [
  {
    id: "HN-01",
    hoTen: "Đinh Văn Khánh",
    namSinh: 2003,
    cccd: "074203001290",
    khuPho: "Khu phố 2",
    dienDoiTuong: "BO_DOI_XUAT_NGU",
    nguyenVongHocNghe: "Kỹ thuật Lái xe tải nặng & Máy xúc công trình (Hạng C)",
    trinhDoHocVan: "12/12",
    chinhSachHoTro: "Thẻ học nghề quân nhân xuất ngũ miễn phí 100% học phí",
    doanhNghiepLienKet: "Công ty CP Vận tải Giao nhận Quốc tế Sóng Thần",
    tinhTrang: "DANG_HOC_NGHE",
  },
  {
    id: "HN-02",
    hoTen: "Nguyễn Thị Ngọc Ánh",
    namSinh: 2001,
    cccd: "074201004561",
    khuPho: "Khu phố 4",
    dienDoiTuong: "HO_NGHEO_CAN_NGHEO",
    nguyenVongHocNghe: "May công nghiệp cao cấp & Vận hành máy dệt kim tử",
    trinhDoHocVan: "9/12",
    chinhSachHoTro: "Hỗ trợ 3.000.000đ học phí và 30.000đ/ngày tiền ăn theo QĐ 46/2015",
    doanhNghiepLienKet: "Tập đoàn Dệt may Kim Oanh (KCN Việt Hương 1)",
    tinhTrang: "DA_CO_VIEC_LAM",
  },
];

// ============================================================================
// GÓI 3: ĐỘI KIỂM TRA LIÊN NGÀNH 814 (NĐ 54/2019) & ĐÔ THỊ VĂN MINH (QĐ 04/2022)
// ============================================================================

export interface KiemTra814Item {
  id: string;
  soBienBan: string;
  ngayKiemTra: string;
  gioKiemTra: string;
  tenCoSo: string;
  diaChi: string;
  chuCoSo: string;
  loaiHinh: "KARAOKE" | "VU_TRUONG_BAR" | "INTERNET_GAME" | "BIEN_QUANG_CAO";
  thanhPhanDoan: string[];
  noiDungKiemTra: {
    giayPhepKinhDoanh: boolean;
    anToanPccc: boolean;
    tiengOnSau22h: boolean;
    gioiHanDoTuoiGame: boolean;
    hopDongLaoDong: boolean;
  };
  hanhViViPham: string[];
  bienPhapXuLy: "NHAC_NHO" | "LAP_BIEN_BAN_VI_PHAM" | "TAM_DINH_CHI" | "CHUYEN_THANH_PHO_XU_PHAT";
  soTienXuPhatDuKienVND: number;
  trangThai: "DANG_XU_LY" | "DA_RA_QUYET_DINH" | "DA_THI_HANH_NOP_PHAT";
}

export const initialKiemTra814List: KiemTra814Item[] = [
  {
    id: "KT814-01",
    soBienBan: "BB-814-2026-09",
    ngayKiemTra: "24/10/2026",
    gioKiemTra: "22:45",
    tenCoSo: "Quán Hát Cho Nhau Nghe & Karaoke Đêm Trăng",
    diaChi: "Số 188 Đại lộ Bình Dương, Khu phố 2",
    chuCoSo: "Ông Nguyễn Văn Hào",
    loaiHinh: "KARAOKE",
    thanhPhanDoan: [
      "Nguyễn Thanh Tùng (Công chức Văn hóa - Xã hội, Trưởng đoàn)",
      "Đại úy Phạm Quốc Tuấn (Phó Trưởng Công an Phường)",
      "Dân quân thường trực Ban CHQS Phường",
      "Cán bộ Đội Quản lý TTĐT Phường",
    ],
    noiDungKiemTra: {
      giayPhepKinhDoanh: true,
      anToanPccc: true,
      tiengOnSau22h: false,
      gioiHanDoTuoiGame: true,
      hopDongLaoDong: true,
    },
    hanhViViPham: [
      "Phát âm thanh vượt quy chuẩn kỹ thuật về tiếng ồn sau 22h00 gây mất an ninh trật tự khu dân cư",
      "Không đóng kín cửa cách âm khi phòng hát đang hoạt động",
    ],
    bienPhapXuLy: "LAP_BIEN_BAN_VI_PHAM",
    soTienXuPhatDuKienVND: 7500000,
    trangThai: "DA_RA_QUYET_DINH",
  },
  {
    id: "KT814-02",
    soBienBan: "BB-814-2026-10",
    ngayKiemTra: "20/10/2026",
    gioKiemTra: "15:30",
    tenCoSo: "Cyber Gaming X90 Tốc Độ Cao",
    diaChi: "Số 45 Đường ĐX-01, Khu phố 4",
    chuCoSo: "Bà Lê Thị Thu Thủy",
    loaiHinh: "INTERNET_GAME",
    thanhPhanDoan: [
      "Nguyễn Thanh Tùng (Công chức Văn hóa - Xã hội)",
      "Thiếu tá Vũ Đức Thịnh (Cảnh sát khu vực KP4)",
    ],
    noiDungKiemTra: {
      giayPhepKinhDoanh: true,
      anToanPccc: true,
      tiengOnSau22h: true,
      gioiHanDoTuoiGame: false,
      hopDongLaoDong: true,
    },
    hanhViViPham: [
      "Để học sinh mặc đồng phục trường học chơi điện tử trong giờ học chính khóa (15h30)",
    ],
    bienPhapXuLy: "LAP_BIEN_BAN_VI_PHAM",
    soTienXuPhatDuKienVND: 3000000,
    trangThai: "DA_THI_HANH_NOP_PHAT",
  },
];

export interface DoThiVanMinhTieuChiItem {
  id: string;
  maTieuChi: string;
  tenTieuChi: string;
  soChiTieuCon: number;
  diemChuan: number;
  diemDatDuoc: number;
  ketQua: "DAT_CHUAN" | "CAN_BO_SUNG";
  ghiChuThucHien: string;
}

export const initialDoThiVanMinhList: DoThiVanMinhTieuChiItem[] = [
  {
    id: "DTVM-01",
    maTieuChi: "TC01",
    tenTieuChi: "Quy hoạch đô thị và hạ tầng giao thông đô thị",
    soChiTieuCon: 6,
    diemChuan: 10,
    diemDatDuoc: 9.5,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "100% đường liên khu phố được thảm nhựa, bê tông hóa có chiếu sáng LED",
  },
  {
    id: "DTVM-02",
    maTieuChi: "TC02",
    tenTieuChi: "Giao thông đô thị, trật tự vỉa hè lòng lề đường",
    soChiTieuCon: 5,
    diemChuan: 10,
    diemDatDuoc: 9.0,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "Không còn điểm lấn chiếm vỉa hè buôn bán tự phát kéo dài quá 24h",
  },
  {
    id: "DTVM-03",
    maTieuChi: "TC03",
    tenTieuChi: "Môi trường và an toàn thực phẩm đô thị",
    soChiTieuCon: 7,
    diemChuan: 15,
    diemDatDuoc: 14.0,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "100% rác sinh hoạt được thu gom trong ngày; 100% cơ sở ăn uống có cam kết ATTP",
  },
  {
    id: "DTVM-04",
    maTieuChi: "TC04",
    tenTieuChi: "An ninh, trật tự đô thị và phòng cháy chữa cháy",
    soChiTieuCon: 6,
    diemChuan: 15,
    diemDatDuoc: 14.5,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "Xây dựng 100% Tổ liên gia PCCC và Điểm chữa cháy công cộng các hẻm sâu",
  },
  {
    id: "DTVM-05",
    maTieuChi: "TC05",
    tenTieuChi: "Thông tin, truyền thông và chuyển đổi số cơ sở",
    soChiTieuCon: 5,
    diemChuan: 10,
    diemDatDuoc: 10.0,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "Hệ thống truyền thanh thông minh kết hợp ứng dụng Công dân số và Zalo OA",
  },
  {
    id: "DTVM-06",
    maTieuChi: "TC06",
    tenTieuChi: "Việc làm, thu nhập và giảm nghèo bền vững",
    soChiTieuCon: 5,
    diemChuan: 10,
    diemDatDuoc: 9.5,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "Thu nhập bình quân đầu người đạt trên 85 triệu đồng/năm; giảm nghèo đa chiều đạt chỉ tiêu",
  },
  {
    id: "DTVM-07",
    maTieuChi: "TC07",
    tenTieuChi: "Văn hóa, thể thao và nếp sống văn minh đô thị",
    soChiTieuCon: 8,
    diemChuan: 15,
    diemDatDuoc: 14.5,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "97.8% hộ Gia đình văn hóa; 4/4 Khu phố đạt chuẩn Khu phố văn hóa",
  },
  {
    id: "DTVM-08",
    maTieuChi: "TC08",
    tenTieuChi: "Y tế, giáo dục và chăm sóc sức khỏe cộng đồng",
    soChiTieuCon: 5,
    diemChuan: 10,
    diemDatDuoc: 9.8,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "95.5% người dân tham gia BHYT; chuẩn Phổ cập GDMN 5T đạt mức độ 3",
  },
  {
    id: "DTVM-09",
    maTieuChi: "TC09",
    tenTieuChi: "Hệ thống chính trị và sự hài lòng của nhân dân",
    soChiTieuCon: 5,
    diemChuan: 5,
    diemDatDuoc: 4.8,
    ketQua: "DAT_CHUAN",
    ghiChuThucHien: "Chỉ số hài lòng SIPAS đạt 98.6%, chính quyền trong sạch vững mạnh",
  },
];

// ============================================================================
// GÓI 4: PHẢN ÁNH HIỆN TRƯỜNG 1022 / IOC & BỘ CHỈ SỐ DTI CẤP XÃ
// ============================================================================

export interface PhanAnh1022Item {
  id: string;
  maPhanAnh: string;
  nguoiPhanAnh: string;
  soDienThoai: string;
  ngayTiepNhan: string;
  gioTiepNhan: string;
  linhVuc: "MOI_TRUONG_RAC" | "TRAT_TU_DO_THI" | "TIENG_ON" | "QUANG_CAO_RAO" | "CHIEU_SANG_HA_TANG" | "THAI_DO_MOT_CUA";
  diaChiSuCo: string;
  khuPho: string;
  noiDung: string;
  mucDoUuTien: "HOA_TOC_24H" | "THUONG_48H";
  canBoThuLy: string;
  chucVuCanBo: string;
  hanXuLy: string;
  ketQuaXuLy?: string;
  ngayHoanThanh?: string;
  trangThai: "TIEP_NHAN" | "DANG_XU_LY" | "DA_XU_LY" | "DONG_PHAN_HOI";
  danhGiaCuaDan?: "RAT_HAI_LONG" | "HAI_LONG" | "KHONG_HAI_LONG";
}

export const initialPhanAnh1022List: PhanAnh1022Item[] = [
  {
    id: "PA-01",
    maPhanAnh: "PA1022-2026-1025",
    nguoiPhanAnh: "Nguyễn Văn Tuấn",
    soDienThoai: "0918.345.xxx",
    ngayTiepNhan: "26/10/2026",
    gioTiepNhan: "08:15",
    linhVuc: "MOI_TRUONG_RAC",
    diaChiSuCo: "Đầu hẻm 42 Đường Nguyễn Tri Phương, Khu phố 1",
    khuPho: "Khu phố 1",
    noiDung: "Bãi rác tự phát đổ trộm phế thải xây dựng và cành cây che khuất cống thoát nước gây ứ đọng nước mưa",
    mucDoUuTien: "HOA_TOC_24H",
    canBoThuLy: "Nguyễn Thanh Tùng",
    chucVuCanBo: "Công chức Văn hóa - Xã hội phối hợp Đội TTĐT",
    hanXuLy: "27/10/2026 08:15",
    ketQuaXuLy: "Đã điều xe công ích thu gom 1.5 tấn phế thải, đặt biển cấm đổ rác và gắn camera giám sát phạt nguội",
    ngayHoanThanh: "26/10/2026 16:30",
    trangThai: "DA_XU_LY",
    danhGiaCuaDan: "RAT_HAI_LONG",
  },
  {
    id: "PA-02",
    maPhanAnh: "PA1022-2026-1026",
    nguoiPhanAnh: "Bà Lê Thị Hồng (Hộ dân KP3)",
    soDienThoai: "0903.882.xxx",
    ngayTiepNhan: "26/10/2026",
    gioTiepNhan: "21:30",
    linhVuc: "TIENG_ON",
    diaChiSuCo: "Quán nhậu vỉa hè Bờ Kè, Khu phố 3",
    khuPho: "Khu phố 3",
    noiDung: "Hát loa kẹo kéo công suất lớn quá 22h đêm gây mất giấc ngủ người già và trẻ nhỏ chuẩn bị thi học kỳ",
    mucDoUuTien: "HOA_TOC_24H",
    canBoThuLy: "Nguyễn Thanh Tùng",
    chucVuCanBo: "Đội Kiểm tra liên ngành 814 & Công an Phường",
    hanXuLy: "27/10/2026 21:30",
    ketQuaXuLy: "Công an Phường và Đội 814 xuống hiện trường lúc 22h00, lập biên bản tạm giữ 01 loa kéo và nhắc nhở chủ quán",
    ngayHoanThanh: "26/10/2026 22:30",
    trangThai: "DA_XU_LY",
    danhGiaCuaDan: "RAT_HAI_LONG",
  },
  {
    id: "PA-03",
    maPhanAnh: "PA1022-2026-1027",
    nguoiPhanAnh: "Trần Minh Trí",
    soDienThoai: "0977.112.xxx",
    ngayTiepNhan: "27/10/2026",
    gioTiepNhan: "09:00",
    linhVuc: "QUANG_CAO_RAO",
    diaChiSuCo: "Dọc cột điện tuyến đường Huỳnh Văn Lũy, Khu phố 4",
    khuPho: "Khu phố 4",
    noiDung: "Dán tờ rơi quảng cáo cho vay tiền nhanh tín dụng đen và khoan cắt bê tông làm mất mỹ quan đô thị",
    mucDoUuTien: "THUONG_48H",
    canBoThuLy: "Vũ Đình Cường",
    chucVuCanBo: "Chuyên viên TT-CĐS & Đoàn Thanh niên",
    hanXuLy: "29/10/2026 09:00",
    trangThai: "DANG_XU_LY",
  },
];

export interface DtiCapXaItem {
  id: string;
  truCot: "CHINH_QUYEN_SO" | "KINH_TE_SO" | "XA_HOI_SO";
  tenChiSo: string;
  chiTieuGiao: number;
  thucTeDat: number;
  donViTinh: string;
  danhGia: "DAT" | "VUOT_CHI_TIEU" | "CAN_PHAN_DAU";
  moTaHienTrang: string;
}

export const initialDtiCapXaList: DtiCapXaItem[] = [
  {
    id: "DTI-01",
    truCot: "CHINH_QUYEN_SO",
    tenChiSo: "Tỷ lệ hồ sơ TTHC tiếp nhận và giải quyết trực tuyến toàn trình",
    chiTieuGiao: 80,
    thucTeDat: 91.5,
    donViTinh: "%",
    danhGia: "VUOT_CHI_TIEU",
    moTaHienTrang: "100% TTHC đủ điều kiện đã cung cấp DVC trực tuyến toàn trình trên Cổng DVCQG",
  },
  {
    id: "DTI-02",
    truCot: "CHINH_QUYEN_SO",
    tenChiSo: "Tỷ lệ hồ sơ công việc xử lý trên môi trường mạng và ký số SmartCA",
    chiTieuGiao: 90,
    thucTeDat: 98.2,
    donViTinh: "%",
    danhGia: "VUOT_CHI_TIEU",
    moTaHienTrang: "100% văn bản chỉ đạo của UBND Phường sử dụng chữ ký số cá nhân và con dấu cơ quan điện tử",
  },
  {
    id: "DTI-03",
    truCot: "KINH_TE_SO",
    tenChiSo: "Tỷ lệ hộ kinh doanh, tiểu thương áp dụng thanh toán không dùng tiền mặt (VietQR)",
    chiTieuGiao: 75,
    thucTeDat: 88.0,
    donViTinh: "%",
    danhGia: "VUOT_CHI_TIEU",
    moTaHienTrang: "Tuyến phố thanh toán không dùng tiền mặt đạt 100% cơ sở kinh doanh có bảng QR",
  },
  {
    id: "DTI-04",
    truCot: "XA_HOI_SO",
    tenChiSo: "Tỷ lệ người dân trưởng thành có tài khoản định danh điện tử VNeID mức 2",
    chiTieuGiao: 85,
    thucTeDat: 94.6,
    donViTinh: "%",
    danhGia: "VUOT_CHI_TIEU",
    moTaHienTrang: "4 Tổ công nghệ số cộng đồng đi từng ngõ, gõ từng nhà kích hoạt VNeID",
  },
  {
    id: "DTI-05",
    truCot: "XA_HOI_SO",
    tenChiSo: "Tỷ lệ người dân trưởng thành có chữ ký số cá nhân để nộp DVC",
    chiTieuGiao: 30,
    thucTeDat: 42.5,
    donViTinh: "%",
    danhGia: "VUOT_CHI_TIEU",
    moTaHienTrang: "Phối hợp VNPT SmartCA và Viettel CA cấp miễn phí chữ ký số tại Bộ phận Một cửa",
  },
];

// ==========================================
// GÓI BỔ SUNG 1: PHỔ CẬP GIÁO DỤC & CỘNG ĐỒNG HỌC TẬP (NĐ 20/2014 & TT 44/2014)
// ==========================================
export interface PhoCapGiaoDucItem {
  id: string;
  khuPho: string;
  bacHoc: "MAM_NON_5T" | "TIEU_HOC" | "THCS" | "XOA_MU_CHU";
  doTuoiDieuTra: string;
  tongSoTre: number;
  soTreDiHoc: number;
  soTreBoHoc: number;
  soTreNguyCoBoHoc: number;
  tyLeHuyDongPercent: number;
  mucDoDatChuan: string;
  namDieuTra: number;
  canBoPhuTrach: string;
  bienPhapVanDong: string;
}

export const initialPhoCapGiaoDucList: PhoCapGiaoDucItem[] = [
  {
    id: "PC-01",
    khuPho: "Khu phố 1",
    bacHoc: "MAM_NON_5T",
    doTuoiDieuTra: "Trẻ 5 tuổi (sinh năm 2021)",
    tongSoTre: 245,
    soTreDiHoc: 245,
    soTreBoHoc: 0,
    soTreNguyCoBoHoc: 0,
    tyLeHuyDongPercent: 100.0,
    mucDoDatChuan: "Đạt chuẩn phổ cập trẻ 5 tuổi",
    namDieuTra: 2026,
    canBoPhuTrach: "Nguyễn Thị Mai (Hiệu trưởng MN Hướng Dương)",
    bienPhapVanDong: "100% trẻ 5 tuổi ra lớp mầm non, duy trì ăn bán trú.",
  },
  {
    id: "PC-02",
    khuPho: "Khu phố 2",
    bacHoc: "TIEU_HOC",
    doTuoiDieuTra: "Độ tuổi 6 - 11 tuổi (sinh 2015 - 2020)",
    tongSoTre: 412,
    soTreDiHoc: 411,
    soTreBoHoc: 0,
    soTreNguyCoBoHoc: 1,
    tyLeHuyDongPercent: 99.76,
    mucDoDatChuan: "Đạt chuẩn PCGD Tiểu học Mức độ 3",
    namDieuTra: 2026,
    canBoPhuTrach: "Lê Văn Hùng (Cán bộ Văn hóa - Xã hội)",
    bienPhapVanDong: "Vận động gia đình cháu Bùi Hoàng M. (tạm trú nhà trọ) tiếp tục đến trường, hỗ trợ sách giáo khoa và học bổng khuyến học.",
  },
  {
    id: "PC-03",
    khuPho: "Khu phố 3",
    bacHoc: "THCS",
    doTuoiDieuTra: "Độ tuổi 11 - 15 tuổi (sinh 2011 - 2015)",
    tongSoTre: 388,
    soTreDiHoc: 385,
    soTreBoHoc: 1,
    soTreNguyCoBoHoc: 2,
    tyLeHuyDongPercent: 99.23,
    mucDoDatChuan: "Đạt chuẩn PCGD THCS Mức độ 3",
    namDieuTra: 2026,
    canBoPhuTrach: "Trần Anh Tuấn (Phó Hiệu trưởng THCS)",
    bienPhapVanDong: "Tổ chức kèm đạo học sinh yếu kém sau giờ học; phân luồng học nghề sớm đối với học sinh hoàn cảnh khó khăn.",
  },
  {
    id: "PC-04",
    khuPho: "Khu phố 4",
    bacHoc: "XOA_MU_CHU",
    doTuoiDieuTra: "Độ tuổi 15 - 60 tuổi",
    tongSoTre: 3200,
    soTreDiHoc: 3198,
    soTreBoHoc: 0,
    soTreNguyCoBoHoc: 2,
    tyLeHuyDongPercent: 99.94,
    mucDoDatChuan: "Đạt chuẩn Xóa mù chữ Mức độ 2",
    namDieuTra: 2026,
    canBoPhuTrach: "Lê Văn Hùng (Cán bộ VH-XH)",
    bienPhapVanDong: "Tổ chức lớp học chuyên đề xóa tái mù và nâng cao tin học văn phòng tại Trung tâm Học tập cộng đồng.",
  },
];

export interface CongDongHocTapItem {
  id: string;
  nhomTieuChi: string;
  tenTieuChi: string;
  diemToiDa: number;
  diemTuDanhGia: number;
  diemDoanKiemTra: number;
  minhChungKetQua: string;
}

export const initialCongDongHocTapList: CongDongHocTapItem[] = [
  {
    id: "CDHT-01",
    nhomTieuChi: "I. Sự lãnh đạo, chỉ đạo của cấp ủy Đảng, chính quyền",
    tenTieuChi: "Có Nghị quyết, kế hoạch hàng năm và bố trí kinh phí hoạt động cho TTHTCĐ",
    diemToiDa: 10,
    diemTuDanhGia: 10,
    diemDoanKiemTra: 10,
    minhChungKetQua: "Nghị quyết HĐND và Quyết định số 48/QĐ-UBND phê duyệt kinh phí 120 triệu đồng cho TTHTCĐ năm 2026.",
  },
  {
    id: "CDHT-02",
    nhomTieuChi: "II. Kết quả hoạt động của TTHTCĐ & Các phong trào học tập",
    tenTieuChi: "Huy động các tầng lớp nhân dân tham gia học tập các lớp chuyên đề KHKT, kỹ năng sống",
    diemToiDa: 25,
    diemTuDanhGia: 24,
    diemDoanKiemTra: 24,
    minhChungKetQua: "Tổ chức 14 lớp chuyên đề với 1.150 lượt người dân tham gia (tin học, bảo hiểm, an toàn thực phẩm).",
  },
  {
    id: "CDHT-03",
    nhomTieuChi: "III. Xây dựng Gia đình học tập, Dòng họ học tập, Cộng đồng học tập",
    tenTieuChi: "Tỷ lệ gia đình đạt danh hiệu 'Gia đình học tập' đạt trên 85%",
    diemToiDa: 30,
    diemTuDanhGia: 28,
    diemDoanKiemTra: 28,
    minhChungKetQua: "91.4% số hộ gia đình đăng ký và đạt chuẩn Gia đình học tập; 100% dòng họ duy trì quỹ khuyến học khuyến tài.",
  },
  {
    id: "CDHT-04",
    nhomTieuChi: "IV. Tác động của học tập đến phát triển KT-XH địa phương",
    tenTieuChi: "Giảm tỷ lệ hộ nghèo, nâng cao năng suất lao động, giảm thiểu tệ nạn xã hội",
    diemToiDa: 25,
    diemTuDanhGia: 24,
    diemDoanKiemTra: 24,
    minhChungKetQua: "100% người sau học nghề có việc làm ổn định tại các cụm công nghiệp địa phương; an ninh trật tự giữ vững.",
  },
  {
    id: "CDHT-05",
    nhomTieuChi: "V. Ứng dụng công nghệ thông tin và chuyển đổi số trong học tập",
    tenTieuChi: "Phổ cập kỹ năng số cộng đồng, tra cứu học liệu số trên nền tảng trực tuyến",
    diemToiDa: 10,
    diemTuDanhGia: 9,
    diemDoanKiemTra: 9,
    minhChungKetQua: "Thư viện điện tử phường kết nối Cổng học liệu mở; 100% người dân được hướng dẫn nộp DVC trực tuyến.",
  },
];

// ==========================================
// GÓI BỔ SUNG 2: THỜ CÚNG LIỆT SĨ & HỘI ĐỒNG KHUYẾT TẬT (NĐ 131/2021 & TT 01/2019)
// ==========================================
export interface ThoCungLietSiItem {
  id: string;
  maHoSo: string;
  hoTenLietSi: string;
  namSinh: number;
  namHySinh: number;
  queQuan: string;
  hoTenNguoiThoCung: string;
  quanHeVoiLietSi: string;
  cccdNguoiThoCung: string;
  diaChiNguoiThoCung: string;
  khuPho: string;
  soVanBanUyQuyen: string;
  dinhMucNamVND: number; // 1.400.000đ theo NĐ 131/2021
  namChiTra: number;
  trangThaiChiTra: "CHO_CHI_TRA" | "DA_CHI_TRA";
  ngayChiTra?: string;
  hinhThucNhan: "TIEN_MAT" | "CHUYEN_KHOAN_ATM";
}

export const initialThoCungLietSiList: ThoCungLietSiItem[] = [
  {
    id: "TCLS-01",
    maHoSo: "TCLS/2026/001",
    hoTenLietSi: "Nguyễn Văn Hùng",
    namSinh: 1948,
    namHySinh: 1972,
    queQuan: "Phường Thủ Dầu Một, TP. Thủ Dầu Một, Bình Dương",
    hoTenNguoiThoCung: "Nguyễn Văn Dũng",
    quanHeVoiLietSi: "Em ruột (Người thờ cúng được ủy quyền)",
    cccdNguoiThoCung: "074088001234",
    diaChiNguoiThoCung: "Số 45 đường Đoàn Trần Nghiệp, KP1",
    khuPho: "Khu phố 1",
    soVanBanUyQuyen: "Văn bản ủy quyền Mẫu 04 số 12/UQ-UBND",
    dinhMucNamVND: 1400000,
    namChiTra: 2026,
    trangThaiChiTra: "DA_CHI_TRA",
    ngayChiTra: "20/07/2026",
    hinhThucNhan: "CHUYEN_KHOAN_ATM",
  },
  {
    id: "TCLS-02",
    maHoSo: "TCLS/2026/002",
    hoTenLietSi: "Lê Hoàng Minh",
    namSinh: 1952,
    namHySinh: 1974,
    queQuan: "Phường Thủ Dầu Một, TP. Thủ Dầu Một",
    hoTenNguoiThoCung: "Lê Thị Bích Liên",
    quanHeVoiLietSi: "Con gái ruột",
    cccdNguoiThoCung: "074190005678",
    diaChiNguoiThoCung: "Số 112 đường Bạch Đằng, KP2",
    khuPho: "Khu phố 2",
    soVanBanUyQuyen: "Văn bản thỏa thuận gia đình số 08/TT-GD",
    dinhMucNamVND: 1400000,
    namChiTra: 2026,
    trangThaiChiTra: "CHO_CHI_TRA",
    hinhThucNhan: "TIEN_MAT",
  },
  {
    id: "TCLS-03",
    maHoSo: "TCLS/2026/003",
    hoTenLietSi: "Trần Quốc Toản",
    namSinh: 1950,
    namHySinh: 1969,
    queQuan: "Phường Thủ Dầu Một, TP. Thủ Dầu Một",
    hoTenNguoiThoCung: "Trần Văn Bình",
    quanHeVoiLietSi: "Cháu đích tôn",
    cccdNguoiThoCung: "074095009876",
    diaChiNguoiThoCung: "Hẻm 18 đường Ngô Quyền, KP3",
    khuPho: "Khu phố 3",
    soVanBanUyQuyen: "Biên bản ủy quyền gia tộc số 22/BB-GT",
    dinhMucNamVND: 1400000,
    namChiTra: 2026,
    trangThaiChiTra: "DA_CHI_TRA",
    ngayChiTra: "22/07/2026",
    hinhThucNhan: "CHUYEN_KHOAN_ATM",
  },
];

export interface HoiDongKhuyetTatItem {
  id: string;
  maHoSo: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: "NAM" | "NU";
  cccd: string;
  diaChi: string;
  khuPho: string;
  dangTat: "VAN_DONG" | "NGHE_NOI" | "NHIN" | "THAN_KINH_TAM_THAN" | "TRI_TUE" | "KHAC";
  mucDoKhuyetTat: "DAC_BIET_NANG" | "NANG" | "NHE";
  ngayHopHoiDong: string;
  thanhVienHoiDong: string;
  ketLuan: string;
  soGiayXacNhan: string;
  trangThaiCapGiay: "CHO_XET_DUYET" | "DA_CAP_GIAY" | "CHUYEN_TUYEN_TREN_GIAM_DINH";
}

export const initialHoiDongKhuyetTatList: HoiDongKhuyetTatItem[] = [
  {
    id: "HDKT-01",
    maHoSo: "HDKT/2026/01",
    hoTen: "Phạm Văn Thành",
    ngaySinh: "15/03/1982",
    gioiTinh: "NAM",
    cccd: "074082001122",
    diaChi: "Số 67 đường Cách Mạng Tháng Tám, KP1",
    khuPho: "Khu phố 1",
    dangTat: "VAN_DONG",
    mucDoKhuyetTat: "DAC_BIET_NANG",
    ngayHopHoiDong: "15/02/2026",
    thanhVienHoiDong: "Chủ tịch Hội đồng: PCT UBND Phường; Phó Chủ tịch: Trạm trưởng Y tế; Thư ký: Cán bộ LĐTBXH; Thành viên: Hội Người khuyết tật",
    ketLuan: "Liệt hoàn toàn 2 chi dưới do di chứng tai nạn lao động, mất hoàn toàn khả năng tự phục vụ sinh hoạt cá nhân.",
    soGiayXacNhan: "GCN-KT/2026/045",
    trangThaiCapGiay: "DA_CAP_GIAY",
  },
  {
    id: "HDKT-02",
    maHoSo: "HDKT/2026/02",
    hoTen: "Trần Thị Cẩm Tú",
    ngaySinh: "20/08/2005",
    gioiTinh: "NU",
    cccd: "074105004455",
    diaChi: "Số 234 đường Yersin, KP2",
    khuPho: "Khu phố 2",
    dangTat: "TRI_TUE",
    mucDoKhuyetTat: "NANG",
    ngayHopHoiDong: "15/03/2026",
    thanhVienHoiDong: "Hội đồng xác định mức độ khuyết tật UBND Phường Thủ Dầu Một",
    ketLuan: "Chậm phát triển trí tuệ bẩm sinh mức độ nặng, suy giảm khả năng nhận thức và lao động.",
    soGiayXacNhan: "GCN-KT/2026/078",
    trangThaiCapGiay: "DA_CAP_GIAY",
  },
  {
    id: "HDKT-03",
    maHoSo: "HDKT/2026/03",
    hoTen: "Võ Hoàng Nam",
    ngaySinh: "10/11/1976",
    gioiTinh: "NAM",
    cccd: "074076008899",
    diaChi: "Hẻm 45 đường Phú Lợi, KP4",
    khuPho: "Khu phố 4",
    dangTat: "NHIN",
    mucDoKhuyetTat: "NANG",
    ngayHopHoiDong: "25/10/2026",
    thanhVienHoiDong: "Hội đồng xét duyệt khuyết tật cấp phường đợt 4/2026",
    ketLuan: "Suy giảm thị lực cả hai mắt trên 81% sau phẫu thuật võng mạc, cần người trợ giúp khi đi lại ngoài đường.",
    soGiayXacNhan: "GCN-KT/2026/102",
    trangThaiCapGiay: "CHO_XET_DUYET",
  },
];

// ==========================================
// GÓI BỔ SUNG 3: NGHỆ NHÂN DI SẢN & THỂ DỤC THỂ THAO (NĐ 109/2015 & NĐ 36/2019)
// ==========================================
export interface NgheNhanDiSanItem {
  id: string;
  hoTen: string;
  namSinh: number;
  danhHieu: "NGHE_NHAN_UU_TU" | "NGHE_NHAN_NHAN_DAN" | "NGHE_NHAN_DAN_GIAN";
  loaiHinhDiSan: string;
  namPhongTang: number;
  khuPho: string;
  tinhTrangSucKhoe: string;
  mucTroCapThangVND: number;
  clbSinhHoat: string;
  thanhTichTruyenDay: string;
}

export const initialNgheNhanDiSanList: NgheNhanDiSanItem[] = [
  {
    id: "NN-01",
    hoTen: "Trương Văn Cang",
    namSinh: 1954,
    danhHieu: "NGHE_NHAN_UU_TU",
    loaiHinhDiSan: "Nghệ thuật Đờn ca tài tử Nam Bộ & Hát bội",
    namPhongTang: 2019,
    khuPho: "Khu phố 2",
    tinhTrangSucKhoe: "Tốt, minh mẫn, nhiệt tình truyền dạy",
    mucTroCapThangVND: 1800000,
    clbSinhHoat: "CLB Đờn ca tài tử Trung tâm Văn hóa Phường Thủ Dầu Một",
    thanhTichTruyenDay: "Đã đào tạo trên 60 học viên ngón đàn kìm, đàn tranh và nghệ thuật ca vọng cổ truyền thống.",
  },
  {
    id: "NN-02",
    hoTen: "Nguyễn Thanh Sơn",
    namSinh: 1960,
    danhHieu: "NGHE_NHAN_UU_TU",
    loaiHinhDiSan: "Nghề thủ công truyền thống Sơn mài Tương Bình Hiệp",
    namPhongTang: 2022,
    khuPho: "Khu phố 4",
    tinhTrangSucKhoe: "Bình thường",
    mucTroCapThangVND: 1800000,
    clbSinhHoat: "Hiệp hội Sơn mài Điêu khắc Bình Dương",
    thanhTichTruyenDay: "Chủ trì phục dựng kỹ thuật sơn mài cẩn vỏ trứng và cẩn ốc xà cừ cổ truyền Nam Bộ.",
  },
  {
    id: "NN-03",
    hoTen: "Lê Thị Hồng Vân",
    namSinh: 1968,
    danhHieu: "NGHE_NHAN_DAN_GIAN",
    loaiHinhDiSan: "Ẩm thực dân gian (Bánh bèo bì chợ Búng & Món ngon Bình Dương)",
    namPhongTang: 2024,
    khuPho: "Khu phố 1",
    tinhTrangSucKhoe: "Tốt",
    mucTroCapThangVND: 1000000,
    clbSinhHoat: "Chi hội Phụ nữ & Ẩm thực truyền thống phường",
    thanhTichTruyenDay: "Truyền dạy bí quyết chế biến nước mắm tỏi ớt gia truyền và bánh bèo bì phục vụ du khách Lễ hội Chùa Bà.",
  },
];

export interface CoSoTheThaoItem {
  id: string;
  tenCoSo: string;
  loaiHinh: "BE_BOI" | "PHONG_GYM_FITNESS" | "YOGA" | "SAN_BONG_DA" | "VO_THUAT";
  diaChi: string;
  chuCoSo: string;
  sdt: string;
  giayPhepKinhDoanh: string;
  soNhanVienCuuHo: number;
  chungChiChuyenMon: boolean;
  tinhTrangPCCC: "DAT" | "CHUA_DAT";
  ketQuaKiemTra: "DAT_CHUAN" | "CAN_KHAC_PHUC" | "DINH_CHI";
  ngayKiemTraGanNhat: string;
  ghiChu: string;
}

export const initialCoSoTheThaoList: CoSoTheThaoItem[] = [
  {
    id: "TT-01",
    tenCoSo: "Hồ bơi Thiếu nhi Hoa Phượng",
    loaiHinh: "BE_BOI",
    diaChi: "Số 88 đường Bạch Đằng, KP1",
    chuCoSo: "Lê Minh Tuấn",
    sdt: "0903.882.331",
    giayPhepKinhDoanh: "GPKD-TT/2023/12",
    soNhanVienCuuHo: 3,
    chungChiChuyenMon: true,
    tinhTrangPCCC: "DAT",
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "14/09/2026",
    ghiChu: "Đầy đủ 10 phao cứu sinh, 2 sào cứu hộ, kiểm nghiệm chất lượng nước định kỳ 2 tuần/lần, có bảng nội quy phòng chống đuối nước rõ ràng.",
  },
  {
    id: "TT-02",
    tenCoSo: "CLB Gym & Fitness Olympic Center",
    loaiHinh: "PHONG_GYM_FITNESS",
    diaChi: "Số 154 đường Cách Mạng Tháng Tám, KP3",
    chuCoSo: "Phạm Quốc Hưng",
    sdt: "0918.445.678",
    giayPhepKinhDoanh: "GPKD-TT/2024/45",
    soNhanVienCuuHo: 0,
    chungChiChuyenMon: true,
    tinhTrangPCCC: "DAT",
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "08/10/2026",
    ghiChu: "Huấn luyện viên có bằng cử nhân TDTT, trang bị máy tập đạt chuẩn an toàn, khoảng cách máy hợp lý.",
  },
  {
    id: "TT-03",
    tenCoSo: "Sân bóng đá cỏ nhân tạo Phú Cường Sport",
    loaiHinh: "SAN_BONG_DA",
    diaChi: "Khu phố 4, P. Thủ Dầu Một",
    chuCoSo: "Nguyễn Văn Đức",
    sdt: "0977.992.114",
    giayPhepKinhDoanh: "GPKD-TT/2022/88",
    soNhanVienCuuHo: 0,
    chungChiChuyenMon: true,
    tinhTrangPCCC: "DAT",
    ketQuaKiemTra: "CAN_KHAC_PHUC",
    ngayKiemTraGanNhat: "18/10/2026",
    ghiChu: "Hệ thống chiếu sáng đèn LED ban đêm đáp ứng tốt, yêu cầu bổ sung tủ thuốc sơ cấp cứu chấn thương thể thao trước ngày 05/11/2026.",
  },
];

// ==========================================
// GÓI BỔ SUNG 4: CỔNG TTĐT, ZALO OA & KHÔNG GIAN MẠNG (NĐ 42/2022 & CT 14/CT-TTg)
// ==========================================
export interface TinBaiCongThongTinItem {
  id: string;
  tieuDe: string;
  chuyenMuc: "CHI_DAO_DIEU_HANH" | "DVC_CHUYEN_DOI_SO" | "AN_NINH_TRAT_TU" | "VAN_HOA_XA_HOI" | "THONG_BAO_KHAN";
  tacGia: string;
  ngayGui: string;
  trangThai: "BAN_THAO" | "CHO_BIEN_TAP" | "CHO_DUYET" | "DA_XUAT_BAN";
  nguoiDuyet?: string;
  ngayXuatBan?: string;
  luotXem: number;
  dongBoZaloOA: boolean;
  luotGuiBroadcast: number;
}

export const initialTinBaiList: TinBaiCongThongTinItem[] = [
  {
    id: "TB-01",
    tieuDe: "UBND Phường Thủ Dầu Một phát động Tháng hành động vì Bình đẳng giới và phòng ngừa bạo lực năm 2026",
    chuyenMuc: "VAN_HOA_XA_HOI",
    tacGia: "Vũ Đình Cường (Chuyên viên TT-CĐS)",
    ngayGui: "20/10/2026",
    trangThai: "DA_XUAT_BAN",
    nguoiDuyet: "Nguyễn Văn An (Chủ tịch UBND Phường)",
    ngayXuatBan: "21/10/2026 08:30",
    luotXem: 2840,
    dongBoZaloOA: true,
    luotGuiBroadcast: 12500,
  },
  {
    id: "TB-02",
    tieuDe: "Hướng dẫn cài đặt và sử dụng tính năng 'Ví giấy tờ số' trên VNeID mức 2 khi thực hiện TTHC",
    chuyenMuc: "DVC_CHUYEN_DOI_SO",
    tacGia: "Tổ Công nghệ số cộng đồng",
    ngayGui: "24/10/2026",
    trangThai: "DA_XUAT_BAN",
    nguoiDuyet: "Trần Thị Mai (PCT UBND Phường)",
    ngayXuatBan: "25/10/2026 09:15",
    luotXem: 4120,
    dongBoZaloOA: true,
    luotGuiBroadcast: 15200,
  },
  {
    id: "TB-03",
    tieuDe: "Kế hoạch tổ chức Lễ hội Đền Bà Thiên Hậu Rằm tháng Giêng năm Đinh Mùi 2027 bảo đảm an toàn PCCC",
    chuyenMuc: "CHI_DAO_DIEU_HANH",
    tacGia: "Lê Văn Hùng (Cán bộ Văn hóa - Xã hội)",
    ngayGui: "26/10/2026",
    trangThai: "CHO_DUYET",
    luotXem: 0,
    dongBoZaloOA: false,
    luotGuiBroadcast: 0,
  },
];

export interface GiamSatKhongGianMangItem {
  id: string;
  maTin: string;
  kenhPhatHien: "FACEBOOK" | "ZALO_GROUP" | "TIKTOK" | "YOUTUBE" | "KHAC";
  tieuDeNoiDung: string;
  duongDanLink: string;
  mucDoNguyHiem: "NGHIEM_TRONG" | "TRUNG_BINH" | "THAP";
  ngayPhatHien: string;
  bienPhapXuLy: "DANG_TIN_DINH_CHINH" | "CHUYEN_CONG_AN_XU_LY" | "VAN_DONG_GO_BAI" | "DA_XU_LY_XONG";
  ketQuaXuLy: string;
  canBoTheoDoi: string;
}

export const initialKhongGianMangList: GiamSatKhongGianMangItem[] = [
  {
    id: "KGM-01",
    maTin: "KGM/2026/01",
    kenhPhatHien: "FACEBOOK",
    tieuDeNoiDung: "Tài khoản ẩn danh đăng tin giả vỡ đê sông Sài Gòn gây ngập lụt trung tâm phường Phú Cường",
    duongDanLink: "https://facebook.com/groups/thudaumot.tintuc/posts/991823",
    mucDoNguyHiem: "NGHIEM_TRONG",
    ngayPhatHien: "12/09/2026 19:30",
    bienPhapXuLy: "DA_XU_LY_XONG",
    ketQuaXuLy: "UBND Phường phát thanh hỏa tốc trên 12 cụm loa thông minh và đăng bài đính chính trên Zalo OA trong 20 phút; Công an Thành phố triệu tập chủ tài khoản xử phạt 7.5 triệu đồng theo NĐ 15/2020.",
    canBoTheoDoi: "Tổ Tác chiến không gian mạng (Lực lượng 35) & Công an Phường",
  },
  {
    id: "KGM-02",
    maTin: "KGM/2026/02",
    kenhPhatHien: "ZALO_GROUP",
    tieuDeNoiDung: "Nhóm cư dân chia sẻ link giả mạo cổng dịch vụ công yêu cầu nhập thông tin OTP ngân hàng để nhận hỗ trợ tiền điện",
    duongDanLink: "zalo.me/g/nhom-dan-cu-kp2",
    mucDoNguyHiem: "TRUNG_BINH",
    ngayPhatHien: "18/10/2026 14:15",
    bienPhapXuLy: "DA_XU_LY_XONG",
    ketQuaXuLy: "Tổ CNS cộng đồng Khu phố 2 đăng cảnh báo lừa đảo trực tiếp vào nhóm, quản trị viên xóa link lừa đảo và chặn đối tượng tán phát tin nhắn rác.",
    canBoTheoDoi: "Vũ Đình Cường (Tổ CNS cộng đồng)",
  },
];

// ==========================================
// GÓI BỔ SUNG 5: QUỸ ĐỀN ƠN ĐÁP NGHĨA & NHÀ TÌNH NGHĨA (NĐ 45/2017)
// ==========================================
export interface QuyDenOnDapNghiaItem {
  id: string;
  loaiGiaoDich: "THU_QUY" | "CHI_HO_TRO";
  noiDung: string;
  donViCaNhan: string;
  khuPho?: string;
  soTienVND: number;
  ngayThucHien: string;
  nguoiThuNhan: string;
  chungTuSo: string;
  mucDichChi?: string;
}

export const initialQuyDenOnList: QuyDenOnDapNghiaItem[] = [
  {
    id: "QDO-00",
    loaiGiaoDich: "THU_QUY",
    noiDung: "Số dư kết dư Quỹ Đền ơn đáp nghĩa năm 2025 chuyển sang năm 2026",
    donViCaNhan: "Kho bạc Nhà nước Thủ Dầu Một",
    soTienVND: 185000000,
    ngayThucHien: "01/01/2026",
    nguoiThuNhan: "Ban Quản lý Quỹ ĐƠĐN",
    chungTuSo: "SD-QDO/2026/01",
  },
  {
    id: "QDO-01",
    loaiGiaoDich: "THU_QUY",
    noiDung: "Cán bộ công chức và người lao động UBND Phường ủng hộ 01 ngày lương Quỹ Đền ơn đáp nghĩa năm 2026",
    donViCaNhan: "Công đoàn Cơ sở UBND Phường Thủ Dầu Một",
    soTienVND: 38500000,
    ngayThucHien: "10/07/2026",
    nguoiThuNhan: "Thủ quỹ Ban Quản lý Quỹ ĐƠĐN",
    chungTuSo: "PT-QDO/2026/01",
  },
  {
    id: "QDO-02",
    loaiGiaoDich: "THU_QUY",
    noiDung: "Doanh nghiệp trên địa bàn ủng hộ Quỹ nhân dịp Kỷ niệm 79 năm ngày Thương binh - Liệt sĩ 27/7",
    donViCaNhan: "Công ty Cổ phần Thương mại & Dịch vụ Bình Dương",
    soTienVND: 50000000,
    ngayThucHien: "15/07/2026",
    nguoiThuNhan: "Ban Vận động Quỹ",
    chungTuSo: "PT-QDO/2026/04",
  },
  {
    id: "QDO-03",
    loaiGiaoDich: "CHI_HO_TRO",
    noiDung: "Hỗ trợ kinh phí xây mới Nhà Tình nghĩa cho thân nhân Liệt sĩ có hoàn cảnh khó khăn về nhà ở",
    donViCaNhan: "Hộ bà Nguyễn Thị Lành (vợ Liệt sĩ)",
    khuPho: "Khu phố 3",
    soTienVND: 80000000,
    ngayThucHien: "25/07/2026",
    nguoiThuNhan: "Bà Nguyễn Thị Lành",
    chungTuSo: "PC-QDO/2026/02",
    mucDichChi: "Xây mới Nhà Tình nghĩa theo Quyết định số 92/QĐ-UBND",
  },
  {
    id: "QDO-04",
    loaiGiaoDich: "CHI_HO_TRO",
    noiDung: "Hỗ trợ sửa chữa, chống dột Nhà Tình nghĩa cho Thương binh hạng 3/4",
    donViCaNhan: "Ông Lê Văn Tư (Thương binh 3/4)",
    khuPho: "Khu phố 1",
    soTienVND: 40000000,
    ngayThucHien: "10/08/2026",
    nguoiThuNhan: "Ông Lê Văn Tư",
    chungTuSo: "PC-QDO/2026/05",
    mucDichChi: "Nâng cấp mái tôn, nền nhà chống ngập theo biên bản khảo sát liên ngành",
  },
];

export interface NhaTinhNghiaItem {
  id: string;
  maHoSo: string;
  hoTenChuHo: string;
  dienDoiTuong: "THAN_NHAN_LIET_SI" | "THUONG_BENH_BINH" | "HO_NGHEO_KHO_KHAN";
  khuPho: string;
  diaChi: string;
  loaiHinhHoTro: "XAY_MOI" | "SUA_CHUA_CHONG_DOT";
  kinhPhiHoTroVND: number;
  kinhPhiGiaDinhVND: number;
  tongDuToanVND: number;
  tienDoThiCongPercent: number;
  ngayKhoiCong: string;
  ngayNghiemThuDuKien: string;
  trangThai: "KHAO_SAT" | "DANG_THI_CONG" | "DA_BAN_GIAO";
}

export const initialNhaTinhNghiaList: NhaTinhNghiaItem[] = [
  {
    id: "NTN-01",
    maHoSo: "NTN/2026/01",
    hoTenChuHo: "Bà Nguyễn Thị Lành",
    dienDoiTuong: "THAN_NHAN_LIET_SI",
    khuPho: "Khu phố 3",
    diaChi: "Số 89 đường Phan Đình Phùng, KP3",
    loaiHinhHoTro: "XAY_MOI",
    kinhPhiHoTroVND: 80000000,
    kinhPhiGiaDinhVND: 35000000,
    tongDuToanVND: 115000000,
    tienDoThiCongPercent: 100,
    ngayKhoiCong: "01/08/2026",
    ngayNghiemThuDuKien: "25/09/2026",
    trangThai: "DA_BAN_GIAO",
  },
  {
    id: "NTN-02",
    maHoSo: "NTN/2026/02",
    hoTenChuHo: "Ông Lê Văn Tư",
    dienDoiTuong: "THUONG_BENH_BINH",
    khuPho: "Khu phố 1",
    diaChi: "Hẻm 12 đường Đoàn Trần Nghiệp, KP1",
    loaiHinhHoTro: "SUA_CHUA_CHONG_DOT",
    kinhPhiHoTroVND: 40000000,
    kinhPhiGiaDinhVND: 15000000,
    tongDuToanVND: 55000000,
    tienDoThiCongPercent: 85,
    ngayKhoiCong: "15/09/2026",
    ngayNghiemThuDuKien: "15/11/2026",
    trangThai: "DANG_THI_CONG",
  },
];

// ============================================================================
// GÓI 6: Y TẾ CƠ SỞ, HÀNH NGHỀ Y DƯỢC TƯ NHÂN & AN TOÀN THỰC PHẨM
// Căn cứ Khoản 9 Điều 3 QĐ 2698/QĐ-UBND & Nghị định số 148/2025/NĐ-CP
// Phụ trách: Bộ phận Giáo dục và Y tế · Phòng Văn hóa - Xã hội P. Thủ Dầu Một
// ============================================================================

export interface CoSoYTeDuocTuNhan {
  id: string;
  maCoSo: string;
  tenCoSo: string;
  loaiHinh:
    | "PHONG_KHAM_DA_KHOA"
    | "PHONG_KHAM_CHUYEN_KHOA"
    | "PHONG_CHAN_TRI_YHCT"
    | "NHA_THUOC_GPP"
    | "QUAY_THUOC";
  diaChi: string;
  khuPho: string;
  soDienThoai: string;
  nguoiChiuTrachNhiemChuyenMon: string;
  chucDanh: string;
  soChungChiHanhNghe: string;
  soGiayPhepHoatDong: string;
  ngayCapPhep: string;
  coSoGPP?: boolean;
  tinhTrangHoatDong: "DANG_HOAT_DONG" | "TAM_NGUNG" | "THU_HOI_GIAY_PHEP";
  ketQuaKiemTraGanNhat: "DAT_CHUAN" | "NHAC_NHO" | "XU_PHAT_HANH_CHINH";
  ngayKiemTraGanNhat: string;
  ghiChuKiemTra: string;
}

export const initialCoSoYTeDuocList: CoSoYTeDuocTuNhan[] = [
  {
    id: "YT-01",
    maCoSo: "PK-TDM-001",
    tenCoSo: "Phòng khám Đa khoa Thủ Dầu Một Sài Gòn",
    loaiHinh: "PHONG_KHAM_DA_KHOA",
    diaChi: "Số 303 đường Đại lộ Bình Dương, Khu phố 1",
    khuPho: "Khu phố 1",
    soDienThoai: "0274.3822.456",
    nguoiChiuTrachNhiemChuyenMon: "BS.CKII. Trần Thanh Liêm",
    chucDanh: "Bác sĩ Chuyên khoa Nội tổng hợp",
    soChungChiHanhNghe: "001452/BD-CCHN",
    soGiayPhepHoatDong: "089/BD-GPHĐ",
    ngayCapPhep: "15/03/2022",
    tinhTrangHoatDong: "DANG_HOAT_DONG",
    ketQuaKiemTraGanNhat: "DAT_CHUAN",
    ngayKiemTraGanNhat: "18/10/2026",
    ghiChuKiemTra: "Trang thiết bị hiện đại, niêm yết công khai bảng giá khám chữa bệnh, liên thông đơn thuốc điện tử quốc gia",
  },
  {
    id: "YT-02",
    maCoSo: "NT-TDM-002",
    tenCoSo: "Nhà thuốc GPP Bình Dương Xanh số 12",
    loaiHinh: "NHA_THUOC_GPP",
    diaChi: "Số 88 đường Cách Mạng Tháng Tám, Khu phố 2",
    khuPho: "Khu phố 2",
    soDienThoai: "0908.765.432",
    nguoiChiuTrachNhiemChuyenMon: "Dược sĩ Đỗ Bích Thủy",
    chucDanh: "Dược sĩ Đại học",
    soChungChiHanhNghe: "003891/BD-CCHN-D",
    soGiayPhepHoatDong: "124/BD-GPP",
    ngayCapPhep: "10/06/2023",
    coSoGPP: true,
    tinhTrangHoatDong: "DANG_HOAT_DONG",
    ketQuaKiemTraGanNhat: "DAT_CHUAN",
    ngayKiemTraGanNhat: "22/10/2026",
    ghiChuKiemTra: "Nhiệt kế ẩm kế tự ghi hoạt động chuẩn, bảo quản thuốc kê đơn đúng quy định, 100% bán thuốc qua mã đơn điện tử",
  },
  {
    id: "YT-03",
    maCoSo: "PK-TDM-003",
    tenCoSo: "Phòng khám Chuyên khoa Răng Hàm Mặt Nụ Cười Xinh",
    loaiHinh: "PHONG_KHAM_CHUYEN_KHOA",
    diaChi: "Số 15 đường Đoàn Trần Nghiệp, Khu phố 3",
    khuPho: "Khu phố 3",
    soDienThoai: "0918.345.678",
    nguoiChiuTrachNhiemChuyenMon: "BS.CKI. Nguyễn Hoàng Vũ",
    chucDanh: "Bác sĩ Răng Hàm Mặt",
    soChungChiHanhNghe: "002774/BD-CCHN",
    soGiayPhepHoatDong: "055/BD-GPHĐ",
    ngayCapPhep: "20/11/2021",
    tinhTrangHoatDong: "DANG_HOAT_DONG",
    ketQuaKiemTraGanNhat: "NHAC_NHO",
    ngayKiemTraGanNhat: "05/10/2026",
    ghiChuKiemTra: "Nhắc nhở cập nhật nhật ký tiệt trùng dụng cụ nha khoa theo ca và hợp đồng xử lý rác thải y tế nguy hại",
  },
  {
    id: "YT-04",
    maCoSo: "YHCT-TDM-004",
    tenCoSo: "Phòng Chẩn trị Y học Cổ truyền Vạn Thọ Đường",
    loaiHinh: "PHONG_CHAN_TRI_YHCT",
    diaChi: "Số 42 đường Bạch Đằng, Khu phố 4",
    khuPho: "Khu phố 4",
    soDienThoai: "0982.112.233",
    nguoiChiuTrachNhiemChuyenMon: "Lương y Võ Minh Đức",
    chucDanh: "Lương y Đa khoa Cổ truyền",
    soChungChiHanhNghe: "000512/BD-CCHN-YHCT",
    soGiayPhepHoatDong: "031/BD-GPHĐ-YHCT",
    ngayCapPhep: "05/04/2019",
    tinhTrangHoatDong: "DANG_HOAT_DONG",
    ketQuaKiemTraGanNhat: "DAT_CHUAN",
    ngayKiemTraGanNhat: "12/09/2026",
    ghiChuKiemTra: "Thuốc thang dược liệu có nguồn gốc hóa đơn chứng từ rõ ràng, phòng châm cứu sạch sẽ vô khuẩn",
  },
  {
    id: "YT-05",
    maCoSo: "QT-TDM-005",
    tenCoSo: "Quầy thuốc Tư nhân Ánh Dương",
    loaiHinh: "QUAY_THUOC",
    diaChi: "Số 114 đường Yersin, Khu phố 5",
    khuPho: "Khu phố 5",
    soDienThoai: "0977.889.900",
    nguoiChiuTrachNhiemChuyenMon: "Dược sĩ CĐ. Lê Thị Thảo",
    chucDanh: "Dược sĩ Cao đẳng",
    soChungChiHanhNghe: "005610/BD-CCHN-D",
    soGiayPhepHoatDong: "210/BD-GPP",
    ngayCapPhep: "14/02/2024",
    coSoGPP: true,
    tinhTrangHoatDong: "DANG_HOAT_DONG",
    ketQuaKiemTraGanNhat: "DAT_CHUAN",
    ngayKiemTraGanNhat: "28/10/2026",
    ghiChuKiemTra: "Bán thuốc theo đơn chuẩn, niêm yết giá bán lẻ đầy đủ, kiểm soát hạn sử dụng tốt",
  },
  {
    id: "YT-06",
    maCoSo: "NT-TDM-006",
    tenCoSo: "Nhà thuốc GPP An Khang số 85",
    loaiHinh: "NHA_THUOC_GPP",
    diaChi: "Số 250 đường Cách Mạng Tháng Tám, Khu phố 8",
    khuPho: "Khu phố 8",
    soDienThoai: "0938.123.456",
    nguoiChiuTrachNhiemChuyenMon: "Dược sĩ Huỳnh Quốc Bảo",
    chucDanh: "Dược sĩ Đại học",
    soChungChiHanhNghe: "004120/BD-CCHN-D",
    soGiayPhepHoatDong: "185/BD-GPP",
    ngayCapPhep: "19/08/2023",
    coSoGPP: true,
    tinhTrangHoatDong: "DANG_HOAT_DONG",
    ketQuaKiemTraGanNhat: "DAT_CHUAN",
    ngayKiemTraGanNhat: "01/11/2026",
    ghiChuKiemTra: "Khu vực tư vấn riêng biệt, phần mềm bán lẻ kết nối cơ sở dữ liệu Dược quốc gia đạt 100%",
  },
];

export interface CoSoAttpVaThucAnDuongPho {
  id: string;
  maCoSo: string;
  tenCoSo: string;
  loaiHinh:
    | "NHA_HANG_DICH_VU_AN_UONG"
    | "QUAN_AN_TRUYEN_THONG"
    | "THUC_AN_DUONG_PHO"
    | "BEP_AN_TAP_THE";
  chuCoSo: string;
  diaChi: string;
  khuPho: string;
  soDienThoai: string;
  soGiayChungNhanAttp: string;
  ngayCapAttp: string;
  hanSuDungAttp: string;
  soNguoiTapHuanAttp: number;
  tinhTrangKhamSucKhoe: boolean;
  ketQuaKiemTra: "DAT_CHUAN" | "NHAC_NHO" | "XU_PHAT";
  ngayKiemTraGanNhat: string;
  tienPhatVND?: number;
  noiDungXuLy?: string;
}

export const initialCoSoAttpList: CoSoAttpVaThucAnDuongPho[] = [
  {
    id: "ATTP-01",
    maCoSo: "ATTP-NH-01",
    tenCoSo: "Nhà hàng Bờ Sông Bạch Đằng Thủ Dầu Một",
    loaiHinh: "NHA_HANG_DICH_VU_AN_UONG",
    chuCoSo: "Bà Nguyễn Thị Kim Loan",
    diaChi: "Số 10 đường Bạch Đằng, Khu phố 1",
    khuPho: "Khu phố 1",
    soDienThoai: "0903.654.321",
    soGiayChungNhanAttp: "35/2024/ATTP-TDM",
    ngayCapAttp: "10/04/2024",
    hanSuDungAttp: "10/04/2027",
    soNguoiTapHuanAttp: 18,
    tinhTrangKhamSucKhoe: true,
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "20/10/2026",
    noiDungXuLy: "Khu sơ chế và chế biến 1 chiều thông thoáng, nguồn gốc hải sản tươi sống truy xuất nguồn gốc rõ ràng",
  },
  {
    id: "ATTP-02",
    maCoSo: "ATTP-QA-02",
    tenCoSo: "Quán Bánh Bèo Bì Mỹ Liên (Đặc sản Bình Dương)",
    loaiHinh: "QUAN_AN_TRUYEN_THONG",
    chuCoSo: "Ông Nguyễn Văn Thành",
    diaChi: "Số 01 đường Thích Quảng Đức, Khu phố 2",
    khuPho: "Khu phố 2",
    soDienThoai: "0919.223.344",
    soGiayChungNhanAttp: "18/2023/ATTP-TDM",
    ngayCapAttp: "15/08/2023",
    hanSuDungAttp: "15/08/2026",
    soNguoiTapHuanAttp: 8,
    tinhTrangKhamSucKhoe: true,
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "25/10/2026",
    noiDungXuLy: "Thực phẩm truyền thống chế biến hợp vệ sinh, test nhanh hàn the trong chả lụa và bì đạt kết quả âm tính",
  },
  {
    id: "ATTP-03",
    maCoSo: "ATTP-DP-03",
    tenCoSo: "Cụm Quầy Thức ăn Đường phố Chợ Thủ Dầu Một (12 hộ)",
    loaiHinh: "THUC_AN_DUONG_PHO",
    chuCoSo: "Đại diện Tổ tự quản Chợ Thủ Dầu Một",
    diaChi: "Đường Trần Hưng Đạo & Chợ Thủ Dầu Một, Khu phố 3",
    khuPho: "Khu phố 3",
    soDienThoai: "0932.778.899",
    soGiayChungNhanAttp: "CAM_KET_ATTP-2026/03",
    ngayCapAttp: "01/01/2026",
    hanSuDungAttp: "31/12/2026",
    soNguoiTapHuanAttp: 24,
    tinhTrangKhamSucKhoe: true,
    ketQuaKiemTra: "NHAC_NHO",
    ngayKiemTraGanNhat: "29/10/2026",
    noiDungXuLy: "Nhắc nhở 2 hộ bán bún bò trang bị thêm tủ kính đậy kín thức ăn chín và găng tay sử dụng một lần",
  },
  {
    id: "ATTP-04",
    maCoSo: "ATTP-QA-04",
    tenCoSo: "Quán Lẩu bò Cầu Ngang",
    loaiHinh: "QUAN_AN_TRUYEN_THONG",
    chuCoSo: "Ông Lê Văn Sang",
    diaChi: "Số 85 đường Cách Mạng Tháng Tám, Khu phố 4",
    khuPho: "Khu phố 4",
    soDienThoai: "0944.556.677",
    soGiayChungNhanAttp: "42/2024/ATTP-TDM",
    ngayCapAttp: "12/05/2024",
    hanSuDungAttp: "12/05/2027",
    soNguoiTapHuanAttp: 6,
    tinhTrangKhamSucKhoe: true,
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "15/10/2026",
    noiDungXuLy: "Đạt chuẩn vệ sinh, dầu ăn chiên rán không bị khét, nguồn thịt có dấu kiểm dịch của Chi cục Chăn nuôi Thú y",
  },
  {
    id: "ATTP-05",
    maCoSo: "ATTP-DP-05",
    tenCoSo: "Điểm Thức ăn nhanh - Trà sữa Phố đi bộ Bạch Đằng",
    loaiHinh: "THUC_AN_DUONG_PHO",
    chuCoSo: "Bà Phan Thị Hồng Nhung",
    diaChi: "Khu vực Bến thuyền Phố đi bộ, Khu phố 1",
    khuPho: "Khu phố 1",
    soDienThoai: "0976.443.322",
    soGiayChungNhanAttp: "CAM_KET_ATTP-2026/18",
    ngayCapAttp: "10/02/2026",
    hanSuDungAttp: "31/12/2026",
    soNguoiTapHuanAttp: 4,
    tinhTrangKhamSucKhoe: true,
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "30/10/2026",
    noiDungXuLy: "Nguyên liệu pha chế syrup, trân châu có tem nhãn phụ tiếng Việt đầy đủ, thùng rác có nắp đậy hợp vệ sinh",
  },
  {
    id: "ATTP-06",
    maCoSo: "ATTP-BT-06",
    tenCoSo: "Bếp ăn Cung cấp Suất ăn Sẵn Hương Quê",
    loaiHinh: "BEP_AN_TAP_THE",
    chuCoSo: "Công ty Cổ phần Thực phẩm Hương Quê",
    diaChi: "Số 168 đường Huỳnh Văn Cù, Khu phố 10",
    khuPho: "Khu phố 10",
    soDienThoai: "0274.3855.999",
    soGiayChungNhanAttp: "09/2025/ATTP-TDM",
    ngayCapAttp: "08/03/2025",
    hanSuDungAttp: "08/03/2028",
    soNguoiTapHuanAttp: 32,
    tinhTrangKhamSucKhoe: true,
    ketQuaKiemTra: "DAT_CHUAN",
    ngayKiemTraGanNhat: "02/11/2026",
    noiDungXuLy: "Cung cấp suất ăn văn phòng và trường học, quy trình bếp một chiều đạt chuẩn HACCP, lưu mẫu 24h đầy đủ",
  },
];

export interface SoSucKhoeDienTuKhuPho {
  khuPho: string;
  tongDanSo: number;
  daLapSoSucKhoeVNeID: number;
  tyLePercent: number;
  soCoSoKhamChuaBenhLienThong: number;
  tiLeTiemChungMoRong: number;
}

export const initialSoSucKhoeKhuPhoList: SoSucKhoeDienTuKhuPho[] = [
  { khuPho: "Khu phố 1", tongDanSo: 4200, daLapSoSucKhoeVNeID: 3950, tyLePercent: 94.0, soCoSoKhamChuaBenhLienThong: 8, tiLeTiemChungMoRong: 98.5 },
  { khuPho: "Khu phố 2", tongDanSo: 3800, daLapSoSucKhoeVNeID: 3500, tyLePercent: 92.1, soCoSoKhamChuaBenhLienThong: 6, tiLeTiemChungMoRong: 97.8 },
  { khuPho: "Khu phố 3", tongDanSo: 4500, daLapSoSucKhoeVNeID: 4120, tyLePercent: 91.5, soCoSoKhamChuaBenhLienThong: 7, tiLeTiemChungMoRong: 98.0 },
  { khuPho: "Khu phố 4", tongDanSo: 3100, daLapSoSucKhoeVNeID: 2950, tyLePercent: 95.1, soCoSoKhamChuaBenhLienThong: 5, tiLeTiemChungMoRong: 99.2 },
  { khuPho: "Khu phố 5", tongDanSo: 3600, daLapSoSucKhoeVNeID: 3200, tyLePercent: 88.8, soCoSoKhamChuaBenhLienThong: 4, tiLeTiemChungMoRong: 96.5 },
  { khuPho: "Khu phố 6", tongDanSo: 4100, daLapSoSucKhoeVNeID: 3810, tyLePercent: 92.9, soCoSoKhamChuaBenhLienThong: 5, tiLeTiemChungMoRong: 98.1 },
  { khuPho: "Khu phố 7", tongDanSo: 3950, daLapSoSucKhoeVNeID: 3630, tyLePercent: 91.8, soCoSoKhamChuaBenhLienThong: 5, tiLeTiemChungMoRong: 97.4 },
  { khuPho: "Khu phố 8", tongDanSo: 4600, daLapSoSucKhoeVNeID: 4420, tyLePercent: 96.0, soCoSoKhamChuaBenhLienThong: 9, tiLeTiemChungMoRong: 99.0 },
  { khuPho: "Khu phố 9", tongDanSo: 3300, daLapSoSucKhoeVNeID: 2980, tyLePercent: 90.3, soCoSoKhamChuaBenhLienThong: 4, tiLeTiemChungMoRong: 96.8 },
  { khuPho: "Khu phố 10", tongDanSo: 4050, daLapSoSucKhoeVNeID: 3850, tyLePercent: 95.0, soCoSoKhamChuaBenhLienThong: 7, tiLeTiemChungMoRong: 98.7 },
  { khuPho: "Khu phố 11", tongDanSo: 3750, daLapSoSucKhoeVNeID: 3450, tyLePercent: 92.0, soCoSoKhamChuaBenhLienThong: 5, tiLeTiemChungMoRong: 97.5 },
  { khuPho: "Khu phố 12", tongDanSo: 4150, daLapSoSucKhoeVNeID: 3900, tyLePercent: 93.9, soCoSoKhamChuaBenhLienThong: 6, tiLeTiemChungMoRong: 98.2 },
  { khuPho: "Khu phố 13", tongDanSo: 3500, daLapSoSucKhoeVNeID: 3120, tyLePercent: 89.1, soCoSoKhamChuaBenhLienThong: 4, tiLeTiemChungMoRong: 96.0 },
  { khuPho: "Khu phố 14", tongDanSo: 4400, daLapSoSucKhoeVNeID: 4210, tyLePercent: 95.6, soCoSoKhamChuaBenhLienThong: 8, tiLeTiemChungMoRong: 98.9 },
];


