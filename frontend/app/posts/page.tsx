import { BlogList } from '@/components/BlogList';

export default function BlogPosts() {
  return (
    <div className="container max-w-6xl px-4 py-8 md:py-12 mx-auto">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Blog Posts
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Discover interesting articles and stories from our writers.
        </p>
      </div>
      <BlogList />
    </div>
  );
}