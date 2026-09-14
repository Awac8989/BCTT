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
  soHoSoTinh?: string | undefined; // Mã số tỉnh quản lý (VD: BD/16720-1)
  hoTen: string;
  cccd: string;
  ngaySinh: string;
  namSinh?: string | number | undefined;
  gioiTinh: "Nam" | "Nữ";
  huyen?: string | undefined;
  phuong: string;
  khuPho: string;
  diaChiTiepNhan?: string | undefined; // Phường - Huyện
  loaiDoiTuong: LoaiDoiTuong;
  banSaoBanGoc?: "Bản gốc" | "Bản sao" | undefined;
  soBhyt?: string | undefined;
  danToc?: string | undefined;
  tyLeTonThuong: number;
  trangThai: TrangThai;
  ngayTiepNhan: string;
  hanXuLy: string;
  quaHanNgay: number;
  canBoTiepNhan: string;
  canBoQuanLy?: string | undefined;
  mucTroCap: number;
  phuCapPhucVu: number;
  troCapDieuDuong: number;
  taiLieu: string[];
  ghiChuThamDinh?: string | undefined;

  // === CÁC TRƯỜNG ĐẶC TẢ CHI TIẾT HỒ SƠ LIỆT SĨ (Theo Cổng SLĐTBXH Bình Dương) ===
  soHoSoBo?: string | undefined; // VD: BD/LS-07956
  hoSoChuyenDenTu?: string | undefined;
  ngayChuyenDen?: { ngay?: string; thang?: string; nam?: string } | undefined;
  hoSoChuyenDi?: string | undefined;
  ngayChuyenDi?: { ngay?: string; thang?: string; nam?: string } | undefined;

  biDanh?: string | undefined;
  sinhNgayChiTiet?: { ngay?: string; thang?: string; nam?: string } | undefined;
  queQuan?: string | undefined;
  truQuan?: string | undefined;
  ngayNhapNguChiTiet?: { ngay?: string; thang?: string; nam?: string } | undefined;
  capBac?: string | undefined;
  chucVu?: string | undefined;
  coQuanDonViKhiHySinh?: string | undefined;
  hySinhNgayChiTiet?: { ngay?: string; thang?: string; nam?: string } | undefined;
  thoiKy?: string | undefined;
  truongHopHySinh?: string | undefined;
  noiHySinh?: string | undefined;
  noiMaiTang?: string | undefined;
  giayBaoTu?: string | undefined;
  baoTuNgayChiTiet?: { ngay?: string; thang?: string; nam?: string } | undefined;
  donViCapGiayBaoTu?: string | undefined;
  soBangToQuocGhiCong?: string | undefined;
  qdCapBangSo?: string | undefined;
  qdCapBangNgayChiTiet?: { ngay?: string; thang?: string; nam?: string } | undefined;
  thuocDoiTuong?: string | undefined; // Dân Chính, Quân đội, Công an...
  viTriLuuHoSo?: string | undefined;
  isAnhHung?: boolean | undefined;

  thanNhanLietSi?: {
    hoTen: string;
    quanHe: string;
    namSinh?: string | number | undefined;
    diaChi: string;
    cheDoHuong: string;
    soTien: number;
  }[] | undefined;

  // Trạng thái báo giảm & mai táng phí khi từ trần
  isTuTran?: boolean | undefined;
  ngayTuTran?: string | undefined;
  soTrichLucKhaiTu?: string | undefined;
  nguoiNhanMaiTangPhi?: string | undefined;
  soTienMaiTangPhi?: number | undefined;
  ngayQuyetDinhMaiTang?: string | undefined;

  // Ký số điện tử lãnh đạo
  kySoLanhDao?: {
    nguoiKy: string;
    chucVu: string;
    ngayKy: string;
    maXacThuc: string;
  } | undefined;
}

export const MUC_CHUAN = 2_055_000;

export const HUYEN_LIST = [
  "TP. Thủ Dầu Một",
  "TP. Dĩ An",
  "TP. Thuận An",
  "Bến Cát",
  "Tân Uyên",
  "Bắc Tân Uyên",
  "Phú Giáo",
  "Bàu Bàng",
  "Dầu Tiếng",
];

