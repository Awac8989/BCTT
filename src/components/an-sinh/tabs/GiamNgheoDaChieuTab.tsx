import { useState, useMemo } from "react";
import {
  Home,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  DollarSign,
  Layers,
  FileCheck2,
  Building,
} from "lucide-react";
import { type HoGheoCanGheoItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface GiamNgheoDaChieuTabProps {
  hoGheoList: HoGheoCanGheoItem[];
  onOpenChamDiemModal: (item: HoGheoCanGheoItem) => void;
}

export function GiamNgheoDaChieuTab({
  hoGheoList,
  onOpenChamDiemModal,
}: GiamNgheoDaChieuTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterPhanLoai, setFilterPhanLoai] = useState("ALL");

  const filteredList = useMemo(() => {
    return hoGheoList.filter((item) => {
      if (filterKhuPho !== "ALL" && item.khuPho !== filterKhuPho) return false;
      if (filterPhanLoai !== "ALL" && item.phanLoai !== filterPhanLoai) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.hoTenChuHo.toLowerCase().includes(q) ||
          item.cccdChuHo.includes(q) ||
          item.maHo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [hoGheoList, filterKhuPho, filterPhanLoai, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Khung hướng dẫn quy trình QĐ 24/2021/QĐ-TTg */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-start gap-2.5">
        <Layers className="size-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Quy trình rà soát Hộ nghèo định kỳ (Quyết định 24/2021/QĐ-TTg & NĐ 07/2021/NĐ-CP):</strong>{" "}
          Đánh giá đa chiều dựa trên mức thu nhập thành thị (&le; 2.000.000đ/người/tháng) và 06 dịch vụ xã hội cơ bản:
          Việc làm, Y tế, Giáo dục, Nhà ở, Nước sinh hoạt & vệ sinh, Thông tin. Đảm bảo 100% hộ nghèo được cấp thẻ BHYT và tiếp cận vốn vay Ngân hàng CSXH.
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo chủ hộ, CCCD, mã hộ gia đình..."
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
            value={filterPhanLoai}
            onChange={(e) => setFilterPhanLoai(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả phân loại</option>
            <option value="HO_NGHEO">Hộ nghèo đa chiều</option>
            <option value="HO_CAN_NGHEO">Hộ cận nghèo</option>
            <option value="MUC_SONG_TRUNG_BINH">Mức sống trung bình (Thoát nghèo)</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Tổng số hộ: <strong className="text-gray-900 font-mono">{filteredList.length}</strong> hộ
        </div>
      </div>

      {/* Bảng danh sách Hộ nghèo */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                <th className="py-2.5 px-3">Mã hộ & Chủ hộ</th>
                <th className="py-2.5 px-3">CCCD & Khẩu</th>
                <th className="py-2.5 px-3">Khu phố</th>
                <th className="py-2.5 px-3">Phân loại chuẩn nghèo</th>
                <th className="py-2.5 px-3">Chiều thiếu hụt dịch vụ cơ bản</th>
                <th className="py-2.5 px-3">Chính sách đã nhận</th>
                <th className="py-2.5 px-3">Vốn vay CSXH</th>
                <th className="py-2.5 px-3">Hiện trạng nhà ở</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{item.hoTenChuHo}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.maHo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div>{item.cccdChuHo}</div>
                      <div className="text-[10px] text-gray-500">{item.soNhanKhau} nhân khẩu</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-800">
                      {item.khuPho}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.phanLoai === "HO_NGHEO" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          <AlertTriangle className="size-3 text-rose-600" />
                          Hộ nghèo
                        </span>
                      )}
                      {item.phanLoai === "HO_CAN_NGHEO" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          <AlertTriangle className="size-3 text-amber-600" />
                          Hộ cận nghèo
                        </span>
                      )}
                      {item.phanLoai === "MUC_SONG_TRUNG_BINH" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Đã thoát nghèo
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.chieuThieuHut.map((ch, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] border border-gray-200"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col gap-0.5 text-[11px] text-gray-600">
                        {item.chinhSachDaNhan.map((cs, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="size-1 rounded-full bg-emerald-500" />
                            <span>{cs}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-emerald-700 font-mono">
                        {formatVND(item.soTienVayCSXHVND)}
                      </div>
                      <div className="text-[10px] text-gray-500">Lãi suất 0.55%/tháng</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-700">
                        {item.tinhTrangNhaO === "NHA_KAP_4_XUNG_CAP" && "Nhà cấp 4 xuống cấp"}
                        {item.tinhTrangNhaO === "DA_XAY_DAI_DOAN_KET" && "Đã xây nhà Đại đoàn kết"}
                        {item.tinhTrangNhaO === "KIEN_CO" && "Nhà kiên cố"}
                      </div>
                      <div className="text-[10px] text-emerald-600">Mục tiêu: {item.mucTieuThoatNgheoNam}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenChamDiemModal(item)}
                        className="px-2.5 py-1 rounded bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <FileCheck2 className="size-3" />
                        Chấm điểm B1/B2
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
