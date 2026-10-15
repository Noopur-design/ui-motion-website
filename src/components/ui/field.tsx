import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const control = [
  "w-full rounded-none border-0 border-b-[1.5px] border-ink/25 bg-transparent px-0 py-3",
  "text-lg text-ink placeholder:text-ink-faint transition-colors duration-300",
  "hover:border-ink/50 focus:border-cobalt focus:outline-none focus-visible:outline-none",
  "aria-[invalid=true]:border-orange",
].join(" ");

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(control, className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(control, "min-h-36 resize-y leading-relaxed", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control + hint/error, with ids wired for aria-describedby. */
export function Field({ id, label, optional, error, hint, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="label-mono flex items-baseline justify-between text-ink-soft">
        <span>{label}</span>
        {optional && (
          <span className="normal-case tracking-normal text-ink-faint">
            <span className="sr-only">, </span>Optional
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-rust">
          <CircleAlert className="size-4" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
