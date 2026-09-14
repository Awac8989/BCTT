import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { appStore, useAppState } from "@/services/app-state";
import { type CanhBaoSomItem } from "@/data/mock";

export function CanhBaoSomCard() {
  const { canhBaoList } = useAppState();
  const [filterType, setFilterType] = useState<"ALL" | "CHƯA_XỬ_LÝ" | "ĐÃ_XỬ_LÝ">("CHƯA_XỬ_LÝ");

  const filteredList = canhBaoList.filter((cb) => {
    if (filterType === "ALL") return true;
    return cb.trangThai === filterType;
  });

  const countPendingRed = canhBaoList.filter(
    (c) => c.loai === "NGHIÊM_TRỌNG" && c.trangThai === "CHƯA_XỬ_LÝ"
  ).length;

  const handleResolve = (id: string, tieuDe: string) => {
    appStore.xuLyCanhBao(id);
    toast.success(`Đã xác nhận xử lý thành công cảnh báo: "${tieuDe}"`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-[#dd4b39]/10 border-b border-[#dd4b39]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-[#dd4b39]" />
          <div>
            <h3 className="font-bold text-sm text-[#dd4b39] uppercase tracking-tight flex items-center gap-2">
              Trung Tâm Giám Sát Cảnh Báo Sớm & Phòng Chống Trục Lợi
              {countPendingRed > 0 && (
                <span className="px-2 py-0.5 bg-[#dd4b39] text-white text-[10px] font-extrabold rounded-full animate-pulse">
                  {countPendingRed} rủi ro cao
                </span>
              )}
            </h3>
            <p className="text-[11px] text-gray-600">
              Bộ quy tắc tự động kiểm tra trùng lặp CCCD, quá hạn thủ tục và điều kiện hưởng chính sách
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterType("CHƯA_XỬ_LÝ")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterType === "CHƯA_XỬ_LÝ"
                ? "bg-[#dd4b39] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Chưa xử lý (
            {canhBaoList.filter((c) => c.trangThai === "CHƯA_XỬ_LÝ").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterType === "ALL"
                ? "bg-[#dd4b39] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Tất cả ({canhBaoList.length})
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            Không có cảnh báo rủi ro chính sách nào cần xử lý.
          </div>
        ) : (
          filteredList.map((item) => {
            const isRed = item.loai === "NGHIÊM_TRỌNG";
            const isYellow = item.loai === "CẢNH_BÁO";
            const isHandled = item.trangThai === "ĐÃ_XỬ_LÝ";

            return (
              <div
                key={item.id}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isHandled
                    ? "bg-gray-50/70 opacity-60"
                    : isRed
                    ? "bg-red-50/40 hover:bg-red-50/80"
                    : isYellow
                    ? "bg-amber-50/40 hover:bg-amber-50/80"
                    : "bg-sky-50/40 hover:bg-sky-50/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isHandled
                        ? "bg-gray-200 text-gray-500"
                        : isRed
                        ? "bg-red-100 text-red-600"
                        : isYellow
                        ? "bg-amber-100 text-amber-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {isHandled ? (
                      <CheckCircle2 className="size-4" />
                    ) : isRed ? (
                      <AlertOctagon className="size-4" />
                    ) : (
                      <AlertTriangle className="size-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-gray-900">{item.tieuDe}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isRed
                            ? "bg-red-200 text-red-900"
                            : isYellow
                            ? "bg-amber-200 text-amber-900"
                            : "bg-sky-200 text-sky-900"
                        }`}
                      >
                        {item.loai}
                      </span>
                      {isHandled && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          Đã xử lý
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mt-1 leading-snug">{item.moTa}</p>

                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-1.5 font-mono">
                      <span>Phát hiện: {item.ngayPhatHien}</span>
                      {item.hanXuLy && (
                        <span className="text-red-600 font-semibold">
                          Hạn xử lý: {item.hanXuLy}
                        </span>
                      )}
                      {item.phuong && <span>Địa bàn: {item.phuong}</span>}
                    </div>
                  </div>
                </div>

                {/* Hành động */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.hoSoId && (
                    <Link
                      to="/ho-so/$id"
                      params={{ id: item.hoSoId }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      Xem hồ sơ
                    </Link>
                  )}
                  {!isHandled && (
                    <button
                      type="button"
                      onClick={() => handleResolve(item.id, item.tieuDe)}
                      className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="size-3" />
                      Xác nhận đã xử lý
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
