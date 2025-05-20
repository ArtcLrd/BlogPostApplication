
import { BlogList } from '@/components/BlogList';

export default function Home() {
  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12 mx-auto">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Create Your Blog
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Share your thoughts with the world.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-4 md:p-6 shadow-sm">
        <BlogList />
      </div>
    </div>
  );
}