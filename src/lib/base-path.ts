// public/ altındaki dosyalara verilen sabit yollar basePath'i otomatik almaz;
// alt yolda barındırılan statik dışa aktarımlarda (GitHub Pages) bu sarmalayıcı
// kullanılır. Normal derlemede NEXT_PUBLIC_BASE_PATH boş olduğundan etkisizdir.
export const withBasePath = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
