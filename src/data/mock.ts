export type TrangThai =
  | "MỚI_TIẾP_NHẬN"
  | "ĐANG_THẨM_ĐỊNH"
  | "CHỜ_PHÊ_DUYỆT"
  | "ĐÃ_DUYỆT"
  | "YÊU_CẦU_BỔ_SUNG"
  | "TỪ_CHỐI";

export type LoaiDoiTuong =
  | "Thương binh"
  | "Bệnh binh"
  | "Thân nhân liệt sĩ"
  | "Mẹ VNAH"
  | "Nhiễm chất độc hóa học"
  | "Cán bộ tiền khởi nghĩa";

export interface HoSo {
  id: string;
  hoTen: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: "Nam" | "Nữ";
  phuong: string;
  khuPho: string;
  loaiDoiTuong: LoaiDoiTuong;
  tyLeTonThuong: number;
  trangThai: TrangThai;
  ngayTiepNhan: string;
  hanXuLy: string;
  quaHanNgay: number;
  canBoTiepNhan: string;
  mucTroCap: number;
  phuCapPhucVu: number;
  troCapDieuDuong: number;
  taiLieu: string[];
  ghiChuThamDinh?: string;
}

export const MUC_CHUAN = 2_055_000;

export const PHUONG_LIST = [
  "Phú Cường",
  "Phú Hòa",
  "Hiệp Thành",
  "Định Hòa",
  "Phú Lợi",
  "Chánh Nghĩa",
  "Phú Thọ",
  "Phú Mỹ",
  "Hiệp An",
  "Tương Bình Hiệp",
  "Chánh Mỹ",
  "Tân An",
  "Thới Hòa",
  "Hòa Phú",
];

export const wardDensity = [
  { phuong: "Phú Cường", hoSo: 1872, chiTra: 3.9 },
  { phuong: "Phú Hòa", hoSo: 1584, chiTra: 3.3 },
  { phuong: "Hiệp Thành", hoSo: 1231, chiTra: 2.6 },
  { phuong: "Định Hòa", hoSo: 986, chiTra: 2.1 },
  { phuong: "Phú Lợi", hoSo: 902, chiTra: 1.9 },
  { phuong: "Chánh Nghĩa", hoSo: 848, chiTra: 1.8 },
  { phuong: "Phú Thọ", hoSo: 812, chiTra: 1.7 },
  { phuong: "Phú Mỹ", hoSo: 776, chiTra: 1.6 },
  { phuong: "Hiệp An", hoSo: 748, chiTra: 1.5 },
  { phuong: "Tương Bình Hiệp", hoSo: 742, chiTra: 1.5 },
  { phuong: "Chánh Mỹ", hoSo: 719, chiTra: 1.4 },
  { phuong: "Tân An", hoSo: 739, chiTra: 1.4 },
  { phuong: "Thới Hòa", hoSo: 521, chiTra: 1.1 },
  { phuong: "Hòa Phú", hoSo: 480, chiTra: 1.0 },
];

export const giaiNganTheoThang = [
  { thang: "T1", thuongXuyen: 18.2, motLan: 1.4, dieuDuong: 0.8, bhyt: 1.1 },
  { thang: "T2", thuongXuyen: 18.4, motLan: 2.1, dieuDuong: 0.6, bhyt: 1.1 },
  { thang: "T3", thuongXuyen: 18.6, motLan: 1.2, dieuDuong: 1.4, bhyt: 1.2 },
  { thang: "T4", thuongXuyen: 19.1, motLan: 3.4, dieuDuong: 1.9, bhyt: 1.2 },
  { thang: "T5", thuongXuyen: 19.3, motLan: 1.8, dieuDuong: 1.1, bhyt: 1.2 },
  { thang: "T6", thuongXuyen: 19.6, motLan: 2.4, dieuDuong: 1.6, bhyt: 1.3 },
  { thang: "T7", thuongXuyen: 20.1, motLan: 3.9, dieuDuong: 2.4, bhyt: 1.3 },
  { thang: "T8", thuongXuyen: 20.4, motLan: 1.1, dieuDuong: 0.7, bhyt: 1.3 },
];

export const coCauDoiTuong = [
  { ten: "Thương binh", value: 42, mau: "var(--color-primary)" },
  { ten: "Thân nhân liệt sĩ", value: 30, mau: "var(--color-gold)" },
  { ten: "Bệnh binh", value: 15, mau: "var(--color-azure)" },
  { ten: "CĐHH & khác", value: 13, mau: "var(--color-ink-4)" },
];

