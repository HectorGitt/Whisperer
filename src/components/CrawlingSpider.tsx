import { useEffect, useState, useMemo } from 'react';
import styles from './CrawlingSpider.module.css';

interface CrawlingSpiderProps {
  onComplete?: () => void;
}

type Edge = 'top' | 'right' | 'bottom' | 'left';

// All available spider images
const SPIDER_IMAGES = [
  '/media/images/transparent-gif-spider.gif',
  '/media/images/spider-3d.gif',
];

export function CrawlingSpider({ onComplete }: CrawlingSpiderProps) {
  const [startEdge] = useState<Edge>(() => {
    const edges: Edge[] = ['top', 'right', 'bottom', 'left'];
    return edges[Math.floor(Math.random() * edges.length)];
  });
  
  const [endEdge] = useState<Edge>(() => {
    const edges: Edge[] = ['top', 'right', 'bottom', 'left'];
    const filtered = edges.filter((e) => e !== startEdge);
    return filtered[Math.floor(Math.random() * filtered.length)];
  });
  
  const [startPosition] = useState(() => Math.random() * 80 + 10); // 10-90%
  const [endPosition] = useState(() => Math.random() * 80 + 10);
  
  const selectedSpider = useMemo(() => {
    return SPIDER_IMAGES[Math.floor(Math.random() * SPIDER_IMAGES.length)];
  }, []);
  
  useEffect(() => {
    // Animation duration is 8 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  const getStartStyle = (): React.CSSProperties => {
    switch (startEdge) {
      case 'top':
        return { top: '-50px', left: `${startPosition}%` };
      case 'right':
        return { right: '-50px', top: `${startPosition}%` };
      case 'bottom':
        return { bottom: '-50px', left: `${startPosition}%` };
      case 'left':
        return { left: '-50px', top: `${startPosition}%` };
    }
  };
  
  const getEndStyle = (): React.CSSProperties => {
    switch (endEdge) {
      case 'top':
        return { top: '-50px', left: `${endPosition}%` };
      case 'right':
        return { right: '-50px', top: `${endPosition}%` };
      case 'bottom':
        return { bottom: '-50px', left: `${endPosition}%` };
      case 'left':
        return { left: '-50px', top: `${endPosition}%` };
    }
  };
  
  return (
    <div
      className={styles.spider}
      style={{
        ...getStartStyle(),
        '--end-top': getEndStyle().top,
        '--end-right': getEndStyle().right,
        '--end-bottom': getEndStyle().bottom,
        '--end-left': getEndStyle().left,
      } as React.CSSProperties}
      data-testid="crawling-spider"
    >
      <img 
        src={selectedSpider} 
        alt="Crawling spider"
        className={styles.spiderImage}
      />
    </div>
  );
}
