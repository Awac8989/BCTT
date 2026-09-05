import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  FileSpreadsheet,
  Plus,
  Filter,
  FileText,
  Edit,
  Check,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { GiayHenModal } from "@/components/GiayHenModal";
import { HUYEN_LIST, HUYEN_PHUONG_MAP, type HoSo } from "@/data/mock";
import { useAppState } from "@/services/app-state";
import { CreateProfileModal } from "@/components/CreateProfileModal";

export const Route = createFileRoute("/ho-so/")({
  head: () => ({
    meta: [
      { title: "Quản lý hồ sơ · Tìm kiếm hồ sơ · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Cổng quản lý hồ sơ người có công tỉnh Bình Dương: tra cứu nâng cao theo số hồ sơ tỉnh quản lý, BHYT, địa bàn hành chính và xuất báo cáo Excel.",
      },
      { property: "og:title", content: "Quản lý hồ sơ Người có công · SLĐTBXH Bình Dương" },
    ],
  }),
  component: HoSoIndex,
});

const LOAI_HO_SO_OPTIONS = [
  "-- Chọn --",
  "Hồ sơ liệt sĩ",
  "Hồ sơ thương binh",
  "Hồ sơ bệnh binh",
  "Hồ sơ Mẹ VNAH",
  "Hồ sơ chất độc hóa học",
  "Hồ sơ cán bộ tiền khởi nghĩa",
];

const DAN_TOC_OPTIONS = ["-- Chọn --", "Kinh", "Hoa", "Chăm", "Tày", "Khác"];

function getDisplayLoaiHoSo(loai: string): string {
  if (loai === "Thân nhân liệt sĩ") return "Hồ sơ liệt sĩ";
  if (loai.startsWith("Hồ sơ")) return loai;
  return `Hồ sơ ${loai.toLowerCase()}`;
}

