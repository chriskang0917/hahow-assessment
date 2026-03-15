import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { HeroProfile } from "@/types/hero.type";
import { saveHeroProfile } from "@/features/heroes/services/save-profile.app";

export const useSaveProfile = (heroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: HeroProfile) => saveHeroProfile(heroId, profile),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(["heroes", heroId, "profile"], variables);
      toast.success("能力值更新成功");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("找不到該英雄，請再選擇其他英雄嘗試");
            return;
          case 400:
            toast.error("輸入的值不正確，請確認後再次送出");
            return;
        }
      }
      toast.error("儲存失敗，請重試");
    },
  });
};