export const HUYEN_PHUONG_MAP: Record<string, string[]> = {
  "TP. Thủ Dầu Một": [
    "Phú Cường", "Phú Hòa", "Hiệp Thành", "Định Hòa", "Phú Lợi", "Chánh Nghĩa",
    "Phú Thọ", "Phú Mỹ", "Hiệp An", "Tương Bình Hiệp", "Chánh Mỹ", "Tân An",
    "Thới Hòa", "Hòa Phú"
  ],
  "TP. Dĩ An": ["Dĩ An", "An Bình", "Bình An", "Bình Thắng", "Đông Hòa", "Tân Bình", "Tân Đông Hiệp"],
  "TP. Thuận An": ["Lái Thiêu", "An Phú", "Bình Hòa", "Bình Chuẩn", "Bình Nhâm", "Hưng Định", "An Thạnh", "Thuận Giao", "Vĩnh Phú", "An Sơn"],
  "Bến Cát": ["Mỹ Phước", "Thới Hòa", "Tân Định", "Hòa Lợi", "Chánh Phú Hòa", "An Điền", "An Tây", "Phú An"],
  "Tân Uyên": ["Uyên Hưng", "Tân Phước Khánh", "Thái Hòa", "Thạnh Phước", "Tân Hiệp", "Khánh Bình", "Vĩnh Tân", "Bạch Đằng"],
  "Bắc Tân Uyên": ["Bình Mỹ", "Tân Thành", "Tân Bình", "Tân Định", "Đất Cuốc", "Thường Tân", "Lạc An"],
  "Phú Giáo": ["Phước Vĩnh", "Tam Lập", "Vĩnh Hòa", "Tân Hiệp", "An Bình", "An Linh", "An Thái", "Phước Sang"],
  "Bàu Bàng": ["Lai Uyên", "Trừ Văn Thố", "Cây Trường II", "Tân Hưng", "Hưng Hòa"],
  "Dầu Tiếng": ["Dầu Tiếng", "Thanh An", "Thanh Tuyền", "Định An", "Định Hiệp", "Minh Hòa"]
};

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
  { ten: "Thương binh", value: 42, mau: "#3c8dbc" }, // Xanh dương
  { ten: "Thân nhân liệt sĩ", value: 30, mau: "#dd4b39" }, // Đỏ đô
  { ten: "Bệnh binh", value: 15, mau: "#f39c12" }, // Vàng cam
  { ten: "CĐHH & khác", value: 13, mau: "#00a65a" }, // Xanh lá
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
  tieuChi?: {
    thaiDo: number;
    thoiGian: number;
    minhBach: number;
    haTang: number;
  } | undefined;
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
    id: "12029",
    soHoSoTinh: "04878",
    soHoSoBo: "BD/LS-07956",
    hoTen: "Hồ Văn Lên",
    cccd: "074026001202",
    ngaySinh: "1926",
    namSinh: 1926,
    sinhNgayChiTiet: { ngay: "", thang: "", nam: "1926" },
    gioiTinh: "Nam",
    huyen: "Thủ Dầu Một",
    phuong: "Chánh Nghĩa",
    khuPho: "Khu phố 2",
    diaChiTiepNhan: "Chánh Nghĩa - Thủ Dầu Một",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420120291",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "10/05/2018",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công", "Giấy báo tử", "Trích lục hồ sơ liệt sĩ"],
    queQuan: "Xã Chánh Hiệp, Châu Thành, Thị xã Thủ Dầu Một, tỉnh Sông Bé",
    truQuan: "Chánh Nghĩa, Thủ Dầu Một",
    ngayNhapNguChiTiet: { ngay: "", thang: "08", nam: "1945" },
    capBac: "",
    chucVu: "Ủy viên Ban tuyên huấn tỉnh",
    coQuanDonViKhiHySinh: "Ban Tuyên giáo tỉnh Sông Bé",
    hySinhNgayChiTiet: { ngay: "", thang: "07", nam: "1949" },
    thoiKy: "Kháng Pháp (từ 19/08/1945 - 20/07/1954)",
    truongHopHySinh: "Trên đường đi công tác về đơn vị bị địch càn quét bắn đồng chí hy sinh",
    noiHySinh: "An Mỹ, Châu Thành",
    noiMaiTang: "An Mỹ, Châu Thành",
    giayBaoTu: "239/07",
    baoTuNgayChiTiet: { ngay: "13", thang: "06", nam: "1977" },
    donViCapGiayBaoTu: "Ban Tuyên giáo tỉnh Sông Bé",
    soBangToQuocGhiCong: "GC887K",
    qdCapBangSo: "1312TTga",
    qdCapBangNgayChiTiet: { ngay: "26", thang: "10", nam: "1977" },
    thuocDoiTuong: "Dân Chính",
    viTriLuuHoSo: "Kho lưu trữ Sở LĐTBXH Bình Dương - Kệ A3, Hộp 12",
    isAnhHung: false,
    thanNhanLietSi: [
      {
        hoTen: "Hồ Thị Mai",
        quanHe: "Con đẻ",
        namSinh: 1948,
        diaChi: "Phường Chánh Nghĩa, TP. Thủ Dầu Một",
        cheDoHuong: "Người thờ cúng liệt sĩ",
        soTien: 1_400_000,
      },
    ],
  },
  {
    id: "BD-16720-1",
    soHoSoTinh: "BD/16720-1",
    soHoSoBo: "BD/LS-09812",
    hoTen: "Phạm Ngọc Dưỡng",
    cccd: "074045001923",
    ngaySinh: "15/03/1945",
    namSinh: 1945,
    gioiTinh: "Nam",
    huyen: "TP. Dĩ An",
    phuong: "Bình An",
    khuPho: "Khu phố Nội Hóa 1",
    diaChiTiepNhan: "Bình An - Dĩ An",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420185921",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "12/04/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công", "Giấy chứng nhận gia đình liệt sĩ"],
  },
  {
    id: "BD-16718-1",
    soHoSoTinh: "BD/16718-1",
    hoTen: "Nguyễn Văn Hạn",
    cccd: "074048002841",
    ngaySinh: "08/11/1948",
    namSinh: 1948,
    gioiTinh: "Nam",
    huyen: "Bắc Tân Uyên",
    phuong: "Bình Mỹ",
    khuPho: "Ấp Bình Cơ",
    diaChiTiepNhan: "Bình Mỹ - Bắc Tân Uyên",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420199120",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "18/06/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16723-1",
    soHoSoTinh: "BD/16723-1",
    hoTen: "Nguyễn Văn Lý",
    cccd: "074052003344",
    ngaySinh: "20/05/1952",
    namSinh: 1952,
    gioiTinh: "Nam",
    huyen: "TP. Dĩ An",
    phuong: "Dĩ An",
    khuPho: "Khu phố Thống Nhất 1",
    diaChiTiepNhan: "Dĩ An - Dĩ An",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420211550",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "05/05/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16715-1",
    soHoSoTinh: "BD/16715-1",
    hoTen: "Lê Văn Xiêm",
    cccd: "074050004455",
    ngaySinh: "10/10/1950",
    namSinh: 1950,
    gioiTinh: "Nam",
    huyen: "Phú Giáo",
    phuong: "Tam Lập",
    khuPho: "Ấp Gia Biện",
    diaChiTiepNhan: "Tam Lập - Phú Giáo",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420177890",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "19/04/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16717-1",
    soHoSoTinh: "BD/16717-1",
    hoTen: "Nguyễn Văn Quýnh",
    cccd: "074047005566",
    ngaySinh: "02/09/1947",
    namSinh: 1947,
    gioiTinh: "Nam",
    huyen: "Phú Giáo",
    phuong: "Vĩnh Hòa",
    khuPho: "Ấp Vĩnh Tiến",
    diaChiTiepNhan: "Vĩnh Hòa - Phú Giáo",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420166540",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "15/04/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16711-1",
    soHoSoTinh: "BD/16711-1",
    hoTen: "Nguyễn Đình Việt",
    cccd: "074053006677",
    ngaySinh: "14/01/1953",
    namSinh: 1953,
    gioiTinh: "Nam",
    huyen: "Bến Cát",
    phuong: "Tân Định",
    khuPho: "Khu phố 1",
    diaChiTiepNhan: "Tân Định - Bến Cát",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420155430",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "09/04/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-18719-1",
    soHoSoTinh: "BD/18719-1",
    hoTen: "Đỗ Xuân Mai",
    cccd: "074049007788",
    ngaySinh: "25/12/1949",
    namSinh: 1949,
    gioiTinh: "Nam",
    huyen: "TP. Thuận An",
    phuong: "Vĩnh Phú",
    khuPho: "Khu phố Đông",
    diaChiTiepNhan: "Vĩnh Phú - Thuận An",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420144320",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "22/06/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16716-1",
    soHoSoTinh: "BD/16716-1",
    hoTen: "Đinh Ngọc Tảo",
    cccd: "074046008899",
    ngaySinh: "04/07/1946",
    namSinh: 1946,
    gioiTinh: "Nam",
    huyen: "TP. Dĩ An",
    phuong: "Dĩ An",
    khuPho: "Khu phố Nhị Đồng 2",
    diaChiTiepNhan: "Dĩ An - Dĩ An",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420133210",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "16/04/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16713-1",
    soHoSoTinh: "BD/16713-1",
    hoTen: "Vũ Đình Nho",
    cccd: "074051009911",
    ngaySinh: "19/08/1951",
    namSinh: 1951,
    gioiTinh: "Nam",
    huyen: "Phú Giáo",
    phuong: "Tân Hiệp",
    khuPho: "Ấp 1",
    diaChiTiepNhan: "Tân Hiệp - Phú Giáo",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420122100",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "12/04/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "BD-16726-1",
    soHoSoTinh: "BD/16726-1",
    hoTen: "Nguyễn Văn An",
    cccd: "074054001122",
    ngaySinh: "30/03/1954",
    namSinh: 1954,
    gioiTinh: "Nam",
    huyen: "Bến Cát",
    phuong: "An Tây",
    khuPho: "Ấp Lộ 7A",
    diaChiTiepNhan: "An Tây - Bến Cát",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "HT2747420111000",
    danToc: "Kinh",
    tyLeTonThuong: 0,
    trangThai: "ĐÃ_DUYỆT",
    ngayTiepNhan: "04/05/2021",
    hanXuLy: "Hoàn thành",
    quaHanNgay: 0,
    canBoTiepNhan: "admin",
    canBoQuanLy: "admin",
    mucTroCap: 2_055_000,
    phuCapPhucVu: 0,
    troCapDieuDuong: 1_027_500,
    taiLieu: ["Bằng Tổ quốc ghi công"],
  },
  {
    id: "TDM-NCC-2026-00412",
    soHoSoTinh: "BD/20260-1",
    hoTen: "TRẦN VĂN SÁU",
    cccd: "074056001234",
    ngaySinh: "12/04/1949",
    namSinh: 1949,
    gioiTinh: "Nam",
    huyen: "TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    khuPho: "Khu phố 3",
    diaChiTiepNhan: "Phú Cường - TP. Thủ Dầu Một",
    loaiDoiTuong: "Thương binh",
    banSaoBanGoc: "Bản gốc",
    soBhyt: "CN3747420185921",
    danToc: "Kinh",
    tyLeTonThuong: 61,
    trangThai: "CHỜ_PHÊ_DUYỆT",
    ngayTiepNhan: "20/08/2026",
    hanXuLy: "10/09/2026",
    quaHanNgay: 0,
    canBoTiepNhan: "Nguyễn Văn An",
    canBoQuanLy: "Nguyễn Văn An",
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

// ==============================================================================
// 1. QUẢN LÝ CẤP PHƯƠNG TIỆN TRỢ GIÚP & DỤNG CỤ CHỈNH HÌNH (Nghị định 131/2021)
// ==============================================================================
export interface DungCuChinhHinhItem {
  id: string;
  hoSoId: string;
  soHoSoTinh: string;
  hoTen: string;
  cccd: string;
  loaiDoiTuong: string;
  phuong: string;
  huyen: string;
  tenDungCu: string;
  loaiDungCu: "CHÂN_GIẢ" | "TAY_GIẢ" | "XE_LĂN" | "XE_LẮC" | "MÁY_TRỢ_THÍNH" | "KHÁC";
  nienHanNam: number; // 3 năm hoặc 5 năm
  namCapGanNhat: number;
  namDenHanCapMoi: number;
  dinhMucTien: number;
  tienBoiDuongPhucHoi: number;
  trangThai: "ĐÃ_CẤP" | "ĐẾN_HẠN_CẤP_MỚI" | "CHỜ_DUYỆT_CẤP";
  ngayCapMoi?: string;
  soQuyetDinhCap?: string;
  canBoTheoDoi?: string;
}

export const initialDungCuChinhHinh: DungCuChinhHinhItem[] = [
  {
    id: "DC-2026-001",
    hoSoId: "BD-16705-1",
    soHoSoTinh: "BD/16705-1",
    hoTen: "Nguyễn Văn Thành",
    cccd: "074052007788",
    loaiDoiTuong: "Thương binh",
    phuong: "Phú Cường",
    huyen: "TP. Thủ Dầu Một",
    tenDungCu: "Chân giả dưới gối (loại tiêu chuẩn)",
    loaiDungCu: "CHÂN_GIẢ",
    nienHanNam: 3,
    namCapGanNhat: 2023,
    namDenHanCapMoi: 2026,
    dinhMucTien: 6_500_000,
    tienBoiDuongPhucHoi: 1_200_000,
    trangThai: "ĐẾN_HẠN_CẤP_MỚI",
    ngayCapMoi: "15/04/2023",
    soQuyetDinhCap: "QĐ-SLĐTBXH/2023-145",
    canBoTheoDoi: "Nguyễn Thị Minh Thảo",
  },
  {
    id: "DC-2026-002",
    hoSoId: "BD-16706-1",
    soHoSoTinh: "BD/16706-1",
    hoTen: "Trần Minh Châu",
    cccd: "074050008811",
    loaiDoiTuong: "Thương binh",
    phuong: "Phú Hòa",
    huyen: "TP. Thủ Dầu Một",
    tenDungCu: "Xe lăn tay tiêu chuẩn có phanh",
    loaiDungCu: "XE_LĂN",
    nienHanNam: 5,
    namCapGanNhat: 2021,
    namDenHanCapMoi: 2026,
    dinhMucTien: 4_800_000,
    tienBoiDuongPhucHoi: 800_000,
    trangThai: "ĐẾN_HẠN_CẤP_MỚI",
    ngayCapMoi: "20/06/2021",
    soQuyetDinhCap: "QĐ-SLĐTBXH/2021-089",
    canBoTheoDoi: "Nguyễn Thị Minh Thảo",
  },
  {
    id: "DC-2026-003",
    hoSoId: "BD-16712-1",
    soHoSoTinh: "BD/16712-1",
    hoTen: "Đỗ Văn Lượng",
    cccd: "074044009922",
    loaiDoiTuong: "Bệnh binh",
    phuong: "Hiệp Thành",
    huyen: "TP. Thủ Dầu Một",
    tenDungCu: "Máy trợ thính kỹ thuật số đeo vành tai",
    loaiDungCu: "MÁY_TRỢ_THÍNH",
    nienHanNam: 3,
    namCapGanNhat: 2024,
    namDenHanCapMoi: 2027,
    dinhMucTien: 5_200_000,
    tienBoiDuongPhucHoi: 600_000,
    trangThai: "ĐÃ_CẤP",
    ngayCapMoi: "10/03/2024",
    soQuyetDinhCap: "QĐ-SLĐTBXH/2024-054",
    canBoTheoDoi: "Trần Quốc Bảo",
  },
  {
    id: "DC-2026-004",
    hoSoId: "BD-16718-1",
    soHoSoTinh: "BD/16718-1",
    hoTen: "Nguyễn Văn Hạn",
    cccd: "074048002841",
    loaiDoiTuong: "Thương binh",
    phuong: "Bình Mỹ",
    huyen: "Bắc Tân Uyên",
    tenDungCu: "Tay giả thẩm mỹ chức năng đơn giản",
    loaiDungCu: "TAY_GIẢ",
    nienHanNam: 3,
    namCapGanNhat: 2023,
    namDenHanCapMoi: 2026,
    dinhMucTien: 7_800_000,
    tienBoiDuongPhucHoi: 1_500_000,
    trangThai: "CHỜ_DUYỆT_CẤP",
    canBoTheoDoi: "Hứa Trọng Duy",
  },
  {
    id: "DC-2026-005",
    hoSoId: "BD-16708-1",
    soHoSoTinh: "BD/16708-1",
    hoTen: "Phan Văn Đức",
    cccd: "074042001133",
    loaiDoiTuong: "Thương binh",
    phuong: "Tân An",
    huyen: "TP. Thủ Dầu Một",
    tenDungCu: "Xe lắc 3 bánh cho người khuyết tật vận động",
    loaiDungCu: "XE_LẮC",
    nienHanNam: 5,
    namCapGanNhat: 2025,
    namDenHanCapMoi: 2030,
    dinhMucTien: 6_200_000,
    tienBoiDuongPhucHoi: 900_000,
    trangThai: "ĐÃ_CẤP",
    ngayCapMoi: "18/07/2025",
    soQuyetDinhCap: "QĐ-SLĐTBXH/2025-210",
    canBoTheoDoi: "Nguyễn Thị Minh Thảo",
  },
];

// ==============================================================================
// 2. SỐ HÓA NGHĨA TRANG LIỆT SĨ & BẢN ĐỒ VỊ TRÍ MỘ (GIS)
// ==============================================================================
export interface MoLietSiItem {
  id: string;
  soMo: string;
  khu: "Khu A" | "Khu B" | "Khu C" | "Khu D";
  hang: number;
  soThuTu: number;
  hoTen: string;
  biDanh?: string;
  namSinh: string;
  ngayHySinh: string;
  queQuan: string;
  truQuan?: string;
  capBac?: string;
  chucVu?: string;
  coQuanKhiHySinh?: string;
  tinhTrangMo: "ĐÃ_XÁC_ĐỊNH" | "CHƯA_XÁC_ĐỊNH_DANH_TÍNH" | "ĐÃ_CẤT_BỐC";
  tinhTrangBia: "TỐT" | "CẦN_TRÙNG_TU";
  luotThapHuong: number;
  toaDoX?: number; // Tọa độ tương đối trên sơ đồ SVG
  toaDoY?: number;
}

export const initialMoLietSiList: MoLietSiItem[] = [
  {
    id: "MO-A1-001",
    soMo: "A1-01",
    khu: "Khu A",
    hang: 1,
    soThuTu: 1,
    hoTen: "Hồ Văn Lên",
    biDanh: "Bảy Lên",
    namSinh: "1926",
    ngayHySinh: "07/1949",
    queQuan: "Xã Chánh Hiệp, Châu Thành, Thủ Dầu Một",
    truQuan: "Chánh Nghĩa, Thủ Dầu Một",
    chucVu: "Ủy viên Ban tuyên huấn tỉnh",
    coQuanKhiHySinh: "Ban Tuyên giáo tỉnh Sông Bé",
    tinhTrangMo: "ĐÃ_XÁC_ĐỊNH",
    tinhTrangBia: "TỐT",
    luotThapHuong: 142,
    toaDoX: 120,
    toaDoY: 80,
  },
  {
    id: "MO-A1-002",
    soMo: "A1-02",
    khu: "Khu A",
    hang: 1,
    soThuTu: 2,
    hoTen: "Nguyễn Văn Tiết",
    biDanh: "Hai Tiết",
    namSinh: "1922",
    ngayHySinh: "1948",
    queQuan: "Lái Thiêu, Thuận An, Bình Dương",
    chucVu: "Chủ tịch Ủy ban Kháng chiến Hành chính tỉnh Thủ Dầu Một",
    tinhTrangMo: "ĐÃ_XÁC_ĐỊNH",
    tinhTrangBia: "TỐT",
    luotThapHuong: 389,
    toaDoX: 180,
    toaDoY: 80,
  },
  {
    id: "MO-A1-003",
    soMo: "A1-03",
    khu: "Khu A",
    hang: 1,
    soThuTu: 3,
    hoTen: "Trần Văn Ơn",
    namSinh: "1931",
    ngayHySinh: "09/01/1950",
    queQuan: "Châu Thành, Bến Tre",
    chucVu: "Học sinh yêu nước, Liệt sĩ thời kỳ kháng Pháp",
    tinhTrangMo: "ĐÃ_XÁC_ĐỊNH",
    tinhTrangBia: "TỐT",
    luotThapHuong: 520,
    toaDoX: 240,
    toaDoY: 80,
  },
  {
    id: "MO-B2-014",
    soMo: "B2-14",
    khu: "Khu B",
    hang: 2,
    soThuTu: 14,
    hoTen: "Liệt sĩ chưa xác định danh tính số 14",
    namSinh: "Không rõ",
    ngayHySinh: "1968",
    queQuan: "Quy tập tại Chiến khu Đ, Bình Dương",
    tinhTrangMo: "CHƯA_XÁC_ĐỊNH_DANH_TÍNH",
    tinhTrangBia: "TỐT",
    luotThapHuong: 215,
    toaDoX: 380,
    toaDoY: 140,
  },
  {
    id: "MO-B2-015",
    soMo: "B2-15",
    khu: "Khu B",
    hang: 2,
    soThuTu: 15,
    hoTen: "Lê Văn Tám",
    namSinh: "1947",
    ngayHySinh: "1972",
    queQuan: "Tân Uyên, Bình Dương",
    chucVu: "Chiến sĩ Đại đội 1, Tiểu đoàn Phú Lợi",
    tinhTrangMo: "ĐÃ_XÁC_ĐỊNH",
    tinhTrangBia: "CẦN_TRÙNG_TU",
    luotThapHuong: 88,
    toaDoX: 440,
    toaDoY: 140,
  },
  {
    id: "MO-C3-008",
    soMo: "C3-08",
    khu: "Khu C",
    hang: 3,
    soThuTu: 8,
    hoTen: "Đoàn Thị Liên",
    biDanh: "Chị Sáu Liên",
    namSinh: "1944",
    ngayHySinh: "1966",
    queQuan: "Chánh Phú Hòa, Bến Cát, Bình Dương",
    chucVu: "Anh hùng Lực lượng vũ trang nhân dân",
    tinhTrangMo: "ĐÃ_XÁC_ĐỊNH",
    tinhTrangBia: "TỐT",
    luotThapHuong: 610,
    toaDoX: 200,
    toaDoY: 220,
  },
  {
    id: "MO-C3-009",
    soMo: "C3-09",
    khu: "Khu C",
    hang: 3,
    soThuTu: 9,
    hoTen: "Liệt sĩ chưa xác định danh tính số 89",
    namSinh: "Không rõ",
    ngayHySinh: "1975",
    queQuan: "Mặt trận Dầu Tiếng, Bình Dương",
    tinhTrangMo: "CHƯA_XÁC_ĐỊNH_DANH_TÍNH",
    tinhTrangBia: "TỐT",
    luotThapHuong: 174,
    toaDoX: 260,
    toaDoY: 220,
  },
  {
    id: "MO-D4-021",
    soMo: "D4-21",
    khu: "Khu D",
    hang: 4,
    soThuTu: 21,
    hoTen: "Phạm Văn Cội",
    namSinh: "1939",
    ngayHySinh: "1967",
    queQuan: "Củ Chi (An táng tại NTLS Bình Dương)",
    tinhTrangMo: "ĐÃ_CẤT_BỐC",
    tinhTrangBia: "TỐT",
    luotThapHuong: 45,
    toaDoX: 350,
    toaDoY: 300,
  },
];

// ==============================================================================
// 3. QUẢN LÝ BÁO GIẢM TỪ TRẦN & TRỢ CẤP MAI TÁNG PHÍ (Mẫu số 02 - NĐ 131/2021)
// ==============================================================================
export interface BaoGiamItem {
  id: string;
  hoSoId: string;
  soHoSoTinh: string;
  hoTen: string;
  cccd: string;
  loaiDoiTuong: string;
  phuong: string;
  huyen: string;
  ngayTuTran: string;
  noiTuTran: string;
  soTrichLucKhaiTu: string;
  ngayCapKhaiTu: string;
  noiCapKhaiTu: string;
  nguoiKhaiBao: string;
  quanHeVoiNguoiMat: string;
  soCccdNguoiKhai: string;
  soDienThoaiNguoiKhai: string;
  diaChiNguoiKhai: string;
  soQuyetDinhMaiTang: string;
  ngayQuyetDinh: string;
  soTienMaiTangPhi: number; // 20.550.000 VNĐ (10 x Mức chuẩn 2.055.000)
  troCapMotLan?: number;
  trangThai: "ĐÃ_BAN_HÀNH_QĐ" | "CHỜ_DUYỆT";
  daNgungChiTraHangThang: boolean;
  canBoThuLy: string;
}

export const initialBaoGiamList: BaoGiamItem[] = [
  {
    id: "BG-2026-001",
    hoSoId: "BD-16701-1",
    soHoSoTinh: "BD/16701-1",
    hoTen: "Lê Thị Mai",
    cccd: "074030008899",
    loaiDoiTuong: "Mẹ VNAH",
    phuong: "Định Hòa",
    huyen: "TP. Thủ Dầu Một",
    ngayTuTran: "28/08/2026",
    noiTuTran: "Tại nhà riêng, Phường Định Hòa",
    soTrichLucKhaiTu: "TLKT-2026/ĐH-18",
    ngayCapKhaiTu: "29/08/2026",
    noiCapKhaiTu: "UBND Phường Định Hòa",
    nguoiKhaiBao: "Nguyễn Văn Quang",
    quanHeVoiNguoiMat: "Con trai",
    soCccdNguoiKhai: "074060001234",
    soDienThoaiNguoiKhai: "0918.456.789",
    diaChiNguoiKhai: "Khu phố 4, Phường Định Hòa, TP. Thủ Dầu Một",
    soQuyetDinhMaiTang: "QĐ-UBND/2026-MTP-088",
    ngayQuyetDinh: "02/09/2026",
    soTienMaiTangPhi: 20_550_000,
    troCapMotLan: 6_165_000, // 3 tháng trợ cấp phụng dưỡng
    trangThai: "ĐÃ_BAN_HÀNH_QĐ",
    daNgungChiTraHangThang: true,
    canBoThuLy: "Nguyễn Thị Minh Thảo",
  },
];

// ==============================================================================
// 4. TRUNG TÂM CẢNH BÁO SỚM & PHÒNG NGỪA RỦI RO CHÍNH SÁCH (Fraud & Early Alert)
// ==============================================================================
export interface CanhBaoSomItem {
  id: string;
  loai: "NGHIÊM_TRỌNG" | "CẢNH_BÁO" | "NHẮC_NHỞ";
  tieuDe: string;
  moTa: string;
  hoSoId?: string;
  soHoSoTinh?: string;
  hoTen?: string;
  huyen?: string;
  phuong?: string;
  ngayPhatHien: string;
  hanXuLy?: string;
  loaiCanhBao:
    | "QUA_TUOI_HUONG_TUAT"
    | "TRUNG_CCCD"
    | "TRE_HAN_MOT_CUA"
    | "DEN_HAN_DUNG_CU"
    | "CHI_TRA_SAU_TU_TRAN";
  trangThai: "CHƯA_XỬ_LÝ" | "ĐÃ_XỬ_LÝ";
}

export const initialCanhBaoList: CanhBaoSomItem[] = [
  {
    id: "CB-01",
    loai: "NGHIÊM_TRỌNG",
    loaiCanhBao: "QUA_TUOI_HUONG_TUAT",
    tieuDe: "Thân nhân liệt sĩ đủ 18 tuổi cần xác nhận học tập",
    moTa: "Thân nhân liệt sĩ Hồ Thị Hoa (CCCD: 074080009123) sinh năm 2008 đã tròn 18 tuổi. Cần nộp Giấy xác nhận học sinh/sinh viên hoặc chấm dứt tiền tuất.",
    hoSoId: "BD-16720-1",
    soHoSoTinh: "BD/16720-1",
    hoTen: "Hồ Thị Hoa",
    huyen: "TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    ngayPhatHien: "01/09/2026",
    hanXuLy: "15/09/2026",
    trangThai: "CHƯA_XỬ_LÝ",
  },
  {
    id: "CB-02",
    loai: "NGHIÊM_TRỌNG",
    loaiCanhBao: "TRUNG_CCCD",
    tieuDe: "Phát hiện trùng số CCCD giữa 2 hồ sơ",
    moTa: "CCCD 074052007788 bị trùng lặp giữa hồ sơ Thương binh tại P. Phú Cường và hồ sơ mới nộp tại P. Tân An.",
    hoSoId: "BD-16705-1",
    soHoSoTinh: "BD/16705-1",
    hoTen: "Nguyễn Văn Thành",
    huyen: "TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    ngayPhatHien: "03/09/2026",
    hanXuLy: "10/09/2026",
    trangThai: "CHƯA_XỬ_LÝ",
  },
  {
    id: "CB-03",
    loai: "CẢNH_BÁO",
    loaiCanhBao: "TRE_HAN_MOT_CUA",
    tieuDe: "Hồ sơ tiếp nhận Một cửa sắp quá hạn thẩm định",
    moTa: "Hồ sơ Thương binh BD-16715-1 tiếp nhận từ 20/08/2026, còn 2 ngày nữa hết thời hạn 15 ngày làm việc quy định.",
    hoSoId: "BD-16715-1",
    soHoSoTinh: "BD/16715-1",
    hoTen: "Lê Văn Xiêm",
    huyen: "Phú Giáo",
    phuong: "Tam Lập",
    ngayPhatHien: "04/09/2026",
    hanXuLy: "08/09/2026",
    trangThai: "CHƯA_XỬ_LÝ",
  },
  {
    id: "CB-04",
    loai: "NHẮC_NHỞ",
    loaiCanhBao: "DEN_HAN_DUNG_CU",
    tieuDe: "2 Thương binh đến niên hạn cấp mới dụng cụ chỉnh hình",
    moTa: "Đồng chí Nguyễn Văn Thành và Trần Minh Châu đến hạn cấp lại Chân giả và Xe lăn theo niên hạn 3-5 năm.",
    hoSoId: "BD-16705-1",
    soHoSoTinh: "BD/16705-1",
    hoTen: "Nguyễn Văn Thành & Trần Minh Châu",
    huyen: "TP. Thủ Dầu Một",
    phuong: "Phú Cường",
    ngayPhatHien: "05/09/2026",
    hanXuLy: "30/09/2026",
    trangThai: "CHƯA_XỬ_LÝ",
  },
];

