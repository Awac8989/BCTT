import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Accessibility,
  Plus,
  Filter,
  Search,
  FileSpreadsheet,
  Printer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore } from "@/services/app-state";
import { formatVND, HUYEN_LIST, type DungCuChinhHinhItem } from "@/data/mock";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";

export const Route = createFileRoute("/dung-cu-chinh-hinh")({
  head: () => ({
    meta: [
      {
        title:
          "Quản lý cấp phương tiện trợ giúp & dụng cụ chỉnh hình · SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Theo dõi niên hạn và cấp mới chân tay giả, xe lăn, máy trợ thính cho thương binh và người có công tỉnh Bình Dương theo Nghị định 131/2021/NĐ-CP.",
      },
    ],
  }),
  component: DungCuChinhHinhPage,
});

function exportExcelDungCu(data: DungCuChinhHinhItem[]) {
  if (data.length === 0) {
    toast.error("Không có dữ liệu để xuất!");
    return;
  }
  const headers = [
    "STT",
    "Mã quản lý",
    "Họ và tên",
    "CCCD",
    "Đối tượng",
    "Địa bàn",
    "Tên dụng cụ",
    "Niên hạn (Năm)",
    "Năm cấp gần nhất",
    "Năm đến hạn cấp mới",
    "Định mức tiền (VNĐ)",
    "Bồi dưỡng phục hồi",
    "Trạng thái",
  ];

  const rows = data.map((d, idx) => [
    idx + 1,
    `"${d.soHoSoTinh}"`,
    `"${d.hoTen}"`,
    `"${d.cccd}"`,
    `"${d.loaiDoiTuong}"`,
    `"${d.phuong} - ${d.huyen}"`,
    `"${d.tenDungCu}"`,
    d.nienHanNam,
    d.namCapGanNhat,
    d.namDenHanCapMoi,
    d.dinhMucTien,
    d.tienBoiDuongPhucHoi,
    d.trangThai === "ĐẾN_HẠN_CẤP_MỚI" ? "Đến hạn cấp mới" : d.trangThai === "ĐÃ_CẤP" ? "Đã cấp" : "Chờ duyệt",
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Danh_sach_dung_cu_chinh_hinh_SLDTBXH_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Đã xuất ${data.length} bản ghi ra file Excel!`);
}

function DungCuChinhHinhPage() {
  const { dungCuChinhHinhList, hoSoList } = useAppState();

  // Bộ lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLoai, setFilterLoai] = useState("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  // Modal cấp mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHoSoId, setSelectedHoSoId] = useState(hoSoList[0]?.id || "");
  const [tenDungCu, setTenDungCu] = useState("Chân giả dưới gối (loại tiêu chuẩn)");
  const [loaiDungCu, setLoaiDungCu] = useState<any>("CHÂN_GIẢ");
  const [nienHanNam, setNienHanNam] = useState(3);
  const [dinhMucTien, setDinhMucTien] = useState(6500000);
  const [tienBoiDuong, setTienBoiDuong] = useState(1200000);

  // In phiếu cấp
  const [printItem, setPrintItem] = useState<DungCuChinhHinhItem | null>(null);

  // Thống kê KPI
  const stats = useMemo(() => {
    const total = dungCuChinhHinhList.length;
    const denHan = dungCuChinhHinhList.filter((d) => d.trangThai === "ĐẾN_HẠN_CẤP_MỚI").length;
    const daCap = dungCuChinhHinhList.filter((d) => d.trangThai === "ĐÃ_CẤP").length;
    const tongKinhPhi = dungCuChinhHinhList.reduce(
      (sum, d) => sum + d.dinhMucTien + d.tienBoiDuongPhucHoi,
      0
    );
    return { total, denHan, daCap, tongKinhPhi };
  }, [dungCuChinhHinhList]);

  // Lọc danh sách
  const filteredList = useMemo(() => {
    return dungCuChinhHinhList.filter((item) => {
      if (filterLoai !== "ALL" && item.loaiDungCu !== filterLoai) return false;
      if (filterTrangThai !== "ALL" && item.trangThai !== filterTrangThai) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.hoTen.toLowerCase().includes(q) ||
          item.soHoSoTinh.toLowerCase().includes(q) ||
          item.cccd.includes(q) ||
          item.tenDungCu.toLowerCase().includes(q) ||
          item.phuong.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dungCuChinhHinhList, filterLoai, filterTrangThai, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hs = hoSoList.find((h) => h.id === selectedHoSoId);
    if (!hs) {
      toast.error("Vui lòng chọn hồ sơ người có công!");
      return;
    }

    appStore.capDungCuChinhHinh({
      hoSoId: hs.id,
      soHoSoTinh: hs.soHoSoTinh || hs.id,
      hoTen: hs.hoTen,
      cccd: hs.cccd,
      loaiDoiTuong: hs.loaiDoiTuong,
      phuong: hs.phuong,
      huyen: hs.huyen || "TP. Thủ Dầu Một",
      tenDungCu,
      loaiDungCu,
      nienHanNam,
      dinhMucTien,
      tienBoiDuongPhucHoi: tienBoiDuong,
    });

    toast.success(`Đã lập hồ sơ và cấp ${tenDungCu} cho đối tượng ${hs.hoTen}!`);
    setShowCreateModal(false);
  };

  const handleGiaHanQuick = (item: DungCuChinhHinhItem) => {
    appStore.capDungCuChinhHinh({
      id: item.id,
      hoSoId: item.hoSoId,
      soHoSoTinh: item.soHoSoTinh,
      hoTen: item.hoTen,
      cccd: item.cccd,
      loaiDoiTuong: item.loaiDoiTuong,
      phuong: item.phuong,
      huyen: item.huyen,
      tenDungCu: item.tenDungCu,
      loaiDungCu: item.loaiDungCu,
      nienHanNam: item.nienHanNam,
      dinhMucTien: item.dinhMucTien,
      tienBoiDuongPhucHoi: item.tienBoiDuongPhucHoi,
    });
    toast.success(`Đã gia hạn cấp mới niên hạn cho ${item.hoTen}!`);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 4 · Pháp lệnh Ưu đãi người có công (NĐ 131/2021/NĐ-CP)"
        title="Quản lý phương tiện trợ giúp & Dụng cụ chỉnh hình"
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportExcelDungCu(filteredList)}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-300 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileSpreadsheet className="size-3.5 text-emerald-600" />
              Xuất Excel
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 bg-[#dd4b39] hover:bg-[#c82333] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              Lập hồ sơ cấp dụng cụ mới
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* KPI Thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium">Tổng đối tượng quản lý</div>
              <div className="text-2xl font-extrabold text-gray-900 font-mono mt-0.5">
                {stats.total}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Chân tay giả, xe lăn, trợ thính</div>
            </div>
            <div className="size-11 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#3c8dbc]">
              <Accessibility className="size-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-red-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-red-600 font-semibold">Đến niên hạn cấp mới (2026)</div>
              <div className="text-2xl font-extrabold text-red-600 font-mono mt-0.5">
                {stats.denHan} trường hợp
              </div>
              <div className="text-[11px] text-red-700/80 mt-1 font-medium">
                Cần lập danh sách trình phê duyệt
              </div>
            </div>
            <div className="size-11 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertTriangle className="size-6 animate-pulse" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-700 font-medium">Đã cấp & Đang sử dụng</div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-0.5">
                {stats.daCap}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">Trong thời hạn bảo đảm</div>
            </div>
            <div className="size-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium">Tổng kinh phí phân bổ</div>
              <div className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">
                {formatVND(stats.tongKinhPhi)}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Kèm tiền bồi dưỡng phục hồi</div>
            </div>
            <div className="size-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Award className="size-6" />
            </div>
          </div>
        </div>

        {/* Thanh lọc & tìm kiếm */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <div className="relative w-full max-w-md">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên thương binh, CCCD, số hồ sơ, tên dụng cụ, phường..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:border-[#3c8dbc] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-semibold">Loại dụng cụ:</span>
              <select
                value={filterLoai}
                onChange={(e) => setFilterLoai(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1 text-xs focus:border-[#3c8dbc] focus:outline-none"
              >
                <option value="ALL">-- Tất cả loại --</option>
                <option value="CHÂN_GIẢ">Chân giả các loại</option>
                <option value="TAY_GIẢ">Tay giả các loại</option>
                <option value="XE_LĂN">Xe lăn tiêu chuẩn</option>
                <option value="XE_LẮC">Xe lắc 3 bánh</option>
                <option value="MÁY_TRỢ_THÍNH">Máy trợ thính</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-semibold">Trạng thái niên hạn:</span>
              <select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1 text-xs focus:border-[#3c8dbc] focus:outline-none"
              >
                <option value="ALL">-- Tất cả trạng thái --</option>
                <option value="ĐẾN_HẠN_CẤP_MỚI">Đến hạn cấp mới (Cần cấp)</option>
                <option value="ĐÃ_CẤP">Đã cấp hợp lệ</option>
                <option value="CHỜ_DUYỆT_CẤP">Chờ duyệt cấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f4f6f9] text-gray-700 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3 text-center w-10">STT</th>
                  <th className="p-3">Hồ sơ người có công</th>
                  <th className="p-3">Dụng cụ trang cấp</th>
                  <th className="p-3 text-center">Niên hạn</th>
                  <th className="p-3 text-center">Năm cấp gần nhất</th>
                  <th className="p-3 text-center">Hạn cấp mới</th>
                  <th className="p-3 text-right">Định mức & Phục hồi</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      Không tìm thấy bản ghi cấp phương tiện trợ giúp nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item, idx) => {
                    const isOverdue = item.trangThai === "ĐẾN_HẠN_CẤP_MỚI";
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3 text-center font-mono text-gray-500">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900 text-sm">{item.hoTen}</div>
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                            {item.soHoSoTinh} · CCCD: {item.cccd}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            {item.phuong}, {item.huyen} ·{" "}
                            <span className="text-[#3c8dbc] font-medium">
                              {item.loaiDoiTuong}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-800">{item.tenDungCu}</div>
                          <div className="text-[11px] text-gray-500">
                            Nhóm: <strong className="text-gray-700">{item.loaiDungCu}</strong>
                          </div>
                          {item.soQuyetDinhCap && (
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              Số QĐ: {item.soQuyetDinhCap}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-gray-700">
                          {item.nienHanNam} năm
                        </td>
                        <td className="p-3 text-center font-mono text-gray-600">
                          {item.namCapGanNhat}
                        </td>
                        <td className="p-3 text-center font-mono">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-xs ${
                              isOverdue
                                ? "bg-red-100 text-red-700 animate-pulse border border-red-300"
                                : "text-gray-700"
                            }`}
                          >
                            {item.namDenHanCapMoi}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">
                          <div className="font-bold text-gray-900">
                            {formatVND(item.dinhMucTien)}
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            +{formatVND(item.tienBoiDuongPhucHoi)} phục hồi
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {isOverdue ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                              Đến hạn cấp mới
                            </span>
                          ) : item.trangThai === "ĐÃ_CẤP" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Đang sử dụng
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Chờ duyệt cấp
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isOverdue && (
                              <button
                                type="button"
                                onClick={() => handleGiaHanQuick(item)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
                              >
                                Cấp mới ngay
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setPrintItem(item)}
                              className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <Printer className="size-3 text-[#3c8dbc]" />
                              Phiếu cấp
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Lập hồ sơ cấp dụng cụ mới */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full border border-gray-300 overflow-hidden my-6">
              <div className="bg-[#dd4b39] text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Accessibility className="size-5" />
                  <h3 className="font-bold text-sm uppercase">
                    Lập hồ sơ cấp phương tiện trợ giúp & Dụng cụ chỉnh hình
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Chọn đối tượng Người có công <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedHoSoId}
                    onChange={(e) => setSelectedHoSoId(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-[#dd4b39] focus:outline-none"
                    required
                  >
                    {hoSoList.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.hoTen} ({h.soHoSoTinh || h.id}) - {h.loaiDoiTuong} - {h.phuong}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nhóm dụng cụ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={loaiDungCu}
                      onChange={(e) => setLoaiDungCu(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-[#dd4b39] focus:outline-none"
                    >
                      <option value="CHÂN_GIẢ">Chân giả</option>
                      <option value="TAY_GIẢ">Tay giả</option>
                      <option value="XE_LĂN">Xe lăn</option>
                      <option value="XE_LẮC">Xe lắc 3 bánh</option>
                      <option value="MÁY_TRỢ_THÍNH">Máy trợ thính</option>
                      <option value="KHÁC">Khác (Giày nẹp, kính râm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Niên hạn sử dụng <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={nienHanNam}
                      onChange={(e) => setNienHanNam(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-[#dd4b39] focus:outline-none"
                    >
                      <option value={3}>3 năm (Chân giả, máy trợ thính, kính)</option>
                      <option value={5}>5 năm (Xe lăn, xe lắc 3 bánh)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Tên chi tiết phương tiện / Dụng cụ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tenDungCu}
                    onChange={(e) => setTenDungCu(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-[#dd4b39] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Định mức tiền mua dụng cụ (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={dinhMucTien}
                      onChange={(e) => setDinhMucTien(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-mono focus:border-[#dd4b39] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Tiền bồi dưỡng phục hồi chức năng (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={tienBoiDuong}
                      onChange={(e) => setTienBoiDuong(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-mono focus:border-[#dd4b39] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-[11px] text-gray-600">
                  Tổng kinh phí cấp duyệt:{" "}
                  <strong className="text-red-600 font-bold text-xs">
                    {formatVND(dinhMucTien + tienBoiDuong)}
                  </strong>
                  . Hạn cấp mới tiếp theo:{" "}
                  <strong>Năm {new Date().getFullYear() + nienHanNam}</strong>.
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#dd4b39] hover:bg-[#c82333] text-white rounded font-bold text-xs shadow-xs"
                  >
                    Lập quyết định cấp ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Xem & In Phiếu Cấp Dụng Cụ */}
        {printItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 overflow-hidden my-6">
              <div className="bg-[#3c8dbc] text-white px-5 py-3 flex items-center justify-between">
                <div className="font-bold text-sm uppercase flex items-center gap-2">
                  <Printer className="size-4" />
                  Phiếu cấp phương tiện trợ giúp & Dụng cụ chỉnh hình
                </div>
                <button
                  onClick={() => setPrintItem(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-8 text-xs font-serif leading-relaxed text-[#222]">
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-3 mb-5 font-sans">
                  <div>
                    <div className="text-[11px] font-bold uppercase">ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG</div>
                    <div className="text-[11px] font-bold">SỞ LAO ĐỘNG - TB&XH</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Số: {printItem.soQuyetDinhCap || "QĐ-SLĐTBXH/2026-DC"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="text-[11px] font-bold underline">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="text-[10px] italic text-gray-500 mt-0.5">Thủ Dầu Một, ngày {new Date().toLocaleDateString("vi-VN")}</div>
                  </div>
                </div>

                <div className="text-center my-4 font-sans">
                  <h3 className="text-base font-bold uppercase">PHIẾU CẤP PHƯƠNG TIỆN TRỢ GIÚP & DỤNG CỤ CHỈNH HÌNH</h3>
                  <p className="text-[11px] italic text-gray-600">(Theo Nghị định số 131/2021/NĐ-CP ngày 30/12/2021 của Chính phủ)</p>
                </div>

                <div className="space-y-2 mt-4">
                  <p>1. Họ và tên người được cấp: <strong>{printItem.hoTen}</strong></p>
                  <p>2. Số CCCD: <strong>{printItem.cccd}</strong> · Số hồ sơ Tỉnh quản lý: <strong>{printItem.soHoSoTinh}</strong></p>
                  <p>3. Thuộc diện: <strong>{printItem.loaiDoiTuong}</strong> · Cư trú tại: {printItem.phuong}, {printItem.huyen}</p>
                  <p>4. Tên phương tiện / Dụng cụ trang cấp: <strong>{printItem.tenDungCu}</strong> ({printItem.loaiDungCu})</p>
                  <p>5. Niên hạn sử dụng: <strong>{printItem.nienHanNam} năm</strong>. Hạn cấp mới tiếp theo: <strong>Năm {printItem.namDenHanCapMoi}</strong></p>
                  <p>6. Định mức kinh phí trang cấp: <strong>{formatVND(printItem.dinhMucTien)}</strong></p>
                  <p>7. Tiền bồi dưỡng phục hồi chức năng: <strong>{formatVND(printItem.tienBoiDuongPhucHoi)}</strong></p>
                  <p className="font-bold text-red-700 mt-2">
                    ➔ TỔNG KINH PHÍ ĐƯỢC THANH TOÁN: {formatVND(printItem.dinhMucTien + printItem.tienBoiDuongPhucHoi)}
                  </p>
                </div>

                <div className="mt-8 flex justify-between items-end font-sans">
                  <div className="text-center">
                    <p className="font-bold">NGƯỜI NHẬN DỤNG CỤ</p>
                    <p className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</p>
                    <div className="h-16 flex items-end justify-center font-bold">{printItem.hoTen}</div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold uppercase">KT. GIÁM ĐỐC SỞ</p>
                    <p className="text-[10px] font-bold uppercase text-[#dd4b39]">PHÓ GIÁM ĐỐC</p>
                    <div className="my-2">
                      <DigitalSignatureBadge
                        nguoiKy="TS. Nguyễn Văn Hùng"
                        chucVu="Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPrintItem(null)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold text-xs"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-[#3c8dbc] hover:bg-[#357ca5] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="size-3.5" />
                  In phiếu cấp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
