'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient'; // ← your configured Supabase client

interface BlogData {
  id?: string;
  title: string;
  content: string;
  tags: string; // comma-separated
}

const STORAGE_KEY = 'blog-draft';
const AUTO_SAVE_DELAY = 2000;

export function BlogEditor() {
  const [blog, setBlog] = useState<BlogData>({
    title: '',
    content: '',
    tags: '',
  });

  const [isEdited, setIsEdited] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        toast.error('You must be logged in to write a blog.');
      } else {
        setUserId(data.user.id);
      }
    };
    checkAuth();

    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        setBlog(JSON.parse(savedDraft));
      } catch (err) {
        console.error('Error loading local draft:', err);
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  };

  const localSaveDraft = useCallback(() => {
    if (!isEdited) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blog));
      setLastSaved(new Date());
      setIsEdited(false);

      toast.success('Draft saved locally');
    } catch (err) {
      console.error('Local save failed', err);
      toast.error('Could not save draft locally.');
    }
  }, [blog, isEdited]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEdited) localSaveDraft();
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [blog, isEdited, localSaveDraft]);

  const saveToSupabase = async (status: 'draft' | 'published') => {
    if (!userId) {
      toast.error('You must be logged in to save your blog.');
      return;
    }

    const tagsArray = blog.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      title: blog.title,
      content: blog.content,
      tags: tagsArray,
      status,
      user_id: userId,
    };

    try {
      let result;
      if (blog.id) {
        result = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', blog.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('blogs')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) {
        console.error(result.error);
        toast.error('Failed to save blog');
        return;
      }

      if (!blog.id && result.data?.id) {
        setBlog((prev) => ({ ...prev, id: result.data.id }));
      }

      toast.success(
        status === 'draft' ? 'Draft saved to Supabase' : 'Blog published!'
      );
    } catch (error) {
      console.error(error);
      toast.error('Supabase error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          Blog Title
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter a captivating title..."
          value={blog.title}
          onChange={handleInputChange}
          className="text-lg font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-base">
          Content
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your blog content here..."
          value={blog.content}
          onChange={handleInputChange}
          className="min-h-[300px] resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-base">
          Tags (comma-separated)
        </Label>
        <Input
          id="tags"
          name="tags"
          placeholder="tech, programming, nextjs"
          value={blog.tags}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {lastSaved ? (
            <span>Last saved locally: {lastSaved.toLocaleTimeString()}</span>
          ) : (
            <span>Not saved locally</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => saveToSupabase('draft')}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => saveToSupabase('published')}>
            <Sparkles className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
