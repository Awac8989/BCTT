import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  FileCheck2,
  FileX2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Printer,
  QrCode,
  ShieldCheck,
  CreditCard,
  FileSpreadsheet,
  X,
  FileText,
  UserCheck,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { appStore, useAppState } from "@/services/app-state";
import { type HoSoMotCuaLienThongItem } from "@/data/domain-mock";

export function MotCuaDvcCenter() {
  const { hoSoMotCuaLienThongList, currentUser } = useAppState();

  // State tìm kiếm & bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLinhVuc, setFilterLinhVuc] = useState<string>("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState<string>("ALL");

  // State Modal Xem Biểu mẫu (Mẫu 01, Mẫu 02, Mẫu 03, Mẫu 04)
  const [viewingModalForm, setViewingModalForm] = useState<{
    hoSo: HoSoMotCuaLienThongItem;
    mauBieu: "MAU_01" | "MAU_02" | "MAU_03" | "MAU_04";
  } | null>(null);

  // State Modal Lập Phiếu Bổ sung Mẫu 02
  const [modalBoSung, setModalBoSung] = useState<HoSoMotCuaLienThongItem | null>(null);
  const [lyDoBoSung, setLyDoBoSung] = useState("");

  // State Modal Lập Phiếu Xin lỗi Mẫu 04
  const [modalXinLoi, setModalXinLoi] = useState<HoSoMotCuaLienThongItem | null>(null);
  const [lyDoXinLoi, setLyDoXinLoi] = useState("");
  const [ngayHenMoi, setNgayHenMoi] = useState("30/10/2026");

  // State Modal Tiếp nhận Hồ sơ Mới
  const [modalTiepNhanMoi, setModalTiepNhanMoi] = useState(false);
  const [newTenThuTuc, setNewTenThuTuc] = useState("Cấp trích lục hộ tịch điện tử");
  const [newMaTthc, setNewMaTthc] = useState("TTHC-TP-01");
  const [newLinhVuc, setNewLinhVuc] = useState<HoSoMotCuaLienThongItem["linhVuc"]>("HO_TICH");
  const [newMucDo, setNewMucDo] = useState<HoSoMotCuaLienThongItem["mucDoDvc"]>("TOAN_TRINH");
  const [newNguoiNop, setNewNguoiNop] = useState("");
  const [newCccd, setNewCccd] = useState("");
  const [newSdt, setNewSdt] = useState("");
  const [newDiaChi, setNewDiaChi] = useState("");
  const [newNgayHen, setNewNgayHen] = useState("30/10/2026 16:30");
  const [newLePhi, setNewLePhi] = useState(10000);

  // Thống kê chỉ số Một cửa
  const stats = {
    total: hoSoMotCuaLienThongList.length,
    dangThuLy: hoSoMotCuaLienThongList.filter((h) => h.trangThai === "DANG_THU_LY").length,
    choBoSung: hoSoMotCuaLienThongList.filter((h) => h.trangThai === "CHO_BO_SUNG").length,
    daHoanThanh: hoSoMotCuaLienThongList.filter((h) => h.trangThai === "DA_HOAN_THANH").length,
    toanTrinh: hoSoMotCuaLienThongList.filter((h) => h.mucDoDvc === "TOAN_TRINH").length,
  };

  // Lọc danh sách hồ sơ
  const filteredHoSo = hoSoMotCuaLienThongList.filter((h) => {
    const matchSearch =
      h.maHoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.tenThuTuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.nguoiNop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.cccd.includes(searchTerm);
    const matchLinhVuc = filterLinhVuc === "ALL" || h.linhVuc === filterLinhVuc;
    const matchTrangThai = filterTrangThai === "ALL" || h.trangThai === filterTrangThai;
    return matchSearch && matchLinhVuc && matchTrangThai;
  });

  // Xử lý tạo Phiếu Bổ sung Mẫu 02
  const handleLuuBoSung = () => {
    if (!modalBoSung) return;
    if (!lyDoBoSung.trim()) {
      toast.error("Vui lòng nhập danh mục giấy tờ hồ sơ cần bổ sung!");
      return;
    }
    appStore.taoPhieuYeuCauBoSungMau02(modalBoSung.id, lyDoBoSung.trim());
    toast.success("Đã ban hành Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ (Mẫu 02/NĐ 61/2018/NĐ-CP)!");
    setModalBoSung(null);
    setLyDoBoSung("");
  };

  // Xử lý tạo Phiếu Xin lỗi Mẫu 04
  const handleLuuXinLoi = () => {
    if (!modalXinLoi) return;
    if (!lyDoXinLoi.trim()) {
      toast.error("Vui lòng nhập lý do chậm trễ để xin lỗi công dân!");
      return;
    }
    appStore.taoPhieuXinLoiMau04(modalXinLoi.id, lyDoXinLoi.trim(), ngayHenMoi);
    toast.success("Đã ban hành Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu 04/NĐ 61/2018/NĐ-CP)!");
    setModalXinLoi(null);
    setLyDoXinLoi("");
  };

  // Xử lý Trả kết quả & Ký số kết quả điện tử
  const handleTraKetQua = (hoSo: HoSoMotCuaLienThongItem) => {
    const soKetQua = `KQ-${hoSo.linhVuc}-2026/0${Math.floor(100 + Math.random() * 900)}`;
    appStore.traKetQuaHoSoMotCua(hoSo.id, soKetQua);
    toast.success(
      `Đã trả kết quả TTHC & cấp Bản điện tử có mã định danh SHA-256 tái sử dụng cho công dân ${hoSo.nguoiNop}!`
    );
  };

  // Xử lý Tiếp nhận hồ sơ mới
  const handleTiepNhanMoi = () => {
    if (!newNguoiNop.trim() || !newCccd.trim()) {
      toast.error("Vui lòng nhập Họ tên và số CCCD của người nộp hồ sơ!");
      return;
    }
    appStore.tiepNhanHoSoMotCuaMoi({
      tenThuTuc: newTenThuTuc,
      maTthc: newMaTthc,
      linhVuc: newLinhVuc,
      mucDoDvc: newMucDo,
      nguoiNop: newNguoiNop.trim(),
      cccd: newCccd.trim(),
      soDienThoai: newSdt.trim() || "0900.000.000",
      diaChi: newDiaChi.trim() || "Phường Thủ Dầu Một, TP. Thủ Dầu Một",
      ngayHenTra: newNgayHen,
      canBoThuLy: currentUser.fullName,
      lePhiVND: newLePhi,
      trangThaiThanhToan: newLePhi === 0 ? "MIEN_PHI" : "THANH_TOAN_TRUC_TIEP",
    });
    toast.success("Tiếp nhận hồ sơ Một cửa mới thành công! Đã cấp Giấy tiếp nhận & Hẹn trả kết quả (Mẫu 01).");
    setModalTiepNhanMoi(false);
    setNewNguoiNop("");
    setNewCccd("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Tiêu chuẩn Một cửa NĐ 61/2018 */}
      <div className="bg-gradient-to-r from-[#222d32] via-[#2c3b41] to-[#1e282c] text-white rounded-2xl p-6 shadow-xl border-b-2 border-[#dd4b39] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Building2 className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dd4b39] text-white text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Building2 className="w-3.5 h-3.5" />
            Cơ chế Một cửa, Một cửa Liên thông &amp; Dịch vụ công Quốc gia
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Bộ phận Tiếp nhận & Trả kết quả TTHC · UBND Phường Thủ Dầu Một
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Áp dụng nghiêm ngặt <strong>Nghị định 61/2018/NĐ-CP</strong> và <strong>Nghị định 107/2021/NĐ-CP</strong>: Chuẩn hóa 4 mẫu biểu bắt buộc (Giấy hẹn Mẫu 01, Bổ sung Mẫu 02, Từ chối Mẫu 03, Xin lỗi Mẫu 04) · 100% hồ sơ cấp bản kết quả điện tử có mã băm SHA-256 tích hợp Kho dữ liệu Đề án 06.
          </p>
        </div>
      </div>

      {/* 4 Cards Thống kê Chỉ số Một cửa */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng hồ sơ tiếp nhận</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</h4>
            <p className="text-[11px] text-emerald-600 mt-1">Đạt 100% số hóa hồ sơ</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Tỷ lệ DVC Toàn trình</p>
            <h4 className="text-2xl font-bold text-blue-600 mt-1">
              {stats.total > 0 ? Math.round((stats.toanTrinh / stats.total) * 100) : 0}%
            </h4>
            <p className="text-[11px] text-blue-600 mt-1">Nộp qua Cổng DVCQG</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Yêu cầu bổ sung (Mẫu 02)</p>
            <h4 className="text-2xl font-bold text-amber-600 mt-1">{stats.choBoSung}</h4>
            <p className="text-[11px] text-amber-600 mt-1">Tối đa 01 lần duy nhất</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Đã trả kết quả đúng hạn</p>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">{stats.daHoanThanh}</h4>
            <p className="text-[11px] text-emerald-600 mt-1">Có mã băm SHA-256</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Thanh công cụ tìm kiếm và Nút tiếp nhận mới */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Mã hồ sơ quốc gia, tên thủ tục, họ tên công dân hoặc CCCD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterLinhVuc}
            onChange={(e) => setFilterLinhVuc(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">-- Tất cả lĩnh vực --</option>
            <option value="HO_TICH">Tư pháp - Hộ tịch</option>
            <option value="VAN_HOA">Văn hóa - Thể thao</option>
            <option value="GIAO_DUC">Giáo dục & Đào tạo</option>
            <option value="LAO_DONG_TBXH">Lao động - NCC & An sinh</option>
            <option value="DIA_CHINH_XAY_DUNG">Địa chính - Xây dựng</option>
          </select>

          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">-- Tất cả trạng thái --</option>
            <option value="DANG_THU_LY">Đang thụ lý</option>
            <option value="CHO_BO_SUNG">Chờ bổ sung (Mẫu 02)</option>
            <option value="CHO_KY_SO">Chờ ký số</option>
            <option value="DA_HOAN_THANH">Đã hoàn thành</option>
          </select>

          <button
            type="button"
            onClick={() => setModalTiepNhanMoi(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Tiếp nhận Hồ sơ Mới</span>
          </button>
        </div>
      </div>

      {/* Bảng danh sách hồ sơ Một cửa liên thông */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Mã hồ sơ & Mức độ</th>
                <th className="px-4 py-3">Tên thủ tục hành chính</th>
                <th className="px-4 py-3">Công dân / CCCD / SĐT</th>
                <th className="px-4 py-3 text-center">Ngày hẹn trả</th>
                <th className="px-4 py-3">Cán bộ thụ lý</th>
                <th className="px-4 py-3 text-center">Trạng thái & Lệ phí</th>
                <th className="px-4 py-3 text-center">Biểu mẫu sử dụng</th>
                <th className="px-4 py-3 text-right">Thao tác nghiệp vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHoSo.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-emerald-600">{h.maHoSo}</div>
                    <div className="mt-1">
                      {h.mucDoDvc === "TOAN_TRINH" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Toàn trình
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          Một phần / Trực tiếp
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{h.tenThuTuc}</div>
                    <div className="text-[11px] text-slate-400">
                      Mã: {h.maTthc} · Lĩnh vực: {h.linhVuc}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{h.nguoiNop}</div>
                    <div className="text-[11px] text-slate-500">CCCD: {h.cccd} · SĐT: {h.soDienThoai}</div>
                    <div className="text-[10px] text-slate-400">{h.diaChi}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {h.ngayHenTraMoi || h.ngayHenTra}
                    </div>
                    {h.ngayHenTraMoi && (
                      <span className="text-[10px] text-amber-600 font-bold block">(Gia hạn Mẫu 04)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{h.canBoThuLy}</div>
                    <div className="text-[10px] text-slate-400">Bộ phận Một cửa</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="mb-1">
                      {h.trangThai === "DA_HOAN_THANH" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Đã hoàn thành
                        </span>
                      ) : h.trangThai === "CHO_BO_SUNG" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Chờ bổ sung
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Đang thụ lý
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {h.lePhiVND === 0 ? "Miễn phí" : `${h.lePhiVND.toLocaleString("vi-VN")} đ`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setViewingModalForm({
                          hoSo: h,
                          mauBieu:
                            h.mauBieuSuDung === "MAU_04_PHIEU_XIN_LOI"
                              ? "MAU_04"
                              : h.mauBieuSuDung === "MAU_02_PHIEU_BO_SUNG"
                                ? "MAU_02"
                                : "MAU_01",
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-slate-500" />
                      <span>
                        {h.mauBieuSuDung === "MAU_04_PHIEU_XIN_LOI"
                          ? "Mẫu 04 (Xin lỗi)"
                          : h.mauBieuSuDung === "MAU_02_PHIEU_BO_SUNG"
                            ? "Mẫu 02 (Bổ sung)"
                            : "Mẫu 01 (Giấy hẹn)"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {h.trangThai !== "DA_HOAN_THANH" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setModalBoSung(h);
                              setLyDoBoSung(h.lyDoBoSungHoacXinLoi || "");
                            }}
                            title="Lập phiếu yêu cầu bổ sung hồ sơ (Mẫu 02)"
                            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-medium transition cursor-pointer"
                          >
                            Bổ sung
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setModalXinLoi(h);
                              setLyDoXinLoi(h.lyDoBoSungHoacXinLoi || "");
                            }}
                            title="Lập phiếu xin lỗi và hẹn lại ngày trả (Mẫu 04)"
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-medium transition cursor-pointer"
                          >
                            Xin lỗi
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTraKetQua(h)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition cursor-pointer inline-flex items-center gap-1 shadow-sm"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Trả kết quả</span>
                          </button>
                        </>
                      )}
                      {h.trangThai === "DA_HOAN_THANH" && (
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 font-mono block">
                            {h.soKyHieuKetQua}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            {h.maXacThucDienTu?.slice(0, 16)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL XEM & IN BIỂU MẪU CHUẨN NGHỊ ĐỊNH 61/2018 (MẪU 01, 02, 04) */}
      {/* ========================================================================= */}
      {viewingModalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG · BỘ PHẬN MỘT CỬA
              </span>
              <button
                type="button"
                onClick={() => setViewingModalForm(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Khung Biểu mẫu in */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 font-serif text-slate-900 dark:text-slate-100">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="text-[11px] underline">Độc lập - Tự do - Hạnh phúc</p>
                <h3 className="text-base font-bold uppercase pt-3">
                  {viewingModalForm.mauBieu === "MAU_01"
                    ? "GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ"
                    : viewingModalForm.mauBieu === "MAU_02"
                      ? "PHIẾU YÊU CẦU BỔ SUNG, HOÀN THIỆN HỒ SƠ"
                      : "PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ"}
                </h3>
                <p className="text-xs italic text-slate-500">
                  (Mẫu số 0{viewingModalForm.mauBieu === "MAU_01" ? 1 : viewingModalForm.mauBieu === "MAU_02" ? 2 : 4} ban hành kèm theo Nghị định số 61/2018/NĐ-CP)
                </p>
              </div>

              <div className="text-xs space-y-2 pt-2 leading-relaxed">
                <p>
                  <strong>Mã số hồ sơ:</strong> <span className="font-mono font-bold text-emerald-600">{viewingModalForm.hoSo.maHoSo}</span>
                </p>
                <p>
                  <strong>Bộ phận tiếp nhận:</strong> Bộ phận Tiếp nhận và Trả kết quả UBND Phường Thủ Dầu Một
                </p>
                <p>
                  <strong>Họ và tên người nộp:</strong> {viewingModalForm.hoSo.nguoiNop} · <strong>CCCD:</strong> {viewingModalForm.hoSo.cccd}
                </p>
                <p>
                  <strong>Thủ tục hành chính:</strong> {viewingModalForm.hoSo.tenThuTuc}
                </p>
                <p>
                  <strong>Thời gian tiếp nhận:</strong> {viewingModalForm.hoSo.ngayTiepNhan}
                </p>

                {viewingModalForm.mauBieu === "MAU_01" && (
                  <p className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded border border-emerald-200 dark:border-emerald-900 font-semibold text-emerald-800 dark:text-emerald-200">
                    Thời gian hẹn trả kết quả: {viewingModalForm.hoSo.ngayHenTra}
                  </p>
                )}

                {viewingModalForm.mauBieu === "MAU_02" && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-900 space-y-1">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">
                      Nội dung hồ sơ cần bổ sung, hoàn thiện:
                    </p>
                    <p className="italic text-amber-900 dark:text-amber-300">
                      {viewingModalForm.hoSo.lyDoBoSungHoacXinLoi || "Bổ sung đầy đủ các giấy tờ theo quy định."}
                    </p>
                    <p className="text-[10px] text-amber-700">
                      * Cán bộ một cửa chỉ được yêu cầu bổ sung 01 lần duy nhất theo Khoản 1 Điều 12 Nghị định 61/2018/NĐ-CP.
                    </p>
                  </div>
                )}

                {viewingModalForm.mauBieu === "MAU_04" && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded border border-rose-200 dark:border-rose-900 space-y-1">
                    <p className="font-semibold text-rose-800 dark:text-rose-200">
                      Lý do chậm trễ và lời xin lỗi từ UBND Phường:
                    </p>
                    <p className="italic text-rose-900 dark:text-rose-300">
                      {viewingModalForm.hoSo.lyDoBoSungHoacXinLoi}
                    </p>
                    <p className="font-bold text-rose-800">
                      Thời gian hẹn trả kết quả mới: {viewingModalForm.hoSo.ngayHenTraMoi}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end pt-4 text-xs">
                <div className="text-center">
                  <p className="font-semibold">NGƯỜI NỘP HỒ SƠ</p>
                  <p className="text-[10px] italic text-slate-400">(Ký, ghi rõ họ tên)</p>
                  <p className="pt-8 font-bold">{viewingModalForm.hoSo.nguoiNop}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">NGƯỜI TIẾP NHẬN HỒ SƠ</p>
                  <p className="text-[10px] italic text-slate-400">(Ký, đóng dấu điện tử)</p>
                  <p className="pt-8 font-bold text-emerald-600">{viewingModalForm.hoSo.canBoThuLy}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingModalForm(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Đang gửi lệnh in phiếu ra máy in tại Bộ phận Một cửa...");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Phiếu (Mẫu Chuẩn)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL LẬP PHIẾU BỔ SUNG MẪU 02 */}
      {/* ========================================================================= */}
      {modalBoSung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Lập Phiếu Yêu Cầu Bổ Sung Hồ Sơ (Mẫu 02)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalBoSung(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Hồ sơ mã: <strong className="font-mono text-emerald-600">{modalBoSung.maHoSo}</strong> của công dân <strong>{modalBoSung.nguoiNop}</strong>.
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Liệt kê cụ thể các giấy tờ, tài liệu cần bổ sung, hoàn thiện:
                </label>
                <textarea
                  rows={4}
                  value={lyDoBoSung}
                  onChange={(e) => setLyDoBoSung(e.target.value)}
                  placeholder="Ví dụ: Bổ sung Giấy chứng nhận quyền sử dụng đất bản sao có chứng thực; 02 ảnh thẻ 3x4..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalBoSung(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLuuBoSung}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Ban Hành Phiếu Mẫu 02
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL LẬP PHIẾU XIN LỖI MẪU 04 */}
      {/* ========================================================================= */}
      {modalXinLoi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Lập Phiếu Xin Lỗi & Hẹn Lại Ngày Trả (Mẫu 04)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalXinLoi(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Hồ sơ mã: <strong className="font-mono text-emerald-600">{modalXinLoi.maHoSo}</strong> của công dân <strong>{modalXinLoi.nguoiNop}</strong>.
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Lý do chậm trễ giải quyết hồ sơ:
                </label>
                <textarea
                  rows={3}
                  value={lyDoXinLoi}
                  onChange={(e) => setLyDoXinLoi(e.target.value)}
                  placeholder="Ví dụ: Do hệ thống xác thực cơ sở dữ liệu quốc gia bảo trì đột xuất..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Ngày hẹn trả kết quả mới:
                </label>
                <input
                  type="text"
                  value={ngayHenMoi}
                  onChange={(e) => setNgayHenMoi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalXinLoi(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLuuXinLoi}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Ban Hành Phiếu Xin Lỗi Mẫu 04
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL TIẾP NHẬN HỒ SƠ MỚI */}
      {/* ========================================================================= */}
      {modalTiepNhanMoi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tiếp Nhận Hồ Sơ Một Cửa Mới (Cấp Mã Số Quốc Gia)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalTiepNhanMoi(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Lĩnh vực:</label>
                  <select
                    value={newLinhVuc}
                    onChange={(e) => setNewLinhVuc(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="HO_TICH">Tư pháp - Hộ tịch</option>
                    <option value="VAN_HOA">Văn hóa - Thể thao</option>
                    <option value="GIAO_DUC">Giáo dục & Đào tạo</option>
                    <option value="LAO_DONG_TBXH">Lao động - NCC & Xã hội</option>
                    <option value="DIA_CHINH_XAY_DUNG">Địa chính - Xây dựng</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Mức độ DVC:</label>
                  <select
                    value={newMucDo}
                    onChange={(e) => setNewMucDo(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="TOAN_TRINH">Toàn trình (Trực tuyến 100%)</option>
                    <option value="MOT_PHAN">Một phần</option>
                    <option value="TRUC_TIEP">Trực tiếp tại quầy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tên thủ tục hành chính:</label>
                <input
                  type="text"
                  value={newTenThuTuc}
                  onChange={(e) => setNewTenThuTuc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Họ và tên người nộp:</label>
                  <input
                    type="text"
                    value={newNguoiNop}
                    onChange={(e) => setNewNguoiNop(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Số CCCD (12 số):</label>
                  <input
                    type="text"
                    value={newCccd}
                    onChange={(e) => setNewCccd(e.target.value)}
                    placeholder="074095000000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Số điện thoại:</label>
                  <input
                    type="text"
                    value={newSdt}
                    onChange={(e) => setNewSdt(e.target.value)}
                    placeholder="0918.000.000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Ngày hẹn trả kết quả:</label>
                  <input
                    type="text"
                    value={newNgayHen}
                    onChange={(e) => setNewNgayHen(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalTiepNhanMoi(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleTiepNhanMoi}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Tiếp Nhận & Xuất Giấy Hẹn Mẫu 01</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
