import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Printer,
  Plus,
  X,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Building,
  Briefcase,
} from "lucide-react";
import { appStore, useAppState } from "@/services/app-state";
import { type LichTuanItem } from "@/data/domain-mock";

export function LichTuanLanhDao() {
  const { lichTuanList, currentUser } = useAppState();

  const [filterChuTri, setFilterChuTri] = useState<string>("ALL");
  const [modalThemLich, setModalThemLich] = useState(false);

  // Form thêm lịch mới
  const [thuTrongTuan, setThuTrongTuan] = useState<LichTuanItem["thuTrongTuan"]>("THU_BA");
  const [ngay, setNgay] = useState("28/10/2026");
  const [buoi, setBuoi] = useState<"SANG" | "CHIEU">("SANG");
  const [gio, setGio] = useState("08h30 - 11h00");
  const [noiDung, setNoiDung] = useState("");
  const [chuTri, setChuTri] = useState("Chủ tịch UBND Phường");
  const [thanhPhan, setThanhPhan] = useState("Lãnh đạo UBND, Công chức chuyên môn liên quan");
  const [diaDiem, setDiaDiem] = useState("Phòng họp số 1 - UBND Phường");
  const [chuanBi, setChuanBi] = useState("Bộ phận Văn phòng chuẩn bị tài liệu");
  const [loaiLich, setLoaiLich] = useState<LichTuanItem["loaiLich"]>("HOP_UBND");

  const filteredLich = lichTuanList.filter((item) => {
    if (filterChuTri === "ALL") return true;
    return item.chuTri.toLowerCase().includes(filterChuTri.toLowerCase());
  });

  const handleLuuLich = () => {
    if (!noiDung.trim()) {
      toast.error("Vui lòng nhập nội dung công tác!");
      return;
    }

    appStore.themLichTuan({
      thuTrongTuan,
      ngay,
      buoi,
      gio,
      noiDung: noiDung.trim(),
      chuTri,
      thanhPhan,
      diaDiem,
      chuanBi,
      loaiLich,
    });

    toast.success("Đã ghi nhận nội dung công tác vào Lịch tuần của Lãnh đạo UBND Phường!");
    setModalThemLich(false);
    setNoiDung("");
  };

  const getDayLabel = (thu: LichTuanItem["thuTrongTuan"]) => {
    switch (thu) {
      case "THU_HAI":
        return "Thứ Hai";
      case "THU_BA":
        return "Thứ Ba";
      case "THU_TU":
        return "Thứ Tư";
      case "THU_NAM":
        return "Thứ Năm (Tiếp công dân)";
      case "THU_SAU":
        return "Thứ Sáu";
      case "THU_BAY":
        return "Thứ Bảy";
      case "CHU_NHAT":
        return "Chủ Nhật";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Lịch Tuần */}
      <div className="bg-gradient-to-r from-[#222d32] via-[#2c3b41] to-[#1e282c] border-b-2 border-[#dd4b39] text-white rounded-xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dd4b39]/20 border border-[#dd4b39]/40 text-red-200 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            Ủy ban nhân dân Phường Thủ Dầu Một · Quy chế làm việc
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Lịch Công Tác Tuần Thường Trực Đảng Ủy - HĐND - UBND Phường
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tuần lễ từ 27/10/2026 đến 02/11/2026 · Định kỳ Thứ 5 hàng tuần: <strong>Chủ tịch UBND Phường tiếp công dân trực tiếp</strong> tại Phòng Tiếp dân · Phân công nhiệm vụ cụ thể cho từng buổi làm việc và thành phần dự họp.
          </p>
        </div>
      </div>

      {/* Thanh công cụ và lọc lãnh đạo */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Lọc theo Lãnh đạo chủ trì:
          </label>
          <select
            value={filterChuTri}
            onChange={(e) => setFilterChuTri(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none cursor-pointer font-medium"
          >
            <option value="ALL">-- Tất cả Lãnh đạo --</option>
            <option value="Chủ tịch">Chủ tịch UBND Phường</option>
            <option value="Văn hóa">Phó Chủ tịch (Khối VH-XH)</option>
            <option value="Đô thị">Phó Chủ tịch (Khối Đô thị)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toast.success("Đang chuẩn bị file PDF Lịch tuần gửi Thường trực Đảng ủy và các khu phố...");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>In / Xuất Bản Lịch Tuần</span>
          </button>

          <button
            type="button"
            onClick={() => setModalThemLich(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Ký Lịch Công Tác Mới</span>
          </button>
        </div>
      </div>

      {/* Bảng Lịch Tuần chuẩn hành chính */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-center w-28">Thứ & Ngày</th>
                <th className="px-4 py-3 text-center w-20">Buổi</th>
                <th className="px-4 py-3 text-center w-28">Thời gian</th>
                <th className="px-4 py-3">Nội dung công tác</th>
                <th className="px-4 py-3">Lãnh đạo chủ trì</th>
                <th className="px-4 py-3">Thành phần tham dự</th>
                <th className="px-4 py-3">Địa điểm & Cán bộ chuẩn bị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLich.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                    item.loaiLich === "TIEP_DAN"
                      ? "bg-amber-50/40 dark:bg-amber-950/20 font-medium"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {getDayLabel(item.thuTrongTuan)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{item.ngay}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.buoi === "SANG"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {item.buoi === "SANG" ? "Sáng" : "Chiều"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {item.gio}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {item.noiDung}
                    </p>
                    {item.loaiLich === "TIEP_DAN" && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase">
                        Luật Tiếp công dân 2013
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-indigo-700 dark:text-indigo-400">
                      {item.chuTri}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      {item.thanhPhan}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium">
                      <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                      <span>{item.diaDiem}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 italic">
                      Chuẩn bị: {item.chuanBi}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Đăng Ký Lịch Công Tác Mới */}
      {modalThemLich && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#dd4b39]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Đăng Ký Lịch Công Tác Lãnh Đạo UBND Phường
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalThemLich(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Thứ:</label>
                  <select
                    value={thuTrongTuan}
                    onChange={(e) => setThuTrongTuan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="THU_HAI">Thứ Hai</option>
                    <option value="THU_BA">Thứ Ba</option>
                    <option value="THU_TU">Thứ Tư</option>
                    <option value="THU_NAM">Thứ Năm</option>
                    <option value="THU_SAU">Thứ Sáu</option>
                    <option value="THU_BAY">Thứ Bảy</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Ngày:</label>
                  <input
                    type="text"
                    value={ngay}
                    onChange={(e) => setNgay(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Buổi:</label>
                  <select
                    value={buoi}
                    onChange={(e) => setBuoi(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="SANG">Sáng</option>
                    <option value="CHIEU">Chiều</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Thời gian (giờ):</label>
                  <input
                    type="text"
                    value={gio}
                    onChange={(e) => setGio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Lãnh đạo chủ trì:</label>
                  <select
                    value={chuTri}
                    onChange={(e) => setChuTri(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Chủ tịch UBND Phường">Chủ tịch UBND Phường</option>
                    <option value="Phó Chủ tịch UBND (Văn hóa - Xã hội)">Phó Chủ tịch UBND (Văn hóa - Xã hội)</option>
                    <option value="Phó Chủ tịch UBND (Kinh tế - Đô thị)">Phó Chủ tịch UBND (Kinh tế - Đô thị)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Nội dung công tác:</label>
                <textarea
                  rows={3}
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  placeholder="Nhập nội dung cuộc họp hoặc buổi kiểm tra thực địa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Thành phần tham dự:</label>
                <input
                  type="text"
                  value={thanhPhan}
                  onChange={(e) => setThanhPhan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Địa điểm:</label>
                  <input
                    type="text"
                    value={diaDiem}
                    onChange={(e) => setDiaDiem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Cán bộ chuẩn bị:</label>
                  <input
                    type="text"
                    value={chuanBi}
                    onChange={(e) => setChuanBi(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalThemLich(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLuuLich}
                className="px-4 py-2 rounded-xl bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Lưu Vào Lịch Tuần
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
