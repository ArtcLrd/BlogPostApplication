import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  tags?: string[];
  variant?: 'default' | 'featured';
}

export function BlogCard({
  id,
  title,
  excerpt,
  publishedAt,
  tags = [],
  variant = 'default',
}: BlogCardProps) {
  const isFeatured = variant === 'featured';
  
  return (
    <Link href={`/posts/${id}`}>
      <article
        className={cn(
          "group relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md",
          isFeatured ? "md:p-6" : ""
        )}
      >
        <div className="space-y-2">
          <h3
            className={cn(
              "line-clamp-2 font-semibold tracking-tight transition-colors group-hover:text-primary",
              isFeatured ? "text-xl md:text-2xl" : "text-lg"
            )}
          >
            {title}
          </h3>
          <p className="line-clamp-3 text-muted-foreground">
            {excerpt}
          </p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="px-2 py-0 text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="px-2 py-0 text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-end text-sm text-muted-foreground">
          <time dateTime={publishedAt.toISOString()}>
            {formatDistanceToNow(publishedAt, { addSuffix: true })}
          </time>
        </div>
      </article>
    </Link>
  );
}
