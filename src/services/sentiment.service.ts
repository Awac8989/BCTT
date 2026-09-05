/**
 * BỘ PHÂN TÍCH CẢM XÚC VÀ GẮN NHÃN Ý KIẾN ĐÁNH GIÁ CÔNG DÂN
 * Thiết kế theo đặc tả Phần 5.3 TDD
 */

export type SentimentTag = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export const NEGATIVE_KEYWORDS = [
  "chậm",
  "chậm trễ",
  "lâu",
  "hách dịch",
  "phiền hà",
  "thái độ",
  "khó chịu",
  "chờ mệt",
  "chờ lâu",
  "thiếu chỉ dẫn",
  "vòi vĩnh",
  "sách nhiễu",
  "bực mình",
  "thất vọng",
  "quá tệ",
  "tệ",
];

export const POSITIVE_KEYWORDS = [
  "nhanh",
  "nhanh chóng",
  "nhiệt tình",
  "chu đáo",
  "tốt",
  "hài lòng",
  "rõ ràng",
  "tận tình",
  "đúng hẹn",
  "lịch sự",
  "niềm nở",
  "chuyên nghiệp",
  "cảm ơn",
  "tuyệt vời",
  "thân thiện",
  "dễ hiểu",
];

export interface SentimentAnalysisResult {
  sentiment: SentimentTag;
  label: string;
  score: number; // -1 (tiêu cực) đến 1 (tích cực)
  matchedPositive: string[];
  matchedNegative: string[];
}

/**
 * Phân tích cảm xúc từ chuỗi nhận xét của công dân
 */
export function analyzeSentiment(feedbackText?: string | null): SentimentAnalysisResult {
  if (!feedbackText || !feedbackText.trim()) {
    return {
      sentiment: "NEUTRAL",
      label: "Trung tính",
      score: 0,
      matchedPositive: [],
      matchedNegative: [],
    };
  }

  const text = feedbackText.toLowerCase();

  const matchedNegative = NEGATIVE_KEYWORDS.filter((kw) => text.includes(kw));
  const matchedPositive = POSITIVE_KEYWORDS.filter((kw) => text.includes(kw));

  if (matchedNegative.length > 0 && matchedPositive.length === 0) {
    return {
      sentiment: "NEGATIVE",
      label: "Tiêu cực / Phàn nàn",
      score: -1,
      matchedPositive: [],
      matchedNegative,
    };
  }

  if (matchedPositive.length > 0 && matchedNegative.length === 0) {
    return {
      sentiment: "POSITIVE",
      label: "Tích cực / Hài lòng",
      score: 1,
      matchedPositive,
      matchedNegative: [],
    };
  }

  if (matchedNegative.length > matchedPositive.length) {
    return {
      sentiment: "NEGATIVE",
      label: "Thiên về tiêu cực",
      score: -0.5,
      matchedPositive,
      matchedNegative,
    };
  }

  if (matchedPositive.length > matchedNegative.length) {
    return {
      sentiment: "POSITIVE",
      label: "Thiên về tích cực",
      score: 0.5,
      matchedPositive,
      matchedNegative,
    };
  }

  return {
    sentiment: "NEUTRAL",
    label: "Trung tính",
    score: 0,
    matchedPositive,
    matchedNegative,
  };
}
