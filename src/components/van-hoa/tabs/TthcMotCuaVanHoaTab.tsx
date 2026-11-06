import { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";
import { type HoSoTTHCVanHoaItem } from "@/data/domain-mock";
import { TRANG_THAI_TTHC_LABELS } from "../utils";

interface TthcMotCuaVanHoaTabProps {
  hoSoList: HoSoTTHCVanHoaItem[];
  onOpenAddModal: () => void;
  onOpenKySoModal: (hoSo: HoSoTTHCVanHoaItem) => void;
}

export function TthcMotCuaVanHoaTab({
  hoSoList,
  onOpenAddModal,
  onOpenKySoModal,
}: TthcMotCuaVanHoaTabProps) {
  const [search, setSearch] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  const filtered = hoSoList.filter((h) => {
    const matchSearch =
      search.trim() === "" ||
      h.tenThuTuc.toLowerCase().includes(search.toLowerCase()) ||
      h.nguoiNop.toLowerCase().includes(search.toLowerCase()) ||
      h.maHoSo.toLowerCase().includes(search.toLowerCase()) ||
      h.cccd.includes(search);
    const matchTt = filterTrangThai === "ALL" || h.trangThai === filterTrangThai;
    return matchSearch && matchTt;
  });

  return (
    <div className="space-y-6">
      {/* 6 bước vòng đời TTHC Một cửa */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Quy trình Một cửa Liên thông 6 bước Lĩnh vực Văn hóa - Xã hội
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Căn cứ Nghị định số 61/2018/NĐ-CP và Quyết định công bố TTHC của UBND tỉnh Bình Dương
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tiếp nhận Hồ sơ mới (Mẫu 01)</span>
          </button>
        </div>

        {/* 6 steps visual bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-2.5">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-0.5">Bước 1</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Tiếp nhận hồ sơ</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Một cửa cấp giấy hẹn</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
            <div className="font-bold text-slate-600 dark:text-slate-400 mb-0.5">Bước 2</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Chuyển xử lý</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Giao CC VH-XH thụ lý</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
            <div className="font-bold text-slate-600 dark:text-slate-400 mb-0.5">Bước 3</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Thẩm định hồ sơ</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Xác minh thực địa cơ sở</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
            <div className="font-bold text-slate-600 dark:text-slate-400 mb-0.5">Bước 4</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Trình Lãnh đạo</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Chủ tịch/Phó CT phê duyệt</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg p-2.5">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-0.5">Bước 5</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Ký số SmartCA</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Con dấu điện tử SHA-256</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
            <div className="font-bold text-slate-600 dark:text-slate-400 mb-0.5">Bước 6</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Trả kết quả</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Bản giấy hoặc file số hóa</div>
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên thủ tục, mã hồ sơ, người nộp, CCCD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái hồ sơ</option>
            <option value="TIEP_NHAN">Mới tiếp nhận</option>
            <option value="DANG_THAM_DINH">Đang thẩm định</option>
            <option value="TRINH_LANH_DAO">Trình Lãnh đạo</option>
            <option value="CHO_TRA_KET_QUA">Chờ trả kết quả</option>
            <option value="DA_HOAN_THANH">Đã ký số SmartCA (Hoàn thành)</option>
          </select>
        </div>
      </div>

      {/* Table danh sách hồ sơ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Mã hồ sơ / Tên thủ tục</th>
                <th className="py-3 px-4">Người nộp &amp; Địa chỉ</th>
                <th className="py-3 px-4">Tiếp nhận &amp; Hẹn trả</th>
                <th className="py-3 px-4 text-center">Trạng thái giải quyết</th>
                <th className="py-3 px-4">Chữ ký số SmartCA</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    Không có hồ sơ TTHC nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const statusInfo = TRANG_THAI_TTHC_LABELS[item.trangThai] || {
                    label: item.trangThai,
                    color: "bg-slate-100 text-slate-700",
                  };

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.tenThuTuc}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[11px]">
                            {item.maHoSo}
                          </span>
                          <span>•</span>
                          <span>Mã TTHC: {item.maThuTuc}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {item.nguoiNop}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          CCCD: {item.cccd} • SĐT: {item.sdt}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {item.diaChi} ({item.khuPho})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-slate-700 dark:text-slate-300">
                          Nhận: {item.ngayTiepNhan}
                        </div>
                        <div className="font-medium text-blue-600 dark:text-blue-400">
                          Hẹn: {item.ngayHenTra}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Thụ lý: {item.canBoThuLy}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {item.kySoSmartCA ? (
                          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg">
                            <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {item.kySoSmartCA.nguoiKy}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {item.kySoSmartCA.chucVu}
                            </div>
                            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 truncate max-w-[140px] mt-0.5">
                              {item.kySoSmartCA.maXacThuc}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Chưa ký số duyệt</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.trangThai !== "DA_HOAN_THANH" ? (
                          <button
                            type="button"
                            onClick={() => onOpenKySoModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Ký số công vụ</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã phát hành</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
