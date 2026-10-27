import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  FileText,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { useAppState } from "@/services/app-state";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
  quickActions?: { label: string; prompt: string }[];
}

export function GovAiAssistantWidget() {
  const {
    currentUser,
    giaDinhVanHoaList,
    khuPhoVanHoaList,
    diTichLeHoiList,
    coSoDichVuVanHoaList,
    baoLucGiaDinhList,
    productCheckInList,
    taskAssignmentList,
    hoSoTTHCVanHoaList,
    vanBanDenList,
    vanBanDiList,
    hoSoMotCuaLienThongList,
    tiepCongDanList,
  } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "MSG-WELCOME",
      sender: "AI",
      text: `Xin chào **${currentUser.fullName}**! Tôi là **Trợ lý Ảo AI Công chức & Điều hành UBND Phường**. Tôi có thể hỗ trợ đồng chí tra cứu pháp luật (NĐ 30/2020 văn thư, NĐ 61/2018 một cửa, NĐ 86/2023, NĐ 54/2019, Luật PCBLGĐ 2022), tra cứu văn bản đến/đi, soạn Bút phê Lãnh đạo hoặc báo cáo nhanh KPI cho Sếp.`,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      quickActions: [
        { label: "📊 Báo cáo nhanh KPI cho Sếp", prompt: "Báo cáo nhanh tiến độ KPI và sản phẩm check-in cho Sếp" },
        { label: "📁 Văn bản đến cần xử lý khẩn", prompt: "Tình hình văn bản đến và các văn bản hỏa tốc đang chờ xử lý" },
        { label: "🏛️ 4 Mẫu biểu Một cửa (NĐ 61)", prompt: "Quy định về 4 mẫu biểu giải quyết TTHC theo Nghị định 61/2018" },
        { label: "✍️ Gợi ý Bút phê Lãnh đạo chuẩn", prompt: "Gợi ý các mẫu bút phê chỉ đạo chuẩn của Lãnh đạo UBND Phường" },
        { label: "📌 Thang điểm GĐVH (NĐ 86)", prompt: "Quy định thang điểm 100 xét tặng Gia đình văn hóa theo NĐ 86/2023" },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AI Knowledge Logic & Data Query Engine
  const generateAiResponse = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Báo cáo nhanh KPI cho Sếp
    if (q.includes("báo cáo") || q.includes("kpi") || q.includes("cho sếp") || q.includes("sản phẩm check-in")) {
      const pendingProds = productCheckInList.filter((p) => p.trangThai === "CHO_LANH_DAO_DUYET");
      const approvedProds = productCheckInList.filter((p) => p.trangThai === "DA_PHE_CHUAN");
      const urgentTasks = taskAssignmentList.filter((t) => t.mucDoUuTien === "HOA_TOC");

      return `📋 **BÁO CÁO NHANH TIẾN ĐỘ ĐIỀU HÀNH & KPI (UBND PHƯỜNG PHÚ CƯỜNG)**:
- **Tiến độ Sản phẩm Check-in**:
  * Đã phê chuẩn: **${approvedProds.length}** sản phẩm.
  * Đang chờ Sếp duyệt: **${pendingProds.length}** sản phẩm (${pendingProds.map((p) => p.canBoNop).join(", ") || "Không có"}).
- **Nhiệm vụ trọng tâm**:
  * Tổng số công việc giao: **${taskAssignmentList.length}** nhiệm vụ.
  * Việc hỏa tốc đang thực hiện: **${urgentTasks.length}** nhiệm vụ (Hậu kiểm PCCC Lễ hội Chùa Bà).
- **Mảng Văn hóa - Xã hội**:
  * Tỷ lệ GĐVH Khu phố 1 đạt **97.8%** (528/540 hộ).
  * 100% Di tích lịch sử có QR Audio Guide.
  * Đội 814 đã kiểm tra 4 cơ sở, xử phạt 1 trường hợp biển quảng cáo trái phép 7.500.000đ.
  * Tiếp nhận 2 vụ việc bạo lực gia đình, đã kích hoạt bảo vệ an toàn 100%.`;
    }

    // 2. Tra cứu Nghị định 86/2023 Gia đình văn hóa
    if (q.includes("86") || q.includes("gia đình văn hóa") || q.includes("thang điểm") || q.includes("bình xét")) {
      return `📌 **CĂN CỨ PHÁP LÝ NGHỊ ĐỊNH SỐ 86/2023/NĐ-CP (NGÀY 07/12/2023)**:
Khung tiêu chuẩn xét tặng danh hiệu **Gia đình văn hóa** theo thang điểm 100:
1. **Tiêu chuẩn 1 (Tối đa 30 điểm)**: Gương mẫu chấp hành chủ trương của Đảng, chính sách, pháp luật của Nhà nước.
2. **Tiêu chuẩn 2 (Tối đa 30 điểm)**: Tích cực học tập, lao động, sản xuất, kinh doanh, phát triển kinh tế gia đình.
3. **Tiêu chuẩn 3 (Tối đa 40 điểm)**: Xây dựng gia đình ấm no, bình đẳng, tiến bộ, hòa thuận, văn minh.

⚖️ **Điều kiện công nhận**:
- Đạt từ **85 điểm trở lên**: Được công nhận danh hiệu *Gia đình văn hóa* hàng năm.
- Đạt từ **95 điểm trở lên**: Đề nghị Chủ tịch UBND Phường tặng Giấy khen *Gia đình văn hóa tiêu biểu*.
- Không vi phạm tiêu chí loại trừ: Bị xử phạt vi phạm hành chính, bạo lực gia đình, khiếu kiện vượt cấp.`;
    }

    // 2. Tra cứu Văn bản đến & e-Office / VDXP / Nghị định 30/2020
    if (q.includes("văn bản đến") || q.includes("hỏa tốc") || q.includes("văn bản đi") || q.includes("vdxp") || q.includes("nghị định 30")) {
      const pendingVbd = vanBanDenList.filter((v) => v.trangThai === "CHO_PHAN_CONG");
      const hoaTocVbd = vanBanDenList.filter((v) => v.doKhan === "HOA_TOC" || v.doKhan === "THUONG_KHAN");
      return `📁 **TÌNH HÌNH QUẢN LÝ VĂN BẢN & ĐIỀU HÀNH (NĐ 30/2020/NĐ-CP & TRỤC VDXP)**:
- **Tổng số Văn bản đến**: **${vanBanDenList.length}** văn bản.
  * Hỏa tốc / Thượng khẩn: **${hoaTocVbd.length}** văn bản (cần xử lý trong 24h-48h).
  * Chờ Lãnh đạo bút phê phân công: **${pendingVbd.length}** văn bản.
  * Đang thụ lý xử lý: **${vanBanDenList.filter((v) => v.trangThai === "DANG_XU_LY").length}** văn bản.
- **Sổ Văn bản đi & Trình ký**: **${vanBanDiList.length}** văn bản (100% kiểm tra thể thức font Times New Roman, cỡ chữ, căn lề theo NĐ 30/2020).
- **Trục Liên thông Văn bản Quốc gia (VDXP)**: Mã định danh UBND Phường **000.00.24.H50** hoạt động bình thường, 100% tích hợp ký số SmartCA.`;
    }

    // 3. Tra cứu Một cửa & 4 Mẫu biểu chuẩn Nghị định 61/2018/NĐ-CP
    if (q.includes("mẫu biểu") || q.includes("một cửa") || q.includes("nghị định 61") || q.includes("mẫu 01") || q.includes("mẫu 02") || q.includes("mẫu 04") || q.includes("xin lỗi")) {
      return `🏛️ **QUY ĐỊNH 4 MẪU BIỂU BẮT BUỘC THEO NGHỊ ĐỊNH 61/2018/NĐ-CP & NĐ 107/2021/NĐ-CP**:
1. **Mẫu số 01**: *Giấy tiếp nhận hồ sơ và hẹn trả kết quả* - Bắt buộc có mã hồ sơ, mã vạch Barcode/QR tra cứu tiến độ trên Cổng DVCQG.
2. **Mẫu số 02**: *Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ* - Ghi rõ danh mục giấy tờ thiếu; **cán bộ Một cửa chỉ được yêu cầu bổ sung 01 lần duy nhất**.
3. **Mẫu số 03**: *Phiếu từ chối tiếp nhận giải quyết hồ sơ* - Nêu rõ lý do và căn cứ pháp luật không đủ điều kiện giải quyết.
4. **Mẫu số 04**: *Phiếu xin lỗi và hẹn lại ngày trả kết quả* - **Bắt buộc ban hành khi hồ sơ chậm trễ**, nêu rõ lý do nguyên nhân và ấn định ngày trả kết quả mới.
- **Hiện trạng tại UBND Phường**: Có **${hoSoMotCuaLienThongList.length}** hồ sơ trong hệ thống, tỷ lệ DVC toàn trình đạt **82.4%**, cấp kết quả điện tử gắn mã băm SHA-256 tái sử dụng theo Đề án 06.`;
    }

    // 4. Gợi ý Bút phê Lãnh đạo chuẩn
    if (q.includes("bút phê") || q.includes("chỉ đạo") || q.includes("phê duyệt văn bản")) {
      return `✍️ **GỢI Ý CÁC MẪU BÚT PHÊ CHỈ ĐẠO CHUẨN CỦA LÃNH ĐẠO UBND PHƯỜNG**:
1. **Đối với Văn bản Hỏa tốc / Thanh tra**:
   *"Giao Đ/c [Tên cán bộ] chủ trì, phối hợp [Bộ phận liên quan] kiểm tra thực địa, xử lý dứt điểm và tham mưu văn bản báo cáo UBND Thành phố trước 16h ngày [dd/mm]."*
2. **Đối với Tờ trình xin chủ trương**:
   *"Thống nhất về mặt chủ trương. Đề nghị bộ phận chuyên môn rà soát chặt chẽ điều kiện pháp lý, đảm bảo quy chế chi tiêu nội bộ và lập dự thảo quyết định trình Chủ tịch ký trước ngày [dd/mm]."*
3. **Đối với Đơn thư khiếu nại, phản ánh của công dân**:
   *"Chuyển Đ/c [Cán bộ thụ lý] thụ lý theo thẩm quyền; mời công dân đến làm việc đối thoại, kiểm tra hiện trạng và có văn bản trả lời đúng hạn luật định."*`;
    }

    // 5. Thang điểm Gia đình văn hóa (Nghị định 86/2023/NĐ-CP)
    if (q.includes("cấm tiếp xúc") || q.includes("bạo lực") || q.includes("luật 2022") || q.includes("địa chỉ tin cậy")) {
      return `🛡️ **QUY ĐỊNH VỀ BIỆN PHÁP CẤM TIẾP XÚC THEO LUẬT PHÒNG, CHỐNG BẠO LỰC GIA ĐÌNH NĂM 2022**:
- **Thẩm quyền**: Căn cứ **Điều 25**, **Chủ tịch UBND cấp xã** nơi xảy ra vụ việc có thẩm quyền ban hành quyết định cấm tiếp xúc.
- **Thời hạn áp dụng**: **Không quá 03 ngày** (tối đa 72 giờ) kể từ khi ban hành.
- **Điều kiện ban hành**:
  1. Có đơn yêu cầu của người bị bạo lực gia đình hoặc cơ quan/tổ chức có thẩm quyền.
  2. Hành vi bạo lực gây tổn hại hoặc đe dọa tổn hại tính mạng, sức khỏe.
  3. Người bị bạo lực và người gây bạo lực không cùng chỗ ở hoặc có nơi tạm lánh an toàn.
- **Phạm vi cấm**: Người có hành vi bạo lực không được đến gần người bị bạo lực trong phạm vi **100 mét** và không sử dụng phương tiện để đe dọa, xúc phạm.
- **Giám sát thi hành**: Giao **Công an Phường** tống đạt và chủ trì giám sát thực hiện.`;
    }

    // 4. Tra cứu kiểm tra Karaoke / Đội 814
    if (q.includes("karaoke") || q.includes("54") || q.includes("814") || q.includes("quảng cáo") || q.includes("quán bar")) {
      return `🎤 **NGHIỆP VỤ HẬU KIỂM LIÊN NGÀNH 814 (NĐ 54/2019/NĐ-CP & NĐ 38/2021/NĐ-CP)**:
- **Cơ sở Karaoke**:
  * Diện tích phòng hát từ **20m² trở lên** (không tính công trình phụ).
  * **Cấm chốt khóa trong phòng hát** hoặc lắp đặt thiết bị báo động để đối phó kiểm tra.
  * Không hoạt động từ **00h00 đến 08h00** sáng hôm sau.
  * Phải đảm bảo điều kiện PCCC và an ninh trật tự theo Nghị định 96/2016/NĐ-CP.
- **Xử phạt Biển quảng cáo (Nghị định 38/2021/NĐ-CP)**:
  * Biển hiệu dọc: Chiều ngang tối đa 1m, chiều cao tối đa 4m không vượt quá tầng nhà.
  * Biển hiệu ngang: Chiều cao tối đa 2m, chiều dài không vượt quá mặt tiền nhà.
  * Mức phạt tiền từ **5.000.000đ đến 10.000.000đ** đối với hành vi lắp đặt vượt kích thước chỉ giới hoặc chưa thông báo cơ quan thẩm quyền.`;
    }

    // 5. Soạn thảo mẫu văn bản
    if (q.includes("soạn") || q.includes("mẫu") || q.includes("dự thảo")) {
      return `📝 **DỰ THẢO QUYẾT ĐỊNH CẤM TIẾP XÚC (MẪU CHUẨN ĐIỀU 25 LUẬT PCBLGĐ 2022)**:

UBND TP. THỦ DẦU MỘT               CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
UBND PHƯỜNG PHÚ CƯỜNG                     Độc lập - Tự do - Hạnh phúc
Số: QĐ-UBND-CTX/...               Phú Cường, ngày ... tháng ... năm 2026

                              QUYẾT ĐỊNH
                   Về việc áp dụng biện pháp cấm tiếp xúc

                    CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG
Căn cứ Luật Tổ chức chính quyền địa phương năm 2015;
Căn cứ Điều 25 Luật Phòng, chống bạo lực gia đình năm 2022;
Xét đề nghị của Công chức Văn hóa - Xã hội và Trưởng Công an Phường,

                              QUYẾT ĐỊNH:
Điều 1. Áp dụng biện pháp cấm tiếp xúc đối với:
- Họ và tên: [Người gây bạo lực] - CCCD: [...]
- Nơi cư trú: [Địa chỉ cư trú]
Không được tiếp xúc với người bị bạo lực gia đình:
- Họ và tên: [Nạn nhân] - CCCD: [...]
Phạm vi cấm: Trong bán kính 100m tính từ nơi cư trú hoặc nơi làm việc của nạn nhân.
Điều 2. Thời hạn áp dụng: 03 ngày, kể từ ngày ký.
Điều 3. Trưởng Công an phường, Công chức Văn hóa - Xã hội và các ông/bà có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này.

                                             CHỦ TỊCH
                                       (Ký tên, đóng dấu)`;
    }

    // Default response
    return `Tôi đã ghi nhận yêu cầu: "${query}". 
Hệ thống hiện đang hỗ trợ tự động:
1. **Kiểm tra tiến độ KPI** các khối ngành (Văn hóa, Giáo dục, An sinh, Thông tin).
2. **Duyệt nhanh sản phẩm check-in** tại phân hệ Điều hành Lãnh đạo.
3. **Tra cứu quy định pháp luật**: NĐ 86/2023, NĐ 54/2019, NĐ 38/2021, Luật PCBLGĐ 2022, TT 04/2023/TT-BTC.
4. **Soạn thảo mẫu văn bản**: Tờ trình, Quyết định, Biên bản kiểm tra 814.

Đồng chí có thể bấm vào các gợi ý bên dưới để tra cứu tức thì!`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `USER-${Date.now()}`,
      sender: "USER",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAiResponse(query);
      const aiMsg: Message = {
        id: `AI-${Date.now()}`,
        sender: "AI",
        text: responseText,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Đã sao chép nội dung văn bản vào bộ nhớ tạm!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* 1. Floating Action Button (Always visible on bottom-right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
          title="Mở Trợ lý AI Công chức"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              Trợ lý AI Công chức <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-blue-100 leading-tight">Tra cứu &amp; Soạn thảo số</span>
          </div>
        </button>
      )}

      {/* 2. Chatbot Dialog Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col ${
            isExpanded
              ? "inset-4 sm:inset-10"
              : "bottom-5 right-5 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1">
                  Trợ lý AI Công chức UBND Phường <Sparkles className="w-3 h-3 text-amber-300" />
                </h3>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sẵn sàng hỗ trợ pháp lý &amp; điều hành</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                title={isExpanded ? "Thu nhỏ" : "Phóng to"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                title="Đóng trợ lý"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50 dark:bg-slate-900/50 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "USER" ? "flex-row-reverse" : "flex-row"}`}
              >
                {m.sender === "AI" ? (
                  <div className="size-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs mt-0.5">
                    AI
                  </div>
                ) : (
                  <div className="size-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs mt-0.5">
                    {currentUser.avatarText || "CB"}
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1.5 ${m.sender === "USER" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "USER"
                        ? "bg-blue-600 text-white rounded-tr-xs shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700 shadow-2xs whitespace-pre-wrap"
                    }`}
                  >
                    {m.text}

                    {m.sender === "AI" && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(m.text, m.id)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                          title="Sao chép nội dung"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Chips if present */}
                  {m.quickActions && m.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.quickActions.map((qa) => (
                        <button
                          key={qa.label}
                          type="button"
                          onClick={() => handleSend(qa.prompt)}
                          className="px-2.5 py-1 bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 hover:border-blue-300 rounded-full text-[11px] text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer text-left"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                  AI
                </div>
                <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="size-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi tra cứu hoặc yêu cầu soạn văn bản..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
