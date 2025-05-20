'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/auth-provider'; // update path accordingly

const EditBlogPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      if (!user) {
        alert('Please login first');
        router.push('/login');
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const blog = await res.json();

        // Check if blog belongs to logged-in user
        if (blog.user_id !== user.user_id) {
          alert('You are not authorized to edit this blog.');
          router.push('/posts');
          return;
        }

        setTitle(blog.title || '');
        setContent(blog.content || '');
        setTags(blog.tags || '');
      } else {
        alert('Failed to load blog');
        router.push('/posts');
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id, user, router]);

  const handleUpdate = async (status: 'draft' | 'published') => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
        tags,
        status,
      }),
    });

    if (res.ok) {
      router.push('/posts');
    } else {
      alert('Failed to update blog');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>

      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        className="w-full p-2 border rounded mb-4 h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded mb-4"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={() => handleUpdate('draft')}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Save as Draft
        </button>

        <button
          onClick={() => handleUpdate('published')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default EditBlogPage;
