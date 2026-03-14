import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { HeroProfileDto } from "@/features/heroes/services/hero-profile.dto";
import { patchHeroProfileApi } from "@/features/heroes/services/save-profile.api";

export const useSaveProfile = (heroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: HeroProfileDto) => patchHeroProfileApi(heroId, profile),
    onSuccess: (data) => {
      queryClient.setQueryData(["heroes", heroId, "profile"], data);
      toast.success("能力值更新成功");
    },
    onError: () => {
      toast.error("儲存失敗，請重試");
    },
  });
};
