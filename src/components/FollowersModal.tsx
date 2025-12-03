import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { UserPlus, UserMinus } from "lucide-react";

interface Profile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
}

const FollowersModal = ({ isOpen, onClose, userId, type }: FollowersModalProps) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, userId, type]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get follower/following relationships
      let userIds: string[] = [];
      
      if (type === "followers") {
        const { data } = await supabase
          .from("follows")
          .select("follower_id")
          .eq("following_id", userId);
        userIds = data?.map(f => f.follower_id) || [];
      } else {
        const { data } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", userId);
        userIds = data?.map(f => f.following_id) || [];
      }

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);
        setProfiles(profilesData || []);
      } else {
        setProfiles([]);
      }

      // Get current user's following list
      if (user) {
        const { data: following } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        setFollowingIds(following?.map(f => f.following_id) || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to follow users",
      });
      return;
    }

    const isFollowing = followingIds.includes(targetUserId);

    if (isFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to unfollow user",
          variant: "destructive",
        });
        return;
      }

      setFollowingIds(followingIds.filter(id => id !== targetUserId));
      toast({
        title: "Unfollowed",
        description: "You unfollowed this user",
      });
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: targetUserId });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to follow user",
          variant: "destructive",
        });
        return;
      }

      setFollowingIds([...followingIds, targetUserId]);
      toast({
        title: "Following!",
        description: "You are now following this user",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{type}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">Loading...</p>
          ) : profiles.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No {type} yet
            </p>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.user_id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {profile.full_name || "Anonymous"}
                  </span>
                </div>
                {user && user.id !== profile.user_id && (
                  <Button
                    variant={followingIds.includes(profile.user_id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollow(profile.user_id)}
                    className="transition-all hover:scale-105"
                  >
                    {followingIds.includes(profile.user_id) ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;
