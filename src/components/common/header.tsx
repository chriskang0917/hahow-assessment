import { Typography } from "@/components/ui";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b-2 bg-white px-4 py-2 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <Typography variant="h4">Hahow Heroes</Typography>
      </div>
    </header>
  );
};

export default Header;