export const phezuyetFunnel = [
  { buoc: "Tiếp nhận", soLuong: 1224 },
  { buoc: "Thẩm định", soLuong: 1108 },
  { buoc: "Lãnh đạo phê duyệt", soLuong: 1042 },
  { buoc: "Đã trả kết quả", soLuong: 986 },
];

export const tieuChiRadar = [
  { tieuChi: "Thái độ cán bộ", diem: 4.9 },
  { tieuChi: "Thời gian xử lý", diem: 4.6 },
  { tieuChi: "Minh bạch giấy tờ", diem: 4.8 },
  { tieuChi: "Hạ tầng tiếp đón", diem: 4.3 },
  { tieuChi: "Dễ dàng liên hệ", diem: 4.5 },
];

export const csatTheoThang = [
  { thang: "T3", csat: 92.1 },
  { thang: "T4", csat: 93.4 },
  { thang: "T5", csat: 94.2 },
  { thang: "T6", csat: 95.8 },
  { thang: "T7", csat: 96.4 },
  { thang: "T8", csat: 97.1 },
];

export const keywordCloud = [
  { tu: "tận tình", trong: 184, cuc: "POSITIVE" as const },
  { tu: "nhanh chóng", trong: 152, cuc: "POSITIVE" as const },
  { tu: "chu đáo", trong: 121, cuc: "POSITIVE" as const },
  { tu: "rõ ràng", trong: 98, cuc: "POSITIVE" as const },
  { tu: "đúng hẹn", trong: 87, cuc: "POSITIVE" as const },
  { tu: "lịch sự", trong: 74, cuc: "POSITIVE" as const },
  { tu: "chờ lâu", trong: 41, cuc: "NEGATIVE" as const },
  { tu: "thiếu chỉ dẫn", trong: 28, cuc: "NEGATIVE" as const },
  { tu: "phiền hà", trong: 19, cuc: "NEGATIVE" as const },
  { tu: "chậm trễ", trong: 16, cuc: "NEGATIVE" as const },
  { tu: "hách dịch", trong: 6, cuc: "NEGATIVE" as const },
  { tu: "bình thường", trong: 62, cuc: "NEUTRAL" as const },
];

export interface PhanHoi {
  id: string;
  hoSoId: string;
  nguoiDanhGia: string;
  phuong: string;
  canBo: string;
  kenh: "KIOSK" | "QR_PHIEU_HEN" | "SMS_ZALO";
  diemCsat: number;
  yKien: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  ngay: string;
  daXuLy: boolean;
}

export const phanHoiList: PhanHoi[] = [
  {
    id: "KS-2026-0412",
    hoSoId: "TDM-NCC-2026-00412",
    nguoiDanhGia: "Trần Thị Bảy",
    phuong: "Phú Cường",
    canBo: "Nguyễn Văn An",
    kenh: "QR_PHIEU_HEN",
    diemCsat: 5,
    yKien: "Cán bộ hướng dẫn rất tận tình, giải thích rõ ràng từng loại giấy tờ.",
    sentiment: "POSITIVE",
    ngay: "04/09/2026",
    daXuLy: true,
  },
  {
    id: "KS-2026-0409",
    hoSoId: "TDM-NCC-2026-00396",
    nguoiDanhGia: "Lê Văn Hùng",
    phuong: "Tân An",
    canBo: "Phạm Thị Lệ",
    kenh: "KIOSK",
    diemCsat: 2,
    yKien: "Phải chờ lâu hơn 1 giờ, lại bị yêu cầu bổ sung giấy tờ ngoài quy định.",
    sentiment: "NEGATIVE",
    ngay: "03/09/2026",
    daXuLy: false,
  },
  {
    id: "KS-2026-0405",
    hoSoId: "TDM-NCC-2026-00381",
    nguoiDanhGia: "Nguyễn Thị Kim",
    phuong: "Định Hòa",
    canBo: "Trần Quốc Bảo",
    kenh: "SMS_ZALO",
    diemCsat: 1,
    yKien: "Thái độ tiếp dân hách dịch, không giải thích khi trả lại hồ sơ.",
    sentiment: "NEGATIVE",
    ngay: "02/09/2026",
    daXuLy: false,
  },
  {
    id: "KS-2026-0398",
    hoSoId: "TDM-NCC-2026-00370",
    nguoiDanhGia: "Võ Văn Tám",
    phuong: "Hiệp Thành",
    canBo: "Nguyễn Văn An",
    kenh: "KIOSK",
    diemCsat: 4,
    yKien: "Nhìn chung đúng hẹn, chỗ ngồi chờ còn thiếu chỉ dẫn.",
    sentiment: "NEUTRAL",
    ngay: "01/09/2026",
    daXuLy: true,
  },
  {
    id: "KS-2026-0391",
    hoSoId: "TDM-NCC-2026-00355",
    nguoiDanhGia: "Đặng Thị Hoa",
    phuong: "Phú Hòa",
    canBo: "Lý Thu Vân",
    kenh: "QR_PHIEU_HEN",
    diemCsat: 2,
    yKien: "Thủ tục phiền hà, đi lại ba lần mới xong.",
    sentiment: "NEGATIVE",
    ngay: "31/08/2026",
    daXuLy: false,
  },
];

