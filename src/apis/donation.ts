import request from '@/utils/request'

export type PayMethod = 'wechat' | 'alipay' | 'crypto' | 'other';
export type CryptoNetwork = 'TRC20' | 'BSC' | 'POL';
export type DonationStatus = 0 | 1 | 2; // 0=待确认 1=已确认 2=已退款

export interface DonationRecord {
  id: number;
  donorName: string;
  donorAvatar: string | null;
  donorEmail: string | null;
  amount: number;
  currency: string;
  payMethod: PayMethod;
  cryptoNetwork: CryptoNetwork | null;
  cryptoTxHash: string | null;
  cryptoFrom: string | null;
  cryptoTo: string | null;
  message: string | null;
  tradeNo: string | null;
  status: DonationStatus;
  isVisible: number;
  createdAt: string;
}

export interface DonationStats {
  totalAmount: number;
  totalDonors: number;
}

export interface DonationListResponse {
  success: boolean;
  message: string;
  data: {
    list: DonationRecord[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface DonationStatsResponse {
  success: boolean;
  message: string;
  data: DonationStats;
}

export interface CreateDonationParams {
  donorName: string;
  donorAvatar?: string;
  donorEmail?: string;
  amount: number;
  currency?: string;
  payMethod: PayMethod;
  cryptoNetwork?: CryptoNetwork;
  cryptoTxHash?: string;
  cryptoFrom?: string;
  cryptoTo?: string;
  message?: string;
  tradeNo?: string;
}

/** 获取捐赠记录列表 */
export function getDonations(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
  payMethod?: string;
}) {
  return request.get<any, DonationListResponse>('/donation', { params })
}

/** 获取赞助统计看板 */
export function getDonationStats() {
  return request.get<any, DonationStatsResponse>('/donation/stats')
}

/** 提交自助捐赠登记 */
export function submitDonation(data: CreateDonationParams) {
  return request.post<any, { success: boolean; message: string; data: DonationRecord }>('/donation', data)
}
