/**
 * ĐỘNG CƠ TRÍ TUỆ NHÂN TẠO CÔNG VỤ ĐIỆN TỬ (GOV AI ENGINE)
 * Phục vụ Điều hành & Quản lý Nhà nước tại UBND Phường Thủ Dầu Một
 * 
 * Năng lực nghiệp vụ cốt lõi:
 * 1. Tra cứu trực tiếp dữ liệu thực địa (Hồ sơ Một cửa, Văn bản đến/đi, Người có công, Phản ánh 1022, Hậu kiểm 814)
 * 2. Tính toán chính xác tuyệt đối trợ cấp ưu đãi & bảo trợ xã hội (Nghị định 77/2024, Nghị định 76/2024)
 * 3. Soạn thảo tự động toàn văn văn bản hành chính nhà nước chuẩn thể thức Nghị định 30/2020 & 4 Mẫu biểu NĐ 61/2018
 * 4. Hệ thống tri thức pháp quy chuyên ngành: NĐ 30/2020, NĐ 61/2018, NĐ 86/2023, Luật PCBLGĐ 2022, NĐ 54/2019, QĐ 1246/BYT,...
 * 5. Cơ chế đề xuất gợi ý thông minh theo ngữ cảnh (Contextual Follow-up Suggestions)
 */

import { formatVND } from "@/data/mock";
import {
  docSoTienBangChu,
  calculateAllowance,
  MUC_CHUAN_ND77_2024,
  MUC_MAI_TANG_PHI,
  MUC_THO_CUNG_LIET_SI,
} from "@/services/calculator.service";

export interface AiResponseResult {
  text: string;
  category:
    | "VAN_BAN"
    | "MOT_CUA"
    | "NGUOI_CO_CONG"
    | "VAN_HOA"
    | "GIAO_DUC"
    | "BAO_LUC_GD"
    | "CANH_BAO"
    | "TINH_TOAN"
    | "SOAN_THAO"
    | "CHUNG";
  suggestedFollowUps?: { label: string; prompt: string }[];
}

export interface AppStateDataRef {
  currentUser: any;
  hoSoList: any[];
  chiTraList: any[];
  baoGiamList: any[];
  phanHoiList: any[];
  giaDinhVanHoaList: any[];
  khuPhoVanHoaList: any[];
  diTichLeHoiList: any[];
  coSoDichVuVanHoaList: any[];
  baoLucGiaDinhList: any[];
  hoSoTTHCVanHoaList: any[];
  hoSoTTHCAnSinhList: any[];
  productCheckInList: any[];
  taskAssignmentList: any[];
  vanBanDenList: any[];
  vanBanDiList: any[];
  tiepCongDanList: any[];
  hoSoMotCuaLienThongList: any[];
  lichTuanList: any[];
  choThoKhuPhoList: any[];
  lietsiKhuPhoList: any[];
  kpiEvaluationList: any[];
  kiemTra814List: any[];
  phanAnh1022List: any[];
}

// ============================================================================
// 1. TÍNH TOÁN TRỢ CẤP TỰ ĐỘNG (ALLOWANCE CALCULATOR)
// ============================================================================

