import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Ellipse, FancyBboxPatch

os.makedirs('docs/diagrams', exist_ok=True)

# Cấu hình phông chữ thẩm mỹ cao hỗ trợ Unicode tiếng Việt
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def draw_actor(ax, x, y, label, role_desc="", color="#1e293b", badge_bg="#f1f5f9", badge_ec="#cbd5e1"):
    """Vẽ tác nhân (Actor) chuẩn UML với biểu tượng người que và nhãn chức danh chuyên nghiệp"""
    r_head = 0.22
    # Đầu (Circle)
    head = plt.Circle((x, y + 0.62), r_head, edgecolor=color, facecolor="#ffffff", lw=2.2, zorder=10)
    ax.add_patch(head)
    # Thân (Torso)
    ax.plot([x, x], [y + 0.40, y - 0.16], color=color, lw=2.2, zorder=10)
    # Tay (Arms)
    ax.plot([x - 0.38, x + 0.38], [y + 0.20, y + 0.20], color=color, lw=2.2, zorder=10)
    # Chân (Legs)
    ax.plot([x, x - 0.32], [y - 0.16, y - 0.70], color=color, lw=2.2, zorder=10)
    ax.plot([x, x + 0.32], [y - 0.16, y - 0.70], color=color, lw=2.2, zorder=10)
    
    # Nhãn tên Tác nhân
    ax.text(x, y - 0.92, label, fontsize=9.2, weight="bold", color=color, ha="center", va="top",
            bbox=dict(boxstyle="round,pad=0.25", fc=badge_bg, ec=badge_ec, lw=1.2, alpha=0.98), zorder=11)
    if role_desc:
        ax.text(x, y - 1.30, role_desc, fontsize=7.8, style="italic", color="#64748b", ha="center", va="top", zorder=11)

def draw_usecase(ax, x, y, width, height, title, code="", ec="#1e3a8a", fc="#ffffff", text_color="#0f172a", fontsize=8.2):
    """Vẽ Use Case hình Oval chuẩn UML"""
    ellipse = Ellipse((x, y), width, height, edgecolor=ec, facecolor=fc, lw=1.6, zorder=5)
    ax.add_patch(ellipse)
    
    full_text = f"<{code}>\n{title}" if code else title
    ax.text(x, y, full_text, fontsize=fontsize, weight="bold", color=text_color,
            ha="center", va="center", multialignment="center", zorder=6)

def draw_association(ax, p1, p2, color="#475569", lw=1.3, zorder=3):
    """Đường kết hợp (Association) giữa Tác nhân và Use Case"""
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=color, lw=lw, ls="-", zorder=zorder)

