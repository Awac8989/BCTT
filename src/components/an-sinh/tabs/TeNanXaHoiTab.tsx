import { useState, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  HeartHandshake,
  DollarSign,
} from "lucide-react";
import { type HoSoPhongChongTeNan } from "@/data/domain-mock";

interface TeNanXaHoiTabProps {
  teNanList: HoSoPhongChongTeNan[];
  onOpenXetNghiemModal: (item: HoSoPhongChongTeNan) => void;
}

export function TeNanXaHoiTab({ teNanList, onOpenXetNghiemModal }: TeNanXaHoiTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterHinhThuc, setFilterHinhThuc] = useState("ALL");
  const [filterXetNghiem, setFilterXetNghiem] = useState("ALL");

  const filteredList = useMemo(() => {
    return teNanList.filter((item) => {
      if (filterKhuPho !== "ALL" && item.khuPho !== filterKhuPho) return false;
      if (filterHinhThuc !== "ALL" && item.hinhThucCaiNghien !== filterHinhThuc) return false;
      if (filterXetNghiem !== "ALL" && item.ketQuaXetNghiemDinhKy !== filterXetNghiem) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.hoTen.toLowerCase().includes(q) ||
          item.cccd.includes(q) ||
          item.maHoSo.toLowerCase().includes(q) ||
          item.canBoTheoDoi.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [teNanList, filterKhuPho, filterHinhThuc, filterXetNghiem, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Banner Nghị định 116/2021/NĐ-CP */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 flex items-start gap-2.5">
        <ShieldCheck className="size-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Công tác Quản lý sau cai & Tái hòa nhập cộng đồng (Luật Phòng, chống ma túy 2021 & NĐ 116/2021/NĐ-CP):</strong>{" "}
          Quản lý người sau cai nghiện tại nơi cư trú trong thời hạn từ 01 đến 02 năm; phối hợp Công an phường định kỳ xét nghiệm chất ma túy;
          phối hợp Đoàn Thanh niên, Hội CCB giúp đỡ học nghề, vay vốn Quỹ Hoàn lương và giới thiệu việc làm tại các doanh nghiệp.
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, CCCD, mã hồ sơ, cán bộ theo dõi..."
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
            value={filterHinhThuc}
            onChange={(e) => setFilterHinhThuc(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả hình thức</option>
            <option value="DIEU_TRI_METHADONE">Điều trị Methadone</option>
            <option value="HOAN_THANH_SAU_CAI">Quản lý sau cai (1-2 năm)</option>
            <option value="CAI_NGHIEN_TU_NGUYEN_CONG_DONG">Cai nghiện tự nguyện tại cộng đồng</option>
          </select>

          <select
            value={filterXetNghiem}
            onChange={(e) => setFilterXetNghiem(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả kết quả xét nghiệm</option>
            <option value="AM_TINH">Âm tính</option>
            <option value="DUONG_TINH">Dương tính</option>
            <option value="CHUA_DEN_KY">Chưa đến kỳ</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Hồ sơ quản lý: <strong className="text-purple-700 font-mono">{filteredList.length}</strong> người
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                <th className="py-2.5 px-3">Mã & Họ tên</th>
                <th className="py-2.5 px-3">CCCD & Năm sinh</th>
                <th className="py-2.5 px-3">Khu phố</th>
                <th className="py-2.5 px-3">Hình thức quản lý</th>
                <th className="py-2.5 px-3">Cán bộ & Đơn vị theo dõi</th>
                <th className="py-2.5 px-3">Xét nghiệm định kỳ</th>
                <th className="py-2.5 px-3">Hỗ trợ việc làm & Vốn vay</th>
                <th className="py-2.5 px-3">Cập nhật</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{item.hoTen}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.maHoSo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div>{item.cccd}</div>
                      <div className="text-[10px] text-gray-500">Sinh năm: {item.namSinh}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-800">
                      {item.khuPho}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.hinhThucCaiNghien === "DIEU_TRI_METHADONE" && (
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                          Điều trị Methadone
                        </span>
                      )}
                      {item.hinhThucCaiNghien === "HOAN_THANH_SAU_CAI" && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                          Quản lý sau cai (NĐ 116)
                        </span>
                      )}
                      {item.hinhThucCaiNghien === "CAI_NGHIEN_TU_NGUYEN_CONG_DONG" && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Cai tự nguyện tại nhà
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-gray-800 font-medium max-w-[180px]">{item.canBoTheoDoi}</div>
                      <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                        Phối hợp: {item.donViPhoiHop === "CONG_AN_PHUONG" ? "Công an phường" : "Đoàn thanh niên"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.ketQuaXetNghiemDinhKy === "AM_TINH" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Âm tính (Tốt)
                        </span>
                      )}
                      {item.ketQuaXetNghiemDinhKy === "DUONG_TINH" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          <AlertTriangle className="size-3 text-rose-600" />
                          Dương tính (Cảnh báo)
                        </span>
                      )}
                      {item.ketQuaXetNghiemDinhKy === "CHUA_DEN_KY" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-[10px]">
                          <Clock className="size-3 text-gray-500" />
                          Chưa đến kỳ
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700 max-w-[200px]">
                      {item.hoTroViecLam}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500">
                      {item.ngayCapNhat}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenXetNghiemModal(item)}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <RefreshCw className="size-3" />
                        Cập nhật kết quả
                      </button>
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