export const xepHangPhuong = [
  { phuong: "Phú Cường", csat: 98.2, luot: 642 },
  { phuong: "Hiệp Thành", csat: 97.4, luot: 418 },
  { phuong: "Phú Hòa", csat: 96.1, luot: 512 },
  { phuong: "Chánh Nghĩa", csat: 95.3, luot: 288 },
  { phuong: "Định Hòa", csat: 91.7, luot: 331 },
  { phuong: "Tân An", csat: 88.4, luot: 254 },
];

export const hoSoList: HoSo[] = [
  {
    id: "TDM-NCC-2026-00412",
    hoTen: "TRẦN VĂN SÁU",
    cccd: "074056001234",
    ngaySinh: "12/04/1949",
    gioiTinh: "Nam",
    phuong: "Phú Cường",
    khuPho: "Khu phố 3",
    loaiDoiTuong: "Thương binh",
    tyLeTonThuong: 61,
    trangThai: "CHỜ_PHÊ_DUYỆT",
    ngayTiepNhan: "20/08/2026",
    hanXuLy: "10/09/2026",
    quaHanNgay: 0,
    canBoTiepNhan: "Nguyễn Văn An",
    mucTroCap: 3_082_500,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Biên bản giám định 61%", "Giấy ra viện", "Quyết định phục viên"],
  },
  {
    id: "TDM-NCC-2026-00396",
    hoTen: "LÊ THỊ TÁM",
    cccd: "074156004521",
    ngaySinh: "03/11/1938",
    gioiTinh: "Nữ",
    phuong: "Tân An",
    khuPho: "Ấp 2",
    loaiDoiTuong: "Mẹ VNAH",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "02/08/2026",
    hanXuLy: "25/08/2026",
    quaHanNgay: 0,
    canBoTiepNhan: "Phạm Thị Lệ",
    mucTroCap: 4_110_000,
    phuCapPhucVu: 2_055_000,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Mẹ VNAH", "Giấy chứng nhận thân nhân liệt sĩ"],
  },
  {
    id: "HS-2026-0089",
    hoTen: "NGUYỄN VĂN CHÍN",
    cccd: "074056007788",
    ngaySinh: "28/02/1953",
    gioiTinh: "Nam",
    phuong: "Phú Cường",
    khuPho: "Khu phố 1",
    loaiDoiTuong: "Bệnh binh",
    tyLeTonThuong: 45,
    trangThai: "ĐANG_THẨM_ĐỊNH",
    ngayTiepNhan: "10/08/2026",
    hanXuLy: "02/09/2026",
    quaHanNgay: 2,
    canBoTiepNhan: "Trần Quốc Bảo",
    mucTroCap: 2_260_500,
    phuCapPhucVu: 0,
    troCapDieuDuong: 0,
    taiLieu: ["Biên bản giám định 45%", "Giấy ra viện"],
  },
  {
    id: "HS-2026-0112",
    hoTen: "PHẠM THỊ MƯỜI",
    cccd: "074156009900",
    ngaySinh: "17/07/1961",
    gioiTinh: "Nữ",
    phuong: "Định Hòa",
    khuPho: "Khu phố 5",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    tyLeTonThuong: 0,
    trangThai: "CHỜ_PHÊ_DUYỆT",
    ngayTiepNhan: "12/08/2026",
    hanXuLy: "03/09/2026",
    quaHanNgay: 1,
    canBoTiepNhan: "Lý Thu Vân",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Giấy chứng nhận thân nhân liệt sĩ"],
  },
  {
    id: "HS-2026-0147",
    hoTen: "VÕ VĂN BỐN",
    cccd: "074056003311",
    ngaySinh: "09/09/1957",
    gioiTinh: "Nam",
    phuong: "Hiệp Thành",
    khuPho: "Khu phố 2",
    loaiDoiTuong: "Nhiễm chất độc hóa học",
    tyLeTonThuong: 81,
    trangThai: "YÊU_CẦU_BỔ_SUNG",
    ngayTiepNhan: "05/08/2026",
    hanXuLy: "28/08/2026",
    quaHanNgay: 4,
    canBoTiepNhan: "Nguyễn Văn An",
    mucTroCap: 4_069_000,
    phuCapPhucVu: 2_055_000,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Biên bản giám định 81%"],
    ghiChuThamDinh: "Thiếu bản sao công chứng quyết định phục viên, đề nghị bổ sung trong 10 ngày.",
  },
  {
    id: "HS-2026-0151",
    hoTen: "HUỲNH VĂN HAI",
    cccd: "074056005566",
    ngaySinh: "22/01/1966",
    gioiTinh: "Nam",
    phuong: "Phú Hòa",
    khuPho: "Khu phố 4",
    loaiDoiTuong: "Thương binh",
    tyLeTonThuong: 25,
    trangThai: "MỚI_TIẾP_NHẬN",
    ngayTiepNhan: "01/09/2026",
    hanXuLy: "22/09/2026",
    quaHanNgay: 0,
    canBoTiepNhan: "Phạm Thị Lệ",
    mucTroCap: 1_233_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 0,
    taiLieu: ["Biên bản giám định 25%", "Huân chương Chiến sĩ vẻ vang"],
  },
  {
    id: "HS-2026-0158",
    hoTen: "TRƯƠNG THỊ BA",
    cccd: "074156002244",
    ngaySinh: "14/06/1944",
    gioiTinh: "Nữ",
    phuong: "Chánh Nghĩa",
    khuPho: "Khu phố 1",
    loaiDoiTuong: "Cán bộ tiền khởi nghĩa",
    tyLeTonThuong: 0,
    trangThai: "TỪ_CHỐI",
    ngayTiepNhan: "18/07/2026",
    hanXuLy: "08/08/2026",
    quaHanNgay: 0,
    canBoTiepNhan: "Trần Quốc Bảo",
    mucTroCap: 0,
    phuCapPhucVu: 0,
    troCapDieuDuong: 0,
    taiLieu: ["Đơn đề nghị"],
    ghiChuThamDinh: "Không đủ căn cứ pháp lý xác nhận thời gian hoạt động trước 01/01/1945.",
  },
];

