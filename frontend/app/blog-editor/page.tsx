'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Blog {
  id?: number;
  title: string;
  content: string;
  tags: string;
}

export default function BlogEditor() {
  const [blog, setBlog] = useState<Blog>(
 { title: '', content: '', tags: '' }
  );
  const [drafts, setDrafts] = useState<Blog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Fetch drafts on load
  useEffect(() => {
    const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to access the blog editor.");
    router.push('/login');
    return;
  }
    const fetchDrafts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/drafts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load drafts');
      }

      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }

      setDrafts(data);
    } catch (error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message);
    console.error('Save error:', error);
  } else {
    toast.error('An unknown error occurred.');
    console.error('Save error:', error);
  }
}
  };
    fetchDrafts();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleDraftSelect = (value: string) => {
    const selected = drafts.find((d) => d.id?.toString() === value);
    if (selected) {
      setBlog({
        id: selected.id,
        title: selected.title,
        content: selected.content,
        tags: selected.tags,
      });
    }
  };

  const saveToServer = async (status: 'draft' | 'published') => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');

      const method = blog.id ? 'PUT' : 'POST';
      const endpoint = blog.id
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blog.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${status === 'published' ? 'publish' : 'save-draft'}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  id: blog.id,
  title: blog.title,
  content: blog.content,
  status,
  tags: (typeof blog.tags === 'string'
    ? blog.tags.split(',')
    : blog.tags
  ).map((tag: string) => tag.trim()).filter(Boolean),
}),

      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save blog');
      }

      if (!blog.id && result[0]?.id) {
        setBlog((prev) => ({ ...prev, id: result[0].id }));
      }

      toast.success(status === 'draft' ? 'Draft saved!' : 'Blog published!');
    } catch (error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message);
    console.error('Save error:', error);
  } else {
    toast.error('An unknown error occurred.');
    console.error('Save error:', error);
  }
}

  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Load Draft</label>
        <Select onValueChange={handleDraftSelect}>
  <SelectTrigger>
    <SelectValue placeholder="Select a draft to edit" />
  </SelectTrigger>
  <SelectContent>
    {drafts.length > 0 ? (
      drafts.map((draft) => (
        <SelectItem key={draft.id} value={draft.id!.toString()}>
          {draft.title || `Untitled (ID: ${draft.id})`}
        </SelectItem>
      ))
    ) : (
      <div className="px-4 py-2 text-sm text-muted-foreground">
        No drafts available
      </div>
    )}
  </SelectContent>
</Select>
      </div>

      <Input
        name="title"
        value={blog.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <Textarea
        name="content"
        value={blog.content}
        onChange={handleChange}
        placeholder="Write your blog content here..."
        className="h-64"
      />
      <Input
        name="tags"
        value={blog.tags}
        onChange={handleChange}
        placeholder="Tags (comma-separated)"
      />

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => saveToServer('draft')}
          disabled={isSaving}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => saveToServer('published')}
          disabled={isSaving}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}
