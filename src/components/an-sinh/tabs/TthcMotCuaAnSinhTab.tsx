import { useState, useMemo } from "react";
import {
  FileSignature,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  QrCode,
  FileText,
  DollarSign,
  Send,
  Eye,
} from "lucide-react";
import { type HoSoTTHCAnSinhItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface TthcMotCuaAnSinhTabProps {
  tthcList: HoSoTTHCAnSinhItem[];
  onOpenAddModal: () => void;
  onOpenKySoModal: (item: HoSoTTHCAnSinhItem) => void;
  onViewQuyetDinh: (item: HoSoTTHCAnSinhItem) => void;
}

export function TthcMotCuaAnSinhTab({
  tthcList,
  onOpenAddModal,
  onOpenKySoModal,
  onViewQuyetDinh,
}: TthcMotCuaAnSinhTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterThuTuc, setFilterThuTuc] = useState("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  const filteredList = useMemo(() => {
    return tthcList.filter((item) => {
      if (filterThuTuc !== "ALL" && item.maThuTuc !== filterThuTuc) return false;
      if (filterTrangThai !== "ALL" && item.trangThai !== filterTrangThai) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.maHoSo.toLowerCase().includes(q) ||
          item.nguoiNop.toLowerCase().includes(q) ||
          item.cccd.includes(q) ||
          item.tenThuTuc.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tthcList, filterThuTuc, filterTrangThai, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Banner Nghị định 61/2018/NĐ-CP & Đề án 06 */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-900 flex items-start gap-2.5">
        <ShieldCheck className="size-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Cơ chế Một cửa điện tử liên thông & Ký số SmartCA (Nghị định 61/2018/NĐ-CP & NĐ 107/2021/NĐ-CP):</strong>{" "}
          Tiếp nhận hồ sơ trực tiếp tại Bộ phận Một cửa hoặc trực tuyến qua Cổng Dịch vụ công Quốc gia;
          tự động đối soát CCCD với CSDL Quốc gia về Dân cư; luân chuyển điện tử giữa Công chức Văn hóa - Xã hội và
          Chủ tịch UBND Phường ký số kết quả giải quyết TTHC.
        </div>
      </div>

      {/* Thanh công cụ và bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo mã hồ sơ, người nộp, CCCD, tên thủ tục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
            />
          </div>

          <select
            value={filterThuTuc}
            onChange={(e) => setFilterThuTuc(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả thủ tục</option>
            <option value="TDM-AS-01">TDM-AS-01: Mai táng phí BTXH</option>
            <option value="TDM-AS-02">TDM-AS-02: Xác định mức độ khuyết tật</option>
            <option value="TDM-AS-03">TDM-AS-03: Trợ cấp người cao tuổi 80+</option>
            <option value="TDM-AS-04">TDM-AS-04: Công nhận hộ nghèo mới</option>
          </select>

          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CHO_THAM_DINH">Chờ thẩm định</option>
            <option value="DANG_XU_LY">Đang xử lý</option>
            <option value="CHO_LANH_DAO_KY">Chờ lãnh đạo ký số</option>
            <option value="DA_KY_SO">Đã ký số SmartCA</option>
            <option value="DA_TRA_KET_QUA">Đã trả kết quả</option>
          </select>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs shrink-0 transition-colors"
        >
          <Plus className="size-3.5" />
          Tiếp nhận hồ sơ Một cửa (Mẫu 01)
        </button>
      </div>

      {/* Bảng danh sách TTHC */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                <th className="py-2.5 px-3">Mã hồ sơ & Thủ tục</th>
                <th className="py-2.5 px-3">Người nộp & CCCD</th>
                <th className="py-2.5 px-3">Đối tượng thụ hưởng</th>
                <th className="py-2.5 px-3">Kinh phí trợ cấp</th>
                <th className="py-2.5 px-3">Hạn trả kết quả</th>
                <th className="py-2.5 px-3">Cán bộ thụ lý</th>
                <th className="py-2.5 px-3">Trạng thái TTHC</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#3c8dbc] font-mono">{item.maHoSo}</div>
                      <div className="font-semibold text-gray-900 line-clamp-1 max-w-[240px]">
                        {item.tenThuTuc}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">Mã TTHC: {item.maThuTuc}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-800">{item.nguoiNop}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.cccd} · {item.soDienThoai}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-800">{item.doiTuongThuHuong}</div>
                      <div className="text-[10px] text-teal-700 font-medium">{item.loaiDoiTuong}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.mucTienHoTroVND > 0 ? (
                        <div className="font-bold text-[#dd4b39] font-mono text-sm">
                          {formatVND(item.mucTienHoTroVND)}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Phi tài chính</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-gray-900 font-semibold">{item.ngayHenTra}</div>
                      <div className="text-[10px] text-gray-500">Nhận: {item.ngayTiepNhan}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-800">{item.canBoThuLy}</div>
                      <div className="text-[10px] text-gray-500">
                        {item.hinhThucNop === "DVC_TRUC_TUYEN_QUOC_GIA" ? "🌐 DVC Quốc gia" : "🏛️ Một cửa trực tiếp"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.trangThai === "DA_KY_SO" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Đã ký số SmartCA
                        </span>
                      )}
                      {item.trangThai === "CHO_LANH_DAO_KY" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                          <Clock className="size-3 text-purple-600" />
                          Chờ lãnh đạo ký
                        </span>
                      )}
                      {item.trangThai === "DANG_XU_LY" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                          <Clock className="size-3 text-sky-600" />
                          Đang thụ lý
                        </span>
                      )}
                      {item.trangThai === "CHO_THAM_DINH" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          <Clock className="size-3 text-amber-600" />
                          Chờ thẩm định
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.trangThai === "CHO_LANH_DAO_KY" ? (
                        <button
                          onClick={() => onOpenKySoModal(item)}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <FileSignature className="size-3" />
                          Ký số SmartCA
                        </button>
                      ) : item.quyetDinhKySo ? (
                        <button
                          onClick={() => onViewQuyetDinh(item)}
                          className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="size-3" />
                          Xem Quyết định
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Đang luân chuyển</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
