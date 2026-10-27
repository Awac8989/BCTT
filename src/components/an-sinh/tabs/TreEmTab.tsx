import { useState, useMemo } from "react";
import {
  Baby,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
  Heart,
  FileSignature,
  Waves,
} from "lucide-react";
import { type TreEmHoanCanhDacBiet } from "@/data/domain-mock";

interface TreEmTabProps {
  treEmList: TreEmHoanCanhDacBiet[];
  onOpenCanThiepModal: (item: TreEmHoanCanhDacBiet) => void;
}

export function TreEmTab({ treEmList, onOpenCanThiepModal }: TreEmTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterLoai, setFilterLoai] = useState("ALL");

  const filteredList = useMemo(() => {
    return treEmList.filter((item) => {
      if (filterKhuPho !== "ALL" && item.khuPho !== filterKhuPho) return false;
      if (filterLoai !== "ALL" && item.loaiHoanCanh !== filterLoai) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.hoTen.toLowerCase().includes(q) ||
          item.hoTenNguoiGiamHo.toLowerCase().includes(q) ||
          item.diaChi.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [treEmList, filterKhuPho, filterLoai, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Banner Luật Trẻ em 2016 & Nghị định 56/2017/NĐ-CP */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-900 flex items-start gap-2.5">
        <Heart className="size-4 text-pink-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Công tác Bảo vệ và Chăm sóc Trẻ em (Luật Trẻ em 2016 & Nghị định 56/2017/NĐ-CP):</strong>{" "}
          Tiếp nhận tin báo nguy cơ bạo lực, xâm hại trẻ em qua Tổng đài Quốc gia 111 hoặc Tổ tự quản khu phố;
          xây dựng <strong>Kế hoạch hỗ trợ can thiệp trẻ em (Mẫu số 01/PLI)</strong> do Chủ tịch UBND Phường phê duyệt;
          triển khai mô hình Ngôi nhà an toàn và phổ cập bơi phòng chống đuối nước 100% trẻ em địa bàn.
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên trẻ, người giám hộ, địa chỉ..."
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
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả hoàn cảnh</option>
            <option value="TRE_MO_COI">Trẻ mồ côi</option>
            <option value="TRE_KHUYET_TAT">Trẻ khuyết tật</option>
            <option value="HO_NGHEO_KHO_KHAN">Hộ nghèo khó khăn</option>
            <option value="TRE_CO_NGUY_CO_BO_HOC">Nguy cơ bỏ học</option>
            <option value="NAN_NHAN_BAO_LUC_GIA_DINH">Nạn nhân bạo lực gia đình</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Trẻ em theo dõi: <strong className="text-pink-700 font-mono">{filteredList.length}</strong> em
        </div>
      </div>

      {/* Bảng danh sách trẻ em */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                <th className="py-2.5 px-3">Họ tên trẻ em</th>
                <th className="py-2.5 px-3">Ngày sinh & Giới tính</th>
                <th className="py-2.5 px-3">Người giám hộ & SĐT</th>
                <th className="py-2.5 px-3">Khu phố & Địa chỉ</th>
                <th className="py-2.5 px-3">Hoàn cảnh đặc biệt</th>
                <th className="py-2.5 px-3">Chính sách & Học bổng</th>
                <th className="py-2.5 px-3">Phòng chống đuối nước</th>
                <th className="py-2.5 px-3">Theo dõi can thiệp</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-pink-50/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-gray-900">
                      {item.hoTen}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div>{item.ngaySinh}</div>
                      <div className="text-[10px] text-gray-500">Giới tính: {item.gioiTinh}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-800">{item.hoTenNguoiGiamHo} ({item.quanHe})</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.sdtNguoiGiamHo}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-800">{item.khuPho}</div>
                      <div className="text-[10px] text-gray-500 max-w-[160px] truncate">{item.diaChi}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.loaiHoanCanh === "TRE_MO_COI" && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                          Trẻ mồ côi
                        </span>
                      )}
                      {item.loaiHoanCanh === "HO_NGHEO_KHO_KHAN" && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Hộ nghèo khó khăn
                        </span>
                      )}
                      {item.loaiHoanCanh === "TRE_KHUYET_TAT" && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Trẻ khuyết tật
                        </span>
                      )}
                      {item.loaiHoanCanh === "TRE_CO_NGUY_CO_BO_HOC" && (
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold text-[10px]">
                          Nguy cơ bỏ học
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-gray-800 max-w-[180px] line-clamp-2">{item.chinhSachTroCap}</div>
                      {item.daDuocTangHocBong && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
                          <GraduationCap className="size-3 text-emerald-600" />
                          Đã cấp học bổng an sinh
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.daHocBoiPhongDuoiNuoc ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          <Waves className="size-3 text-emerald-600" />
                          Đã biết bơi an toàn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                          Chưa học bơi
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px] max-w-[200px]">
                      {item.ghiChuTheoDoi}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenCanThiepModal(item)}
                        className="px-2.5 py-1 rounded bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <FileSignature className="size-3" />
                        Lập KH Can thiệp
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
