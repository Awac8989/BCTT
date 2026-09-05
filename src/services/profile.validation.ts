/**
 * XÁC THỰC THÔNG TIN HỒ SƠ VỚI ZOD
 * Thiết kế theo đặc tả Phần 5.1 TDD
 */

import { z } from "zod";

export const createProfileSchema = z.object({
  so_cccd: z
    .string()
    .trim()
    .regex(/^[0-9]{12}$/, "Số CCCD phải gồm đúng 12 chữ số hợp lệ"),
  ho_ten: z
    .string()
    .trim()
    .min(3, "Họ và tên phải có ít nhất 3 ký tự")
    .transform((val) => val.toUpperCase()),
  ngay_sinh: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày sinh phải là YYYY-MM-DD"),
  gioi_tinh: z.enum(["NAM", "NU"], {
    errorMap: () => ({ message: "Giới tính phải là NAM hoặc NU" }),
  }),
  dia_chi_thuong_tru: z
    .string()
    .trim()
    .min(5, "Địa chỉ thường trú không được để trống (tối thiểu 5 ký tự)"),
  ward_id: z.coerce.number().int().positive("Vui lòng chọn Phường / Xã tiếp nhận"),
  huyen: z.string().optional().default("TP. Thủ Dầu Một"),
  phuong: z.string().optional(),
  khu_pho: z.string().optional().default("Khu phố 1"),
  so_ho_so_tinh: z.string().optional(),
  so_bhyt: z.string().optional(),
  dan_toc: z.string().optional().default("Kinh"),
  ban_sao_ban_goc: z.enum(["Bản gốc", "Bản sao"]).optional().default("Bản gốc"),
  ma_loai_dt: z.string().min(1, "Vui lòng chọn loại đối tượng chính sách"),
  ty_le_thuong_tat: z.coerce
    .number()
    .min(0, "Tỷ lệ tổn thương nhỏ nhất là 0%")
    .max(100, "Tỷ lệ tổn thương tối đa là 100%")
    .default(0),
  co_nguoi_cham_soc: z.boolean().default(false),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
