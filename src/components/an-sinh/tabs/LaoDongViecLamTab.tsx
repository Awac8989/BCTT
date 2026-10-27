import { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Send,
  Users,
} from "lucide-react";
import { type CungCauLaoDongItem, type CoSoKiemTraATLaoDong } from "@/data/domain-mock";

interface LaoDongViecLamTabProps {
  cungCauList: CungCauLaoDongItem[];
  atLaoDongList: CoSoKiemTraATLaoDong[];
  onOpenKetNoiModal: (item: CungCauLaoDongItem) => void;
}

export function LaoDongViecLamTab({
  cungCauList,
  atLaoDongList,
  onOpenKetNoiModal,
}: LaoDongViecLamTabProps) {
  const [subView, setSubView] = useState<"CUNG_CAU" | "AT_LAO_DONG">("CUNG_CAU");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterDoiTuong, setFilterDoiTuong] = useState("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  const filteredCungCau = useMemo(() => {
    return cungCauList.filter((item) => {
      if (filterKhuPho !== "ALL" && item.khuPho !== filterKhuPho) return false;
      if (filterDoiTuong !== "ALL" && item.doiTuongUuTien !== filterDoiTuong) return false;
      if (filterTrangThai !== "ALL" && item.tinhTrangViecLam !== filterTrangThai) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.hoTen.toLowerCase().includes(q) ||
          item.cccd.includes(q) ||
          item.chuyenMon.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cungCauList, filterKhuPho, filterDoiTuong, filterTrangThai, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Sub-view switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="inline-flex rounded-md shadow-xs bg-gray-100 p-0.5 border border-gray-300">
          <button
            onClick={() => setSubView("CUNG_CAU")}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 ${
              subView === "CUNG_CAU"
                ? "bg-[#3c8dbc] text-white shadow-xs"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            <Briefcase className="size-3.5" />
            Điều tra Cung - Cầu & Kết nối việc làm (TT 01/2022)
          </button>
          <button
            onClick={() => setSubView("AT_LAO_DONG")}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 ${
              subView === "AT_LAO_DONG"
                ? "bg-[#3c8dbc] text-white shadow-xs"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            <ShieldCheck className="size-3.5" />
            Kiểm tra An toàn lao động & HĐLĐ cơ sở
          </button>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Dữ liệu liên thông: <span className="font-bold text-gray-900">KCN Sóng Thần, Đại Đăng, VSIP II</span>
        </div>
      </div>

      {subView === "CUNG_CAU" ? (
        <div className="space-y-4">
          {/* Bộ lọc */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="size-4 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm họ tên, chuyên môn, CCCD..."
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
              value={filterDoiTuong}
              onChange={(e) => setFilterDoiTuong(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
            >
              <option value="ALL">Tất cả đối tượng ưu tiên</option>
              <option value="BO_DOI_XUAT_NGU">Bộ đội / Công an xuất ngũ</option>
              <option value="THANH_NIEN_THAT_NGHIEP">Thanh niên chưa có việc làm</option>
              <option value="MAN_HAN_TU_HOAN_LUONG">Mãn hạn tù hoàn lương</option>
              <option value="LAO_DONG_PHO_THONG">Lao động phổ thông</option>
            </select>

            <select
              value={filterTrangThai}
              onChange={(e) => setFilterTrangThai(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700"
            >
              <option value="ALL">Tất cả tình trạng</option>
              <option value="CHUA_CO_VIEC_LAM">Chưa có việc làm</option>
              <option value="DA_KET_NOI_VIEC_LAM">Đã kết nối việc làm</option>
              <option value="DANG_HOC_NGHE">Đang học nghề</option>
            </select>
          </div>

          {/* Bảng dữ liệu Cung lao động */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                    <th className="py-2.5 px-3">Họ tên & Năm sinh</th>
                    <th className="py-2.5 px-3">CCCD & Khu phố</th>
                    <th className="py-2.5 px-3">Trình độ & Chuyên môn</th>
                    <th className="py-2.5 px-3">Đối tượng ưu tiên</th>
                    <th className="py-2.5 px-3">Mức lương kỳ vọng</th>
                    <th className="py-2.5 px-3">Doanh nghiệp tiếp nhận</th>
                    <th className="py-2.5 px-3">Tình trạng việc làm</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCungCau.map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-gray-900">{item.hoTen}</div>
                          <div className="text-[10px] text-gray-500 font-mono">Sinh năm: {item.namSinh}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <div>{item.cccd}</div>
                          <div className="text-[10px] text-gray-500 font-sans font-semibold">{item.khuPho}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-gray-800">{item.chuyenMon}</div>
                          <div className="text-[10px] text-gray-500">{item.trinhDoHocVan}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          {item.doiTuongUuTien === "BO_DOI_XUAT_NGU" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              🎖️ Bộ đội xuất ngũ
                            </span>
                          )}
                          {item.doiTuongUuTien === "THANH_NIEN_THAT_NGHIEP" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                              Thanh niên tìm việc
                            </span>
                          )}
                          {item.doiTuongUuTien === "MAN_HAN_TU_HOAN_LUONG" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                              Hoàn lương tái hòa nhập
                            </span>
                          )}
                          {item.doiTuongUuTien === "LAO_DONG_PHO_THONG" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-bold text-[10px]">
                              Lao động phổ thông
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#dd4b39]">
                          {item.mucLuongKyVong}
                        </td>
                        <td className="py-2.5 px-3">
                          {item.doanhNghiepTuyenDung ? (
                            <div className="font-semibold text-gray-800 flex items-center gap-1">
                              <Building2 className="size-3 text-[#3c8dbc]" />
                              <span>{item.doanhNghiepTuyenDung}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Chưa kết nối</span>
                          )}
                          <div className="text-[10px] text-gray-500">Cập nhật: {item.ngayCapNhat}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          {item.tinhTrangViecLam === "DA_KET_NOI_VIEC_LAM" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <CheckCircle2 className="size-3 text-emerald-600" />
                              Đã có việc làm
                            </span>
                          )}
                          {item.tinhTrangViecLam === "CHUA_CO_VIEC_LAM" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              <Clock className="size-3 text-amber-600" />
                              Chờ kết nối
                            </span>
                          )}
                          {item.tinhTrangViecLam === "DANG_HOC_NGHE" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                              Đang học nghề
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onOpenKetNoiModal(item)}
                            className="px-2.5 py-1 rounded bg-[#0073b7] hover:bg-[#005a92] text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                          >
                            <Send className="size-3" />
                            Kết nối KCN
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
      ) : (
        /* Kiểm tra An toàn lao động */
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-800 text-xs flex justify-between items-center">
            <span>Danh mục cơ sở sản xuất, gia công trên địa bàn phường (Kiểm tra ATVSLĐ & HĐLĐ)</span>
            <span className="text-gray-500 font-normal">Tổng: {atLaoDongList.length} cơ sở</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold">
                  <th className="py-2.5 px-3">Tên cơ sở & Chủ cơ sở</th>
                  <th className="py-2.5 px-3">Loại hình sản xuất</th>
                  <th className="py-2.5 px-3">Địa chỉ</th>
                  <th className="py-2.5 px-3">Số lao động</th>
                  <th className="py-2.5 px-3">Hợp đồng lao động</th>
                  <th className="py-2.5 px-3">Bảo hộ lao động</th>
                  <th className="py-2.5 px-3">PCCC cơ sở</th>
                  <th className="py-2.5 px-3">Kết luận kiểm tra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {atLaoDongList.map((cs) => (
                  <tr key={cs.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{cs.tenCoSo}</div>
                      <div className="text-[10px] text-gray-500 font-medium">Chủ: {cs.chuCoSo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-700">
                      {cs.loaiHinh === "XUONG_CO_KHI" && "Xưởng cơ khí, tiện hàn"}
                      {cs.loaiHinh === "MAY_GIA_CONG" && "May gia công xuất khẩu"}
                      {cs.loaiHinh === "CHE_BIEN_GO" && "Chế biến đồ gỗ thủ công"}
                      {cs.loaiHinh === "CONG_TRINH_XAY_DUNG_NHA_O" && "Công trình xây dựng nhà ở"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 max-w-[200px] truncate">{cs.diaChi}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{cs.soLaoDong} người</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                        {cs.tinhTrangHopDong}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-700">{cs.trangBiBaoHo}</td>
                    <td className="py-2.5 px-3 font-mono">{cs.soBinhPCCC} bình PCCC</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Đạt chuẩn ATVSLĐ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