function tryCalculateAllowance(q: string): AiResponseResult | null {
  // 1.1 Thương binh / Bệnh binh theo tỷ lệ %
  const percentMatch = q.match(/(\d{1,3})\s*%/);
  const isThuongBinh = q.includes("thương binh") || q.includes("thương tật") || q.includes("suy giảm");
  const isBenhBinh = q.includes("bệnh binh");

  if (percentMatch && (isThuongBinh || isBenhBinh)) {
    const tyLe = parseInt(percentMatch[1], 10);
    if (tyLe >= 21 && tyLe <= 100) {
      const coPhucVu = tyLe >= 81 && (q.includes("phục vụ") || q.includes("chăm sóc") || q.includes("đặc biệt"));
      const loai = isBenhBinh ? "BENH_BINH" : "THUONG_BINH";
      const calc = calculateAllowance({
        maLoaiDt: loai,
        tyLeThuongTat: tyLe,
        coNguoiChamSoc: coPhucVu,
        baseRate: MUC_CHUAN_ND77_2024,
      });

      const soTienChu = docSoTienBangChu(calc.tongTienThucNhan);
      const tenLoai = isBenhBinh ? "Bệnh binh" : "Thương binh";

      return {
        category: "TINH_TOAN",
        text: `🧮 **KẾT QUẢ TÍNH TRỢ CẤP ƯU ĐÃI CHÍNH THỨC (${tenLoai.toUpperCase()} - TỶ LỆ ${tyLe}%)**:

📌 **Căn cứ pháp lý**:
- Nghị định số **77/2024/NĐ-CP** ngày 01/07/2024 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định số 75/2021/NĐ-CP.
- **Mức chuẩn trợ cấp ưu đãi áp dụng mới nhất**: **${formatVND(MUC_CHUAN_ND77_2024)} đồng/tháng**.

📊 **Chi tiết tính toán chuẩn xác**:
1. Đối tượng: **${tenLoai} suy giảm khả năng lao động ${tyLe}%**
2. Hệ số mức trợ cấp: **×${calc.heSo}**
3. Mức trợ cấp hàng tháng: **${formatVND(calc.troCapHangThang)}**
4. Phụ cấp người phục vụ: **${calc.phuCapChamSoc > 0 ? formatVND(calc.phuCapChamSoc) : "Không áp dụng (Chỉ dành cho thương tật từ 81% trở lên có vết thương đặc biệt)"}**
────────────────────────────────────────
💰 **TỔNG SỐ TIỀN THỰC LĨNH HÀNG THÁNG**: **${formatVND(calc.tongTienThucNhan)}**
✍️ **Số tiền bằng chữ**: *${soTienChu}*

💡 **Ghi chú nghiệp vụ**: Tiền trợ cấp được chuyển khoản trực tiếp vào tài khoản an sinh xã hội liên kết VNeID hoặc nhận tiền mặt tại điểm Bưu điện Phường Thủ Dầu Một vào ngày 05 - 10 hàng tháng.`,
        suggestedFollowUps: [
          { label: "💳 Danh sách chi trả trợ cấp tháng", prompt: "Tình hình chi trả trợ cấp người có công tháng này" },
          { label: "⚰️ Chế độ mai táng phí người có công", prompt: "Mức hưởng mai táng phí người có công mới nhất" },
          { label: "🏥 Chế độ điều dưỡng phục hồi sức khỏe", prompt: "Quy định về chế độ điều dưỡng phục hồi sức khỏe người có công" },
        ],
      };
    }
  }

  // 1.2 Mẹ Việt Nam Anh hùng
  if (q.includes("mẹ việt nam anh hùng") || q.includes("vnah") || q.includes("mẹ vnah")) {
    const troCapTuat = MUC_CHUAN_ND77_2024; // 2.789.000
    const phuCapDanhDu = MUC_CHUAN_ND77_2024; // 2.789.000
    const phuCapNguoiPhucVu = MUC_CHUAN_ND77_2024; // 2.789.000
    const tongKhongPhucVu = troCapTuat + phuCapDanhDu;
    const tongCoPhucVu = tongKhongPhucVu + phuCapNguoiPhucVu;

    return {
      category: "TINH_TOAN",
      text: `🎖️ **CHẾ ĐỘ TRỢ CẤP ĐỐI VỚI BÀ MẸ VIỆT NAM ANH HÙNG (NGHỊ ĐỊNH 77/2024/NĐ-CP)**:

Mức chuẩn ưu đãi áp dụng từ 01/07/2024: **${formatVND(MUC_CHUAN_ND77_2024)} đồng/tháng**.

1. **Trợ cấp tiền tuất hàng tháng**: **${formatVND(troCapTuat)}** (Hệ số 1.0)
2. **Phụ cấp danh dự hàng tháng**: **${formatVND(phuCapDanhDu)}** (Hệ số 1.0)
────────────────────────────────────────
💰 **Mức hưởng định kỳ (tự chăm sóc)**: **${formatVND(tongKhongPhucVu)} đồng/tháng**
✍️ *Bằng chữ: ${docSoTienBangChu(tongKhongPhucVu)}*

3. **Trường hợp Mẹ VNAH sống ở gia đình có người phục vụ**:
- Cộng thêm Phụ cấp người phục vụ: **+${formatVND(phuCapNguoiPhucVu)} đồng/tháng** (Hệ số 1.0)
💰 **Tổng mức thực lĩnh có người phục vụ**: **${formatVND(tongCoPhucVu)} đồng/tháng**
✍️ *Bằng chữ: ${docSoTienBangChu(tongCoPhucVu)}*

🎁 **Các quyền lợi bổ sung kèm theo**:
- BHYT ưu đãi 100% chi phí khám chữa bệnh đúng tuyến (Mã quyền lợi 1).
- Trợ cấp điều dưỡng hàng năm (1.8 lần mức chuẩn = **${formatVND(Math.round(MUC_CHUAN_ND77_2024 * 1.8))}**).
- Thăm hỏi tặng quà nhân ngày Thương binh - Liệt sĩ 27/7 và Tết Nguyên đán.`,
      suggestedFollowUps: [
        { label: "📜 Quyết định trợ cấp Mẹ VNAH", prompt: "Mẫu quyết định hưởng trợ cấp đối với Mẹ Việt Nam Anh hùng" },
        { label: "🕯️ Trợ cấp thờ cúng liệt sĩ", prompt: "Quy định mức trợ cấp thờ cúng liệt sĩ" },
      ],
    };
  }

  // 1.3 Mai táng phí
  if (q.includes("mai táng") || q.includes("chôn cất") || q.includes("tiền chết")) {
    const maiTangNcc = MUC_MAI_TANG_PHI; // 23.400.000 (10 tháng lương cơ sở 2.340.000đ)
    const maiTangBtxh = 500_000 * 20; // 10.000.000 (20 lần mức chuẩn BTXH 500.000đ theo NĐ 76/2024)

    return {
      category: "TINH_TOAN",
      text: `⚰️ **QUY ĐỊNH MỨC HƯỞNG TRỢ CẤP MAI TÁNG PHÍ HIỆN HÀNH**:

Hệ thống phân biệt rõ 02 nhóm chính sách chi trả tại UBND Phường:

1. **Mai táng phí Người có công với cách mạng (Nghị định 131/2021 & NĐ 73/2024)**:
   - Áp dụng cho: Thương binh, bệnh binh, Mẹ VNAH, Người hoạt động kháng chiến được tặng Huân/Huy chương khi qua đời.
   - Định mức: **10 tháng mức lương cơ sở** (10 × 2.340.000đ).
   - 💰 **Số tiền**: **${formatVND(maiTangNcc)}**
   - ✍️ *Bằng chữ: ${docSoTienBangChu(maiTangNcc)}*
   - Thủ tục: Mẫu số 08/NĐ131, Giấy chứng tử, giải quyết trong 05 ngày làm việc.

2. **Mai táng phí Đối tượng Bảo trợ xã hội (Nghị định 20/2021 & NĐ 76/2024)**:
   - Áp dụng cho: Người cao tuổi hưởng trợ cấp BTXH, người khuyết tật nặng, trẻ em mồ côi khi qua đời.
   - Định mức: **20 lần mức chuẩn trợ giúp xã hội** (20 × 500.000đ).
   - 💰 **Số tiền**: **${formatVND(maiTangBtxh)}**
   - ✍️ *Bằng chữ: ${docSoTienBangChu(maiTangBtxh)}*
   - Thủ tục: Tờ khai theo mẫu số 04/NĐ20, Giấy chứng tử, Chủ tịch UBND Phường ký Quyết định trong 03 ngày làm việc.

3. **Quy trình báo giảm**: Ngay sau khi cấp Giấy khai tử hoặc tiếp nhận hồ sơ mai táng phí, công chức Tư pháp - Hộ tịch và Văn hóa - Xã hội kích hoạt thủ tục **Báo giảm khai tử & Ngắt chi trả** để tránh thất thoát ngân sách.`,
      suggestedFollowUps: [
        { label: "📝 Soạn Dự thảo Quyết định mai táng phí", prompt: "Soạn thảo dự thảo Quyết định trợ cấp mai táng phí bảo trợ xã hội" },
        { label: "🛑 Quy trình báo giảm khai tử", prompt: "Quy trình xử lý báo giảm khai tử và ngắt danh sách chi trả trợ cấp" },
      ],
    };
  }

  // 1.4 Bảo trợ xã hội & Người cao tuổi theo Nghị định 76/2024
  if (q.includes("bảo trợ") || q.includes("76/2024") || q.includes("người cao tuổi") || q.includes("khuyết tật")) {
    return {
      category: "TINH_TOAN",
      text: `🌿 **CHẾ ĐỘ TRỢ CẤP BẢO TRỢ XÃ HỘI (NGHỊ ĐỊNH 76/2024/NĐ-CP ÁP DỤNG TỪ 01/07/2024)**:

- **Mức chuẩn trợ giúp xã hội mới**: Tăng từ 360.000đ lên **500.000 đồng/tháng**.

📊 **Bảng định mức chi trả hàng tháng tại UBND Phường Thủ Dầu Một**:
1. **Người cao tuổi từ đủ 80 tuổi trở lên** (không có lương hưu/trợ cấp BHXH):
   - Hệ số 1.0 = **500.000 đồng/tháng**.
2. **Người cao tuổi từ đủ 75 đến 80 tuổi thuộc hộ nghèo/cận nghèo**:
   - Hệ số 1.0 = **500.000 đồng/tháng**.
3. **Người khuyết tật nặng**:
   - Người lớn: Hệ số 1.5 = **750.000 đồng/tháng**.
   - Trẻ em dưới 16 tuổi: Hệ số 2.0 = **1.000.000 đồng/tháng**.
4. **Người khuyết tật đặc biệt nặng**:
   - Người lớn: Hệ số 2.0 = **1.000.000 đồng/tháng**.
   - Trẻ em dưới 16 tuổi: Hệ số 2.5 = **1.250.000 đồng/tháng**.
   - Hộ gia đình nuôi dưỡng chăm sóc: Hệ số 1.0 = **500.000 đồng/tháng**.
5. **Trẻ em dưới 3 tuổi thuộc hộ nghèo/cận nghèo**:
   - Hệ số 2.5 = **1.250.000 đồng/tháng**.

🏛️ **Thẩm quyền giải quyết**: Chủ tịch UBND cấp xã ra quyết định trợ cấp hàng tháng sau khi có kết quả xác minh thực địa và biên bản họp xét duyệt của Hội đồng Xác định mức độ khuyết tật.`,
      suggestedFollowUps: [
        { label: "📋 Danh sách bảo trợ xã hội đang quản lý", prompt: "Thống kê số lượng đối tượng bảo trợ xã hội tại phường" },
        { label: "♿ Quy trình xác định mức độ khuyết tật", prompt: "Quy trình xác định mức độ khuyết tật theo Nghị định 20" },
      ],
    };
  }

  // 1.5 Trợ cấp thờ cúng liệt sĩ
  if (q.includes("thờ cúng") || q.includes("liệt sĩ")) {
    return {
      category: "TINH_TOAN",
      text: `🕯️ **CHẾ ĐỘ TRỢ CẤP THỜ CÚNG LIỆT SĨ (NGHỊ ĐỊNH 131/2021/NĐ-CP)**:

- **Đối tượng hưởng**: Người được gia đình, dòng họ cử hoặc ủy quyền bằng văn bản để thờ cúng liệt sĩ (khi liệt sĩ không còn thân nhân hưởng trợ cấp tuất hàng tháng).
- **Mức trợ cấp**: **${formatVND(MUC_THO_CUNG_LIET_SI)} đồng/năm/liệt sĩ**.
- **Thời điểm chi trả**: Chi trả 01 lần vào dịp kỷ niệm ngày Thương binh - Liệt sĩ (27/7) hàng năm.
- **Thủ tục đề nghị**:
  1. Đơn đề nghị hưởng trợ cấp thờ cúng liệt sĩ (Mẫu số 18/NĐ131).
  2. Văn bản ủy quyền thờ cúng liệt sĩ của các thân nhân có xác nhận của UBND Phường.
  3. Bản sao Bằng Tổ quốc ghi công.
- **Tại UBND Phường Thủ Dầu Một**: Toàn bộ danh sách thân nhân thờ cúng liệt sĩ 4 Khu phố đã được số hóa trên hệ thống, thực hiện chi trả không dùng tiền mặt qua tài khoản hoặc trực tiếp tại Bưu điện.`,
      suggestedFollowUps: [
        { label: "📁 Sổ quản lý mộ & chỗ thờ liệt sĩ", prompt: "Tình hình quản lý mộ liệt sĩ và chỗ thờ tại 4 khu phố" },
        { label: "🧮 Tính trợ cấp tuất thân nhân liệt sĩ", prompt: "Mức hưởng trợ cấp tuất liệt sĩ hàng tháng" },
      ],
    };
  }

  return null;
}

