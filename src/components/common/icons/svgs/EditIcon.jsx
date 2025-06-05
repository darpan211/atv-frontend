export const EditIcon = ({ height, width, size, className }) => {
  return (
    <svg
      width={width ?? size ?? 25}
      height={height ?? size ?? 25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5263 23.3684H22.7105M19.421 10.2105L14.1579 4.94736M19.421 10.2105L23.3684 6.26314L18.1052 1L14.1579 4.94736M19.421 10.2105L18.1052 11.5263M14.1579 4.94736L5.60525 13.5M2.31579 16.7894L1 18.1052V23.3684H6.26314L14.1579 15.4736"
        stroke="#4D4D4D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
