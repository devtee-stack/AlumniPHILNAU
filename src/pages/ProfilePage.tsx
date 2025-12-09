import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/components/Profile";
import { Profile as ProfileType } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<ProfileType>) => {
      if (!user || !userId) throw new Error('Not authenticated or no user ID');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

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
        onUpdate={updateProfile.mutate} // Handle profile updates
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default ProfilePage;
