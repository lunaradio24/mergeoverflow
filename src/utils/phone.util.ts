export function formatPhoneNumber(phoneNum: string): string {
  if (phoneNum.length === 11) {
    return phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phoneNum; // 이미 형식화된 경우 그대로 반환
}
