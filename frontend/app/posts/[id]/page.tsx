'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Blog {
  id: number;
  title: string;
  content: string;
  tags: string[];
  user_id: string;
  author_name?: string;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID from Supabase JWT (stored in localStorage or cookie)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.sub); // 'sub' is the user's UUID
    }
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/public/blogs/${id}`);
        if (!res.ok) return setError(true);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(true);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this blog?');
    if (!confirmed) return;

    const res = await fetch(`/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.ok) {
      router.push('/posts');
    } else {
      alert('Failed to delete the post.');
    }
  };

  if (error) notFound();
  if (!blog) return <div className="text-center mt-10">Loading blog post...</div>;

  const isAuthor = blog.user_id === userId;

  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12 mx-auto">
      <Link
        href="/posts"
        className="inline-flex items-center mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <header className="mb-8 not-prose text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {(blog.tags || []).map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div>By {blog.author_name || 'Unknown'}</div>
            <time dateTime={blog.created_at}>
              Published {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
            </time>
          </div>
        </header>

        <div className="mt-8">
          {(blog.content || '').split('\n').map((paragraph: string, index: number) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-center">
                  {paragraph.substring(2)}
                </h1>
              );
            } else if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-center">
                  {paragraph.substring(3)}
                </h2>
              );
            } else if (paragraph.startsWith('```')) {
              return (
                <pre key={index} className="bg-muted p-4 rounded-md overflow-x-auto my-4">
                  <code>{paragraph.replace(/```/g, '')}</code>
                </pre>
              );
            } else if (paragraph.trim() !== '') {
              return (
                <p key={index} className="my-4 text-center">
                  {paragraph}
                </p>
              );
            }
            return null;
          })}
        </div>
      </article>

      {/* Buttons below content */}
      {isAuthor && (
        <div className="flex justify-center gap-4 mt-8">
          <Link
            href={`/posts/${id}/edit`}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <Trash className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