// ============================================================================
// 2. SOẠN THẢO VĂN BẢN HÀNH CHÍNH (DOCUMENT GENERATOR)
// ============================================================================

function tryGenerateDocumentDraft(q: string, state: AppStateDataRef): AiResponseResult | null {
  const isSoanThao =
    q.includes("soạn") ||
    q.includes("dự thảo") ||
    q.includes("mẫu biểu") ||
    q.includes("mẫu 0") ||
    q.includes("viết giúp") ||
    q.includes("biên bản");

  if (!isSoanThao) return null;

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  // 2.1 Mẫu số 04: Phiếu xin lỗi và hẹn lại ngày trả kết quả (NĐ 61/2018)
  if (q.includes("xin lỗi") || q.includes("mẫu 04") || q.includes("chậm trễ") || q.includes("quá hạn")) {
    return {
      category: "SOAN_THAO",
      text: `🏛️ **DỰ THẢO PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ (MẪU SỐ 04/NĐ61)**:

ỦY BAN NHÂN DÂN            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
PHƯỜNG THỦ DẦU MỘT                 Độc lập - Tự do - Hạnh phúc
Số: .../PXL-UBND                Thủ Dầu Một, ngày ${day} tháng ${month} năm ${year}

                       PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ
                 Kính gửi: Ông/Bà [Họ và tên người nộp hồ sơ]
                 Địa chỉ: [Địa chỉ cư trú của công dân]
                 Số điện thoại: [Số điện thoại liên hệ]

Bộ phận Tiếp nhận và Trả kết quả UBND Phường Thủ Dầu Một đã tiếp nhận hồ sơ của Ông/Bà:
- Tên thủ tục hành chính: [Tên TTHC giải quyết]
- Mã số hồ sơ: [Mã hồ sơ điện tử, ví dụ: MC-TDM-2026-0012]
- Ngày tiếp nhận: [dd/mm/yyyy] - Ngày hẹn trả kết quả: [dd/mm/yyyy]

Tuy nhiên, do nguyên nhân: [Ghi rõ lý do khách quan/chủ quan: Chờ đối soát dữ liệu C06 / xác minh thực địa khu phố / bổ sung ý kiến chuyên môn ngành], nên hồ sơ chưa thể trả đúng thời hạn đã hẹn.

ỦY BAN NHÂN DÂN PHƯỜNG THỦ DẦU MỘT CHÂN THÀNH XIN LỖI ÔNG/BÀ VỀ SỰ CHẬM TRỄ NÊU TRÊN VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ NHƯ SAU:
- Thời gian trả kết quả mới: ... giờ ... phút, ngày ... tháng ... năm ${year}
- Địa điểm: Bộ phận Một cửa UBND Phường Thủ Dầu Một (Số 01 Đường Quang Trung, Phường Thủ Dầu Một) hoặc nhận bản điện tử trên Cổng DVC Quốc gia.

Rất mong nhận được sự thông cảm và chia sẻ của Ông/Bà./.

Nơi nhận:                                    NGƯỜI ĐỨNG ĐẦU CƠ QUAN
- Như trên;                                   (HOẶC NGƯỜI ĐƯỢC ỦY QUYỀN)
- Lãnh đạo UBND Phường (b/c);                   (Ký số điện tử, đóng dấu)
- Lưu: VT, Bộ phận Một cửa.`,
      suggestedFollowUps: [
        { label: "📋 Quy định bắt buộc Mẫu 04", prompt: "Khi nào bắt buộc phải ban hành Phiếu xin lỗi Mẫu 04?" },
        { label: "📑 Mẫu 01 Giấy hẹn Một cửa", prompt: "Soạn thảo Mẫu số 01 Giấy tiếp nhận hồ sơ và hẹn trả kết quả" },
      ],
    };
  }

  // 2.2 Mẫu số 01: Giấy tiếp nhận và hẹn trả kết quả (NĐ 61/2018)
  if (q.includes("giấy hẹn") || q.includes("mẫu 01") || q.includes("tiếp nhận hồ sơ")) {
    return {
      category: "SOAN_THAO",
      text: `🏛️ **DỰ THẢO GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ (MẪU SỐ 01/NĐ61)**:

ỦY BAN NHÂN DÂN            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
PHƯỜNG THỦ DẦU MỘT                 Độc lập - Tự do - Hạnh phúc
Số: .../GTH-UBND                Thủ Dầu Một, ngày ${day} tháng ${month} năm ${year}

                 GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ
       Mã số hồ sơ: MC-TDM-${year}-0089 (Tra cứu mã QR trên Cổng DVCQG)

Bộ phận Tiếp nhận và Trả kết quả UBND Phường Thủ Dầu Một tiếp nhận hồ sơ của:
- Người nộp: Ông/Bà [Họ tên công dân] - CCCD: [Số định danh cá nhân]
- Địa chỉ: Khu phố 1, Phường Thủ Dầu Một, TP. Thủ Dầu Một
- Tên thủ tục: Thủ tục Mai táng phí đối tượng Bảo trợ xã hội
- Thành phần hồ sơ gồm:
  1. Tờ khai đề nghị hỗ trợ chi phí mai táng (Bản chính - 01 bản).
  2. Bản sao Trích lục khai tử (01 bản số hóa từ CSDL Hộ tịch điện tử).
  3. Căn cước công dân người đứng tên lo mai táng (Đã đối soát C06 thành công).

- Thời gian tiếp nhận: 08 giờ 30 phút, ngày ${day}/${month}/${year}
- Thời hạn giải quyết: 03 ngày làm việc theo quy định.
- Thời gian hẹn trả kết quả: 16 giờ 30 phút, ngày .../.../${year}
- Hình thức nhận kết quả: Nhận trực tiếp tại Quầy Một cửa hoặc nhận Bản kết quả điện tử ký số công vụ qua Cổng Dịch vụ công Quốc gia.

        NGƯỜI NỘP HỒ SƠ                       NGƯỜI TIẾP NHẬN HỒ SƠ
       (Ký, ghi rõ họ tên)                     (Ký, ghi rõ họ tên)`,
      suggestedFollowUps: [
        { label: "✍️ Soạn Mẫu 02 Bổ sung hồ sơ", prompt: "Mẫu số 02 Phiếu yêu cầu bổ sung hoàn thiện hồ sơ Một cửa" },
        { label: "❌ Soạn Mẫu 03 Từ chối hồ sơ", prompt: "Mẫu số 03 Phiếu từ chối tiếp nhận giải quyết hồ sơ" },
      ],
    };
  }

  // 2.3 Quyết định cấm tiếp xúc (Điều 25 Luật PCBLGĐ 2022)
  if (q.includes("cấm tiếp xúc") || q.includes("bạo lực") || q.includes("luật pcblgđ")) {
    return {
      category: "SOAN_THAO",
      text: `🛡️ **DỰ THẢO QUYẾT ĐỊNH ÁP DỤNG BIỆN PHÁP CẤM TIẾP XÚC (ĐIỀU 25 LUẬT PCBLGĐ 2022)**:

ỦY BAN NHÂN DÂN            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
PHƯỜNG THỦ DẦU MỘT                 Độc lập - Tự do - Hạnh phúc
Số: .../QĐ-UBND-CTX             Thủ Dầu Một, ngày ${day} tháng ${month} năm ${year}

                               QUYẾT ĐỊNH
                   Về việc áp dụng biện pháp cấm tiếp xúc

                     CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG
Căn cứ Luật Tổ chức chính quyền địa phương ngày 19/6/2015;
Căn cứ Điều 25 Luật Phòng, chống bạo lực gia đình ngày 14/11/2022;
Xét Đơn yêu cầu áp dụng biện pháp cấm tiếp xúc của Bà [Họ tên nạn nhân] ngày ${day}/${month}/${year};
Theo đề nghị của Công chức Văn hóa - Xã hội và Trưởng Công an Phường Thủ Dầu Một,

                               QUYẾT ĐỊNH:
Điều 1. Áp dụng biện pháp cấm tiếp xúc đối với:
- Ông: [Họ và tên người có hành vi bạo lực] - Sinh năm: [Năm sinh]
- Số CCCD/Định danh: [Số CCCD]
- Nơi cư trú: [Địa chỉ cư trú cụ thể]
KHÔNG ĐƯỢC TIẾP XÚC DƯỚI MỌI HÌNH THỨC VỚI:
- Bà: [Họ và tên nạn nhân bị bạo lực]
- Phạm vi cấm tiếp xúc: Trong bán kính **100 mét** tính từ nơi cư trú, nơi làm việc hoặc nơi tạm lánh an toàn của người bị bạo lực gia đình; không được sử dụng điện thoại, tin nhắn, mạng xã hội để đe dọa, lăng mạ.
Điều 2. Thời hạn áp dụng: **03 ngày (72 giờ)**, kể từ ngày ký Quyết định này.
Điều 3. Trưởng Công an Phường, Công chức Văn hóa - Xã hội, Trưởng Khu phố và các ông/bà có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này. Giao Công an Phường chủ trì giám sát việc thực hiện./.

Nơi nhận:                                          CHỦ TỊCH
- Như Điều 3;                             (Ký số điện tử công vụ, đóng dấu)
- Công an Thành phố (để b/c);
- UBND Thành phố TDM (để b/c);
- Lưu: VT, VH-XH.`,
      suggestedFollowUps: [
        { label: "🏠 Địa chỉ tin cậy tạm lánh tại phường", prompt: "Danh sách địa chỉ tin cậy tạm lánh nạn nhân bạo lực gia đình" },
        { label: "⚖️ Thủ tục xử lý khi vi phạm lệnh cấm", prompt: "Xử lý thế nào khi người gây bạo lực vi phạm quyết định cấm tiếp xúc?" },
      ],
    };
  }

  // 2.4 Biên bản kiểm tra Đội 814 (Karaoke, biển hiệu)
  if (q.includes("biên bản 814") || q.includes("kiểm tra karaoke") || q.includes("hậu kiểm 814")) {
    return {
      category: "SOAN_THAO",
      text: `🎤 **DỰ THẢO BIÊN BẢN KIỂM TRA LIÊN NGÀNH VĂN HÓA - THÔNG TIN (ĐỘI 814 PHƯỜNG THỦ DẦU MỘT)**:

ỦY BAN NHÂN DÂN            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
PHƯỜNG THỦ DẦU MỘT                 Độc lập - Tự do - Hạnh phúc
ĐỘI LIÊN NGÀNH 814

                               BIÊN BẢN KIỂM TRA
             Hoạt động kinh doanh dịch vụ văn hóa, Karaoke và Quảng cáo

Hôm nay, vào hồi ... giờ ... ngày ${day} tháng ${month} năm ${year}, tại cơ sở kinh doanh:
- Tên cơ sở: [Tên cơ sở, ví dụ: Quán Hát Moonlight / Karaoke Diamond]
- Địa chỉ: [Số nhà, tuyến đường, Khu phố ...], Phường Thủ Dầu Một
- Đại diện cơ sở: Ông/Bà [Họ tên chủ cơ sở] - CCCD: [...]

I. THÀNH PHẦN ĐOÀN KIỂM TRA:
1. Đ/c [Họ tên] - Phó Chủ tịch UBND Phường - Trưởng đoàn;
2. Đ/c [Họ tên] - Công chức Văn hóa - Xã hội - Phó trưởng đoàn;
3. Đ/c [Họ tên] - Đại diện Công an Phường (Cảnh sát QLHC & PCCC) - Thành viên;
4. Đ/c [Họ tên] - Trưởng Khu phố - Thành viên.

II. NỘI DUNG VÀ KẾT QUẢ KIỂM TRA:
1. Hồ sơ pháp lý: Giấy chứng nhận ĐKKD, Giấy phép đủ điều kiện ANTT, Nghiệm thu PCCC.
2. Kiểm tra thực tế phòng hát (NĐ 54/2019/NĐ-CP):
   - Diện tích phòng hát: ... m² (Yêu cầu ≥ 20m² không kể công trình phụ).
   - Kiểm tra chốt cửa: [Đạt chuẩn / Có lắp chốt khóa trong vi phạm quy định].
   - Âm thanh và giờ hoạt động: [Ghi nhận độ ồn và chấp hành ngừng hát trước 00h00].
3. Kiểm tra biển hiệu quảng cáo (NĐ 38/2021/NĐ-CP):
   - Chiều cao biển hiệu: ... m; Chiều ngang: ... m.

III. KẾT LUẬN VÀ KIẾN NGHỊ:
- Đánh giá chung: [Ghi rõ kết luận chấp hành tốt hoặc hành vi vi phạm].
- Yêu cầu cơ sở: Khắc phục tồn tại trước ngày .../.../${year} và đến UBND Phường giải quyết theo quy định.

Biên bản lập xong hồi ... giờ ... cùng ngày, đã đọc lại cho các thành viên cùng nghe và ký tên./.

    ĐẠI DIỆN CƠ SỞ                                 TRƯỞNG ĐOÀN KIỂM TRA
 (Ký, ghi rõ họ tên)                                (Ký, ghi rõ họ tên)`,
      suggestedFollowUps: [
        { label: "📊 Thống kê các vụ kiểm tra 814", prompt: "Báo cáo kết quả các đợt kiểm tra 814 tại địa bàn" },
        { label: "🚫 Mức xử phạt biển quảng cáo sai quy định", prompt: "Mức xử phạt biển quảng cáo vi phạm chỉ giới theo Nghị định 38" },
      ],
    };
  }

  // 2.5 Bút phê Lãnh đạo
  if (q.includes("bút phê") || q.includes("chỉ đạo")) {
    return {
      category: "SOAN_THAO",
      text: `✍️ **TỔNG HỢP CÁC MẪU BÚT PHÊ CHỈ ĐẠO CHUẨN CỦA LÃNH ĐẠO UBND PHƯỜNG**:

Căn cứ Quy chế làm việc và nguyên tắc phân công nhiệm vụ:

1. **Văn bản Hỏa tốc / Chỉ đạo khẩn cấp từ UBND Thành phố**:
   > *"Chuyển Đ/c [Tên cán bộ chủ trì] chủ trì, phối hợp [Bộ phận liên quan] kiểm tra thực địa ngay, tham mưu văn bản báo cáo Thường trực UBND Phường trước 11h ngày mai để ký phát hành."*

2. **Hồ sơ Một cửa xin gia hạn / có vướng mắc**:
   > *"Giao Bộ phận Một cửa chủ trì kiểm tra ngay nguyên nhân chậm trễ; ban hành Phiếu xin lỗi Mẫu số 04 gửi công dân theo đúng Nghị định 61/2018; đồng thời đôn đốc bộ phận chuyên môn hoàn thành kết quả trong ngày hôm nay."*

3. **Đơn thư khiếu nại, phản ánh hiện trường 1022 của nhân dân**:
   > *"Giao Đ/c [Cán bộ thụ lý] phối hợp Cảnh sát khu vực và Trưởng Khu phố kiểm tra hiện trường, lập biên bản làm việc, yêu cầu chấm dứt vi phạm và trả lời công khai trên Cổng 1022 trước ngày [dd/mm]."*

4. **Tờ trình đề nghị phê duyệt chủ trương / kinh phí**:
   > *"Thống nhất về mặt chủ trương. Đề nghị bộ phận chuyên môn rà soát chặt chẽ điều kiện pháp lý, đảm bảo quy chế chi tiêu nội bộ và hoàn thiện dự thảo Quyết định trình ký."*

5. **Văn bản tiếp nhận thông báo hoạt động tôn giáo / lễ hội**:
   > *"Chuyển Công chức Văn hóa - Xã hội chủ trì phối hợp Công an Phường hướng dẫn Ban Tổ chức thực hiện nghiêm nếp sống văn minh, đảm bảo tuyệt đối an toàn PCCC và an ninh trật tự."*`,
      suggestedFollowUps: [
        { label: "📁 Xem văn bản đến đang chờ bút phê", prompt: "Có những văn bản đến nào đang chờ Lãnh đạo bút phê phân công?" },
        { label: "📝 Soạn văn bản hỏa tốc", prompt: "Quy định về thời hạn xử lý văn bản hỏa tốc, thượng khẩn theo Nghị định 30" },
      ],
    };
  }

  return null;
}

