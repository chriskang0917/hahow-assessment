import { cva } from "class-variance-authority";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const searchBarVariants = cva(
  "relative flex items-center w-full rounded-md border border-input bg-background text-sm ring-offset-background transition-all focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1",
  {
    variants: {
      size: {
        sm: "h-8 px-2",
        md: "h-9 px-3",
        lg: "h-10 px-4",
      },
      variant: {
        default: "border-gray-200 bg-white",
        outlined: "border-gray-300 bg-transparent",
        filled: "border-transparent bg-gray-100",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

const inputVariants = cva(
  "flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SearchBarProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "filled";
  showClearButton?: boolean;
  disabled?: boolean;
}

const SearchBar = ({
  placeholder = "搜尋...",
  value = "",
  onChange,
  onSearch,
  onClear,
  size = "md",
  variant = "default",
  showClearButton = true,
  disabled = false,
  className = "",
  ...props
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState<string>(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    onChange?.("");
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn(searchBarVariants({ size, variant }), className)} {...props}>
      <Search
        className={cn(iconVariants({ size }), "mr-2 flex-shrink-0 cursor-pointer")}
        onClick={handleSearch}
      />

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={inputVariants({ size })}
      />

      {showClearButton && (
        <X
          className={cn(
            iconVariants({ size }),
            "ml-2 flex-shrink-0 transition-all duration-200",
            inputValue
              ? "hover:text-foreground cursor-pointer opacity-100"
              : "pointer-events-none cursor-default opacity-0",
          )}
          onClick={inputValue ? handleClear : undefined}
        />
      )}
    </div>
  );
};

export { SearchBar };
