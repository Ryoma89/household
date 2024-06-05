export const currencies: string[] = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "HKD", "INR"]; // 使用する通貨のリスト

// 通貨シンボルを取得する関数
export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'JPY':
      return '¥';
    case 'GBP':
      return '£';
    case 'AUD':
      return 'A$';
    case 'CAD':
      return 'C$';
    case 'CHF':
      return 'CHF';
    case 'CNY':
      return '¥';
    case 'HKD':
      return 'HK$';
    case 'INR':
      return '₹';
    default:
      return currency;
  }
};