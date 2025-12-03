import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  cover_image: string | null;
  created_at: string;
  likes: number;
  comments: number;
  user_id: string;
}

interface Author {
  full_name: string | null;
  avatar_url: string | null;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Post not found",
          description: "The post you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setPost(data);
      setLikeCount(data.likes);

      // Fetch author info
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", data.user_id)
        .maybeSingle();

      setAuthor(profileData);
    } catch (error: any) {
      toast({
        title: "Error loading post",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to like posts",
      });
      navigate("/login");
      return;
    }

    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
      toast({
        title: "Post liked!",
        description: "You liked this post",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Post link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to posts
        </Button>

        <Card className="shadow-lg overflow-hidden">
          {post.cover_image && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span>By {author?.full_name || "Anonymous"}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <div className="prose prose-lg max-w-none text-foreground mb-8">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`transition-all hover:scale-110 ${isLiked ? "text-red-500" : ""}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {likeCount}
              </Button>
              <Button variant="ghost" size="sm" className="transition-all hover:scale-110">
                <MessageCircle className="w-5 h-5 mr-2" />
                {post.comments}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="transition-all hover:scale-110"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;