function exportToExcel(data: HoSo[]) {
  if (data.length === 0) {
    toast.error("Không có dữ liệu để xuất Excel!");
    return;
  }

  const headers = [
    "STT",
    "Số hồ sơ Tỉnh quản lý",
    "Họ và tên",
    "Loại hồ sơ",
    "Địa chỉ tiếp nhận",
    "Năm sinh",
    "Giới tính",
    "Số BHYT",
    "Cán bộ quản lý",
  ];

  const rows = data.map((h, idx) => [
    idx + 1,
    `"${h.soHoSoTinh || h.id}"`,
    `"${h.hoTen}"`,
    `"${getDisplayLoaiHoSo(h.loaiDoiTuong)}"`,
    `"${h.diaChiTiepNhan || `${h.phuong} - ${h.huyen || "TP. Thủ Dầu Một"}`}"`,
    h.loaiDoiTuong === "Thân nhân liệt sĩ" ? "" : h.namSinh || "",
    h.gioiTinh,
    `"${h.loaiDoiTuong === "Thân nhân liệt sĩ" ? "" : h.soBhyt || ""}"`,
    `"${h.canBoQuanLy || "admin"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Danh_sach_ho_so_SLDTBXH_Binh_Duong_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success(`Đã xuất thành công ${data.length} bản ghi ra file Excel!`);
}

function HoSoIndex() {
  const { hoSoList } = useAppState();

  // Modal thêm mới hồ sơ
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // Modal in giấy tiếp nhận hồ sơ có QR code
  const [selectedGiayHenHoSo, setSelectedGiayHenHoSo] = useState<HoSo | null>(null);

  // Bộ lọc tìm kiếm nâng cao theo giao diện Sở LĐTBXH Bình Dương
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [loaiHoSo, setLoaiHoSo] = useState("-- Chọn --");
  const [banSaoGoc, setBanSaoGoc] = useState("-- Chọn --");
  const [soHoSoTinh, setSoHoSoTinh] = useState("");
  const [huyen, setHuyen] = useState("-- Chọn --");
  const [phuong, setPhuong] = useState("-- Chọn --");
  const [hoTen, setHoTen] = useState("");
  const [soBhyt, setSoBhyt] = useState("");
  const [namSinh, setNamSinh] = useState("");
  const [gioiTinh, setGioiTinh] = useState("-- Chọn --");
  const [danToc, setDanToc] = useState("-- Chọn --");

  // Phân trang & chọn dòng
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Khởi tạo các ID được chọn (theo ảnh mẫu, tất cả checkbox hàng đều được tích xanh)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => hoSoList.map((h) => h.id));

  // Danh sách xã/phường liên động theo huyện
  const availablePhuongs = useMemo(() => {
    if (huyen === "-- Chọn --" || !HUYEN_PHUONG_MAP[huyen]) {
      return [];
    }
    return HUYEN_PHUONG_MAP[huyen];
  }, [huyen]);

  // Bộ lọc dữ liệu
  const filteredRows = useMemo(() => {
    return hoSoList.filter((h) => {
      // Lọc loại hồ sơ
      if (loaiHoSo !== "-- Chọn --") {
        const displayLoai = getDisplayLoaiHoSo(h.loaiDoiTuong).toLowerCase();
        if (!displayLoai.includes(loaiHoSo.toLowerCase().replace("hồ sơ ", ""))) {
          return false;
        }
      }

      // Lọc bản sao / bản gốc
      if (banSaoGoc !== "-- Chọn --") {
        if (h.banSaoBanGoc && h.banSaoBanGoc !== banSaoGoc) return false;
      }

      // Lọc số hồ sơ tỉnh
      if (soHoSoTinh.trim()) {
        const query = soHoSoTinh.trim().toLowerCase();
        const code = (h.soHoSoTinh || h.id).toLowerCase();
        if (!code.includes(query)) return false;
      }

      // Lọc huyện
      if (huyen !== "-- Chọn --") {
        const huyenNorm = h.huyen || (h.diaChiTiepNhan ? h.diaChiTiepNhan.split("-").pop()?.trim() : "TP. Thủ Dầu Một");
        if (huyenNorm && !huyenNorm.toLowerCase().includes(huyen.toLowerCase().replace("tp. ", ""))) {
          return false;
        }
      }

      // Lọc phường
      if (phuong !== "-- Chọn --") {
        if (h.phuong !== phuong && !h.diaChiTiepNhan?.includes(phuong)) return false;
      }

      // Lọc họ và tên
      if (hoTen.trim()) {
        if (!h.hoTen.toLowerCase().includes(hoTen.trim().toLowerCase())) return false;
      }

      // Lọc số BHYT
      if (soBhyt.trim()) {
        if (!h.soBhyt || !h.soBhyt.toLowerCase().includes(soBhyt.trim().toLowerCase())) return false;
      }

      // Lọc năm sinh
      if (namSinh.trim()) {
        const ns = String(h.namSinh || h.ngaySinh);
        if (!ns.includes(namSinh.trim())) return false;
      }

      // Lọc giới tính
      if (gioiTinh !== "-- Chọn --") {
        if (h.gioiTinh !== gioiTinh) return false;
      }

      // Lọc dân tộc
      if (danToc !== "-- Chọn --") {
        if (h.danToc && h.danToc !== danToc) return false;
      }

      return true;
    });
  }, [hoSoList, loaiHoSo, banSaoGoc, soHoSoTinh, huyen, phuong, hoTen, soBhyt, namSinh, gioiTinh, danToc]);

  // Phân trang
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRows.map((r) => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <AppShell>
      {/* 1. Tiêu đề trang chuẩn Sở LĐTBXH */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-[#333333] flex items-baseline">
          Quản lý hồ sơ
          <span className="text-sm font-normal text-[#777777] ml-2">Tìm kiếm hồ sơ</span>
        </h1>
      </div>

      {/* 2. Thanh 3 nút Tác vụ hàng đầu (Action Bar: Xanh lá, Xanh ngọc, Đỏ) */}
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
        >
          <Filter className="size-3.5" />
          {showAdvanced ? "Tìm kiếm nâng cao" : "Tìm kiếm nâng cao"}
        </button>

        <button
          type="button"
          onClick={() => exportToExcel(filteredRows)}
          className="flex items-center gap-1.5 rounded-full bg-[#00c0ef] hover:bg-[#00a7d0] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
        >
          <FileSpreadsheet className="size-3.5" />
          Xuất Excel
        </button>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-[#dd4b39] hover:bg-[#c82333] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
        >
          <Plus className="size-3.5" />
          Thêm hồ sơ
        </button>
      </div>

      <CreateProfileModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* 3. Khung Tìm kiếm nâng cao (Search Form Panel) */}
      {showAdvanced && (
        <div className="mb-4 rounded-[4px] border border-[#d2d6de] bg-white p-4 sm:p-5 shadow-xs">
          <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 text-[13px]">
            {/* Hàng 1 - Cột 1 */}
            <div className="flex items-center gap-2">
              <label className="w-40 text-right font-medium text-[#333333] shrink-0">Loại hồ sơ:</label>
              <select
                value={loaiHoSo}
                onChange={(e) => {
                  setLoaiHoSo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                {LOAI_HO_SO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Hàng 1 - Cột 2 */}
            <div className="flex items-center gap-2">
              <label className="w-36 text-right font-medium text-[#333333] shrink-0">Bản sao/ bản gốc:</label>
              <select
                value={banSaoGoc}
                onChange={(e) => {
                  setBanSaoGoc(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                <option value="-- Chọn --">-- Chọn --</option>
                <option value="Bản gốc">Bản gốc</option>
                <option value="Bản sao">Bản sao</option>
              </select>
            </div>

            {/* Hàng 2 - Cột 1: Số hồ sơ Tỉnh quản lý */}
            <div className="flex items-center gap-2">
              <label className="w-40 text-right font-medium text-[#333333] shrink-0">Số hồ sơ Tỉnh quản lý:</label>
              <input
                value={soHoSoTinh}
                onChange={(e) => {
                  setSoHoSoTinh(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>

            {/* Hàng 2 - Cột 2 (Trống theo mẫu layout) */}
            <div className="hidden sm:block" />

            {/* Hàng 3 - Cột 1: Thành phố/ Huyện */}
            <div className="flex items-center gap-2">
              <label className="w-40 text-right font-medium text-[#333333] shrink-0">Thành phố/ Huyện:</label>
              <select
                value={huyen}
                onChange={(e) => {
                  setHuyen(e.target.value);
                  setPhuong("-- Chọn --");
                  setCurrentPage(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                <option value="-- Chọn --">-- Chọn --</option>
                {HUYEN_LIST.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Hàng 3 - Cột 2: Xã/ Phường */}
            <div className="flex items-center gap-2">
              <label className="w-36 text-right font-medium text-[#333333] shrink-0">Xã/ Phường:</label>
              <select
                value={phuong}
                onChange={(e) => {
                  setPhuong(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={availablePhuongs.length === 0}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc] disabled:bg-gray-100"
              >
                <option value="-- Chọn --">-- Chọn --</option>
                {availablePhuongs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Hàng 4 - Cột 1: Họ và tên */}
            <div className="flex items-center gap-2">
              <label className="w-40 text-right font-medium text-[#333333] shrink-0">Họ và tên:</label>
              <input
                value={hoTen}
                onChange={(e) => {
                  setHoTen(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>

            {/* Hàng 4 - Cột 2: Số BHYT */}
            <div className="flex items-center gap-2">
              <label className="w-36 text-right font-medium text-[#333333] shrink-0">Số BHYT:</label>
              <input
                value={soBhyt}
                onChange={(e) => {
                  setSoBhyt(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>

            {/* Hàng 5 - Cột 1: Năm sinh */}
            <div className="flex items-center gap-2">
              <label className="w-40 text-right font-medium text-[#333333] shrink-0">Năm sinh:</label>
              <input
                value={namSinh}
                onChange={(e) => {
                  setNamSinh(e.target.value);
                  setCurrentPage(1);
                }}
                maxLength={4}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>

            {/* Hàng 5 - Cột 2: Giới tính & Dân tộc */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-1.5">
                <label className="w-16 text-right font-medium text-[#333333] shrink-0 text-[13px]">Giới tính:</label>
                <select
                  value={gioiTinh}
                  onChange={(e) => {
                    setGioiTinh(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
                >
                  <option value="-- Chọn --">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <label className="w-16 text-right font-medium text-[#333333] shrink-0 text-[13px]">Dân tộc:</label>
                <select
                  value={danToc}
                  onChange={(e) => {
                    setDanToc(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2 py-1 text-[13px] text-[#333333] outline-none focus:border-[#3c8dbc]"
                >
                  {DAN_TOC_OPTIONS.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nút Tìm kiếm đỏ đô bo tròn ở giữa chuẩn mẫu */}
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => toast.success(`Tìm kiếm hoàn tất: hiển thị ${filteredRows.length} hồ sơ`)}
              className="flex items-center gap-1.5 rounded-full bg-[#dd4b39] hover:bg-[#c82333] px-6 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Search className="size-3.5" />
              Tìm kiếm
            </button>
          </div>
        </div>
      )}

      {/* 4. Dòng đếm số lượng & Số dòng / trang */}
      <div className="mb-2 flex items-center justify-between text-xs text-[#333333]">
        <div className="font-normal">
          Tổng số: <span className="font-bold">61884</span> hồ sơ
        </div>

        <div className="flex items-center gap-2">
          <span>Số dòng / trang:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-0.5 text-xs font-sans text-[#333333] outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* 5. Bảng Dữ liệu Hồ sơ chuẩn ảnh mẫu */}
      <div className="rounded-[4px] border border-[#d2d6de] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#d2d6de] bg-white text-[#333333] font-bold">
                <th className="w-12 py-2 text-center font-bold">STT</th>
                <th className="w-10 py-2 text-center">
                  <button
                    onClick={handleSelectAll}
                    type="button"
                    className="size-4 rounded-[2px] bg-[#00c0ef] text-white inline-flex items-center justify-center cursor-pointer"
                  >
                    <Check className="size-3 stroke-[3]" />
                  </button>
                </th>
                <th className="px-3 py-2 font-bold">Họ và tên</th>
                <th className="px-3 py-2 font-bold">Loại hồ sơ</th>
                <th className="px-3 py-2 font-bold">Địa chỉ tiếp nhận</th>
                <th className="px-3 py-2 font-bold text-center">Số hồ sơ Tỉnh quản lý</th>
                <th className="w-20 px-2 py-2 text-center font-bold">Năm sinh</th>
                <th className="w-16 px-2 py-2 text-center font-bold">Giới tính</th>
                <th className="px-3 py-2 text-center font-bold">Số BHYT</th>
                <th className="px-3 py-2 text-center font-bold">Cán bộ quản lý</th>
                <th className="w-20 px-2 py-2 text-center font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {paginatedRows.map((h, idx) => {
                const stt = (currentPage - 1) * pageSize + idx + 1;
                const isChecked = selectedIds.includes(h.id);
                const isLietSi = h.loaiDoiTuong === "Thân nhân liệt sĩ";
                return (
                  <tr
                    key={h.id}
                    className="hover:bg-[#f9fafb] transition-colors text-[#333333]"
                  >
                    {/* STT */}
                    <td className="py-2 text-center font-normal text-[#555555]">{stt}</td>

                    {/* Checkbox vuông xanh lam chuẩn ảnh */}
                    <td className="py-2 text-center">
                      <button
                        onClick={() => handleToggleRow(h.id)}
                        type="button"
                        className={`size-4 rounded-[2px] inline-flex items-center justify-center transition-colors cursor-pointer ${
                          isChecked ? "bg-[#00c0ef] text-white" : "border border-[#ccc] bg-white"
                        }`}
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Họ và tên */}
                    <td className="px-3 py-2 text-[#333333] font-normal">
                      <Link
                        to="/ho-so/$id"
                        params={{ id: h.id }}
                        className="hover:text-[#dd4b39] transition-colors"
                      >
                        {h.hoTen}
                      </Link>
                    </td>

                    {/* Loại hồ sơ */}
                    <td className="px-3 py-2 text-[#333333]">{getDisplayLoaiHoSo(h.loaiDoiTuong)}</td>

                    {/* Địa chỉ tiếp nhận */}
                    <td className="px-3 py-2 text-[#333333]">
                      {h.diaChiTiepNhan || `${h.phuong} - ${h.huyen || "TP. Thủ Dầu Một"}`}
                    </td>

                    {/* Số hồ sơ Tỉnh quản lý */}
                    <td className="px-3 py-2 text-center text-[#333333]">
                      {h.soHoSoTinh || h.id}
                    </td>

                    {/* Năm sinh (để trống nếu là hồ sơ liệt sĩ theo ảnh) */}
                    <td className="px-2 py-2 text-center text-[#333333]">
                      {isLietSi ? "" : h.namSinh || (h.ngaySinh ? h.ngaySinh.split("/").pop() : "")}
                    </td>

                    {/* Giới tính */}
                    <td className="px-2 py-2 text-center text-[#333333]">{h.gioiTinh}</td>

                    {/* Số BHYT (để trống nếu là liệt sĩ theo ảnh) */}
                    <td className="px-3 py-2 text-center text-[#333333]">
                      {isLietSi ? "" : h.soBhyt || ""}
                    </td>

                    {/* Cán bộ quản lý */}
                    <td className="px-3 py-2 text-center text-[#333333]">
                      {h.canBoQuanLy || "admin"}
                    </td>

                    {/* Thao tác: Nút xem, chỉnh sửa & In Giấy hẹn tiếp nhận có mã QR */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedGiayHenHoSo(h)}
                          title="In Giấy tiếp nhận hồ sơ & Hẹn trả kết quả (kèm Mã QR Đánh giá)"
                          className="size-6 rounded-[2px] bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Printer className="size-3.5" />
                        </button>
                        <Link
                          to="/ho-so/$id"
                          params={{ id: h.id }}
                          title="Xem chi tiết"
                          className="size-6 rounded-[2px] bg-[#00c0ef] hover:bg-[#00a7d0] text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <FileText className="size-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toast.info(`Mở cập nhật thông tin hồ sơ ${h.id}`)}
                          title="Chỉnh sửa"
                          className="size-6 rounded-[2px] bg-[#f39c12] hover:bg-[#e08e0b] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Edit className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-[#888888]">
                    Không tìm thấy bản ghi hồ sơ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang dưới bảng */}
        <div className="flex items-center justify-between border-t border-[#d2d6de] bg-white px-4 py-2.5 text-xs text-[#555555]">
          <div>
            Trang {currentPage} / {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs text-[#555555] hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`size-6 rounded-[2px] text-xs font-semibold ${
                  currentPage === i + 1
                    ? "bg-[#00c0ef] text-white"
                    : "border border-[#d2d6de] bg-white text-[#555555] hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs text-[#555555] hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Giấy tiếp nhận hồ sơ và Hẹn trả kết quả (kèm mã QR) */}
      {selectedGiayHenHoSo && (
        <GiayHenModal
          hoSo={selectedGiayHenHoSo}
          onClose={() => setSelectedGiayHenHoSo(null)}
        />
      )}
    </AppShell>
  );
}
