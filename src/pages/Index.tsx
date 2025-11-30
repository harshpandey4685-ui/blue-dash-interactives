import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";

const Index = () => {
  const posts = [
    {
      title: "The Art of Clean Code",
      excerpt: "Writing clean, maintainable code is an essential skill for every developer. Clean code has evolved significantly over the years. Today, we have powerful tools and methodologies to help us write better code.",
      tags: ["Programming", "Best Practices"],
      likes: 189,
      comments: 32,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    },
    {
      title: "Design Systems 101",
      excerpt: "A design system is a collection of reusable components, guided by clear standards, that helps teams build consistent user interfaces.",
      tags: ["Design", "UI/UX"],
      likes: 256,
      comments: 45,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    },
    {
      title: "Modern Web Development",
      excerpt: "Exploring the latest trends and technologies in web development, from React to serverless architectures and beyond.",
      tags: ["Web Dev", "Technology"],
      likes: 342,
      comments: 67,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-up">
            BlogNest
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Latest Posts
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogCard {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
