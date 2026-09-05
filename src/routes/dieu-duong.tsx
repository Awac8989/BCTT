import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  HeartPulse,
  Building,
  Home,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Plus,
  Users,
  Calendar,
  AlertCircle,
  HelpCircle,
  MapPin,
  Search,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/services/app-state";
import { MUC_DIEU_DUONG_TAI_NHA, MUC_DIEU_DUONG_TAP_TRUNG } from "@/services/calculator.service";
import { HUYEN_LIST } from "@/data/mock";

export const Route = createFileRoute("/dieu-duong")({
  head: () => ({
    meta: [
      { title: "Chương trình điều dưỡng phục hồi sức khỏe Người có công · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Kế hoạch điều dưỡng người có công tỉnh Bình Dương: chế độ điều dưỡng 1 năm/lần, 2 năm/lần, điều dưỡng tập trung và điều dưỡng tại nhà theo Nghị định 131/2021/NĐ-CP.",
      },
    ],
  }),
  component: DieuDuongPage,
});

interface DieuDuongRecord {
  id: string;
  soHoSoTinh: string;
  hoTen: string;
  cccd: string;
  loaiDoiTuong: string;
  tyLe: number;
  chuKy: "1_NAM_LAN" | "2_NAM_LAN";
  hinhThuc: "TAP_TRUNG" | "TAI_NHA";
  diaDiemHoacNganHang: string;
  dinhMuc: number;
  namThucHien: number;
  phuong: string;
  huyen: string;
  trangThai: "DA_HOAN_THANH" | "DA_CAP_TIEN" | "CHUA_THUC_HIEN";
  dotDieuDuong?: string;
}

const INITIAL_DIEU_DUONG_DATA: DieuDuongRecord[] = [
  {
    id: "DD-2026-001",
    soHoSoTinh: "BD/16705-1",
    hoTen: "Nguyễn Văn Thành",
    cccd: "074052007788",
    loaiDoiTuong: "Thương binh",
    tyLe: 61,
    chuKy: "2_NAM_LAN",
    hinhThuc: "TAI_NHA",
    diaDiemHoacNganHang: "Vietcombank PGD Phú Cường",
    dinhMuc: MUC_DIEU_DUONG_TAI_NHA,
    namThucHien: 2026,
    phuong: "Phú Cường",
    huyen: "TP. Thủ Dầu Một",
    trangThai: "DA_CAP_TIEN",
    dotDieuDuong: "Đợt 1 (Dịp 27/7)",
  },
  {
    id: "DD-2026-002",
    soHoSoTinh: "BD/16701-1",
    hoTen: "Lê Thị Mai",
    cccd: "074030008899",
    loaiDoiTuong: "Mẹ VNAH",
    tyLe: 100,
    chuKy: "1_NAM_LAN",
    hinhThuc: "TAI_NHA",
    diaDiemHoacNganHang: "Chi trả tiền mặt tại nhà (Bưu điện)",
    dinhMuc: MUC_DIEU_DUONG_TAI_NHA,
    namThucHien: 2026,
    phuong: "Định Hòa",
    huyen: "TP. Thủ Dầu Một",
    trangThai: "CHUA_THUC_HIEN",
  },
  {
    id: "DD-2026-003",
    soHoSoTinh: "BD/16720-1",
    hoTen: "Phạm Ngọc Dưỡng",
    cccd: "074045001923",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    tyLe: 0,
    chuKy: "2_NAM_LAN",
    hinhThuc: "TAI_NHA",
    diaDiemHoacNganHang: "Vietcombank CN Bình Dương",
    dinhMuc: MUC_DIEU_DUONG_TAI_NHA,
    namThucHien: 2026,
    phuong: "Bình An",
    huyen: "TP. Dĩ An",
    trangThai: "DA_CAP_TIEN",
    dotDieuDuong: "Đợt 1 (Dịp 27/7)",
  },
  {
    id: "DD-2026-004",
    soHoSoTinh: "BD/16699-1",
    hoTen: "Trần Văn Nam",
    cccd: "074048003311",
    loaiDoiTuong: "Thương binh đặc biệt nặng",
    tyLe: 81,
    chuKy: "1_NAM_LAN",
    hinhThuc: "TAP_TRUNG",
    diaDiemHoacNganHang: "TT Điều dưỡng NCC Miền Đông Nam Bộ (Vũng Tàu)",
    dinhMuc: MUC_DIEU_DUONG_TAP_TRUNG,
    namThucHien: 2026,
    phuong: "Hiệp Thành",
    huyen: "TP. Thủ Dầu Một",
    trangThai: "DA_HOAN_THANH",
    dotDieuDuong: "Đoàn Vũng Tàu (10 - 17/06/2026)",
  },
  {
    id: "DD-2026-005",
    soHoSoTinh: "BD/16718-1",
    hoTen: "Nguyễn Văn Hạn",
    cccd: "074048002841",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    tyLe: 0,
    chuKy: "2_NAM_LAN",
    hinhThuc: "TAP_TRUNG",
    diaDiemHoacNganHang: "TT Điều dưỡng NCC Đà Lạt (Lâm Đồng)",
    dinhMuc: MUC_DIEU_DUONG_TAP_TRUNG,
    namThucHien: 2026,
    phuong: "Bình Mỹ",
    huyen: "Bắc Tân Uyên",
    trangThai: "CHUA_THUC_HIEN",
    dotDieuDuong: "Đoàn Đà Lạt (Dự kiến 15/09/2026)",
  },
  {
    id: "DD-2026-006",
    soHoSoTinh: "BD/16723-1",
    hoTen: "Nguyễn Văn Lý",
    cccd: "074052003344",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    tyLe: 0,
    chuKy: "2_NAM_LAN",
    hinhThuc: "TAI_NHA",
    diaDiemHoacNganHang: "BIDV Nam Bình Dương",
    dinhMuc: MUC_DIEU_DUONG_TAI_NHA,
    namThucHien: 2026,
    phuong: "Dĩ An",
    huyen: "TP. Dĩ An",
    trangThai: "DA_CAP_TIEN",
  },
  {
    id: "DD-2026-007",
    soHoSoTinh: "BD/16715-1",
    hoTen: "Lê Văn Xiêm",
    cccd: "074050004455",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    tyLe: 0,
    chuKy: "2_NAM_LAN",
    hinhThuc: "TAI_NHA",
    diaDiemHoacNganHang: "Bưu điện Tam Lập",
    dinhMuc: MUC_DIEU_DUONG_TAI_NHA,
    namThucHien: 2026,
    phuong: "Tam Lập",
    huyen: "Phú Giáo",
    trangThai: "CHUA_THUC_HIEN",
  },
];

