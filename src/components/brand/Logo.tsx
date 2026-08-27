"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "icon" | "horizontal" | "stacked" | "app-icon";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  theme?: "light" | "dark" | "auto";
  showTagline?: boolean;
  href?: string;
}

export function BuildTamilNaduSymbol({
  className = "w-7 h-7",
  color = "#FF6A00",
  strokeWidth = 3.5,
  style,
}: {
  className?: string;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Build Tamil Nadu Path Icon"
    >
      {/* Connecting Network Path (Tamil Nadu Boundary Outline) */}
      <path
        d="M 28 86 L 18 66 L 15 46 L 27 28 L 47 18 L 68 10 L 85 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 28 86 L 48 72 L 66 52 L 74 26 L 85 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrowhead at Top Right */}
      <path
        d="M 68 4 L 88 2 L 86 22"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Node Circles on the Path Vertices */}
      {/* South (Kanyakumari) */}
      <circle cx="28" cy="86" r="4.8" fill={color} />
      {/* South-West */}
      <circle cx="18" cy="66" r="4.8" fill={color} />
      {/* Mid-West (Kongu/Western Ghats) */}
      <circle cx="15" cy="46" r="4.8" fill={color} />
      {/* North-West */}
      <circle cx="27" cy="28" r="4.8" fill={color} />
      {/* North Slope */}
      <circle cx="47" cy="18" r="4.8" fill={color} />
      {/* North / Near Chennai */}
      <circle cx="68" cy="10" r="4.8" fill={color} />

      {/* East Coast / Delta */}
      <circle cx="74" cy="26" r="4.8" fill={color} />
      <circle cx="66" cy="52" r="4.8" fill={color} />
      {/* South-East Coast */}
      <circle cx="48" cy="72" r="4.8" fill={color} />
    </svg>
  );
}

export function AppIconBadge({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-[#FF6A00] flex items-center justify-center shadow-md shadow-[#FF6A00]/25 transition-transform group-hover:scale-105 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size * 0.72, height: size * 0.72 }}
      >
        {/* White Network Path */}
        <path
          d="M 28 86 L 18 66 L 15 46 L 27 28 L 47 18 L 68 10 L 85 4"
          stroke="#FAFAFA"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 28 86 L 48 72 L 66 52 L 74 26 L 85 4"
          stroke="#FAFAFA"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrowhead */}
        <path
          d="M 68 4 L 88 2 L 86 22"
          stroke="#FAFAFA"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* White Node Circles */}
        <circle cx="28" cy="86" r="5" fill="#FAFAFA" />
        <circle cx="18" cy="66" r="5" fill="#FAFAFA" />
        <circle cx="15" cy="46" r="5" fill="#FAFAFA" />
        <circle cx="27" cy="28" r="5" fill="#FAFAFA" />
        <circle cx="47" cy="18" r="5" fill="#FAFAFA" />
        <circle cx="68" cy="10" r="5" fill="#FAFAFA" />
        <circle cx="74" cy="26" r="5" fill="#FAFAFA" />
        <circle cx="66" cy="52" r="5" fill="#FAFAFA" />
        <circle cx="48" cy="72" r="5" fill="#FAFAFA" />
      </svg>
    </div>
  );
}

export default function Logo({
  variant = "horizontal",
  size = "md",
  className = "",
  theme = "auto",
  showTagline = false,
  href,
}: LogoProps) {
  const iconSizes = {
    sm: 26,
    md: 36,
    lg: 46,
    xl: 60,
  };

  const textSizes = {
    sm: "text-[13px]",
    md: "text-[15.5px]",
    lg: "text-[19px]",
    xl: "text-[26px]",
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {variant === "app-icon" ? (
        <AppIconBadge size={iconSizes[size]} />
      ) : (
        <div className="flex-shrink-0">
          <BuildTamilNaduSymbol
            className=""
            style={{ width: iconSizes[size], height: iconSizes[size] }}
            color="#FF6A00"
          />
        </div>
      )}

      {variant !== "icon" && (
        <div className="flex flex-col">
          <div
            className={`font-jakarta font-black tracking-tight leading-tight flex items-center gap-1.5 ${textSizes[size]}`}
          >
            <span
              className={
                theme === "dark"
                  ? "text-white"
                  : theme === "light"
                  ? "text-[#0D182A]"
                  : "text-[#0D182A]"
              }
            >
              BUILD
            </span>
            <span className="text-[#FF6A00]">TAMIL NADU</span>
          </div>

          {showTagline && (
            <span className="text-[11px] text-[#64748b] font-medium tracking-tight mt-0.5">
              What should we build for Tamil Nadu?
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
