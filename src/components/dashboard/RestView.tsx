import { useNow } from "../../hooks/useNow";
import { formatDate, formatTime } from "../../utils/date";
import type { ContentResources } from "../../types/content";

export function RestView({ data }: { data: ContentResources }) {
  const now = useNow();
  const image = data.images[0];

  return (
    <div className="rest-view">
      {image && <img src={image.url} alt="" />}
      <div className="rest-copy">
        <p className="eyebrow">Dashboard pausiert</p>
        <time>{formatTime(now)}</time>
        <p>{formatDate(now)}</p>
      </div>
    </div>
  );
}
