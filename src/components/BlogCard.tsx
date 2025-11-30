import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BlogCardProps {
  title: string;
  excerpt: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
}

const BlogCard = ({ title, excerpt, tags, likes, comments, image }: BlogCardProps) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
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

  return (
    <Card className="overflow-hidden hover-lift shadow-lg transition-all duration-300 animate-fade-in">
      {image && (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`transition-all hover:scale-110 ${isLiked ? "text-red-500" : ""}`}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="transition-all hover:scale-110">
            <MessageCircle className="w-4 h-4 mr-1" />
            {comments}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 transition-all hover:scale-105"
        >
          Read more
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
