export {};

declare global {
  interface Window {
    StringeeVideo: any;
    StringeeClient: any; // Thay 'any' bằng kiểu chính xác nếu có
  }
}
