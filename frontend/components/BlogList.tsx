'use client';

import { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, X } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
}

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/public/blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags))).sort();

  const filteredBlogs = blogs.filter((blog) => {
  const excerpt = blog.content ? blog.content.slice(0, 150) : '';
  const matchesSearch =
    searchTerm === '' ||
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    excerpt.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesTags =
    selectedTags.length === 0 || selectedTags.every((tag) => blog.tags?.includes(tag));

  return matchesSearch && matchesTags;
});


  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search blog posts..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
            {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog, index) => (
         <BlogCard
  key={blog.id}
  id={blog.id}
  title={blog.title}
  excerpt={blog.content ? blog.content.slice(0, 150) : ''}
  tags={blog.tags || []}
  publishedAt={new Date(blog.created_at)}
  variant={index === 0 ? 'featured' : 'default'}
/>

        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xl font-medium">No blog posts found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
