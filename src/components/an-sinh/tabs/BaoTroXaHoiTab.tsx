import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserX,
} from "lucide-react";
import { type DoiTuongBaoTroXaHoi } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface BaoTroXaHoiTabProps {
  baoTroList: DoiTuongBaoTroXaHoi[];
  onOpenAddModal: () => void;
  onOpenThoiHuongModal: (item: DoiTuongBaoTroXaHoi) => void;
}

export function BaoTroXaHoiTab({
  baoTroList,
  onOpenAddModal,
  onOpenThoiHuongModal,
}: BaoTroXaHoiTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterLoai, setFilterLoai] = useState("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  const filteredList = useMemo(() => {
    return baoTroList.filter((item) => {
      if (filterKhuPho !== "ALL" && item.khuPho !== filterKhuPho) return false;
      if (filterLoai !== "ALL" && item.loaiDoiTuong !== filterLoai) return false;
      if (filterTrangThai !== "ALL" && item.trangThai !== filterTrangThai) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.hoTen.toLowerCase().includes(q) ||
          item.cccd.includes(q) ||
          item.diaChi.toLowerCase().includes(q) ||
          item.soQuyetDinh.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [baoTroList, filterKhuPho, filterLoai, filterTrangThai, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Thanh công cụ và bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, CCCD, số quyết định..."
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
            <option value="Khu phố 5">Khu phố 5</option>
          </select>

          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả diện đối tượng</option>
            <option value="NGUOI_CAO_TUOI_80">Người cao tuổi đủ 80 tuổi</option>
            <option value="KHUYET_TAT_DAC_BIET_NANG">Khuyết tật đặc biệt nặng</option>
            <option value="KHUYET_TAT_NANG">Khuyết tật nặng</option>
            <option value="TRE_MO_COI">Trẻ em mồ côi</option>
            <option value="DON_THAN_NUOI_CON_NGHEO">Đơn thân nuôi con nghèo</option>
          </select>

          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DANG_HUONG">Đang hưởng</option>
            <option value="TAM_DUNG">Tạm dừng</option>
            <option value="THOI_HUONG">Đã thôi hưởng</option>
          </select>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold shadow-xs shrink-0 transition-colors"
        >
          <Plus className="size-3.5" />
          Tiếp nhận đối tượng BTXH (NĐ 20)
        </button>
      </div>

      {/* Bảng dữ liệu đối tượng BTXH */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                <th className="py-2.5 px-3">Mã & Đối tượng</th>
                <th className="py-2.5 px-3">CCCD & Năm sinh</th>
                <th className="py-2.5 px-3">Khu phố & Địa chỉ</th>
                <th className="py-2.5 px-3">Diện hưởng & Hệ số</th>
                <th className="py-2.5 px-3">Mức trợ cấp (tháng)</th>
                <th className="py-2.5 px-3">Kênh chi trả</th>
                <th className="py-2.5 px-3">Quyết định hưởng</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{item.hoTen}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div>{item.cccd}</div>
                      <div className="text-[10px] text-gray-500">{item.ngaySinh} ({item.gioiTinh})</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-800">{item.khuPho}</div>
                      <div className="text-[11px] text-gray-500 max-w-[180px] truncate">{item.diaChi}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-800">{item.tenLoaiDoiTuong}</div>
                      <div className="text-[10px] text-amber-700 font-mono">Hệ số: {item.heSoHuong}x</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#dd4b39] font-mono text-sm">
                        {formatVND(item.mucTroCapHangThang)}
                      </div>
                      <div className="text-[10px] text-gray-500">Mức chuẩn 540.000đ</div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.hinhThucNhan === "NGAN_HANG" ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                          <CreditCard className="size-3 text-emerald-600" />
                          <span>ATM Đề án 06</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                          <Building className="size-3 text-amber-600" />
                          <span>Bưu cục Phường</span>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500 truncate max-w-[140px] mt-0.5">
                        {item.thongTinChiTra}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <div className="font-semibold text-gray-700">{item.soQuyetDinh}</div>
                      <div className="text-[10px] text-gray-500">Hiệu lực: {item.ngayHieuLuc}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.trangThai === "DANG_HUONG" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Đang hưởng
                        </span>
                      )}
                      {item.trangThai === "TAM_DUNG" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          <AlertCircle className="size-3 text-amber-600" />
                          Tạm dừng
                        </span>
                      )}
                      {item.trangThai === "THOI_HUONG" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-bold text-[10px]">
                          <UserX className="size-3 text-gray-500" />
                          Thôi hưởng
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.trangThai === "DANG_HUONG" ? (
                        <button
                          onClick={() => onOpenThoiHuongModal(item)}
                          className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                          title="Ban hành Quyết định thôi hưởng trợ cấp (khi chết hoặc chuyển khẩu)"
                        >
                          <UserX className="size-3 text-rose-600" />
                          Thôi hưởng
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Đã chốt sổ</span>
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
