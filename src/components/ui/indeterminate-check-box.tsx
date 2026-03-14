import { type HTMLProps, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return <input type="checkbox" ref={ref} className={cn("cursor-pointer", className)} {...rest} />;
}

export default IndeterminateCheckbox;
