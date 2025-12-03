import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Edit, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import FollowersModal from "@/components/FollowersModal";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEmail(user.email || "");
    loadProfile();
    loadPostCount();
    loadFollowCounts();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("skills")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && data.skills) {
      setSkills(data.skills);
    }
  };

  const loadPostCount = async () => {
    if (!user) return;

    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("published", true);

    setPostCount(count || 0);
  };

  const loadFollowCounts = async () => {
    if (!user) return;

    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", user.id);

    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", user.id);

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const saveSkills = async (updatedSkills: string[]) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ skills: updatedSkills })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error updating skills",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      saveSkills(updatedSkills);
      setNewSkill("");
      toast({
        title: "Skill added",
        description: `${newSkill} has been added to your profile`,
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill);
    setSkills(updatedSkills);
    saveSkills(updatedSkills);
  };

  const handleCopyProfileUrl = () => {
    navigator.clipboard.writeText("https://blognest.com/profile/user");
    toast({
      title: "Copied!",
      description: "Profile URL copied to clipboard",
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
        <Card className="shadow-lg hover-lift">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Profile & Skills</CardTitle>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="transition-all hover:scale-[1.02]"
            >
              Logout
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Email Address</h3>
              <p className="text-foreground">{email}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Skills</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="transition-all hover:scale-[1.02]"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Skills
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-primary text-primary-foreground cursor-pointer transition-all hover:scale-105"
                    onClick={() => isEditingSkills && handleRemoveSkill(skill)}
                  >
                    {skill}
                    {isEditingSkills && " ×"}
                  </Badge>
                ))}
              </div>

              {isEditingSkills && (
                <div className="flex gap-2 animate-fade-in">
                  <Input
                    placeholder="Add a new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    className="transition-all focus:scale-[1.01]"
                  />
                  <Button onClick={handleAddSkill} className="transition-all hover:scale-[1.02]">
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover-lift">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Email</h3>
              <p className="text-foreground">{email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Skills</h3>
              <ul className="list-disc list-inside space-y-1">
                {skills.map((skill) => (
                  <li key={skill} className="text-foreground">{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Public Profile URL</h3>
              <div className="flex gap-2">
                <Input
                  value="https://blognest.com/profile/user"
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyProfileUrl}
                  className="transition-all hover:scale-[1.02]"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="text-center p-4 bg-primary/10 rounded-lg transition-all hover:scale-105 cursor-pointer"
                  onClick={() => navigate("/create")}
                >
                  <p className="text-2xl font-bold text-primary">{postCount}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div 
                  className="text-center p-4 bg-primary/10 rounded-lg transition-all hover:scale-105 cursor-pointer"
                  onClick={() => setShowFollowersModal(true)}
                >
                  <p className="text-2xl font-bold text-primary">{followersCount}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div 
                  className="text-center p-4 bg-primary/10 rounded-lg transition-all hover:scale-105 cursor-pointer"
                  onClick={() => setShowFollowingModal(true)}
                >
                  <p className="text-2xl font-bold text-primary">{followingCount}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {user && (
        <>
          <FollowersModal
            isOpen={showFollowersModal}
            onClose={() => setShowFollowersModal(false)}
            userId={user.id}
            type="followers"
          />
          <FollowersModal
            isOpen={showFollowingModal}
            onClose={() => setShowFollowingModal(false)}
            userId={user.id}
            type="following"
          />
        </>
      )}
    </div>
  );
};

export default Profile;
