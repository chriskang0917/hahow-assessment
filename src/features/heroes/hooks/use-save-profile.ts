import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { HeroProfile } from "@/types/hero.type";
import { saveHeroProfile } from "@/features/heroes/services/save-profile.app";

export const useSaveProfile = (heroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: HeroProfile) => saveHeroProfile(heroId, profile),
    onSuccess: (data) => {
      queryClient.setQueryData(["heroes", heroId, "profile"], data);
      toast.success("能力值更新成功");
    },
    onError: () => {
      toast.error("儲存失敗，請重試");
    },
  });
};