def draw_dependency(ax, p1, p2, text="<<include>>", text_offset=(0, 0.14), color="#0284c7"):
    """Vẽ quan hệ <<include>> hoặc <<extend>> nét đứt có mũi tên"""
    ax.annotate('', xy=p2, xytext=p1,
                arrowprops=dict(facecolor=color, edgecolor=color, arrowstyle='->', lw=1.4, ls='--', shrinkA=2, shrinkB=2),
                zorder=4)
    mid_x = (p1[0] + p2[0]) / 2 + text_offset[0]
    mid_y = (p1[1] + p2[1]) / 2 + text_offset[1]
    ax.text(mid_x, mid_y, text, fontsize=7.2, weight="bold", color=color,
            ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.15", fc="#ffffff", ec=color, lw=0.7, alpha=0.95), zorder=7)

def generate_usecase_diagram():
    fig, ax = plt.subplots(figsize=(16.5, 12.0), dpi=300)
    ax.set_xlim(-0.6, 17.1)
    ax.set_ylim(-0.8, 12.4)
    ax.axis('off')

    # 1. RANH GIỚI HỆ THỐNG (SYSTEM BOUNDARY)
    sys_box = FancyBboxPatch((2.5, 0.0), 11.5, 11.7, boxstyle="round,pad=0.2",
                             ec="#1e3a8a", fc="#ffffff", lw=2.4, zorder=1)
    ax.add_patch(sys_box)

    # Tiêu đề System Boundary
    header_box = FancyBboxPatch((2.7, 11.15), 11.1, 0.45, boxstyle="round,pad=0.08",
                                ec="#1e3a8a", fc="#1e3a8a", lw=1.0, zorder=2)
    ax.add_patch(header_box)
    ax.text(8.25, 11.37, "HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG & ĐÁNH GIÁ DỊCH VỤ CÔNG (TP. THỦ DẦU MỘT)",
            color="#ffffff", weight="bold", fontsize=11.2, ha="center", va="center", zorder=3)

    # 2. KHU VỰC 6 PHÂN HỆ NGHIỆP VỤ (6 SUBSYSTEMS)
    subsystems = [
        # (x, y, w, h, title, ec, fc)
        (2.7, 7.7, 5.3, 3.25, "1. PHÂN HỆ TIẾP NHẬN & HỒ SƠ MỘT CỬA", "#2563eb", "#eff6ff"),
        (2.7, 4.0, 5.3, 3.50, "2. PHÂN HỆ THẨM ĐỊNH & CHÍNH SÁCH TRỢ CẤP", "#0d9488", "#f0fdfa"),
        (2.7, 0.3, 5.3, 3.50, "3. PHÂN HỆ KẾ TOÁN CHI TRẢ & BÁO GIẢM", "#d97706", "#fffbeb"),
        (8.5, 7.7, 5.3, 3.25, "6. PHÂN HỆ GIÁM SÁT LÃNH ĐẠO & PHÊ DUYỆT", "#e11d48", "#fff1f2"),
        (8.5, 4.0, 5.3, 3.50, "5. PHÂN HỆ CỔNG DỊCH VỤ CÔNG & KIOSK CSAT", "#7c3aed", "#faf5ff"),
        (8.5, 0.3, 5.3, 3.50, "4. PHÂN HỆ QUẢN TRỊ HỆ THỐNG & DANH MỤC", "#475569", "#f8fafc"),
    ]

    for (sx, sy, sw, sh, stitle, sec, sfc) in subsystems:
        p_sub = FancyBboxPatch((sx, sy), sw, sh, boxstyle="round,pad=0.1", ec=sec, fc=sfc, lw=1.2, ls=":", zorder=2)
        ax.add_patch(p_sub)
        ax.text(sx + 0.15, sy + sh - 0.22, stitle, fontsize=8.2, weight="bold", color=sec, ha="left", va="center", zorder=3)

    # 3. USE CASES CHI TIẾT TRONG TỪNG PHÂN HỆ
    # -------------------------------------------------------------
    # PHÂN HỆ 1: TIẾP NHẬN & HỒ SƠ MỘT CỬA (Top-Left)
    # -------------------------------------------------------------
    draw_usecase(ax, 4.05, 9.85, 2.25, 0.75, "Tiếp nhận hồ sơ mới\n& Cấp mã định danh", "UC-01", ec="#2563eb", fc="#ffffff")
    draw_usecase(ax, 6.75, 9.85, 2.05, 0.75, "In Giấy hẹn Mẫu 01\n(Mã QR tra cứu)", "UC-01a", ec="#2563eb", fc="#ffffff")
    draw_usecase(ax, 4.05, 8.50, 2.25, 0.75, "Số hóa hồ sơ giấy\n(Quét AI OCR Scan)", "UC-02", ec="#2563eb", fc="#ffffff")
    draw_usecase(ax, 6.75, 8.50, 2.05, 0.75, "Tiếp nhận báo giảm\nđối tượng từ trần", "UC-05", ec="#2563eb", fc="#ffffff")

    # Quan hệ Phân hệ 1
    draw_dependency(ax, (5.17, 9.85), (5.72, 9.85), text="<<include>>", text_offset=(0, 0.16), color="#2563eb")
    draw_dependency(ax, (4.05, 8.87), (4.05, 9.47), text="<<extend>>", text_offset=(0.35, 0), color="#0284c7")

    # -------------------------------------------------------------
    # PHÂN HỆ 2: THẨM ĐỊNH & CHÍNH SÁCH TRỢ CẤP (Mid-Left)
    # -------------------------------------------------------------
    draw_usecase(ax, 4.15, 6.75, 2.35, 0.75, "Thẩm định hồ sơ 5 bước\n(Kiểm tra y khoa/pháp lý)", "UC-03", ec="#0d9488", fc="#ffffff")
    draw_usecase(ax, 6.80, 6.75, 2.05, 0.75, "Tự động tính trợ cấp\n(Nghị định 75/2021)", "UC-03a", ec="#0d9488", fc="#ffffff")
    draw_usecase(ax, 4.15, 5.50, 2.35, 0.75, "Lập dự thảo Quyết định\nhưởng trợ cấp ưu đãi", "UC-03b", ec="#0d9488", fc="#ffffff")
    draw_usecase(ax, 6.80, 5.50, 2.05, 0.75, "Quản lý kế hoạch\nđiều dưỡng luân phiên", "UC-06", ec="#0d9488", fc="#ffffff")
    draw_usecase(ax, 4.15, 4.35, 2.35, 0.65, "Quản lý cấp phương tiện &\nDụng cụ chỉnh hình", "UC-07", ec="#0d9488", fc="#ffffff")

    # Quan hệ Phân hệ 2
    draw_dependency(ax, (5.32, 6.75), (5.77, 6.75), text="<<include>>", text_offset=(0, 0.16), color="#0d9488")
    draw_dependency(ax, (4.15, 6.37), (4.15, 5.87), text="<<include>>", text_offset=(0.36, 0), color="#0d9488")

    # -------------------------------------------------------------
    # PHÂN HỆ 3: KẾ TOÁN CHI TRẢ & BÁO GIẢM (Bottom-Left)
    # -------------------------------------------------------------
    draw_usecase(ax, 4.15, 2.85, 2.35, 0.75, "Lập danh sách chi trả &\nXuất Phiếu chi C70a-HD", "UC-04", ec="#d97706", fc="#ffffff")
    draw_usecase(ax, 6.80, 2.85, 2.05, 0.75, "Đối soát tự động\nsao kê Ngân hàng", "UC-04a", ec="#d97706", fc="#ffffff")
    draw_usecase(ax, 4.15, 1.45, 2.35, 0.75, "Ban hành Quyết định\nMai táng phí Mẫu 02", "UC-05a", ec="#d97706", fc="#ffffff")
    draw_usecase(ax, 6.80, 1.45, 2.05, 0.75, "Chi trả trợ cấp\nMai táng phí & 1 lần", "UC-05b", ec="#d97706", fc="#ffffff")

    # Quan hệ Phân hệ 3
    draw_dependency(ax, (5.77, 2.85), (5.32, 2.85), text="<<extend>>", text_offset=(0, 0.16), color="#d97706")
    draw_dependency(ax, (5.32, 1.45), (5.77, 1.45), text="<<include>>", text_offset=(0, 0.16), color="#b45309")

    # -------------------------------------------------------------
    # PHÂN HỆ 6: GIÁM SÁT LÃNH ĐẠO & PHÊ DUYỆT (Top-Right)
    # -------------------------------------------------------------
    draw_usecase(ax, 9.80, 9.85, 2.15, 0.75, "Dashboard điều hành &\nTrung tâm cảnh báo rủi ro", "UC-11", ec="#e11d48", fc="#ffffff")
    draw_usecase(ax, 12.45, 9.85, 2.05, 0.75, "Ký số điện tử PKI\n(SmartCA Quyết định)", "UC-12", ec="#e11d48", fc="#ffffff")
    draw_usecase(ax, 9.80, 8.50, 2.15, 0.75, "Giám sát Radar SIPAS\n4 tiêu chí phục vụ", "UC-11a", ec="#e11d48", fc="#ffffff")
    draw_usecase(ax, 12.45, 8.50, 2.05, 0.75, "Kiểm toán công vụ &\nThống kê ngân sách", "UC-11b", ec="#e11d48", fc="#ffffff")

    # Quan hệ Phân hệ 6
    draw_dependency(ax, (9.80, 9.47), (9.80, 8.87), text="<<include>>", text_offset=(0.36, 0), color="#e11d48")

    # -------------------------------------------------------------
    # PHÂN HỆ 5: CỔNG DỊCH VỤ CÔNG & KIOSK CSAT (Mid-Right)
    # -------------------------------------------------------------
    draw_usecase(ax, 9.80, 6.75, 2.25, 0.75, "Tra cứu tiến độ hồ sơ &\nLịch phát tiền qua CCCD", "UC-09", ec="#7c3aed", fc="#ffffff")
    draw_usecase(ax, 12.45, 6.75, 2.05, 0.75, "Tra cứu bia mộ Liệt sĩ\n& Thắp hương số (GIS)", "UC-08", ec="#7c3aed", fc="#ffffff")
    draw_usecase(ax, 9.80, 5.00, 2.25, 0.75, "Đánh giá dịch vụ Kiosk\n(1-5 sao, 4 tiêu chí)", "UC-10", ec="#7c3aed", fc="#ffffff")
    draw_usecase(ax, 12.45, 5.00, 2.05, 0.75, "Góp ý nhận xét tự do &\nPhân tích Sentiment AI", "UC-10a", ec="#7c3aed", fc="#ffffff")

    # Quan hệ Phân hệ 5
    draw_dependency(ax, (11.42, 5.00), (10.92, 5.00), text="<<extend>>", text_offset=(0, 0.16), color="#7c3aed")

    # -------------------------------------------------------------
    # PHÂN HỆ 4: QUẢN TRỊ HỆ THỐNG & DANH MỤC (Bottom-Right)
    # -------------------------------------------------------------
    draw_usecase(ax, 9.80, 2.85, 2.25, 0.75, "Cấu hình định mức chuẩn\n& Tham số chính sách", "UC-13", ec="#475569", fc="#ffffff")
    draw_usecase(ax, 12.45, 2.85, 2.05, 0.75, "Phân quyền RBAC &\nQuản lý tài khoản cán bộ", "UC-14", ec="#475569", fc="#ffffff")
    draw_usecase(ax, 9.80, 1.45, 2.25, 0.75, "Giám sát nhật ký kiểm toán\n(Audit Trails / Security)", "UC-15", ec="#475569", fc="#ffffff")
    draw_usecase(ax, 12.45, 1.45, 2.05, 0.75, "Quản trị bản đồ số GIS\nNghĩa trang & Khu mộ", "UC-08a", ec="#475569", fc="#ffffff")

    # 4. TÁC NHÂN (ACTORS) VÀ ĐƯỜNG LIÊN KẾT (ASSOCIATIONS)
    # ==========================
    # PHÍA BÊN TRÁI (LEFT ACTORS)
    # ==========================
    x_act_l = 1.15

    # Tác nhân 1: Cán bộ Tiếp nhận Một cửa (y = 9.2)
    draw_actor(ax, x_act_l, 9.2, "Cán bộ Một cửa", "Tiếp nhận & Cấp giấy hẹn", color="#1e3a8a", badge_bg="#eff6ff", badge_ec="#93c5fd")
    draw_association(ax, (x_act_l + 0.35, 9.35), (2.92, 9.85), color="#1e3a8a", lw=1.4)
    draw_association(ax, (x_act_l + 0.35, 9.15), (2.92, 8.50), color="#1e3a8a", lw=1.4)
    draw_association(ax, (x_act_l + 0.35, 8.95), (5.72, 8.50), color="#1e3a8a", lw=1.2) # UC-05 Báo giảm

    # Tác nhân 2: Chuyên viên Thẩm định (y = 5.6)
    draw_actor(ax, x_act_l, 5.6, "Chuyên viên Thẩm định", "Thẩm định y khoa & Lập QĐ", color="#0f766e", badge_bg="#f0fdfa", badge_ec="#99f6e4")
    draw_association(ax, (x_act_l + 0.35, 5.85), (2.97, 6.75), color="#0f766e", lw=1.4)
    draw_association(ax, (x_act_l + 0.35, 5.60), (2.97, 5.50), color="#0f766e", lw=1.4)
    draw_association(ax, (x_act_l + 0.35, 5.40), (5.77, 5.50), color="#0f766e", lw=1.2) # UC-06 Điều dưỡng
    draw_association(ax, (x_act_l + 0.35, 5.20), (2.97, 4.35), color="#0f766e", lw=1.2) # UC-07 Chỉnh hình

    # Tác nhân 3: Cán bộ Kế toán / Chi trả (y = 2.1)
    draw_actor(ax, x_act_l, 2.1, "Cán bộ Kế toán / Chi trả", "Xuất C70a-HD & Đối soát", color="#b45309", badge_bg="#fffbeb", badge_ec="#fde68a")
    draw_association(ax, (x_act_l + 0.35, 2.30), (2.97, 2.85), color="#b45309", lw=1.4)
    draw_association(ax, (x_act_l + 0.35, 2.05), (2.97, 1.45), color="#b45309", lw=1.4) # UC-05a Mai táng phí
    draw_association(ax, (x_act_l + 0.35, 1.85), (5.77, 1.45), color="#b45309", lw=1.2) # UC-05b Chi trả

    # ==========================
    # PHÍA BÊN PHẢI (RIGHT ACTORS)
    # ==========================
    x_act_r = 15.35

    # Tác nhân 4: Lãnh đạo Phê duyệt (y = 9.2)
    draw_actor(ax, x_act_r, 9.2, "Lãnh đạo Phê duyệt", "Ký số PKI & Giám sát SIPAS", color="#be123c", badge_bg="#fff1f2", badge_ec="#fecdd3")
    draw_association(ax, (x_act_r - 0.35, 9.35), (10.87, 9.85), color="#be123c", lw=1.4)
    draw_association(ax, (x_act_r - 0.35, 9.15), (11.42, 9.85), color="#be123c", lw=1.4) # UC-12 Ký số
    draw_association(ax, (x_act_r - 0.35, 8.95), (10.87, 8.50), color="#be123c", lw=1.3) # UC-11a Radar SIPAS

    # Tác nhân 5: Công dân & Thân nhân (y = 5.6)
    draw_actor(ax, x_act_r, 5.6, "Công dân / Thân nhân", "Tra cứu CCCD & Kiosk CSAT", color="#6d28d9", badge_bg="#faf5ff", badge_ec="#e9d5ff")
    draw_association(ax, (x_act_r - 0.35, 5.85), (10.92, 6.75), color="#6d28d9", lw=1.4)
    draw_association(ax, (x_act_r - 0.35, 5.65), (11.42, 6.75), color="#6d28d9", lw=1.3) # UC-08 Tra cứu bia mộ
    draw_association(ax, (x_act_r - 0.35, 5.40), (10.92, 5.00), color="#6d28d9", lw=1.4) # UC-10 Kiosk CSAT

    # Tác nhân 6: Quản trị viên Hệ thống (y = 2.1)
    draw_actor(ax, x_act_r, 2.1, "Quản trị viên Hệ thống", "Phân quyền RBAC & Cấu hình", color="#334155", badge_bg="#f8fafc", badge_ec="#cbd5e1")
    draw_association(ax, (x_act_r - 0.35, 2.30), (10.92, 2.85), color="#334155", lw=1.3) # UC-13
    draw_association(ax, (x_act_r - 0.35, 2.10), (11.42, 2.85), color="#334155", lw=1.3) # UC-14 RBAC
    draw_association(ax, (x_act_r - 0.35, 1.90), (10.92, 1.45), color="#334155", lw=1.2) # UC-15 Audit
    draw_association(ax, (x_act_r - 0.35, 1.70), (11.42, 1.45), color="#334155", lw=1.2) # UC-08a GIS

    # 5. CHÚ THÍCH (LEGEND) Ở CHÂN BIỂU ĐỒ
    legend_y = -0.45
    ax.plot([3.8, 4.6], [legend_y, legend_y], color="#475569", lw=1.5, ls="-")
    ax.text(4.75, legend_y, "Đường liên kết (Association)", fontsize=8.2, color="#334155", va="center")

    ax.annotate('', xy=(8.7, legend_y), xytext=(7.7, legend_y),
                arrowprops=dict(facecolor="#2563eb", edgecolor="#2563eb", arrowstyle='->', lw=1.4, ls='--'))
    ax.text(8.85, legend_y, "Quan hệ Bao hàm <<include>>", fontsize=8.2, color="#2563eb", weight="bold", va="center")

    ax.annotate('', xy=(12.8, legend_y), xytext=(11.8, legend_y),
                arrowprops=dict(facecolor="#059669", edgecolor="#059669", arrowstyle='->', lw=1.4, ls='--'))
    ax.text(12.95, legend_y, "Quan hệ Mở rộng <<extend>>", fontsize=8.2, color="#059669", weight="bold", va="center")

    output_path = "docs/diagrams/hinh_3_1_use_case_tong_quat.png"
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor="#ffffff", edgecolor="none")
    plt.close()
    print(f"Sơ đồ Use Case tổng quát đã được cập nhật thành công tại: {output_path}")

if __name__ == "__main__":
    generate_usecase_diagram()
