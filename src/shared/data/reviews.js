// Список фото отзывов (файлы в public/)
export const reviews = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  src: `/review${i + 1}.jpg`,
  alt: `Отзыв клиента ${i + 1}`,
}))
