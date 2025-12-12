import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/components/Profile";
import { Profile as ProfileType } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  // THIS IS THE ONLY LINE YOU ADD/CHANGE
  const targetId = userId || user?.id;

  if (!targetId) {
    return <div className="p-8 text-center">Please log in to view profile</div>;
  }

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<ProfileType>) => {
      if (!user || !targetId) throw new Error('Not authenticated or no user ID');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', targetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', targetId] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', targetId],
    queryFn: async () => {
      if (!targetId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (error) throw error;
      return data as ProfileType;
    },
    enabled: !!targetId,
  });

  const isOwnProfile = user?.id === targetId;

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
