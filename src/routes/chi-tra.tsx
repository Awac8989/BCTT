import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Zap,
  CheckCircle2,
  Clock,
  Building2,
  CreditCard,
  Printer,
  Search,
  AlertTriangle,
  Send,
  FileCheck,
  Check,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAppState, appStore, type ChiTraItem } from "@/services/app-state";
import { PhieuChiModal } from "@/components/PhieuChiModal";
import { HUYEN_LIST } from "@/data/mock";

export const Route = createFileRoute("/chi-tra")({
  head: () => ({
    meta: [
      { title: "Quản lý chi trả & Phát tiền trợ cấp · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Cổng quản lý chi trả trợ cấp ưu đãi người có công tỉnh Bình Dương: lập bảng kê C70a-HD, phát tiền qua tài khoản ngân hàng (Đề án 06) và bưu điện VNPost.",
      },
      { property: "og:title", content: "Chi trả trợ cấp Người có công · SLĐTBXH Bình Dương" },
    ],
  }),
  component: ChiTraPage,
});

function exportChiTraExcel(data: ChiTraItem[], ky: string) {
  if (data.length === 0) {
    toast.error("Không có dữ liệu để xuất bảng kê!");
    return;
  }

  const headers = [
    "STT",
    "Mã giao dịch",
    "Số hồ sơ Tỉnh",
    "Họ và tên người nhận",
    "CCCD",
    "Loại đối tượng",
    "Nội dung chế độ",
    "Số tiền (VNĐ)",
    "Kênh chi trả",
    "Thông tin tài khoản / Điểm chi",
    "Địa bàn (Phường - Huyện)",
    "Trạng thái",
    "Ngày chi trả",
  ];

  const rows = data.map((item, idx) => [
    idx + 1,
    `"${item.maGiaoDich || ""}"`,
    `"${item.soHoSoTinh}"`,
    `"${item.hoTen}"`,
    `"${item.cccd || ""}"`,
    `"${item.loaiDoiTuong}"`,
    `"${item.tenCheDo}"`,
    item.soTien,
    item.hinhThuc === "NGAN_HANG" ? "Tài khoản Ngân hàng" : "Bưu điện tiền mặt",
    `"${item.thongTinChiTra} ${item.soTaiKhoan ? `(STK: ${item.soTaiKhoan})` : ""}"`,
    `"${item.phuong} - ${item.huyen}"`,
    item.trangThai === "ĐÃ_CHI_TRẢ" ? "Đã phát tiền" : "Chưa nhận",
    item.ngayChiTra || "",
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Bang_ke_chi_tra_C70aHD_Ky_${ky.replace("/", "-")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success(`Đã xuất ${data.length} bản ghi chi trả kỳ ${ky} ra file Excel!`);
}

function ChiTraPage() {
  const { chiTraList } = useAppState();

  // Bộ lọc
  const [kyChiTra, setKyChiTra] = useState("09/2026");
  const [loaiCheDo, setLoaiCheDo] = useState("ALL");
  const [hinhThuc, setHinhThuc] = useState("ALL");
  const [huyen, setHuyen] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Quản lý modal phiếu chi
  const [selectedItemForModal, setSelectedItemForModal] = useState<ChiTraItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chọn dòng để phát tiền hàng loạt
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dữ liệu sau khi lọc
  const filteredData = useMemo(() => {
    return chiTraList.filter((item) => {
      // Lọc kỳ
      if (item.kyChiTra !== kyChiTra) return false;

      // Lọc chế độ
      if (loaiCheDo !== "ALL" && item.loaiCheDo !== loaiCheDo) return false;

      // Lọc hình thức
      if (hinhThuc !== "ALL" && item.hinhThuc !== hinhThuc) return false;

      // Lọc huyện
      if (huyen !== "ALL" && item.huyen !== huyen) return false;

      // Tìm kiếm text
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = item.hoTen.toLowerCase().includes(q);
        const matchCode = item.soHoSoTinh.toLowerCase().includes(q);
        const matchCccd = item.cccd?.includes(q);
        if (!matchName && !matchCode && !matchCccd) return false;
      }

      return true;
    });
  }, [chiTraList, kyChiTra, loaiCheDo, hinhThuc, huyen, searchQuery]);

  // Thống kê ngân sách
  const stats = useMemo(() => {
    const tongKinhPhi = filteredData.reduce((s, r) => s + r.soTien, 0);
    const daPhatTien = filteredData.filter((r) => r.trangThai === "ĐÃ_CHI_TRẢ");
    const tongDaPhat = daPhatTien.reduce((s, r) => s + r.soTien, 0);
    const chuaPhatTien = filteredData.filter((r) => r.trangThai !== "ĐÃ_CHI_TRẢ");
    const tongChuaPhat = chuaPhatTien.reduce((s, r) => s + r.soTien, 0);
    const quaNganHang = filteredData.filter((r) => r.hinhThuc === "NGAN_HANG");
    const tyLeNganHang = filteredData.length > 0 ? Math.round((quaNganHang.length / filteredData.length) * 100) : 0;
    const tyLeGiaiNgan = tongKinhPhi > 0 ? Math.round((tongDaPhat / tongKinhPhi) * 100) : 0;

    return {
      tongKinhPhi,
      tongDaPhat,
      tongChuaPhat,
      soDaPhat: daPhatTien.length,
      soChuaPhat: chuaPhatTien.length,
      tyLeNganHang,
      tyLeGiaiNgan,
    };
  }, [filteredData]);

  // Thao tác phát tiền đơn lẻ
  const handlePhatTienDonLe = (item: ChiTraItem) => {
    const res = appStore.thucHienChiTra(item.id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  // Thao tác phát tiền hàng loạt qua Ngân hàng
  const handlePhatTienHangLoatNganHang = () => {
    const idsToPay = filteredData
      .filter((r) => r.hinhThuc === "NGAN_HANG" && r.trangThai !== "ĐÃ_CHI_TRẢ")
      .map((r) => r.id);

    if (idsToPay.length === 0) {
      toast.info("Tất cả các đối tượng qua ngân hàng trong danh sách này đã được chi trả!");
      return;
    }

    const res = appStore.phatTienHangLoat(idsToPay);
    if (res.success) {
      toast.success(res.message);
    }
  };

  // Chọn tất cả
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Mở phiếu chi
  const handleOpenPhieuChi = (item: ChiTraItem) => {
    setSelectedItemForModal(item);
    setIsModalOpen(true);
  };

  return (
    <AppShell>
      {/* 1. Tiêu đề chuẩn Cổng Sở LĐTBXH */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-[#333333] flex items-baseline">
          Quản lý chi trả &amp; Phát tiền trợ cấp
          <span className="text-sm font-normal text-[#777777] ml-2">
            Chế độ ưu đãi Thương binh, Liệt sĩ &amp; Thân nhân
          </span>
        </h1>
      </div>

      {/* 2. Thanh nút tác vụ hàng đầu (Action Bar) */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút phát tiền ngân hàng tự động */}
          <button
            type="button"
            onClick={handlePhatTienHangLoatNganHang}
            className="flex items-center gap-1.5 rounded-full bg-[#dd4b39] hover:bg-[#c82333] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Zap className="size-3.5" />
            Phát tiền Ngân hàng tự động (Đề án 06)
          </button>

          {/* Nút xuất bảng kê Excel C70a-HD */}
          <button
            type="button"
            onClick={() => exportChiTraExcel(filteredData, kyChiTra)}
            className="flex items-center gap-1.5 rounded-full bg-[#00c0ef] hover:bg-[#00a7d0] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5" />
            Xuất Bảng kê C70a-HD (.csv)
          </button>

          {/* Nút lập danh sách phát tiền bưu điện */}
          <button
            type="button"
            onClick={() => {
              setHinhThuc("BUU_DIEN");
              toast.info("Đã lọc danh sách chi trả tiền mặt qua Bưu điện VNPost");
            }}
            className="flex items-center gap-1.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Building2 className="size-3.5" />
            Danh sách Bưu điện VNPost
          </button>
        </div>

        {/* Kỳ chi trả hiện thời */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-[#555555]">Kỳ chi trả:</span>
          <select
            value={kyChiTra}
            onChange={(e) => setKyChiTra(e.target.value)}
            className="rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs font-bold text-[#dd4b39] outline-none"
          >
            <option value="09/2026">Tháng 09/2026 (Hiện tại)</option>
            <option value="08/2026">Tháng 08/2026</option>
            <option value="07/2026">Tháng 07/2026 (Dịp 27/7)</option>
          </select>
        </div>
      </div>

      {/* 3. Bốn thẻ Thống kê Ngân sách & Tiến độ phát tiền (KPI Summary Cards) */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-[#333333]">
        {/* Card 1: Tổng kinh phí */}
        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase tracking-tight">Tổng kinh phí kỳ này</span>
            <CreditCard className="size-4 text-[#00c0ef]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#333333]">
            {stats.tongKinhPhi.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-normal text-[#777777]">đ</span>
          </div>
          <div className="mt-1 text-[11px] text-[#777777]">
            Quy mô: <strong>{filteredData.length}</strong> đối tượng người có công
          </div>
        </div>

        {/* Card 2: Đã phát tiền thành công */}
        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs border-l-4 border-l-[#00a65a]">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase tracking-tight">Đã phát tiền thành công</span>
            <CheckCircle2 className="size-4 text-[#00a65a]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#00a65a]">
            {stats.tongDaPhat.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-normal text-[#777777]">đ</span>
          </div>
          <div className="mt-1 text-[11px] text-[#00a65a] font-medium">
            Đã nhận: {stats.soDaPhat} người ({stats.tyLeGiaiNgan}% ngân sách)
          </div>
        </div>

        {/* Card 3: Đang chờ phát tiền */}
        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs border-l-4 border-l-[#f39c12]">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase tracking-tight">Chờ phát tiền / Bưu điện</span>
            <Clock className="size-4 text-[#f39c12]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#f39c12]">
            {stats.tongChuaPhat.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-normal text-[#777777]">đ</span>
          </div>
          <div className="mt-1 text-[11px] text-[#f39c12] font-medium">
            Còn lại: {stats.soChuaPhat} đối tượng đang chi trả
          </div>
        </div>

        {/* Card 4: Tỷ lệ không dùng tiền mặt */}
        <div className="rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs border-l-4 border-l-[#00c0ef]">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span className="font-medium uppercase tracking-tight">Tài khoản ATM (Đề án 06)</span>
            <Building2 className="size-4 text-[#00c0ef]" />
          </div>
          <div className="mt-1.5 font-mono text-xl font-extrabold text-[#00c0ef]">
            {stats.tyLeNganHang}%{" "}
            <span className="text-xs font-normal text-[#777777]">không dùng tiền mặt</span>
          </div>
          <div className="mt-1 text-[11px] text-[#777777]">
            Mục tiêu: Đạt 100% trong năm 2026
          </div>
        </div>
      </div>

      {/* 4. Khung Bộ lọc Tìm kiếm (Search Filter Card) */}
      <div className="mb-4 rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-4 text-[13px]">
          {/* Lọc chế độ */}
          <div>
            <label className="mb-1 block font-medium text-[#444444] text-xs">Loại chế độ trợ cấp:</label>
            <select
              value={loaiCheDo}
              onChange={(e) => setLoaiCheDo(e.target.value)}
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs text-[#333333] outline-none"
            >
              <option value="ALL">-- Tất cả chế độ chi trả --</option>
              <option value="HÀNG_THÁNG">Trợ cấp hàng tháng (Thương binh, Liệt sĩ, Mẹ VNAH)</option>
              <option value="THỜ_CÚNG_LIỆT_SĨ">Trợ cấp thờ cúng liệt sĩ (1.400.000đ)</option>
              <option value="ĐIỀU_DƯỠNG">Trợ cấp điều dưỡng phục hồi sức khỏe</option>
              <option value="MỘT_LẦN">Trợ cấp một lần &amp; Mai táng phí</option>
            </select>
          </div>

          {/* Lọc hình thức */}
          <div>
            <label className="mb-1 block font-medium text-[#444444] text-xs">Hình thức phát tiền:</label>
            <select
              value={hinhThuc}
              onChange={(e) => setHinhThuc(e.target.value)}
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs text-[#333333] outline-none"
            >
              <option value="ALL">-- Tất cả kênh chi trả --</option>
              <option value="NGAN_HANG">Tài khoản Ngân hàng (Đề án 06)</option>
              <option value="BUU_DIEN">Bưu điện VNPost (Tiền mặt / Tận nhà)</option>
            </select>
          </div>

          {/* Lọc địa bàn */}
          <div>
            <label className="mb-1 block font-medium text-[#444444] text-xs">Thành phố / Huyện:</label>
            <select
              value={huyen}
              onChange={(e) => setHuyen(e.target.value)}
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs text-[#333333] outline-none"
            >
              <option value="ALL">-- Toàn tỉnh Bình Dương --</option>
              {HUYEN_LIST.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Tìm kiếm */}
          <div>
            <label className="mb-1 block font-medium text-[#444444] text-xs">Tìm theo Tên / Số hồ sơ / CCCD:</label>
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên hoặc BD/..."
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white pl-7 pr-2.5 py-1 text-xs text-[#333333] outline-none"
              />
              <Search className="size-3.5 absolute left-2 top-2 text-[#888888]" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bảng kê chi tiết phát tiền trợ cấp Người có công */}
      <div className="rounded-[4px] border border-[#d2d6de] bg-white shadow-xs overflow-hidden">
        {/* Header trên bảng */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#d2d6de] bg-[#fbfcfd] px-4 py-2.5 text-xs text-[#444444]">
          <div className="font-medium">
            Danh sách phát tiền kỳ <strong>{kyChiTra}</strong> (Tổng cộng <strong>{filteredData.length}</strong> bản ghi)
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#dd4b39] font-bold">Đã chọn {selectedIds.length} dòng</span>
              <button
                type="button"
                onClick={() => {
                  const res = appStore.phatTienHangLoat(selectedIds);
                  if (res.success) {
                    toast.success(res.message);
                    setSelectedIds([]);
                  }
                }}
                className="rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-3 py-1 text-xs font-bold text-white shadow-xs"
              >
                Xác nhận phát tiền cho các dòng đã chọn
              </button>
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#d2d6de] bg-white text-[#333333] font-bold">
                <th className="w-10 py-2 text-center">STT</th>
                <th className="w-8 py-2 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="size-4 rounded-[2px] bg-[#00c0ef] text-white inline-flex items-center justify-center cursor-pointer"
                  >
                    <Check className="size-3 stroke-[3]" />
                  </button>
                </th>
                <th className="px-3 py-2 font-bold">Số hồ sơ</th>
                <th className="px-3 py-2 font-bold">Họ và tên người nhận</th>
                <th className="px-3 py-2 font-bold">Chế độ &amp; Nội dung</th>
                <th className="px-3 py-2 font-bold">Địa chỉ</th>
                <th className="px-3 py-2 font-bold">Kênh &amp; Thông tin phát</th>
                <th className="px-3 py-2 font-bold text-right">Số tiền thực lĩnh</th>
                <th className="px-3 py-2 font-bold text-center">Trạng thái</th>
                <th className="px-3 py-2 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4] text-[#333333]">
              {filteredData.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const isDaPhat = item.trangThai === "ĐÃ_CHI_TRẢ";
                return (
                  <tr key={item.id} className="hover:bg-[#f9fafb] transition-colors">
                    {/* STT */}
                    <td className="py-2.5 text-center text-[#666666] font-mono text-xs">{idx + 1}</td>

                    {/* Checkbox */}
                    <td className="py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectRow(item.id)}
                        className={`size-4 rounded-[2px] inline-flex items-center justify-center transition-colors cursor-pointer ${
                          isSelected ? "bg-[#00c0ef] text-white" : "border border-[#ccc] bg-white"
                        }`}
                      >
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Số hồ sơ */}
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-[#dd4b39]">
                      {item.soHoSoTinh}
                    </td>

                    {/* Họ và tên */}
                    <td className="px-3 py-2.5 font-medium">
                      <div>{item.hoTen}</div>
                      <div className="text-[11px] text-[#777777] font-mono">CCCD: {item.cccd}</div>
                    </td>

                    {/* Chế độ & Nội dung */}
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-xs">{item.tenCheDo}</div>
                      <div className="text-[11px] text-[#666666]">{item.loaiDoiTuong}</div>
                    </td>

                    {/* Địa chỉ */}
                    <td className="px-3 py-2.5 text-xs text-[#555555]">
                      {item.phuong} - {item.huyen}
                    </td>

                    {/* Kênh & Thông tin phát */}
                    <td className="px-3 py-2.5 text-xs">
                      <div className="flex items-center gap-1 font-medium">
                        {item.hinhThuc === "NGAN_HANG" ? (
                          <span className="text-[#00c0ef] font-semibold">Tài khoản ATM</span>
                        ) : (
                          <span className="text-[#f39c12] font-semibold">Bưu điện VNPost</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#666666] font-mono">
                        {item.thongTinChiTra} {item.soTaiKhoan ? `(${item.soTaiKhoan})` : ""}
                      </div>
                    </td>

                    {/* Số tiền thực lĩnh */}
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-[#dd4b39]">
                      {item.soTien.toLocaleString("vi-VN")} <span className="text-[10px] text-[#777777]">đ</span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-3 py-2.5 text-center">
                      {isDaPhat ? (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Đã phát tiền
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                          <Clock className="size-3 text-amber-600" />
                          Chờ phát tiền
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {!isDaPhat ? (
                          <button
                            type="button"
                            onClick={() => handlePhatTienDonLe(item)}
                            title="Xác nhận phát tiền"
                            className="rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-2 py-1 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                          >
                            Phát tiền
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#666666] font-mono">
                            {item.ngayChiTra?.slice(0, 5)}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenPhieuChi(item)}
                          title="In Giấy lĩnh tiền C70a-HD"
                          className="size-6 rounded-[2px] bg-[#00c0ef] hover:bg-[#00a7d0] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Printer className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#888888]">
                    Không tìm thấy bản ghi chi trả nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Hộp Thông báo Đối Soát & Kiểm soát Rủi ro Ngân sách (Audit Risk Box) */}
      <div className="mt-4 rounded-[4px] border border-[#f39c12]/30 bg-[#f39c12]/5 p-4 text-xs text-[#333333]">
        <div className="flex items-center gap-2 font-bold text-[#b45309] uppercase">
          <AlertTriangle className="size-4 text-[#d97706]" />
          Kiểm soát rủi ro &amp; Đối soát dữ liệu chi trả tự động
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3 text-[12px] leading-relaxed">
          <div className="rounded bg-white p-2.5 border border-[#e5e7eb]">
            <div className="font-semibold text-[#333333]">1. Đối tượng con liệt sĩ &gt; 18 tuổi</div>
            <div className="text-[11px] text-[#666666] mt-0.5">
              Tất cả 03 trường hợp đang hưởng trợ cấp tuất con liệt sĩ đã được xác minh giấy xác nhận đang học đại học/nghề còn hiệu lực.
            </div>
          </div>

          <div className="rounded bg-white p-2.5 border border-[#e5e7eb]">
            <div className="font-semibold text-[#333333]">2. Bưu tá phát tận nhà (Cao tuổi &gt; 80 tuổi)</div>
            <div className="text-[11px] text-[#666666] mt-0.5">
              Đã điều phối 02 trường hợp thương binh nặng và Mẹ VNAH (Lê Thị Mai) để bưu tá chi trả tận nhà vào ngày 06/09/2026.
            </div>
          </div>

          <div className="rounded bg-white p-2.5 border border-[#e5e7eb]">
            <div className="font-semibold text-[#333333]">3. Khớp nối tài khoản ngân hàng VNeID</div>
            <div className="text-[11px] text-[#666666] mt-0.5">
              100% tài khoản nhận tiền tại Vietcombank, BIDV, Agribank đều đã đối soát định danh trùng khớp số CCCD 12 số.
            </div>
          </div>
        </div>
      </div>

      {/* Modal Phiếu chi C70a-HD */}
      <PhieuChiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItemForModal}
      />
    </AppShell>
  );
}