function DieuDuongPage() {
  const [data, setData] = useState<DieuDuongRecord[]>(INITIAL_DIEU_DUONG_DATA);
  const [filterChuKy, setFilterChuKy] = useState("ALL");
  const [filterHinhThuc, setFilterHinhThuc] = useState("ALL");
  const [filterHuyen, setFilterHuyen] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDoanModalOpen, setIsDoanModalOpen] = useState(false);

  // Bộ lọc
  const filteredRecords = useMemo(() => {
    return data.filter((item) => {
      if (filterChuKy !== "ALL" && item.chuKy !== filterChuKy) return false;
      if (filterHinhThuc !== "ALL" && item.hinhThuc !== filterHinhThuc) return false;
      if (filterHuyen !== "ALL" && item.huyen !== filterHuyen) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!item.hoTen.toLowerCase().includes(q) && !item.soHoSoTinh.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [data, filterChuKy, filterHinhThuc, filterHuyen, searchQuery]);

  // Thống kê
  const stats = useMemo(() => {
    const tongSo = data.length;
    const motNamLan = data.filter((d) => d.chuKy === "1_NAM_LAN").length;
    const haiNamLan = data.filter((d) => d.chuKy === "2_NAM_LAN").length;
    const tapTrung = data.filter((d) => d.hinhThuc === "TAP_TRUNG").length;
    const taiNha = data.filter((d) => d.hinhThuc === "TAI_NHA").length;
    const hoanThanh = data.filter((d) => d.trangThai === "DA_HOAN_THANH" || d.trangThai === "DA_CAP_TIEN").length;
    const tongKinhPhi = data.reduce((s, d) => s + d.dinhMuc, 0);

    return { tongSo, motNamLan, haiNamLan, tapTrung, taiNha, hoanThanh, tongKinhPhi };
  }, [data]);

  const handlePhatTienTaiNha = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, trangThai: "DA_CAP_TIEN" as const } : item,
      ),
    );
    toast.success("Đã xác nhận cấp tiền điều dưỡng tại nhà thành công!");
  };

  return (
    <AppShell>
      {/* 1. Tiêu đề chuẩn Cổng Sở LĐTBXH */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-[#333333] flex items-baseline">
          Chương trình Điều dưỡng phục hồi sức khỏe
          <span className="text-sm font-normal text-[#777777] ml-2">
            Kế hoạch năm 2026 · Nghị định 131/2021/NĐ-CP (Điều 84-87)
          </span>
        </h1>
      </div>

      {/* 2. Thanh nút tác vụ hàng đầu */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDoanModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            <Building className="size-3.5" />
            Lập đoàn Điều dưỡng tập trung (Trung tâm)
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterHinhThuc("TAI_NHA");
              toast.info("Đã lọc danh sách cấp tiền điều dưỡng tại nhà (1.849.500đ/người)");
            }}
            className="flex items-center gap-1.5 rounded-full bg-[#00c0ef] hover:bg-[#00a7d0] px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            <Home className="size-3.5" />
            Danh sách Điều dưỡng tại nhà
          </button>

          <button
            type="button"
            onClick={() => toast.success("Đã xuất danh sách Kế hoạch điều dưỡng năm 2026 (.csv)")}
            className="flex items-center gap-1.5 rounded-full border border-[#d2d6de] bg-white px-4 py-1.5 text-xs font-semibold text-[#555555] hover:bg-gray-50 shadow-xs"
          >
            <FileSpreadsheet className="size-3.5" />
            Xuất báo cáo kế hoạch
          </button>
        </div>

        <div className="text-xs text-[#666666]">
          Năm kế hoạch: <span className="font-bold text-[#dd4b39]">2026 (Niên hạn năm chẵn)</span>
        </div>
      </div>

      {/* 3. Bốn thẻ Thống kê Chỉ tiêu Điều dưỡng */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-[#333333]">
        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase">Chỉ tiêu năm 2026</span>
            <HeartPulse className="size-4 text-[#dd4b39]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#333333]">
            {stats.tongSo} <span className="text-xs font-normal text-[#777777]">đối tượng</span>
          </div>
          <div className="mt-1 text-[11px] text-[#777777]">
            Kinh phí: <strong>{stats.tongKinhPhi.toLocaleString("vi-VN")} đ</strong>
          </div>
        </div>

        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs border-l-4 border-l-[#dd4b39]">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase">Chế độ 1 năm/lần</span>
            <AlertCircle className="size-4 text-[#dd4b39]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#dd4b39]">
            {stats.motNamLan} <span className="text-xs font-normal text-[#777777]">người</span>
          </div>
          <div className="mt-1 text-[11px] text-[#777777]">
            Thương binh nặng &ge;81%, Mẹ VNAH, tuất nuôi dưỡng
          </div>
        </div>

        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs border-l-4 border-l-[#00c0ef]">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase">Chế độ 2 năm/lần</span>
            <Calendar className="size-4 text-[#00c0ef]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#00c0ef]">
            {stats.haiNamLan} <span className="text-xs font-normal text-[#777777]">người</span>
          </div>
          <div className="mt-1 text-[11px] text-[#777777]">
            Thương binh 21-80%, thân nhân 2 liệt sĩ (Năm 2026)
          </div>
        </div>

        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs border-l-4 border-l-[#00a65a]">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase">Đã thực hiện xong</span>
            <CheckCircle2 className="size-4 text-[#00a65a]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#00a65a]">
            {stats.hoanThanh} / {stats.tongSo}{" "}
            <span className="text-xs font-normal text-[#777777]">người</span>
          </div>
          <div className="mt-1 text-[11px] text-[#00a65a] font-medium">
            Đạt {Math.round((stats.hoanThanh / stats.tongSo) * 100)}% kế hoạch phân bổ
          </div>
        </div>
      </div>

      {/* 4. Khung Bộ lọc Tìm kiếm */}
      <div className="mb-4 rounded-[4px] border border-[#d2d6de] bg-white p-3 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-4 text-xs">
          <div>
            <label className="mb-1 block font-medium text-[#444444]">Chu kỳ điều dưỡng:</label>
            <select
              value={filterChuKy}
              onChange={(e) => setFilterChuKy(e.target.value)}
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs outline-none"
            >
              <option value="ALL">-- Tất cả chu kỳ --</option>
              <option value="1_NAM_LAN">1 năm/lần (Thương binh nặng &ge; 81%, Mẹ VNAH)</option>
              <option value="2_NAM_LAN">2 năm/lần (Thương binh 21-80%, Thân nhân 2 LS)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium text-[#444444]">Hình thức điều dưỡng:</label>
            <select
              value={filterHinhThuc}
              onChange={(e) => setFilterHinhThuc(e.target.value)}
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs outline-none"
            >
              <option value="ALL">-- Tất cả hình thức --</option>
              <option value="TAP_TRUNG">Điều dưỡng tập trung (7 ngày tại Trung tâm)</option>
              <option value="TAI_NHA">Điều dưỡng tại nhà (1.849.500đ)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium text-[#444444]">Địa bàn:</label>
            <select
              value={filterHuyen}
              onChange={(e) => setFilterHuyen(e.target.value)}
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs outline-none"
            >
              <option value="ALL">-- Toàn tỉnh Bình Dương --</option>
              {HUYEN_LIST.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium text-[#444444]">Tìm kiếm theo tên / số hồ sơ:</label>
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên hoặc số hồ sơ..."
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white pl-7 pr-2.5 py-1 text-xs outline-none"
              />
              <Search className="size-3.5 absolute left-2 top-2 text-[#888888]" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bảng Danh sách Đối tượng hưởng chế độ Điều dưỡng */}
      <div className="rounded-[4px] border border-[#d2d6de] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#d2d6de] bg-white text-[#333333] font-bold">
                <th className="w-10 py-2 text-center font-bold">STT</th>
                <th className="px-3 py-2 font-bold">Số hồ sơ</th>
                <th className="px-3 py-2 font-bold">Họ và tên đối tượng</th>
                <th className="px-3 py-2 font-bold">Diện đối tượng</th>
                <th className="px-3 py-2 font-bold text-center">Chu kỳ</th>
                <th className="px-3 py-2 font-bold">Hình thức điều dưỡng</th>
                <th className="px-3 py-2 font-bold">Điểm đến / Kênh cấp tiền</th>
                <th className="px-3 py-2 font-bold text-right">Định mức kinh phí</th>
                <th className="px-3 py-2 font-bold text-center">Trạng thái</th>
                <th className="px-3 py-2 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4] text-[#333333]">
              {filteredRecords.map((r, idx) => (
                <tr key={r.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="py-2.5 text-center text-[#666666] font-mono text-xs">{idx + 1}</td>
                  <td className="px-3 py-2.5 font-mono text-xs font-semibold text-[#dd4b39]">
                    {r.soHoSoTinh}
                  </td>
                  <td className="px-3 py-2.5 font-medium">
                    <div>{r.hoTen}</div>
                    <div className="text-[11px] text-[#777777] font-mono">CCCD: {r.cccd}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div>{r.loaiDoiTuong}</div>
                    {r.tyLe > 0 && (
                      <span className="text-[11px] text-[#666666] font-mono">Thương tật: {r.tyLe}%</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                        r.chuKy === "1_NAM_LAN"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {r.chuKy === "1_NAM_LAN" ? "1 năm/lần" : "2 năm/lần"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {r.hinhThuc === "TAP_TRUNG" ? (
                      <span className="font-semibold text-[#00a65a] flex items-center gap-1">
                        <Building className="size-3.5" />
                        Tập trung (7 ngày)
                      </span>
                    ) : (
                      <span className="font-semibold text-[#00c0ef] flex items-center gap-1">
                        <Home className="size-3.5" />
                        Tại gia đình
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-[#555555]">
                    <div>{r.diaDiemHoacNganHang}</div>
                    {r.dotDieuDuong && (
                      <div className="text-[11px] text-[#dd4b39] font-medium">{r.dotDieuDuong}</div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-[#dd4b39]">
                    {r.dinhMuc.toLocaleString("vi-VN")} <span className="text-[10px] text-[#777777]">đ</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {r.trangThai === "DA_HOAN_THANH" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3" />
                        Đã đi điều dưỡng
                      </span>
                    ) : r.trangThai === "DA_CAP_TIEN" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 border border-sky-200">
                        <CheckCircle2 className="size-3" />
                        Đã cấp tiền
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                        <Clock className="size-3" />
                        Chờ thực hiện
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {r.trangThai === "CHUA_THUC_HIEN" && r.hinhThuc === "TAI_NHA" ? (
                      <button
                        type="button"
                        onClick={() => handlePhatTienTaiNha(r.id)}
                        className="rounded-[2px] bg-[#00a65a] hover:bg-[#008d4c] px-2.5 py-1 text-xs font-bold text-white shadow-2xs cursor-pointer"
                      >
                        Cấp tiền
                      </button>
                    ) : r.trangThai === "CHUA_THUC_HIEN" && r.hinhThuc === "TAP_TRUNG" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setData((prev) =>
                            prev.map((item) =>
                              item.id === r.id ? { ...item, trangThai: "DA_HOAN_THANH" as const } : item,
                            ),
                          );
                          toast.success(`Đã xếp ${r.hoTen} vào đoàn đi Trung tâm điều dưỡng Vũng Tàu!`);
                        }}
                        className="rounded-[2px] bg-[#00c0ef] hover:bg-[#00a7d0] px-2.5 py-1 text-xs font-bold text-white shadow-2xs cursor-pointer"
                      >
                        Xếp đoàn
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">Hoàn tất</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Hộp Phổ biến Quy định Pháp luật về Chế độ Điều dưỡng (Nghị định 131/2021/NĐ-CP) */}
      <div className="mt-4 rounded-[4px] border border-[#d2d6de] bg-white p-4 text-xs text-[#333333]">
        <div className="font-bold text-[#dd4b39] uppercase text-xs mb-2">
          Quy định Pháp lý về Chế độ Điều dưỡng phục hồi sức khỏe (Điều 84 - 87 Nghị định 131/2021/NĐ-CP)
        </div>
        <div className="grid gap-3 sm:grid-cols-2 text-[12px] leading-relaxed">
          <div className="rounded border border-[#e5e7eb] p-3 bg-gray-50/50">
            <div className="font-bold text-[#00a65a] mb-1">1. Chế độ Điều dưỡng tập trung (7 ngày)</div>
            <p className="text-[#555555]">
              - Mức chi bằng <strong>1.8 lần mức chuẩn</strong> = <strong>3.699.000 đồng/người/lần</strong>.
            </p>
            <p className="text-[#555555] mt-1">
              - Bao gồm: Tiền ăn trong thời gian điều dưỡng, thuốc bổ thiết yếu, quà tặng, vé tham quan, sinh hoạt văn hóa và xe đưa đón đi về.
            </p>
          </div>

          <div className="rounded border border-[#e5e7eb] p-3 bg-gray-50/50">
            <div className="font-bold text-[#00c0ef] mb-1">2. Chế độ Điều dưỡng tại gia đình</div>
            <p className="text-[#555555]">
              - Mức chi bằng <strong>0.9 lần mức chuẩn</strong> = <strong>1.849.500 đồng/người/lần</strong>.
            </p>
            <p className="text-[#555555] mt-1">
              - Chi trả trực tiếp bằng tiền mặt hoặc qua tài khoản ngân hàng không dùng tiền mặt (Đề án 06) cho người có công hoặc người thờ cúng.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Lập đoàn điều dưỡng tập trung */}
      {isDoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg rounded-[4px] border border-[#d2d6de] bg-white p-5 shadow-xl text-xs text-[#333333]">
            <h3 className="font-bold text-sm text-[#dd4b39] mb-2 uppercase">Lập đoàn điều dưỡng tập trung đợt 3/2026</h3>
            <p className="text-[#666666] mb-3">
              Địa điểm: <strong>Trung tâm Điều dưỡng Thương binh &amp; Người có công Miền Đông Nam Bộ (Vũng Tàu)</strong>
            </p>

            <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded border border-[#e5e7eb]">
              <div>- Thời gian: 7 ngày (Dự kiến từ 15/09/2026 đến 21/09/2026)</div>
              <div>- Định mức kinh phí: 3.699.000 đồng/đối tượng</div>
              <div>- Đơn vị tổ chức: Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương</div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDoanModalOpen(false)}
                className="rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 text-xs text-[#555555] hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDoanModalOpen(false);
                  toast.success("Đã phê duyệt kế hoạch đoàn điều dưỡng tập trung đợt 3/2026 thành công!");
                }}
                className="rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-4 py-1.5 text-xs font-bold text-white shadow-xs"
              >
                Xác nhận thành lập đoàn
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
