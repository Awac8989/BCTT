import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("docs/screenshots/tinh_nang_moi");
const BASE_URL = "http://localhost:8081";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== BẮT ĐẦU CHỤP BỘ ẢNH GIAO DIỆN CÁC TÍNH NĂNG MỚI NÂNG CẤP ===");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--window-size=1600,1000",
    ],
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  async function take(filename, description) {
    const dest = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: dest });
    console.log(`[✓ ĐÃ CHỤP] ${filename}: ${description}`);
  }

  async function clickByText(text) {
    return await page.evaluate((t) => {
      const elements = Array.from(document.querySelectorAll('button, a, span, div[role="button"]'));
      const el = elements.find((e) => e.innerText && e.innerText.includes(t));
      if (el) {
        el.click();
        return true;
      }
      return false;
    }, text);
  }

  async function closeModal() {
    await page.keyboard.press("Escape");
    await sleep(400);
    // Also try clicking close button if escape didn't close
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title*="Đóng"], button[aria-label*="Close"], button.modal-close');
      if (closeBtn) closeBtn.click();
    });
    await sleep(300);
  }

  async function loginAs(username, password) {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
    await sleep(800);
    await page.evaluate((u, p) => {
      const inputs = document.querySelectorAll("input");
      if (inputs.length >= 2) {
        inputs[0].value = u;
        inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
        inputs[1].value = p;
        inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, username, password);
    await sleep(300);
    await clickByText("Đăng nhập vào Hệ thống");
    await sleep(1500);
  }

  try {
    // -------------------------------------------------------------
    // 1. CỔNG ĐĂNG NHẬP MỚI (/login)
    // -------------------------------------------------------------
    console.log("\n1. Chụp Cổng đăng nhập mới...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
    await sleep(1200);
    await take("01_cong_dang_nhap_chuyen_dung.png", "Cổng đăng nhập bảo mật & Tải danh sách tài khoản Excel/CSV");

    // 2. MODAL TRA CỨU TÀI KHOẢN CÔNG VỤ
    console.log("\n2. Chụp Modal tra cứu tài khoản công vụ...");
    await clickByText("Tra cứu danh sách tài khoản");
    await sleep(800);
    await take("02_modal_tra_cuu_tai_khoan.png", "Bảng tra cứu danh bạ tài khoản & phân quyền cán bộ 3 cấp");
    await clickByText("Đóng bảng tra cứu");
    await sleep(400);

    // -------------------------------------------------------------
    // 3. PHÂN HỆ KỸ THUẬT (/ky-thuat) - VAI TRÒ ADMIN_TECH (KS. Lê Văn Khoa)
    // -------------------------------------------------------------
    console.log("\nĐăng nhập vai trò Kỹ sư IT (admin.tech)...");
    await loginAs("admin.tech", "BinhDuong@2026");

    // 3a. Tab Báo lỗi sự cố hệ thống
    console.log("\n3. Chụp /ky-thuat Tab 1 - Báo lỗi & Sự cố hệ thống...");
    await page.goto(`${BASE_URL}/ky-thuat`, { waitUntil: "networkidle2" });
    await sleep(1200);
    await take("03_ky_thuat_bao_loi_su_co.png", "Phân hệ Kỹ thuật: Tiếp nhận & Xử lý báo lỗi website từ người dùng");

    // 3b. Tab Database Fix Studio
    console.log("\n4. Chụp /ky-thuat Tab 2 - Database Fix Studio & SQL Console...");
    await clickByText("Phân hệ Rà soát & Sửa lỗi CSDL 3NF");
    await sleep(1000);
    await take("04_ky_thuat_database_studio.png", "Phân hệ Kỹ thuật: Database Studio, SQL Editor, Safety Guards & Table Inspector");

    // 3c. Tab ATTT & VNeID
    console.log("\n5. Chụp /ky-thuat Tab 3 - Kiến trúc ATTT & Tích hợp VNeID/C06...");
    await clickByText("Giám sát ATTT & Tích hợp VNeID");
    await sleep(1000);
    await take("05_ky_thuat_attt_vneid.png", "Kiến trúc An toàn Thông tin Cấp độ 3 & Tích hợp định danh VNeID C06");

    // -------------------------------------------------------------
    // 4. QUY TRÌNH HỒ SƠ: XÁC MINH THỰC ĐỊA & NIÊM YẾT 15 NGÀY (VAI TRÒ GIÁM ĐỐC SỞ)
    // -------------------------------------------------------------
    console.log("\nĐăng nhập vai trò Giám đốc Sở (giamdoc.so) để truy cập mọi mảng nghiệp vụ...");
    await loginAs("giamdoc.so", "BinhDuong@2026");

    // 4a. Modal Xác minh thực địa Mẫu 02/XMTD tại hồ sơ ID 12029
    console.log("\n6. Chụp Biên bản Xác minh thực địa Mẫu 02/XMTD...");
    await page.goto(`${BASE_URL}/ho-so/12029`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await clickByText("Xác minh thực địa");
    await sleep(1000);
    await take("06_bien_ban_xac_minh_thuc_dia.png", "Biên bản kiểm tra hiện trường & xác minh thực địa Mẫu 02/XMTD 4 bên ký");
    await closeModal();

    // 4b. Modal Thông báo Niêm yết công khai (Tab 1)
    console.log("\n7. Chụp Thông báo Niêm yết công khai (Tab 1)...");
    await clickByText("Niêm yết 15 ngày");
    await sleep(1000);
    await take("07_thong_bao_niem_yet_15_ngay.png", "Thông báo Niêm yết công khai tại UBND Phường và Khu phố theo NĐ 131/2021");

    // 4c. Modal Biên bản Kết thúc Niêm yết công khai (Tab 2)
    console.log("\n8. Chụp Biên bản Kết thúc Niêm yết sau 15 ngày (Tab 2)...");
    await clickByText("Biên bản Kết thúc Niêm yết (sau 15 ngày)");
    await sleep(1000);
    await take("08_bien_ban_ket_thuc_niem_yet.png", "Biên bản Kết thúc Niêm yết công khai sau 15 ngày có 4 chữ ký liên ngành");
    await closeModal();

    // -------------------------------------------------------------
    // 5. PHÂN HỆ CHI TRẢ: MAI TÁNG PHÍ, SỔ C70b-HD, BẢNG KÊ VNPOST
    // -------------------------------------------------------------
    console.log("\n9. Chụp Quyết định Mai táng phí & Trợ cấp một lần...");
    await page.goto(`${BASE_URL}/chi-tra`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await clickByText("QĐ Mai táng phí & Một lần");
    await sleep(1000);
    await take("09_quyet_dinh_mai_tang_phi.png", "Quyết định hưởng trợ cấp Mai táng phí (23.4 triệu đ) & Trợ cấp 1 lần có Ký số SmartCA");
    await closeModal();

    // 5b. Sổ theo dõi Chi trả Trợ cấp Mẫu C70b-HD
    console.log("\n10. Chụp Sổ theo dõi Chi trả Trợ cấp Mẫu C70b-HD...");
    await clickByText("Sổ Chi trả Mẫu C70b-HD");
    await sleep(1000);
    await take("10_so_chi_tra_mau_c70b_hd.png", "Sổ theo dõi chi trả trợ cấp ưu đãi Mẫu C70b-HD khổ A4 ngang theo Thông tư liên tịch BTC - BLĐTBXH");
    await closeModal();

    // 5c. Bảng kê Bưu điện VNPost & Phiếu phát tiền tận nhà
    console.log("\n11. Chụp Bảng kê Bưu điện VNPost (Tab 1)...");
    await clickByText("Bảng kê Bưu điện VNPost (Tiền mặt)");
    await sleep(1000);
    await take("11_bang_ke_buu_dien_vnpost.png", "Bảng kê danh sách đối tượng chi trả tiền mặt qua Bưu điện VNPost (Mẫu C70a-VNPost)");

    console.log("\n12. Chụp Phiếu phát tiền tận nhà cho Mẹ VNAH (Tab 2)...");
    await clickByText("Phiếu phát tiền tận nhà (Mẹ VNAH / TB nặng)");
    await sleep(1000);
    await take("12_phieu_phat_tien_tan_nha.png", "Phiếu phát tiền trợ cấp tận nhà cho Bà Mẹ VNAH Lê Thị Mai và Thương binh nặng");
    await closeModal();

    // -------------------------------------------------------------
    // 6. NGHĨA TRANG LIỆT SĨ: TRÍCH LỤC MỘ & LIVE QR GPS
    // -------------------------------------------------------------
    console.log("\n13. Chụp Trích lục mộ liệt sĩ & Live QR GPS...");
    await page.goto(`${BASE_URL}/nghia-trang`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await clickByText("In Giấy Trích Lục Mộ");
    await sleep(1000);
    await take("13_trich_luc_mo_liet_si_gps.png", "Giấy trích lục thông tin mộ liệt sĩ khổ A4 có mã QR Code GPS dẫn đường trực tiếp");
    await closeModal();

    // -------------------------------------------------------------
    // 7. AN SINH XÃ HỘI: QUYẾT ĐỊNH TRỢ CẤP BẢO TRỢ XÃ HỘI
    // -------------------------------------------------------------
    console.log("\n14. Chụp Quyết định trợ cấp Bảo trợ xã hội...");
    await page.goto(`${BASE_URL}/an-sinh-xa-hoi`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await clickByText("Quyết định");
    await sleep(1000);
    await take("14_quyet_dinh_bao_tro_xa_hoi.png", "Quyết định trợ cấp Bảo trợ xã hội hàng tháng (Nghị định 76/2024/NĐ-CP mức chuẩn 500k)");
    await closeModal();

    // -------------------------------------------------------------
    // 8. TIẾP CÔNG DÂN: PHIẾU HƯỚNG DẪN TIẾP DÂN
    // -------------------------------------------------------------
    console.log("\n15. Chụp Phiếu Tiếp nhận & Hướng dẫn Tiếp công dân...");
    await page.goto(`${BASE_URL}/van-ban`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await clickByText("Tiếp công dân");
    await sleep(1000);
    await clickByText("In Phiếu");
    await sleep(1000);
    await take("15_phieu_huong_dan_tiep_dan.png", "Phiếu Hướng dẫn & Thông báo thụ lý đơn thư Tiếp công dân (Thông tư 04/2021/TT-TTCP)");
    await closeModal();

    // -------------------------------------------------------------
    // 9. CỔNG TRA CỨU CÔNG DÂN: KẾT QUẢ & TẢI GIẤY TỜ ĐIỆN TỬ
    // -------------------------------------------------------------
    console.log("\n16. Chụp Cổng Tra cứu Dịch vụ công...");
    await page.goto(`${BASE_URL}/tra-cuu`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await take("16_tra_cuu_cong_dan_ket_qua.png", "Cổng Tra cứu Công dân: Tải Giấy hẹn Một cửa điện tử, QĐ trợ cấp SmartCA & Thẻ BHYT D03-TS");

    // -------------------------------------------------------------
    // 10. PHÂN TÍCH: KHUNG ĐÁNH GIÁ HIỆU QUẢ NGHIỆP VỤ
    // -------------------------------------------------------------
    console.log("\n17. Chụp Phân hệ Đánh giá Hiệu quả...");
    await page.goto(`${BASE_URL}/phan-tich`, { waitUntil: "networkidle2" });
    await sleep(1500);
    await clickByText("Đánh giá Hiệu quả");
    await sleep(1200);
    await take("17_danh_gia_hieu_qua_nghiep_vu.png", "Khung Đánh giá Hiệu quả: SLA 99.2%, SIPAS 98.6%, Đề án 06 98.4%, ROI ngân sách");

    console.log("\n=== HOÀN TẤT CHỤP TOÀN BỘ 17 ẢNH GIAO DIỆN TÍNH NĂNG MỚI! ===");
    console.log(`Toàn bộ ảnh lưu tại thư mục: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error("Lỗi trong quá trình chụp:", error);
  } finally {
    await browser.close();
  }
}

run();
