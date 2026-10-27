import { useState, useMemo } from "react";
import {
  Flame,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Wheat,
} from "lucide-react";
import { type HoSoCuuTroDotXuat } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface CuuTroDotXuatTabProps {
  cuuTroList: HoSoCuuTroDotXuat[];
  onOpenAddModal: () => void;
}

export function CuuTroDotXuatTab({ cuuTroList, onOpenAddModal }: CuuTroDotXuatTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterSuCo, setFilterSuCo] = useState("ALL");

  const filteredList = useMemo(() => {
    return cuuTroList.filter((item) => {
      if (filterKhuPho !== "ALL" && item.khuPho !== filterKhuPho) return false;
      if (filterSuCo !== "ALL" && item.loaiSuCo !== filterSuCo) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.hoTenChuHo.toLowerCase().includes(q) ||
          item.cccd.includes(q) ||
          item.diaChi.toLowerCase().includes(q) ||
          item.moTaThietHai.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cuuTroList, filterKhuPho, filterSuCo, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Banner Nghị định 20/2021/NĐ-CP Điều 12, 13 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-900 flex items-start gap-2.5">
        <Flame className="size-4 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Trợ giúp xã hội khẩn cấp (Điều 12, 13 Nghị định 20/2021/NĐ-CP):</strong>{" "}
          Hỗ trợ hộ gia đình có nhà ở bị đổ, sập, trôi, cháy, hư hỏng nặng do thiên tai, hỏa hoạn (mức hỗ trợ 20.000.000đ - 40.000.000đ);
          hỗ trợ lương thực cứu đói khẩn cấp 15kg gạo/khẩu/tháng; hỗ trợ chi phí mai táng đối với người chết, mất tích do thiên tai, dịch bệnh.
        </div>
      </div>

      {/* Thanh công cụ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo chủ hộ, CCCD, mô tả thiệt hại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
            />
          </div>

          <select
            value={filterKhuPho}
            onChange={(e) => setFilterKhuPho(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả khu phố</option>
            <option value="Khu phố 1">Khu phố 1</option>
            <option value="Khu phố 2">Khu phố 2</option>
            <option value="Khu phố 3">Khu phố 3</option>
            <option value="Khu phố 4">Khu phố 4</option>
          </select>

          <select
            value={filterSuCo}
            onChange={(e) => setFilterSuCo(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả loại sự cố</option>
            <option value="HOA_HOAN_CHAY_NHA">Hỏa hoạn cháy nhà</option>
            <option value="THIEN_TAI_GIONG_LOC">Thiên tai, giông lốc</option>
            <option value="TAI_NAN_NGHIEM_TRONG">Tai nạn giao thông nghiêm trọng</option>
            <option value="BENH_HIEM_NGHEO">Bệnh hiểm nghèo đột xuất</option>
          </select>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs shrink-0 transition-colors"
        >
          <Plus className="size-3.5" />
          Tiếp nhận hồ sơ cứu trợ đột xuất
        </button>
      </div>

      {/* Bảng danh sách cứu trợ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                <th className="py-2.5 px-3">Mã & Chủ hộ</th>
                <th className="py-2.5 px-3">CCCD & Khu phố</th>
                <th className="py-2.5 px-3">Loại sự cố rủi ro</th>
                <th className="py-2.5 px-3">Mô tả mức độ thiệt hại</th>
                <th className="py-2.5 px-3">Mức hỗ trợ tài chính</th>
                <th className="py-2.5 px-3">Lương thực cứu đói</th>
                <th className="py-2.5 px-3">Thời gian xảy ra</th>
                <th className="py-2.5 px-3">Trạng thái phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{item.hoTenChuHo}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div>{item.cccd}</div>
                      <div className="text-[10px] text-gray-500 font-sans font-semibold">{item.khuPho}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.loaiSuCo === "HOA_HOAN_CHAY_NHA" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          🔥 Hỏa hoạn cháy nhà
                        </span>
                      )}
                      {item.loaiSuCo === "THIEN_TAI_GIONG_LOC" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                          🌪️ Giông lốc tốc mái
                        </span>
                      )}
                      {item.loaiSuCo === "TAI_NAN_NGHIEM_TRONG" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          ⚠️ Tai nạn nghiêm trọng
                        </span>
                      )}
                      {item.loaiSuCo === "BENH_HIEM_NGHEO" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                          🏥 Bệnh hiểm nghèo
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700 max-w-[240px]">
                      {item.moTaThietHai}
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate">{item.diaChi}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#dd4b39] text-sm">
                      {formatVND(item.soTienHoTroVND)}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.soKgGao > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold font-mono">
                          <Wheat className="size-3 text-amber-600" />
                          {item.soKgGao} kg gạo
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Không cấp gạo</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">
                      <div>{item.ngayXayRa}</div>
                      <div className="text-[10px] text-gray-400">Duyệt: {item.ngayPheDuyet}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Đã chi trả ({item.nguoiPheDuyet})
                      </span>
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
