import { useRouter } from "@tanstack/react-router";
import { CircleUser, LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Typography,
} from "@/components/ui";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onProfile?: () => void;
}

const Header = ({ userName = "Chris", userEmail = "chris@gmail.com" }: HeaderProps) => {
  const logout = useAuthStore.use.logout();
  const route = useRouter();

  const onLogout = () => {
    logout();
    route.invalidate();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b-2 bg-white px-4 py-2 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <div className="hidden min-w-0 flex-1 flex-col sm:flex">
          <h1 className="w-14"></h1>
          <p className="text-muted-foreground truncate text-xs leading-tight">react-template</p>
        </div>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="relative h-10 w-10 rounded-full p-0" />}
          >
            <Avatar className="h-full w-full">
              <AvatarFallback className="bg-muted">
                <CircleUser className="size-full h-6 w-6 opacity-80" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Typography variant="h4">{userName}</Typography>
                  <Badge variant="secondary">系統管理員</Badge>
                </div>
                <div>
                  <Typography variant="text">信箱 {userEmail}</Typography>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>登出</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