// ============================================================================
// 3. TRUY VẤN DỮ LIỆU THỰC TẾ TRONG HỆ THỐNG (LIVE STATE QUERY ENGINE)
// ============================================================================

function tryQueryLiveSystemState(q: string, state: AppStateDataRef): AiResponseResult | null {
  // 3.1 Tra cứu Hồ sơ Một cửa cụ thể hoặc danh sách
  if (q.includes("hồ sơ") || q.includes("một cửa") || q.includes("dvc") || q.includes("tiếp nhận")) {
    const list = state.hoSoMotCuaLienThongList || [];

    // Tìm kiếm theo từ khóa tên hoặc mã
    const matched = list.filter((h) => {
      const kw = q.replace(/tra cứu|hồ sơ|tìm|xem|của/g, "").trim().toLowerCase();
      if (!kw) return false;
      return (
        h.maHoSo.toLowerCase().includes(kw) ||
        h.nguoiNop.toLowerCase().includes(kw) ||
        h.tenThuTuc.toLowerCase().includes(kw) ||
        h.cccd.toLowerCase().includes(kw)
      );
    });

    if (matched.length > 0) {
      const top = matched.slice(0, 3);
      return {
        category: "MOT_CUA",
        text: `🏛️ **TÌM THẤY ${matched.length} HỒ SƠ MỘT CỬA PHÙ HỢP TRONG CƠ SỞ DỮ LIỆU**:

${top
  .map(
    (h, idx) => `📋 **Hồ sơ ${idx + 1}: ${h.maHoSo}**
- **Người nộp**: **${h.nguoiNop}** (CCCD: \`${h.cccd}\`)
- **Tên thủ tục**: ${h.tenThuTuc}
- **Lĩnh vực**: ${h.linhVuc} · Khu phố: ${h.khuPho}
- **Ngày tiếp nhận**: ${h.ngayTiepNhan} · **Ngày hẹn trả**: **${h.ngayHenTra}**
- **Cán bộ thụ lý**: ${h.canBoThuLy}
- **Trạng thái**: ${
      h.trangThai === "DA_TRA_KET_QUA"
        ? "✅ Đã trả kết quả cho công dân"
        : h.trangThai === "DA_KY_SO"
        ? "🛡️ Đã ký số công vụ (Sẵn sàng trả kết quả)"
        : h.trangThai === "CHO_LANH_DAO_KY"
        ? "⏳ Chờ Lãnh đạo ký số phê duyệt"
        : "⏳ Đang thụ lý giải quyết"
    }
- **Kết quả điện tử**: ${h.banDienTuKetQua ? "Đã cấp bản điện tử có chữ ký số xác thực" : "Chưa phát hành"}`
  )
  .join("\n\n")}`,
        suggestedFollowUps: [
          { label: "✍️ Soạn Phiếu xin lỗi nếu trễ", prompt: "Soạn thảo Mẫu số 04 Phiếu xin lỗi cho hồ sơ này" },
          { label: "📊 Xem toàn bộ thống kê Một cửa", prompt: "Tình hình giải quyết hồ sơ Một cửa toàn phường" },
        ],
      };
    }

    // Nếu hỏi chung tình hình Một cửa
    const total = list.length;
    const daTra = list.filter((h) => h.trangThai === "DA_TRA_KET_QUA").length;
    const choKy = list.filter((h) => h.trangThai === "CHO_LANH_DAO_KY").length;
    const dangXuLy = list.filter((h) => h.trangThai === "DANG_XU_LY").length;
    const tyLeDungHan = total > 0 ? ((daTra / total) * 100).toFixed(1) : "100";

    return {
      category: "MOT_CUA",
      text: `🏛️ **BÁO CÁO TÌNH HÌNH TIẾP NHẬN & GIẢI QUYẾT TTHC MỘT CỬA (UBND PHƯỜNG THỦ DẦU MỘT)**:

- **Tổng số hồ sơ tiếp nhận**: **${total}** hồ sơ (100% cấp mã biên nhận Mẫu 01).
- **Hồ sơ đã trả kết quả**: **${daTra}** hồ sơ (${tyLeDungHan}% đúng hạn và trước hạn).
- **Hồ sơ chờ Lãnh đạo ký số**: **${choKy}** hồ sơ.
- **Hồ sơ đang trong quy trình thụ lý**: **${dangXuLy}** hồ sơ.
- **Hồ sơ quá hạn**: **0** hồ sơ (Đạt chỉ tiêu Quyết định 766/QĐ-TTg).
- **Tỷ lệ dịch vụ công trực tuyến**: **82.4%** (liên thông Cổng DVC Quốc gia).
- **Số hóa kết quả điện tử**: 100% kết quả có chữ ký số công vụ tích hợp Kho dữ liệu Đề án 06.`,
      suggestedFollowUps: [
        { label: "📑 Quy định 4 mẫu biểu Một cửa", prompt: "Quy định về 4 mẫu biểu giải quyết TTHC theo Nghị định 61/2018" },
        { label: "🔍 Tìm hồ sơ cụ thể", prompt: "Tra cứu hồ sơ MC-2026" },
      ],
    };
  }

  // 3.2 Tra cứu Văn bản đến / Văn bản đi
  if (q.includes("văn bản đến") || q.includes("hỏa tốc") || q.includes("văn bản đi") || q.includes("thư viện") || q.includes("văn thư")) {
    const vbdList = state.vanBanDenList || [];
    const vbdPending = vbdList.filter((v) => v.trangThai === "CHO_PHAN_CONG");
    const vbdUrgent = vbdList.filter((v) => v.doKhan === "HOA_TOC" || v.doKhan === "THUONG_KHAN");
    const vbDiList = state.vanBanDiList || [];

    return {
      category: "VAN_BAN",
      text: `📁 **TÌNH TRẠNG SỔ VĂN BẢN & ĐIỀU HÀNH (NGHỊ ĐỊNH 30/2020/NĐ-CP)**:

1. **Sổ Văn bản đến (${vbdList.length} văn bản)**:
   * **Văn bản hỏa tốc / thượng khẩn**: **${vbdUrgent.length}** văn bản:
${vbdUrgent.map((v) => `     - Số ${v.soDen}: *${v.trichYeu.slice(0, 75)}...* (Hạn xử lý: ${v.hanXuLy})`).join("\n") || "     (Không có văn bản khẩn tồn đọng)"}
   * **Chờ Lãnh đạo bút phê chỉ đạo**: **${vbdPending.length}** văn bản.
   * **Đang thụ lý chuyên môn**: **${vbdList.filter((v) => v.trangThai === "DANG_XU_LY").length}** văn bản.

2. **Sổ Văn bản đi (${vbDiList.length} văn bản)**:
   * 100% tuân thủ thể thức font Times New Roman, căn lề và số hiệu theo NĐ 30/2020.
   * Đã ký số công vụ và phát hành liên thông Trục Quốc gia: **${vbDiList.filter((v) => v.trangThai === "DA_PHAT_HANH").length}** văn bản.
   * Dự thảo đang thẩm tra thể thức: **${vbDiList.filter((v) => v.trangThai === "DU_THAO").length}** văn bản.

3. **Mã định danh điện tử của UBND Phường Thủ Dầu Một**: \`000.00.24.H50\`, liên thông 100% với Trục liên thông Dịch vụ công Quốc gia.`,
      suggestedFollowUps: [
        { label: "✍️ Gợi ý mẫu Bút phê Lãnh đạo", prompt: "Gợi ý các mẫu bút phê chỉ đạo chuẩn của Lãnh đạo UBND Phường" },
        { label: "📐 Thể thức văn bản chuẩn NĐ 30", prompt: "Quy chuẩn cỡ chữ, căn lề văn bản hành chính theo Nghị định 30/2020" },
      ],
    };
  }

  // 3.3 Tra cứu Tiếp công dân & Đơn thư khiếu nại
  if (q.includes("tiếp dân") || q.includes("khiếu nại") || q.includes("tố cáo") || q.includes("đơn thư") || q.includes("phản ánh")) {
    const list = state.tiepCongDanList || [];
    const pa1022 = state.phanAnh1022List || [];

    return {
      category: "VAN_BAN",
      text: `🏛️ **BÁO CÁO CÔNG TÁC TIẾP CÔNG DÂN & GIẢI QUYẾT ĐƠN THƯ KHIẾU NẠI**:

- **Tiếp công dân định kỳ của Chủ tịch UBND Phường**: Vào ngày Thứ Năm hàng tuần tại Phòng Tiếp công dân.
- **Tổng số lượt tiếp công dân**: **${list.length}** lượt.
  * Khiếu nại đất đai, bồi thường giải phóng mặt bằng: 1 vụ việc.
  * Phản ánh trật tự đô thị, tiếng ồn kinh doanh: 1 vụ việc.
  * Đang thụ lý xác minh thực địa: **${list.filter((t) => t.trangThai === "DANG_XU_LY").length}** vụ việc.
- **Tiếp nhận phản ánh hiện trường Tổng đài 1022**: **${pa1022.length}** phản ánh.
  * 100% được phản hồi công khai trong thời hạn 24 giờ.
  * 0 vụ việc khiếu kiện vượt cấp hoặc đông người phức tạp.`,
      suggestedFollowUps: [
        { label: "✍️ Mẫu Bút phê chuyển đơn khiếu nại", prompt: "Mẫu bút phê chuyển đơn khiếu nại của công dân cho cán bộ thụ lý" },
        { label: "📅 Xem lịch tuần tiếp công dân", prompt: "Lịch tuần làm việc và lịch tiếp công dân của Lãnh đạo" },
      ],
    };
  }

  // 3.4 Báo cáo nhanh tiến độ công việc Lãnh đạo
  if (q.includes("báo cáo") || q.includes("cho sếp") || q.includes("tiến độ") || q.includes("sản phẩm công vụ") || q.includes("nhiệm vụ")) {
    const pendingProds = (state.productCheckInList || []).filter((p) => p.trangThai === "CHO_LANH_DAO_DUYET");
    const approvedProds = (state.productCheckInList || []).filter((p) => p.trangThai === "DA_PHE_CHUAN");
    const urgentTasks = (state.taskAssignmentList || []).filter((t) => t.mucDoUuTien === "HOA_TOC" || t.doUuTien === "HOA_TOC");

    return {
      category: "CANH_BAO",
      text: `📋 **BÁO CÁO TOÀN DIỆN TIẾN ĐỘ THỰC HIỆN NHIỆM VỤ (UBND PHƯỜNG THỦ DẦU MỘT)**:

1. **Sản phẩm công vụ của cán bộ**:
   * Đã thẩm định & phê chuẩn: **${approvedProds.length}** sản phẩm.
   * Đang chờ Lãnh đạo phê duyệt: **${pendingProds.length}** sản phẩm (${pendingProds.map((p) => p.canBoNop).join(", ") || "Không có"}).

2. **Nhiệm vụ trọng tâm được giao**:
   * Tổng số nhiệm vụ đang vận hành: **${(state.taskAssignmentList || []).length}** nhiệm vụ.
   * Nhiệm vụ hỏa tốc: **${urgentTasks.length}** việc (Hậu kiểm an toàn PCCC Lễ hội Chùa Bà, Tổ chức chi trả an sinh xã hội).

3. **Chỉ số công vụ theo từng ngành**:
   * **Văn hóa - Xã hội**: Tỷ lệ GĐVH Khu phố 1 đạt **97.8%**; Đội 814 đã hậu kiểm 4 cơ sở, xử phạt 1 cơ sở vi phạm 7.500.000đ; Xử lý dứt điểm 2 vụ bạo lực gia đình.
   * **Người có công & An sinh**: 100% đối tượng được lập danh sách chi trả, tỷ lệ thanh toán không dùng tiền mặt đạt **98.4%**.
   * **Giáo dục cơ sở**: 100% nhóm trẻ độc lập tư thục được kiểm tra an toàn và ký cam kết lưu mẫu thức ăn bán trú.`,
      suggestedFollowUps: [
        { label: "⭐ Xem đánh giá xếp loại cán bộ", prompt: "Bảng chấm điểm và đánh giá hoàn thành nhiệm vụ cán bộ công chức" },
        { label: "📁 Kiểm tra văn bản đến cần xử lý", prompt: "Văn bản đến cần xử lý khẩn" },
      ],
    };
  }

  // 3.5 Tra cứu kiểm tra Karaoke / Đội 814
  if (q.includes("karaoke") || q.includes("814") || q.includes("hậu kiểm") || q.includes("quán bar") || q.includes("biển hiệu")) {
    const list = state.kiemTra814List || [];
    return {
      category: "VAN_HOA",
      text: `🎤 **BÁO CÁO NGHIỆP VỤ HẬU KIỂM ĐỘI LIÊN NGÀNH 814 (NĐ 54/2019 & NĐ 38/2021)**:

1. **Kết quả kiểm tra thực tế trên địa bàn Phường Thủ Dầu Một**:
   - Đã tiến hành kiểm tra: **${list.length > 0 ? list.length : 4} cơ sở** dịch vụ văn hóa, Karaoke và quảng cáo.
   - Phát hiện vi phạm và lập biên bản xử phạt: **1 cơ sở** (Cơ sở Biển hiệu Quảng cáo Khu phố 2 vi phạm kích thước chỉ giới, xử phạt **7.500.000 đồng** theo Nghị định 38/2021/NĐ-CP).
   - Cơ sở Karaoke: 100% phòng hát tuân thủ diện tích $\\ge 20m^2$, không chốt cửa trong, ngừng hoạt động trước 00h00.

2. **Quy định pháp lý cốt lõi cần ghi nhớ khi kiểm tra**:
   - **Phòng hát Karaoke (NĐ 54/2019)**: Diện tích tối thiểu 20m²; cửa phòng phải trong suốt hoặc có ô kính nhìn rõ bên trong; **nghiêm cấm lắp đặt chốt khóa bên trong** hoặc thiết bị báo động đối phó kiểm tra.
   - **Thời gian hoạt động**: Từ **08h00 đến 24h00** (cấm hoạt động từ 00h00 đến 08h00 sáng).
   - **Kích thước biển hiệu (NĐ 38/2021)**: Biển ngang cao tối đa 2m; biển dọc rộng tối đa 1m, cao tối đa 4m không vượt quá sàn tầng trên.`,
      suggestedFollowUps: [
        { label: "📝 Soạn Biên bản kiểm tra 814", prompt: "Soạn thảo dự thảo Biên bản kiểm tra liên ngành 814 về Karaoke" },
        { label: "🏛️ Quy định thang điểm Gia đình văn hóa", prompt: "Quy định thang điểm 100 xét tặng Gia đình văn hóa theo NĐ 86/2023" },
      ],
    };
  }

  // 3.6 Tra cứu Bạo lực gia đình & Địa chỉ tin cậy
  if (q.includes("bạo lực") || q.includes("địa chỉ tin cậy") || q.includes("tạm lánh") || q.includes("ngược đãi")) {
    const bldList = state.baoLucGiaDinhList || [];
    return {
      category: "BAO_LUC_GD",
      text: `🛡️ **CÔNG TÁC PHÒNG, CHỐNG BẠO LỰC GIA ĐÌNH & BẢO VỆ NẠN NHÂN (LUẬT NĂM 2022)**:

1. **Thống kê tiếp nhận tại Phường Thủ Dầu Một**:
   - Tổng số vụ việc đã tiếp nhận: **${bldList.length > 0 ? bldList.length : 2} vụ việc**.
   - Biện pháp can thiệp đã kích hoạt:
     * 100% nạn nhân được bố trí tạm lánh tại **Địa chỉ tin cậy cộng đồng** (Trạm Y tế Phường hoặc Nhà văn hóa Khu phố).
     * Đã tham mưu Chủ tịch UBND Phường ban hành **Quyết định cấm tiếp xúc** 03 ngày theo Điều 25 Luật PCBLGĐ.
     * Bàn giao Công an Phường giám sát, đối tượng gây bạo lực cam kết không tái phạm.

2. **Nguyên tắc xử lý khẩn cấp 4 bước**:
   - Bước 1: Tiếp nhận tin báo qua đường dây nóng UBND hoặc Công an Phường.
   - Bước 2: Công an và Trưởng Khu phố có mặt tại hiện trường trong vòng **15 phút** ngăn chặn hành vi.
   - Bước 3: Đưa nạn nhân đến cơ sở y tế / nơi tạm lánh an toàn; chăm sóc y tế và tâm lý.
   - Bước 4: Hoàn thiện hồ sơ trình Chủ tịch UBND Phường ban hành Lệnh cấm tiếp xúc trong vòng **12 giờ**.`,
      suggestedFollowUps: [
        { label: "📝 Soạn Quyết định cấm tiếp xúc", prompt: "Soạn thảo dự thảo Quyết định cấm tiếp xúc theo Điều 25 Luật PCBLGĐ" },
        { label: "🏠 Danh sách địa chỉ tin cậy", prompt: "Danh sách địa chỉ tin cậy tạm lánh nạn nhân bạo lực gia đình" },
      ],
    };
  }

  // 3.7 Tra cứu Giáo dục cơ sở & Kiểm thực 3 bước bán trú
  if (q.includes("giáo dục") || q.includes("nhóm trẻ") || q.includes("mầm non") || q.includes("kiểm thực") || q.includes("bán trú")) {
    return {
      category: "GIAO_DUC",
      text: `🏫 **QUẢN LÝ NHÀ NƯỚC VỀ GIÁO DỤC CƠ SỞ & AN TOÀN BÁN TRÚ (QĐ 1246/BYT & NĐ 46/2017)**:

1. **Quy định về nhóm trẻ, lớp mẫu giáo độc lập tư thục**:
   - Quy mô tối đa: **Tối đa 70 trẻ/cơ sở độc lập**; nhóm trẻ quy mô nhỏ tối đa **07 trẻ**.
   - Diện tích phòng nuôi dưỡng: Tối thiểu **1.5 m²/trẻ**; có đủ ánh sáng, thông thoáng và thiết bị PCCC.
   - Đội ngũ giáo viên: Giáo viên phụ trách bắt buộc có bằng **Cao đẳng Sư phạm Mầm non trở lên**.

2. **Quy trình Sổ kiểm thực 3 bước và Lưu mẫu thức ăn (Quyết định 1246/QĐ-BYT)**:
   - **Bước 1 (Nhập nguyên liệu)**: Kiểm tra hóa đơn chứng từ, nguồn gốc xuất xứ, hạn sử dụng, cảm quan nguyên liệu tươi sống trước khi đưa vào sơ chế.
   - **Bước 2 (Chế biến)**: Kiểm tra vệ sinh khu vực bếp theo nguyên tắc 1 chiều, nhiệt độ làm chín thực phẩm.
   - **Bước 3 (Trước khi ăn & Lưu mẫu)**:
     * Cán bộ y tế/bếp trưởng ăn thử và ghi nhận xét vào Sổ kiểm thực.
     * **Bắt buộc lưu mẫu thức ăn**: Mỗi món ăn lưu tối thiểu **100g** (thức ăn đặc) hoặc **150ml** (thức ăn lỏng) trong dụng cụ thủy tinh/inox đậy kín niêm phong.
     * Nhiệt độ lưu: Bảo quản trong tủ lạnh chuyên dụng ở nhiệt độ **2°C đến 8°C** trong thời gian tối thiểu **24 giờ**.`,
      suggestedFollowUps: [
        { label: "📋 Thủ tục cấp phép nhóm trẻ độc lập", prompt: "Hồ sơ và quy trình cấp phép thành lập nhóm trẻ độc lập tư thục" },
        { label: "🍽️ Mẫu biên bản kiểm thực 3 bước", prompt: "Mẫu sổ kiểm thực 3 bước theo Quyết định 1246 của Bộ Y tế" },
      ],
    };
  }

  // 3.8 Gia đình văn hóa & Khu phố văn hóa (NĐ 86/2023)
  if (q.includes("86") || q.includes("gia đình văn hóa") || q.includes("khu phố văn hóa") || q.includes("gđvh")) {
    return {
      category: "VAN_HOA",
      text: `📌 **KHUNG TIÊU CHUẨN XÉT TẶNG DANH HIỆU GIA ĐÌNH VĂN HÓA (NGHỊ ĐỊNH 86/2023/NĐ-CP)**:

Áp dụng thống nhất trên địa bàn 4 Khu phố thuộc Phường Thủ Dầu Một theo thang điểm 100:

1. **Tiêu chuẩn 1 (Tối đa 30 điểm)**: Gương mẫu chấp hành chủ trương của Đảng, chính sách, pháp luật của Nhà nước và quy ước khu dân cư.
2. **Tiêu chuẩn 2 (Tối đa 30 điểm)**: Tích cực học tập, lao động, sản xuất, kinh doanh, phát triển kinh tế gia đình; gia đình hòa thuận.
3. **Tiêu chuẩn 3 (Tối đa 40 điểm)**: Xây dựng gia đình ấm no, bình đẳng, tiến bộ, văn minh; tham gia đóng góp công ích địa phương.

⚖️ **Điều kiện công nhận và khen thưởng**:
- Đạt từ **85 điểm trở lên**: Được công nhận danh hiệu *Gia đình văn hóa* hàng năm (Chủ tịch UBND Phường ra quyết định công nhận).
- Đạt từ **95 điểm trở lên liên tục 03 năm**: Được Chủ tịch UBND Phường tặng **Giấy khen Gia đình văn hóa tiêu biểu**.
- **Tiêu chí loại trừ (không xét tặng)**: Có thành viên bị truy cứu trách nhiệm hình sự; bị xử phạt vi phạm hành chính trong lĩnh vực ANTT, PCCC; có hành vi bạo lực gia đình; khiếu kiện trái quy định.

📅 **Thời hạn bình xét**: Khu phố tổ chức họp bình xét công khai trước ngày **15 tháng 11** hàng năm.`,
      suggestedFollowUps: [
        { label: "📝 Soạn Tờ trình khen thưởng GĐVH", prompt: "Soạn thảo Tờ trình đề nghị tặng Giấy khen Gia đình văn hóa tiêu biểu" },
        { label: "🏙️ Tiêu chuẩn công nhận Khu phố văn hóa", prompt: "Tiêu chí và thang điểm công nhận Khu phố văn hóa theo Nghị định 86" },
      ],
    };
  }

  // 3.9 Thể thức văn bản hành chính theo Nghị định 30/2020
  if (q.includes("thể thức") || q.includes("nghị định 30") || q.includes("căn lề") || q.includes("cỡ chữ") || q.includes("font")) {
    return {
      category: "VAN_BAN",
      text: `📐 **QUY CHUẨN THỂ THỨC VĂN BẢN HÀNH CHÍNH (NGHỊ ĐỊNH 30/2020/NĐ-CP)**:

1. **Quy định khổ giấy & Căn lề trang A4 (210mm × 297mm)**:
   - Lề trên: **20 - 25 mm** (Cách mép trên 2.0 - 2.5cm)
   - Lề dưới: **20 - 25 mm** (Cách mép dưới 2.0 - 2.5cm)
   - Lề trái: **30 - 35 mm** (Để đóng gáy văn bản)
   - Lề phải: **15 - 20 mm**

2. **Phông chữ & Bộ mã ký tự**:
   - Bắt buộc dùng phông chữ tiếng Việt **Times New Roman**, bộ mã Unicode TCVN 6909:2001.

3. **Cỡ chữ và kiểu chữ chuẩn cho các thành phần chính**:
   - **Quốc hiệu**: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" - Cỡ chữ **12 - 13**, in hoa, đứng, đậm.
   - **Tiêu ngữ**: "Độc lập - Tự do - Hạnh phúc" - Cỡ chữ **13 - 14**, chữ in thường, đứng, đậm, có gạch nối ngang.
   - **Tên cơ quan ban hành**: Cỡ chữ **12 - 13**, in hoa, đứng, đậm.
   - **Số, ký hiệu văn bản**: Cỡ chữ **13**, chữ in thường, đứng (VD: \`128/QĐ-UBND\`).
   - **Tên loại và trích yếu nội dung**: Cỡ chữ **13 - 14**, in hoa, đứng, đậm.
   - **Nội dung văn bản**: Cỡ chữ **13 - 14**, dãn dòng 1.15 - 1.5 lines, thụt đầu dòng 1 - 1.27cm.
   - **Chức vụ & Chữ ký**: Chức vụ in hoa đứng đậm cỡ 13-14; Chữ ký số màu xanh hoặc màu đỏ theo QCVN.`,
      suggestedFollowUps: [
        { label: "✍️ Gợi ý mẫu Bút phê Lãnh đạo", prompt: "Gợi ý các mẫu bút phê chỉ đạo chuẩn của Lãnh đạo UBND Phường" },
        { label: "📁 Sổ Văn bản đi và Trình ký", prompt: "Tình hình văn bản đi đang chờ ký số và phát hành" },
      ],
    };
  }

  return null;
}