export const doiSoatCanhBao = [
  {
    ma: "DS-001",
    loai: "Trùng CCCD",
    noiDung: "CCCD 074056007788 xuất hiện tại 2 hồ sơ (HS-2026-0089, HS-2025-0771)",
    mucDo: "CAO" as const,
  },
  {
    ma: "DS-002",
    loai: "Chi trả sau báo tử",
    noiDung: "Hồ sơ TDM-NCC-2025-00218 đã ghi nhận báo tử 06/2026 nhưng còn phát sinh chi trả T7",
    mucDo: "CAO" as const,
  },
  {
    ma: "DS-003",
    loai: "Trùng hưởng chế độ",
    noiDung: "Đối tượng Nguyễn Thị Kim hưởng đồng thời 2 nhóm trợ cấp thường xuyên",
    mucDo: "TRUNG BÌNH" as const,
  },
];

export const dsChiTra = [
  {
    ky: "Tháng 8/2026",
    phuong: "Phú Cường",
    soDoiTuong: 1872,
    qua: "Ngân hàng",
    soTien: 3_912_400_000,
    trangThai: "ĐÃ CHI",
  },
  {
    ky: "Tháng 8/2026",
    phuong: "Phú Hòa",
    soDoiTuong: 1584,
    qua: "Ngân hàng",
    soTien: 3_301_800_000,
    trangThai: "ĐÃ CHI",
  },
  {
    ky: "Tháng 8/2026",
    phuong: "Hiệp Thành",
    soDoiTuong: 1231,
    qua: "Bưu điện",
    soTien: 2_604_200_000,
    trangThai: "ĐANG CHI",
  },
  {
    ky: "Tháng 8/2026",
    phuong: "Định Hòa",
    soDoiTuong: 986,
    qua: "Bưu điện",
    soTien: 2_081_500_000,
    trangThai: "CHỜ DUYỆT",
  },
  {
    ky: "Tháng 8/2026",
    phuong: "Tân An",
    soDoiTuong: 739,
    qua: "Ngân hàng",
    soTien: 1_438_900_000,
    trangThai: "CHỜ DUYỆT",
  },
];

export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + " ₫";

export const formatNum = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
