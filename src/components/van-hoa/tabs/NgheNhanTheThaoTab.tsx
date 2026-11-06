import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Activity,
  LifeBuoy,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Users,
  Building,
  FileCheck,
  Dumbbell,
  Waves,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type NgheNhanDiSanItem, type CoSoTheThaoItem } from "@/data/domain-mock";
import { toast } from "sonner";

export const NgheNhanTheThaoTab: React.FC = () => {
  const { ngheNhanDiSanList, coSoTheThaoList } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<"NGHE_NHAN" | "THE_THAO">("NGHE_NHAN");
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal Thêm Nghệ nhân mới
  const [showAddNnModal, setShowAddNnModal] = useState(false);
  const [nnHoTen, setNnHoTen] = useState("");
  const [nnNamSinh, setNnNamSinh] = useState(1965);
  const [nnDanhHieu, setNnDanhHieu] = useState<NgheNhanDiSanItem["danhHieu"]>("NGHE_NHAN_DAN_GIAN");
  const [nnLoaiHinh, setNnLoaiHinh] = useState("Đờn ca tài tử Nam Bộ");
  const [nnTroCap, setNnTroCap] = useState(1000000);
  const [nnKhuPho, setNnKhuPho] = useState("Khu phố 1");
  const [nnTruyenDay, setNnTruyenDay] = useState("Tích cực truyền dạy cho thanh thiếu niên tại địa phương");

  // State Modal Kiểm tra cơ sở thể thao
  const [kiemTraCs, setKiemTraCs] = useState<CoSoTheThaoItem | null>(null);
  const [ketQuaKiemTra, setKetQuaKiemTra] = useState<CoSoTheThaoItem["ketQuaKiemTra"]>("DAT_CHUAN");
  const [ghiChuKt, setGhiChuKt] = useState("");

  const nnItems = ngheNhanDiSanList || [];
  const csItems = coSoTheThaoList || [];

  const nnUuTuCount = nnItems.filter((n) => n.danhHieu === "NGHE_NHAN_UU_TU").length;
  const beBoiCount = csItems.filter((c) => c.loaiHinh === "BE_BOI").length;
  const csDatChuanCount = csItems.filter((c) => c.ketQuaKiemTra === "DAT_CHUAN").length;

  const handleThemNn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nnHoTen.trim()) {
      toast.error("Vui lòng nhập họ tên nghệ nhân");
      return;
    }
    appStore.themNgheNhanDiSan({
      hoTen: nnHoTen,
      namSinh: Number(nnNamSinh),
      danhHieu: nnDanhHieu,
      loaiHinhDiSan: nnLoaiHinh,
      namPhongTang: 2026,
      khuPho: nnKhuPho,
      tinhTrangSucKhoe: "Tốt",
      mucTroCapThangVND: Number(nnTroCap),
      clbSinhHoat: "CLB Văn nghệ Quần chúng Phường Thủ Dầu Một",
      thanhTichTruyenDay: nnTruyenDay,
    });
    toast.success(`Đã ghi nhận thông tin Nghệ nhân ${nnHoTen} thành công!`);
    setShowAddNnModal(false);
    setNnHoTen("");
  };

  const handleLuuKiemTraCs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kiemTraCs) return;
    appStore.kiemTraCoSoTheThao(kiemTraCs.id, ketQuaKiemTra, ghiChuKt);
    toast.success(`Đã cập nhật kết luận kiểm tra điều kiện TDTT cho ${kiemTraCs.tenCoSo}!`);
    setKiemTraCs(null);
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-950 via-orange-950 to-slate-950 p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="size-3.5 text-amber-400" />
            Nghị định 109/2015/NĐ-CP · Nghị định 36/2019/NĐ-CP · Thông tư 04/2018/TT-BVHTTDL
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Quản Lý Nghệ Nhân Di Sản Văn Hóa &amp; Giám Sát Hoạt Động Thể Dục Thể Thao
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Hồ sơ danh hiệu Nghệ nhân Nhân dân, Nghệ nhân Ưu tú trong các ngành nghề truyền thống và Đờn ca tài tử Nam Bộ; chi trả chế độ trợ cấp ưu đãi. Kiểm tra điều kiện pháp lý, an toàn cứu hộ bể bơi phòng chống đuối nước trẻ em và các cơ sở thể thao quần chúng.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-300" />
              Nghệ nhân Ưu tú: {nnUuTuCount} nghệ nhân
            </span>
            <span className="bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <LifeBuoy className="size-3.5 text-sky-300" />
              An toàn bể bơi: 100% có nhân viên cứu hộ
            </span>
            <span className="bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-300" />
              Cơ sở đạt chuẩn: {csDatChuanCount}/{csItems.length} cơ sở
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Nghệ nhân Di sản</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700">{nnItems.length}</span>
            <span className="text-xs font-bold text-amber-600">nghệ nhân</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Đờn ca tài tử &amp; Sơn mài</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Trợ cấp nghệ nhân/tháng</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {(nnItems.reduce((s, n) => s + (n.mucTroCapThangVND || 0), 0) / 1000000).toFixed(1)} tr
            </span>
            <span className="text-xs font-bold text-slate-600">VNĐ/tháng</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Định mức ưu đãi NĐ 109</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Bể bơi phòng đuối nước</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">{beBoiCount}</span>
            <span className="text-xs font-bold text-sky-600">hồ bơi</span>
          </div>
          <span className="text-[11px] text-sky-600 mt-1 block">Đầy đủ phao cứu hộ &amp; sào cứu sinh</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Cơ sở kinh doanh TDTT</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{csItems.length}</span>
            <span className="text-xs font-bold text-emerald-600">cơ sở</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Gym, Yoga, Sân bóng, Võ thuật</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white rounded-t-lg px-3 pt-2 gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("NGHE_NHAN")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "NGHE_NHAN"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Award className="size-3.5" />
            1. Quản lý Nghệ nhân Di sản Văn hóa (NĐ 109/2015)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("THE_THAO")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "THE_THAO"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="size-3.5" />
            2. Điều kiện Kinh doanh TDTT &amp; Bể bơi (NĐ 36/2019)
          </button>
        </div>

        {activeSubTab === "NGHE_NHAN" && (
          <button
            type="button"
            onClick={() => setShowAddNnModal(true)}
            className="mb-1 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Thêm Nghệ nhân mới
          </button>
        )}
      </div>

      {/* 1. SUB-TAB NGHỆ NHÂN DI SẢN */}
      {activeSubTab === "NGHE_NHAN" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Họ và tên nghệ nhân</th>
                  <th className="py-2.5 px-3">Danh hiệu phong tặng</th>
                  <th className="py-2.5 px-3">Loại hình di sản văn hóa</th>
                  <th className="py-2.5 px-3">CLB sinh hoạt &amp; Địa bàn</th>
                  <th className="py-2.5 px-3 text-right">Trợ cấp ưu đãi</th>
                  <th className="py-2.5 px-3">Thành tích truyền dạy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nnItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900 text-sm block">{item.hoTen}</strong>
                      <span className="text-[11px] text-slate-500">
                        Sinh năm {item.namSinh} ({new Date().getFullYear() - item.namSinh} tuổi)
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.danhHieu === "NGHE_NHAN_UU_TU"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : item.danhHieu === "NGHE_NHAN_NHAN_DAN"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {item.danhHieu === "NGHE_NHAN_UU_TU"
                          ? "Nghệ nhân Ưu tú"
                          : item.danhHieu === "NGHE_NHAN_NHAN_DAN"
                          ? "Nghệ nhân Nhân dân"
                          : "Nghệ nhân Dân gian"}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Năm phong: {item.namPhongTang}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.loaiHinhDiSan}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <div>{item.clbSinhHoat}</div>
                      <span className="text-[11px] text-slate-500">{item.khuPho}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700">
                      {item.mucTroCapThangVND.toLocaleString("vi-VN")} đ/tháng
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                      {item.thanhTichTruyenDay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB CƠ SỞ KINH DOANH THỂ THAO & BỂ BƠI */}
      {activeSubTab === "THE_THAO" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Tên cơ sở / Địa chỉ</th>
                  <th className="py-2.5 px-3">Loại hình thể thao</th>
                  <th className="py-2.5 px-3">Chủ cơ sở &amp; Giấy phép</th>
                  <th className="py-2.5 px-3 text-center">Cứu hộ bể bơi</th>
                  <th className="py-2.5 px-3 text-center">An toàn PCCC</th>
                  <th className="py-2.5 px-3">Kết quả kiểm tra</th>
                  <th className="py-2.5 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {csItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900 text-sm block">{item.tenCoSo}</strong>
                      <span className="text-[11px] text-slate-500">{item.diaChi}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        {item.loaiHinh === "BE_BOI"
                          ? "Hồ bơi / Bể bơi"
                          : item.loaiHinh === "PHONG_GYM_FITNESS"
                          ? "Phòng Gym & Fitness"
                          : item.loaiHinh === "SAN_BONG_DA"
                          ? "Sân bóng đá cỏ nhân tạo"
                          : "Yoga & Võ thuật"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{item.chuCoSo}</div>
                      <div className="text-[10px] text-slate-500 font-mono">GP: {item.giayPhepKinhDoanh}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.loaiHinh === "BE_BOI" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.soNhanVienCuuHo} cứu hộ trực
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.tinhTrangPCCC === "DAT"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {item.tinhTrangPCCC === "DAT" ? "Đạt chuẩn PCCC" : "Chưa đạt"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block mb-1 ${
                          item.ketQuaKiemTra === "DAT_CHUAN"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.ketQuaKiemTra === "CAN_KHAC_PHUC"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {item.ketQuaKiemTra === "DAT_CHUAN"
                          ? "Đạt chuẩn quy chuẩn"
                          : item.ketQuaKiemTra === "CAN_KHAC_PHUC"
                          ? "Cần khắc phục"
                          : "Đình chỉ hoạt động"}
                      </span>
                      <div className="text-[11px] text-slate-600 italic line-clamp-2">{item.ghiChu}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setKiemTraCs(item);
                          setKetQuaKiemTra(item.ketQuaKiemTra);
                          setGhiChuKt(item.ghiChu);
                        }}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-all shadow-2xs cursor-pointer mx-auto"
                      >
                        Cập nhật KT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL THÊM NGHỆ NHÂN */}
      {showAddNnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-amber-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="size-4" />
                <h3 className="font-bold text-sm">Ghi Nhận Hồ Sơ Nghệ Nhân Di Sản Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddNnModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleThemNn} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên nghệ nhân</label>
                <input
                  type="text"
                  required
                  value={nnHoTen}
                  onChange={(e) => setNnHoTen(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Năm sinh</label>
                  <input
                    type="number"
                    value={nnNamSinh}
                    onChange={(e) => setNnNamSinh(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh hiệu</label>
                  <select
                    value={nnDanhHieu}
                    onChange={(e) => setNnDanhHieu(e.target.value as any)}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  >
                    <option value="NGHE_NHAN_DAN_GIAN">Nghệ nhân Dân gian</option>
                    <option value="NGHE_NHAN_UU_TU">Nghệ nhân Ưu tú</option>
                    <option value="NGHE_NHAN_NHAN_DAN">Nghệ nhân Nhân dân</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại hình di sản</label>
                  <input
                    type="text"
                    value={nnLoaiHinh}
                    onChange={(e) => setNnLoaiHinh(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trợ cấp tháng (VNĐ)</label>
                  <input
                    type="number"
                    value={nnTroCap}
                    onChange={(e) => setNnTroCap(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thành tích truyền dạy</label>
                <textarea
                  rows={2}
                  value={nnTruyenDay}
                  onChange={(e) => setNnTruyenDay(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNnModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-700 text-white font-bold hover:bg-amber-800"
                >
                  Lưu nghệ nhân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CẬP NHẬT KIỂM TRA CƠ SỞ THỂ THAO */}
      {kiemTraCs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-orange-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="size-4" />
                <h3 className="font-bold text-sm">Ghi Nhận Kết Quả Kiểm Tra Cơ Sở TDTT</h3>
              </div>
              <button
                type="button"
                onClick={() => setKiemTraCs(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLuuKiemTraCs} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="font-bold text-slate-900">{kiemTraCs.tenCoSo}</div>
                <div className="text-[11px] text-slate-500">{kiemTraCs.diaChi} ({kiemTraCs.loaiHinh})</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kết luận kiểm tra</label>
                <select
                  value={ketQuaKiemTra}
                  onChange={(e) => setKetQuaKiemTra(e.target.value as any)}
                  className="w-full rounded border border-slate-300 p-2 text-xs font-bold"
                >
                  <option value="DAT_CHUAN">Đạt chuẩn điều kiện hoạt động TDTT</option>
                  <option value="CAN_KHAC_PHUC">Cần khắc phục (Nhắc nhở bổ sung)</option>
                  <option value="DINH_CHI">Đình chỉ hoạt động (Không bảo đảm an toàn)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú &amp; Yêu cầu khắc phục</label>
                <textarea
                  rows={3}
                  value={ghiChuKt}
                  onChange={(e) => setGhiChuKt(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setKiemTraCs(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-orange-700 text-white font-bold hover:bg-orange-800"
                >
                  Lưu biên bản kiểm tra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
