import { createLink, type LinkComponent } from "@tanstack/react-router";
import * as React from "react";
import { cn } from "@/lib/utils";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>((props, ref) => {
  return (
    <a
      ref={ref}
      {...props}
      className={cn(
        "text-link hover:text-link-hover active:text-link-active flex items-center gap-1 underline-offset-4 transition-all duration-200 hover:underline",
        props.className,
      )}
    />
  );
});

const CreatedLinkComponent = createLink(BasicLinkComponent);

const Link: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};

export { Link };
