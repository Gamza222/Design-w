import { cn } from '../../lib/cn/cn';
import styles from './YandexMap.module.scss';

interface YandexMapProps {
  address: string;
  title: string;
  point?: { longitude: number; latitude: number };
  className?: string;
}

/** Lazy Yandex Maps embed pinned to the verified building coordinates. */
export function YandexMap({ address, point, title, className }: YandexMapProps) {
  const coordinates = point ? `${point.longitude},${point.latitude}` : null;
  const source = coordinates
    ? `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(coordinates)}&mode=whatshere&whatshere%5Bpoint%5D=${encodeURIComponent(coordinates)}&whatshere%5Bzoom%5D=17&z=17`
    : `https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(address)}&z=16`;

  return (
    <div className={cn(styles.map, className)}>
      <iframe
        src={source}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
