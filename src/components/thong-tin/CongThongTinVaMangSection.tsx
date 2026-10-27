import React, { useState } from "react";
import {
  Globe,
  Share2,
  ShieldAlert,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  Flame,
  Radio,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type TinBaiCongThongTinItem, type GiamSatKhongGianMangItem } from "@/data/domain-mock";
import { toast } from "sonner";

export const CongThongTinVaMangSection: React.FC = () => {
  const { tinBaiList, khongGianMangList } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<"TIN_BAI" | "KHONG_GIAN_MANG">("TIN_BAI");
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal Soạn Tin bài mới
  const [showAddTinModal, setShowAddTinModal] = useState(false);
  const [tieuDeMoi, setTieuDeMoi] = useState("");
  const [chuyenMucMoi, setChuyenMucMoi] = useState<TinBaiCongThongTinItem["chuyenMuc"]>("CHI_DAO_DIEU_HANH");
  const [tacGiaMoi, setTacGiaMoi] = useState("Vũ Đình Cường (Chuyên viên TT-CĐS)");

  // State Modal Xử lý tin xấu độc
  const [xuLyItem, setXuLyItem] = useState<GiamSatKhongGianMangItem | null>(null);
  const [bienPhapXuLy, setBienPhapXuLy] = useState<GiamSatKhongGianMangItem["bienPhapXuLy"]>("DANG_TIN_DINH_CHINH");
  const [ketQuaXuLy, setKetQuaXuLy] = useState("");

  const tbItems = tinBaiList || [];
  const kgmItems = khongGianMangList || [];

  const daXuatBanCount = tbItems.filter((t) => t.trangThai === "DA_XUAT_BAN").length;
  const tongLuotXem = tbItems.reduce((s, t) => s + (t.luotXem || 0), 0);
  const daXuLyKgmCount = kgmItems.filter((k) => k.bienPhapXuLy === "DA_XU_LY_XONG").length;

  const handleThemTinBai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDeMoi.trim()) {
      toast.error("Vui lòng nhập tiêu đề tin bài");
      return;
    }
    appStore.themTinBaiCongThongTin({
      tieuDe: tieuDeMoi,
      chuyenMuc: chuyenMucMoi,
      tacGia: tacGiaMoi,
      ngayGui: new Date().toLocaleDateString("vi-VN"),
      trangThai: "CHO_DUYET",
      luotXem: 0,
      dongBoZaloOA: false,
      luotGuiBroadcast: 0,
    });
    toast.success("Đã gửi tin bài lên Cổng TTĐT Phường thành công (Chờ Lãnh đạo duyệt)!");
    setShowAddTinModal(false);
    setTieuDeMoi("");
  };

  const handleDuyetTin = (id: string, tieuDe: string) => {
    appStore.duyetXuatBanTinBai(id, "Nguyễn Văn An (Chủ tịch UBND Phường)");
    toast.success(`Chủ tịch UBND Phường đã phê duyệt xuất bản bài viết: "${tieuDe}"!`);
  };

  const handleBroadcastZalo = (id: string, tieuDe: string) => {
    appStore.dongBoBroadcastZalo(id, 15000);
    toast.success(`Đã phát thông điệp truyền thông chính sách qua Zalo OA thành công!`, {
      description: `Đã gửi tin nhắn Broadcast tới 15.000 người dân theo dõi trang Zalo OA Phường.`,
    });
  };

  const handleLuuXuLyKgm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xuLyItem || !ketQuaXuLy.trim()) return;
    appStore.xuLyTinXauDoc(xuLyItem.id, bienPhapXuLy, ketQuaXuLy);
    toast.success("Đã cập nhật biện pháp xử lý và định hướng dư luận xã hội thành công!");
    setXuLyItem(null);
    setKetQuaXuLy("");
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-cyan-950 via-sky-950 to-slate-950 p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Globe className="size-3.5 text-cyan-300" />
            Nghị định 42/2022/NĐ-CP · Chỉ thị 14/CT-TTg · Quyết định 830/QĐ-TTg
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Quản Trị Cổng Thông Tin Điện Tử, Zalo OA &amp; Tác Chiến Không Gian Mạng (Lực Lượng 35)
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Quy trình biên tập xuất bản tin bài 3 bước trên Cổng TTĐT; phát tin nhắn truyền thông chính sách qua Zalo Official Account cấp Phường; theo dõi, phát hiện và phản bác thông tin xấu độc, tin giả trên mạng xã hội bảo đảm an toàn tư tưởng và định hướng dư luận.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="bg-cyan-950/80 border border-cyan-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Share2 className="size-3.5 text-sky-300" />
              Zalo OA: 15.000 người theo dõi
            </span>
            <span className="bg-cyan-950/80 border border-cyan-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-rose-300" />
              Tác chiến mạng 35: Phản ứng nhanh trong 30 phút
            </span>
            <span className="bg-cyan-950/80 border border-cyan-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Eye className="size-3.5 text-emerald-300" />
              Lượt xem Cổng TTĐT: {tongLuotXem.toLocaleString("vi-VN")} lượt
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tin bài Cổng TTĐT</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">{tbItems.length}</span>
            <span className="text-xs font-bold text-sky-600">bài viết</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">{daXuatBanCount} bài đã xuất bản</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Lượt xem Cổng TTĐT</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{tongLuotXem.toLocaleString("vi-VN")}</span>
            <span className="text-xs font-bold text-slate-600">lượt</span>
          </div>
          <span className="text-[11px] text-sky-600 mt-1 block">Tương tác trực tuyến cao</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Broadcast qua Zalo OA</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-700">27.700</span>
            <span className="text-xs font-bold text-indigo-600">tin nhắn</span>
          </div>
          <span className="text-[11px] text-indigo-600 mt-1 block">Truyền thông chính sách tức thì</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Giám sát mạng xã hội</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-700">{kgmItems.length}</span>
            <span className="text-xs font-bold text-rose-600">vụ việc</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">{daXuLyKgmCount} vụ việc đã xử lý dứt điểm</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white rounded-t-lg px-3 pt-2 gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("TIN_BAI")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "TIN_BAI"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="size-3.5" />
            1. Quản trị Tin bài Cổng TTĐT &amp; Zalo OA (NĐ 42/2022)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("KHONG_GIAN_MANG")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "KHONG_GIAN_MANG"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert className="size-3.5" />
            2. Giám sát Tin xấu độc &amp; Tác chiến mạng (Lực lượng 35)
          </button>
        </div>

        {activeSubTab === "TIN_BAI" && (
          <button
            type="button"
            onClick={() => setShowAddTinModal(true)}
            className="mb-1 px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Soạn thảo tin bài mới
          </button>
        )}
      </div>

      {/* 1. SUB-TAB QUẢN TRỊ TIN BÀI CỔNG TTĐT */}
      {activeSubTab === "TIN_BAI" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {tbItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-wrap items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                      {item.chuyenMuc === "CHI_DAO_DIEU_HANH"
                        ? "Chỉ đạo điều hành"
                        : item.chuyenMuc === "DVC_CHUYEN_DOI_SO"
                        ? "Dịch vụ công & Chuyển đổi số"
                        : item.chuyenMuc === "AN_NINH_TRAT_TU"
                        ? "An ninh trật tự"
                        : "Văn hóa - Xã hội"}
                    </span>
                    <span className="text-[11px] text-slate-400">Gửi ngày: {item.ngayGui}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.tieuDe}</h4>
                  <div className="text-[11px] text-slate-500">
                    Tác giả: <strong className="text-slate-700">{item.tacGia}</strong>
                    {item.nguoiDuyet && (
                      <span> · Người duyệt: <strong className="text-slate-700">{item.nguoiDuyet}</strong></span>
                    )}
                    {item.ngayXuatBan && (
                      <span> · Xuất bản lúc: <strong>{item.ngayXuatBan}</strong></span>
                    )}
                  </div>

                  {item.dongBoZaloOA && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold">
                      <Share2 className="size-3" />
                      Đã phát Broadcast Zalo OA ({item.luotGuiBroadcast.toLocaleString("vi-VN")} người nhận)
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Eye className="size-3.5 text-slate-400" />
                      <strong className="text-slate-800 font-mono">{item.luotXem.toLocaleString("vi-VN")}</strong> lượt xem
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.trangThai === "DA_XUAT_BAN"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {item.trangThai === "DA_XUAT_BAN" ? "Đã xuất bản" : "Chờ lãnh đạo duyệt"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {item.trangThai !== "DA_XUAT_BAN" ? (
                      <button
                        type="button"
                        onClick={() => handleDuyetTin(item.id, item.tieuDe)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Duyệt xuất bản
                      </button>
                    ) : (
                      !item.dongBoZaloOA && (
                        <button
                          type="button"
                          onClick={() => handleBroadcastZalo(item.id, item.tieuDe)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="size-3.5" />
                          Phát Zalo OA
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SUB-TAB GIÁM SÁT MẠNG XÃ HỘI (LỰC LƯỢNG 35) */}
      {activeSubTab === "KHONG_GIAN_MANG" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {kgmItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.maTin}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      Kênh: {item.kenhPhatHien}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.mucDoNguyHiem === "NGHIEM_TRONG"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {item.mucDoNguyHiem === "NGHIEM_TRONG" ? "Mức độ: Nghiêm trọng" : "Mức độ: Trung bình"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Phát hiện: {item.ngayPhatHien}</span>
                </div>

                <div>
                  <strong className="text-slate-900 text-sm block mb-1">{item.tieuDeNoiDung}</strong>
                  <span className="text-sky-700 text-[11px] font-mono flex items-center gap-1">
                    <ExternalLink className="size-3" />
                    {item.duongDanLink}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 text-[11px] space-y-1">
                  <div>
                    <strong>Kết quả định hướng &amp; xử lý:</strong> {item.ketQuaXuLy}
                  </div>
                  <div className="text-slate-500">Cán bộ theo dõi: <strong>{item.canBoTheoDoi}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.bienPhapXuLy === "DA_XU_LY_XONG"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {item.bienPhapXuLy === "DA_XU_LY_XONG"
                      ? "Đã xử lý dứt điểm & Ổn định tư tưởng"
                      : "Đang định hướng dư luận"}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setXuLyItem(item);
                      setBienPhapXuLy(item.bienPhapXuLy);
                      setKetQuaXuLy(item.ketQuaXuLy);
                    }}
                    className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert className="size-3.5" />
                    Cập nhật biện pháp xử lý
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL THÊM TIN BÀI */}
      {showAddTinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-sky-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <h3 className="font-bold text-sm">Biên Tập Tin Bài Mới Lên Cổng TTĐT</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTinModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleThemTinBai} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề tin bài tuyên truyền..."
                  value={tieuDeMoi}
                  onChange={(e) => setTieuDeMoi(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
                  <select
                    value={chuyenMucMoi}
                    onChange={(e) => setChuyenMucMoi(e.target.value as any)}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  >
                    <option value="CHI_DAO_DIEU_HANH">Chỉ đạo điều hành</option>
                    <option value="DVC_CHUYEN_DOI_SO">Dịch vụ công &amp; CĐS</option>
                    <option value="AN_NINH_TRAT_TU">An ninh trật tự</option>
                    <option value="VAN_HOA_XA_HOI">Văn hóa - Xã hội</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tác giả biên soạn</label>
                  <input
                    type="text"
                    value={tacGiaMoi}
                    onChange={(e) => setTacGiaMoi(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTinModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-700 text-white font-bold hover:bg-sky-800"
                >
                  Gửi duyệt xuất bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XỬ LÝ KHÔNG GIAN MẠNG */}
      {xuLyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4" />
                <h3 className="font-bold text-sm">Biện Pháp Xử Lý Thông Tin Mạng (Lực lượng 35)</h3>
              </div>
              <button
                type="button"
                onClick={() => setXuLyItem(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLuuXuLyKgm} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded">
                <strong className="text-slate-900 block">{xuLyItem.tieuDeNoiDung}</strong>
                <span className="text-[11px] text-slate-500">Kênh: {xuLyItem.kenhPhatHien}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Biện pháp xử lý</label>
                <select
                  value={bienPhapXuLy}
                  onChange={(e) => setBienPhapXuLy(e.target.value as any)}
                  className="w-full rounded border border-slate-300 p-2 text-xs font-bold"
                >
                  <option value="DANG_TIN_DINH_CHINH">Đăng bài đính chính &amp; Định hướng dư luận</option>
                  <option value="CHUYEN_CONG_AN_XU_LY">Chuyển Công an Thành phố triệu tập xử lý</option>
                  <option value="VAN_DONG_GO_BAI">Vận động quản trị viên gỡ bài viết</option>
                  <option value="DA_XU_LY_XONG">Đã xử lý xong &amp; Ổn định tình hình</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kết quả thực hiện chi tiết</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi nhận nội dung đính chính, cơ chế thông tin hoặc kết quả làm việc..."
                  value={ketQuaXuLy}
                  onChange={(e) => setKetQuaXuLy(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setXuLyItem(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-700 text-white font-bold hover:bg-rose-800"
                >
                  Cập nhật xử lý
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
