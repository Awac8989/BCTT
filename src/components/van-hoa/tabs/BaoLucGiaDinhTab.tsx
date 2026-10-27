import { useState } from "react";
import {
  Heart,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  Clock,
  Building2,
  Home,
  Gavel,
} from "lucide-react";
import { type DiaChiTinCayItem, type HoSoBaoLucGiaDinhItem } from "@/data/domain-mock";
import { BIEN_PHAP_PCBLGD_LABELS } from "../utils";

interface BaoLucGiaDinhTabProps {
  diaChiList: DiaChiTinCayItem[];
  hoSoList: HoSoBaoLucGiaDinhItem[];
  onTriggerSupport: (diaChiId: string) => void;
  onOpenCamTiepXucModal: (hoSo: HoSoBaoLucGiaDinhItem) => void;
}

export function BaoLucGiaDinhTab({
  diaChiList,
  hoSoList,
  onTriggerSupport,
  onOpenCamTiepXucModal,
}: BaoLucGiaDinhTabProps) {
  const [subView, setSubView] = useState<"DIA_CHI" | "HO_SO">("HO_SO");

  return (
    <div className="space-y-6">
      {/* Banner Phòng chống bạo lực gia đình */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-purple-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5" />
            Luật Phòng, chống bạo lực gia đình 2022
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Mạng lưới Địa chỉ Tin cậy & Cơ chế Bảo vệ Khẩn cấp Nạn nhân
          </h3>
          <p className="text-rose-100 text-sm leading-relaxed mb-4">
            Triển khai đồng bộ mạng lưới &quot;Địa chỉ tin cậy tại cộng đồng&quot; và thẩm quyền của Chủ tịch UBND cấp xã ban hành Quyết định cấm tiếp xúc (Điều 25 Luật PCBLGĐ 2022). Bảo đảm an toàn tính mạng, sức khỏe cho nạn nhân, cung cấp nơi tạm lánh khẩn cấp và tư vấn trợ giúp pháp lý.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Home className="w-4 h-4 text-amber-300" />
              <span>{diaChiList.length} Địa chỉ tin cậy trực tiếp nhận nạn nhân 24/7</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Gavel className="w-4 h-4 text-rose-300" />
              <span>Quyết định cấm tiếp xúc Chủ tịch UBND có hiệu lực tức thì</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Đường dây nóng can thiệp khẩn cấp: 111 / Công an: 113</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setSubView("HO_SO")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            subView === "HO_SO"
              ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          Hồ sơ Vụ việc & Quyết định Cấm tiếp xúc ({hoSoList.length})
        </button>
        <button
          type="button"
          onClick={() => setSubView("DIA_CHI")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            subView === "DIA_CHI"
              ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          Mạng lưới Địa chỉ Tin cậy tại Cộng đồng ({diaChiList.length})
        </button>
      </div>

      {subView === "HO_SO" ? (
        /* Danh sách hồ sơ vụ việc PCBLGĐ */
        <div className="space-y-4">
          {hoSoList.map((hoSo) => {
            const bienPhapInfo = BIEN_PHAP_PCBLGD_LABELS[hoSo.bienPhapBaoVe] || {
              label: hoSo.bienPhapBaoVe,
              badgeClass: "bg-slate-100 text-slate-700",
            };

            return (
              <div
                key={hoSo.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {hoSo.maVuViec}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${bienPhapInfo.badgeClass}`}
                      >
                        {bienPhapInfo.label}
                      </span>
                      {hoSo.soQuyetDinhCamTiepXuc && (
                        <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-md font-mono font-medium">
                          Số: {hoSo.soQuyetDinhCamTiepXuc} (Cấm {hoSo.thoiHanCamNgay} ngày)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Tiếp nhận: {hoSo.ngayTiepNhan} • Người báo tin: <strong>{hoSo.nguoiBaoTin}</strong>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      hoSo.trangThai === "DA_HOA_GIAI_ON_DINH"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : hoSo.trangThai === "DANG_XU_LY"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300"
                    }`}
                  >
                    {hoSo.trangThai === "DA_HOA_GIAI_ON_DINH"
                      ? "Đã hòa giải ổn định"
                      : hoSo.trangThai === "DANG_XU_LY"
                      ? "Đang khẩn cấp xử lý"
                      : "Chuyển cơ quan Công an"}
                  </span>
                </div>

                {/* Chi tiết nạn nhân & người gây bạo lực */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 text-xs">
                  <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-lg p-3">
                    <div className="font-semibold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Thông tin Nạn nhân được bảo vệ:
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      Họ tên: <strong>{hoSo.nanNhan.hoTen}</strong> (Quan hệ: {hoSo.nanNhan.quanHe})
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      CCCD: {hoSo.nanNhan.cccd}
                    </div>
                    <div className="text-rose-700 dark:text-rose-300 mt-1">
                      Tình trạng: {hoSo.nanNhan.tinhTrangThuongTich}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      Người có hành vi bạo lực gia đình:
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      Họ tên: <strong>{hoSo.nguoiGayBaoLuc.hoTen}</strong>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      CCCD: {hoSo.nguoiGayBaoLuc.cccd}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 mt-1">
                      Hành vi: {hoSo.nguoiGayBaoLuc.hanhVi}
                    </div>
                  </div>
                </div>

                {/* Biên bản ghi nhận */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Biên bản xử lý của Công chức VH-XH:
                  </span>{" "}
                  {hoSo.bienBanGhiNhan}
                </div>

                {/* Action button */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Cán bộ thụ lý: {hoSo.canBoThuLy}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCamTiepXucModal(hoSo)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Ban hành QĐ Cấm tiếp xúc (Điều 25)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Danh bạ Địa chỉ tin cậy */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {diaChiList.map((dc) => (
            <div
              key={dc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 mb-1.5">
                      {dc.loaiHinh}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {dc.tenDiaChi}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {dc.diaChi} ({dc.khuPho})
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      dc.trangThai === "SAN_SANG_TIEP_NHAN"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                    }`}
                  >
                    {dc.trangThai === "SAN_SANG_TIEP_NHAN"
                      ? "Sẵn sàng tiếp nhận"
                      : "Đang hỗ trợ nạn nhân"}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg my-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Người phụ trách:</span>
                    <span className="font-semibold">
                      {dc.nguoiPhuTrach} ({dc.chucVu})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Số vụ việc đã tiếp nhận:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {dc.soVuViecTiepNhan} vụ việc
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Chỗ tạm lánh khẩn cấp:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {dc.choTamLanhKhauCap ? "Có buồng riêng an toàn" : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-rose-600 dark:text-rose-400 font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{dc.hotline}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onTriggerSupport(dc.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Kích hoạt hỗ trợ nạn nhân</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
