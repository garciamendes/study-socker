import { cn } from "@/lib/utils";
import React from "react";
import type { InputHTMLAttributes } from "react";
import { Label } from "./Label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  classNameWrapper?: string
  error?: string
  label?: string
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "Example",
  className = "",
  classNameWrapper = '',
  label = '',
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5', classNameWrapper)}>
      {label && (<Label htmlFor={props.id}>{label}</Label>)}

      <input
        type={type}
        placeholder={placeholder}
        className={cn(
          'px-4 py-2 w-full rounded border-2 shadow-md transition focus:outline-hidden focus:shadow-xs',
          props.error ? "border-destructive text-destructive shadow-xs shadow-destructive" : "",
          className
        )}
        {...props}
      />

      {props.error && (<p className="text-sm text-red-500">{props.error}</p>)}
    </div>
  );
};
