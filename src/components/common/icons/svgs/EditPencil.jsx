export const EditPencil = ({ height, width, size, className }) => {
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
     width={width ?? size ?? '25'}
      height={height ?? size ?? '25'}
    viewBox="0 0 25 25" 
    fill="none">
      <path
        d="M12.0263 23.3684H23.2105M19.921 10.2105L14.6579 4.94736M19.921 10.2105L23.8684 6.26314L18.6052 1L14.6579 4.94736M19.921 10.2105L18.6052 11.5263M14.6579 4.94736L6.10525 13.5M2.81579 16.7894L1.5 18.1052V23.3684H6.76314L14.6579 15.4736"
        stroke="#4D4D4D"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
