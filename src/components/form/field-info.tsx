import type { AnyFieldApi } from "@tanstack/react-form";
import { Typography } from "@/components/ui";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const showError = field.state.meta.isTouched && !field.state.meta.isValid;

  const errorMessageInfo = field.state.meta.errors[0];

  return (
    <>
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-out ${
          showError ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className={`overflow-hidden transition-opacity delay-200 duration-200 ease-in-out ${
            showError ? "opacity-100" : "opacity-0"
          }`}
        >
          <Typography variant="small" className="text-destructive pt-1 pl-1">
            {errorMessageInfo &&
              JSON.parse(errorMessageInfo)
                .map((err: { message: string }) => err.message)
                .join(", ")}
          </Typography>
        </div>
      </div>
      {field.state.meta.isValidating ? "驗證中..." : null}
    </>
  );
}

export { FieldInfo };
