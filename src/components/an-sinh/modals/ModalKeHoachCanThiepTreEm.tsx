import { useState } from "react";
import { X, Baby, Heart, Check, FileSignature } from "lucide-react";
import { type TreEmHoanCanhDacBiet } from "@/data/domain-mock";

interface ModalKeHoachCanThiepTreEmProps {
  item: TreEmHoanCanhDacBiet | null;
  onClose: () => void;
  onSubmit: (id: string, noiDungCanThiep: string) => void;
}

export function ModalKeHoachCanThiepTreEm({
  item,
  onClose,
  onSubmit,
}: ModalKeHoachCanThiepTreEmProps) {
  if (!item) return null;

  const [noiDung, setNoiDung] = useState(
    "Cấp học bổng an sinh 2.000.000đ/năm + Hỗ trợ chi phí học tập theo NĐ 81/2021 + Cử Chi hội Phụ nữ khu phố giám sát định kỳ hàng tháng."
  );
  const [canBoPhuTrach, setCanBoPhuTrach] = useState(
    "Lê Hoàng Nam (Công chức LĐ-TBXH) & Trưởng Ban Điều hành Khu phố"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item.id, noiDung);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-pink-700 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Baby className="size-4" />
            <span>Kế Hoạch Hỗ Trợ Can Thiệp Trẻ Em (Mẫu số 01 - Nghị định 56/2017/NĐ-CP)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="bg-pink-50 border border-pink-200 rounded p-3 text-pink-900 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{item.hoTen}</span>
              <span className="font-mono text-xs">{item.ngaySinh}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span>Người giám hộ: <strong>{item.hoTenNguoiGiamHo}</strong> ({item.quanHe})</span>
              <span>Khu phố: <strong>{item.khuPho}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nội dung biện pháp hỗ trợ, can thiệp khẩn cấp <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Cán bộ và tổ chức được phân công theo dõi, hỗ trợ
            </label>
            <input
              type="text"
              value={canBoPhuTrach}
              onChange={(e) => setCanBoPhuTrach(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-semibold text-gray-800"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-2.5 text-[11px] text-gray-600">
            <strong>Căn cứ:</strong> Điều 52 Luật Trẻ em 2016 và Điều 25 Nghị định 56/2017/NĐ-CP.
            Kế hoạch can thiệp sau khi phê duyệt có hiệu lực ngay lập tức nhằm bảo vệ an toàn tối đa cho trẻ em và phòng chống nguy cơ bạo lực, bỏ học.
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-pink-700 hover:bg-pink-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <FileSignature className="size-3.5" />
              Chủ Tịch UBND Phê Duyệt Kế Hoạch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
