import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FF6A00",
          borderRadius: 7,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: "75%", height: "75%" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 28 86 L 18 66 L 15 46 L 27 28 L 47 18 L 68 10 L 85 4"
            stroke="#FAFAFA"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 28 86 L 48 72 L 66 52 L 74 26 L 85 4"
            stroke="#FAFAFA"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 68 4 L 88 2 L 86 22"
            stroke="#FAFAFA"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="86" r="6" fill="#FAFAFA" />
          <circle cx="18" cy="66" r="6" fill="#FAFAFA" />
          <circle cx="15" cy="46" r="6" fill="#FAFAFA" />
          <circle cx="27" cy="28" r="6" fill="#FAFAFA" />
          <circle cx="47" cy="18" r="6" fill="#FAFAFA" />
          <circle cx="68" cy="10" r="6" fill="#FAFAFA" />
          <circle cx="74" cy="26" r="6" fill="#FAFAFA" />
          <circle cx="66" cy="52" r="6" fill="#FAFAFA" />
          <circle cx="48" cy="72" r="6" fill="#FAFAFA" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