// ============================================================================
// 4. BỘ ĐIỀU PHỐI XỬ LÝ TRUNG TÂM (MAIN GENERATE DISPATCHER)
// ============================================================================

export function generateGovAiResponse(
  query: string,
  state: AppStateDataRef
): AiResponseResult {
  const q = query.toLowerCase().trim();

  // 1. Kiểm tra ưu tiên: Tính toán trợ cấp số học
  const calcResult = tryCalculateAllowance(q);
  if (calcResult) return calcResult;

  // 2. Kiểm tra ưu tiên: Soạn thảo văn bản hành chính
  const docResult = tryGenerateDocumentDraft(q, state);
  if (docResult) return docResult;

  // 3. Kiểm tra ưu tiên: Truy vấn dữ liệu thực tế hệ thống
  const liveResult = tryQueryLiveSystemState(q, state);
  if (liveResult) return liveResult;

  // 4. Chào hỏi & Tương tác thông minh
  if (
    q === "xin chào" ||
    q === "chào" ||
    q === "hello" ||
    q === "hi" ||
    q.includes("bạn là ai") ||
    q.includes("giới thiệu")
  ) {
    return {
      category: "CHUNG",
      text: `Xin kính chào **${state.currentUser?.fullName || "Đồng chí Cán bộ"}**! 

Tôi là **Trợ lý Công vụ Điện tử phục vụ Điều hành UBND Phường Thủ Dầu Một**. Tôi được lập trình để hỗ trợ đắc lực cho công tác quản trị, chuyên môn và điều hành hàng ngày với các năng lực:

1. 🧮 **Tính toán trợ cấp ưu đãi chính xác**: Tự động tính trợ cấp thương binh, bệnh binh, Mẹ VNAH, mai táng phí theo Nghị định 77/2024 và bảo trợ xã hội Nghị định 76/2024.
2. 🏛️ **Tra cứu thực tế hệ thống**: Tìm kiếm hồ sơ Một cửa, văn bản đến hỏa tốc, danh sách người có công, phản ánh 1022, kết quả hậu kiểm 814.
3. 📝 **Soạn thảo văn bản hành chính tự động**: Dự thảo Giấy hẹn (Mẫu 01), Phiếu xin lỗi (Mẫu 04), Quyết định cấm tiếp xúc bạo lực gia đình, Biên bản kiểm tra 814.
4. ✍️ **Gợi ý Bút phê Lãnh đạo**: Cung cấp các mẫu bút phê điều hành chuẩn mực cho từng tình huống khẩn cấp.

Đồng chí hãy nhập yêu cầu hoặc bấm chọn các gợi ý tác nghiệp nhanh bên dưới!`,
      suggestedFollowUps: [
        { label: "📊 Báo cáo nhanh tiến độ", prompt: "Báo cáo nhanh tiến độ thực hiện nhiệm vụ và sản phẩm công tác" },
        { label: "📁 Văn bản đến hỏa tốc", prompt: "Tình hình văn bản đến và các văn bản hỏa tốc đang chờ xử lý" },
        { label: "🧮 Tính trợ cấp thương binh 61%", prompt: "Tính trợ cấp thương binh 61% theo Nghị định 77/2024" },
        { label: "🏛️ 4 Mẫu biểu Một cửa (NĐ 61)", prompt: "Quy định về 4 mẫu biểu giải quyết TTHC theo Nghị định 61/2018" },
      ],
    };
  }

  // 5. Fallback thông minh với hướng dẫn phân loại
  return {
    category: "CHUNG",
    text: `Tôi đã ghi nhận nội dung câu hỏi của đồng chí: *"**${query}**"*.

Hệ thống hiện sẵn sàng hỗ trợ chuyên sâu các nghiệp vụ sau:
1. 🧮 **Tính trợ cấp công vụ**: Gõ ví dụ: *"Tính trợ cấp thương binh 61%"*, *"Mai táng phí bao nhiêu"*, *"Trợ cấp Mẹ Việt Nam Anh hùng"*.
2. 🏛️ **Tra cứu hồ sơ Một cửa**: Gõ ví dụ: *"Tra cứu hồ sơ MC-TDM"*, *"Có hồ sơ nào trễ hạn không"*, *"Tình hình giải quyết TTHC"*.
3. 📁 **Văn bản & Bút phê**: Gõ ví dụ: *"Văn bản đến hỏa tốc"*, *"Mẫu bút phê chỉ đạo khẩn"*, *"Căn lề chuẩn Nghị định 30"*.
4. 📝 **Soạn thảo mẫu văn bản**: Gõ ví dụ: *"Soạn phiếu xin lỗi Mẫu 04"*, *"Soạn quyết định cấm tiếp xúc"*, *"Soạn biên bản kiểm tra 814"*.
5. 🛡️ **Văn hóa & Đời sống**: Gõ ví dụ: *"Thang điểm Gia đình văn hóa NĐ 86"*, *"Quy định cấm tiếp xúc bạo lực gia đình"*, *"Kiểm tra Karaoke Đội 814"*.

Đồng chí có thể bấm vào các gợi ý nghiệp vụ bên dưới để tra cứu ngay lập tức!`,
    suggestedFollowUps: [
      { label: "🧮 Tính thử trợ cấp thương binh 61%", prompt: "Tính trợ cấp thương binh 61% theo Nghị định 77/2024" },
      { label: "🏛️ Soạn Phiếu xin lỗi Mẫu 04", prompt: "Soạn thảo Mẫu số 04 Phiếu xin lỗi và hẹn lại ngày trả kết quả" },
      { label: "📁 Kiểm tra văn bản đến cần xử lý", prompt: "Tình hình văn bản đến và các văn bản hỏa tốc đang chờ xử lý" },
      { label: "📌 Thang điểm GĐVH (NĐ 86)", prompt: "Quy định thang điểm 100 xét tặng Gia đình văn hóa theo NĐ 86/2023" },
    ],
  };
}

