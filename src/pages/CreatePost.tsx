import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handlePublish = () => {
    if (title && content) {
      toast({
        title: "Post published!",
        description: "Your story has been shared with the world",
      });
      navigate("/");
    } else {
      toast({
        title: "Missing fields",
        description: "Please fill in title and content",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-primary/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Post</CardTitle>
            <p className="text-muted-foreground">Share your story with the world</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg transition-all focus:scale-[1.01]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., Web Development, React, JavaScript)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="transition-all focus:scale-[1.01]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                placeholder="Paste image URL..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="transition-all focus:scale-[1.01]"
              />
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="mt-2 rounded-lg w-full h-48 object-cover animate-fade-in"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] transition-all focus:scale-[1.01]"
              />
              <p className="text-xs text-muted-foreground">
                Write your content in plain text. It will be formatted automatically.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePublish}
                className="flex-1 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                Publish Post
              </Button>
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="flex-1 hover:bg-secondary/10 transition-all hover:scale-[1.02]"
              >
                Save Draft
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="hover:bg-destructive/10 transition-all hover:scale-[1.02]"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
