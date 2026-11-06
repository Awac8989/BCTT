import { X, Printer, ShieldCheck, QrCode } from "lucide-react";
import { type HoSoTTHCAnSinhItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface ModalXemQuyetDinhAnSinhProps {
  item: HoSoTTHCAnSinhItem | null;
  onClose: () => void;
}

export function ModalXemQuyetDinhAnSinh({
  item,
  onClose,
}: ModalXemQuyetDinhAnSinhProps) {
  if (!item || !item.quyetDinhKySo) return null;

  const qd = item.quyetDinhKySo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 text-white">
          <span className="font-bold text-xs uppercase tracking-wider">
            Văn Bản Quyết Định Điện Tử Ký Số SmartCA
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs font-semibold flex items-center gap-1"
            >
              <Printer className="size-3.5" />
              In quyết định
            </button>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-6 text-gray-900 space-y-4 max-h-[80vh] overflow-y-auto font-serif text-sm">
          {/* Quốc hiệu & Tiêu ngữ */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <div className="text-center font-sans text-xs">
              <div className="font-bold uppercase">ỦY BAN NHÂN DÂN</div>
              <div className="font-bold uppercase text-[#3c8dbc]">PHƯỜNG PHÚ CƯỜNG</div>
              <div className="text-[11px] text-gray-500 font-mono mt-1">Số: {qd.soQuyetDinh}</div>
            </div>
            <div className="text-center font-sans text-xs">
              <div className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-semibold italic">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] text-gray-500 mt-1">Thủ Dầu Một, ngày {qd.ngayKy}</div>
            </div>
          </div>

          {/* Tiêu đề quyết định */}
          <div className="text-center space-y-1 pt-2">
            <div className="font-bold font-sans text-base uppercase tracking-tight text-gray-900">
              QUYẾT ĐỊNH
            </div>
            <div className="font-semibold italic text-xs max-w-md mx-auto">
              Về việc giải quyết thủ tục: {item.tenThuTuc}
            </div>
            <div className="font-bold font-sans text-xs uppercase text-gray-700 mt-2">
              CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
            </div>
          </div>

          <div className="text-xs leading-relaxed space-y-2 text-justify">
            <p className="italic">
              Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015;
            </p>
            <p className="italic">
              Căn cứ Nghị định số 20/2021/NĐ-CP ngày 15 tháng 3 năm 2021 của Chính phủ quy định chính sách trợ giúp xã hội đối với đối tượng bảo trợ xã hội;
            </p>
            <p className="italic">
              Căn cứ Nghị định số 61/2018/NĐ-CP về thực hiện cơ chế một cửa, một cửa liên thông trong giải quyết thủ tục hành chính;
            </p>
            <p className="italic">
              Xét đề nghị của Công chức Văn hóa - Xã hội và Biên bản họp thẩm định của Hội đồng xét duyệt trợ cấp xã hội,
            </p>
          </div>

          <div className="font-sans font-bold text-xs uppercase text-center py-1">
            QUYẾT ĐỊNH:
          </div>

          <div className="text-xs space-y-2 leading-relaxed">
            <p>
              <strong>Điều 1.</strong> Phê chuẩn giải quyết thủ tục hành chính cho công dân{" "}
              <strong>{item.nguoiNop}</strong> (Số định danh CCCD:{" "}
              <span className="font-mono">{item.cccd}</span>, thường trú tại: {item.diaChi}).
            </p>
            <p>
              Đối tượng thụ hưởng chính sách: <strong>{item.doiTuongThuHuong}</strong> ({item.loaiDoiTuong}).
            </p>
            {item.mucTienHoTroVND > 0 && (
              <p>
                Mức kinh phí hỗ trợ theo quy định:{" "}
                <strong className="text-[#dd4b39] font-mono text-sm">
                  {formatVND(item.mucTienHoTroVND)}
                </strong>
                .
              </p>
            )}
            <p>
              <strong>Điều 2.</strong> {qd.noiDung}
            </p>
            <p>
              <strong>Điều 3.</strong> Văn phòng HĐND - UBND, Công chức Văn hóa - Xã hội, Trưởng Khu phố{" "}
              {item.khuPho} và ông/bà có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này.
            </p>
          </div>

          {/* Khối chữ ký số điện tử SmartCA */}
          <div className="pt-6 flex justify-between items-end">
            <div className="text-[11px] font-sans text-gray-500 space-y-0.5">
              <div className="font-bold">Nơi nhận:</div>
              <div>- Như Điều 3;</div>
              <div>- Phòng LĐTBXH TP. TDM (b/c);</div>
              <div>- Lưu: VT, VH-XH.</div>
            </div>

            <div className="text-center font-sans space-y-2">
              <div className="font-bold text-xs uppercase">{qd.chucVu}</div>
              <div className="border-2 border-purple-600 rounded-md p-2.5 bg-purple-50 inline-block text-left shadow-xs">
                <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[11px]">
                  <ShieldCheck className="size-4 text-purple-700" />
                  <span>KÝ BỞI: {qd.nguoiKy}</span>
                </div>
                <div className="text-[10px] text-purple-800">Cơ quan: UBND Phường Thủ Dầu Một</div>
                <div className="text-[10px] text-purple-700 font-mono">Ngày ký: {qd.ngayKy}</div>
                <div className="text-[9px] text-gray-500 font-mono mt-0.5 max-w-[200px] truncate">
                  {qd.maXacThucSha256}
                </div>
              </div>
              <div className="font-bold text-xs">{qd.nguoiKy}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
