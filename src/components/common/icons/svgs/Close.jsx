export const Close = ({ height, width, size, className,colour }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
       width={width ?? size ?? 14}
      height={height ?? size ?? 14}
      className={className}
      color={colour}
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M13 13L7 7M7 7L1 1M7 7L13 1M7 7L1 13"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
