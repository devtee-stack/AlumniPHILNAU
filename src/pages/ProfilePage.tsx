import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/components/Profile";
import { Profile as ProfileType } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as ProfileType;
    },
    enabled: !!userId,
  });

  const isOwnProfile = user?.id === userId;

  return (
    <div className="min-h-screen bg-background">
      <Profile
        profile={profile || null}
        isLoading={isLoading}
        onUpdate={() => {}} // This will be handled by the Profile component
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default ProfilePage;
