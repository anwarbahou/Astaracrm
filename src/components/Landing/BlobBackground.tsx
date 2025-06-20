export const BlobBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900 animate-gradient bg-[length:400%_400%] opacity-90"></div>

      {/* Dark green animated blobs */}
      <div className="absolute w-[80vw] h-[80vw] top-[-30%] left-[-30%] bg-green-800 filter blur-3xl opacity-40 animate-blob1 rounded-full"></div>
      <div className="absolute w-[70vw] h-[70vw] top-[20%] left-[10%] bg-emerald-700 filter blur-3xl opacity-40 animate-blob2 rounded-full"></div>
      <div className="absolute w-[75vw] h-[75vw] top-[50%] left-[-20%] bg-lime-800 filter blur-3xl opacity-40 animate-blob3 rounded-full"></div>

      {/* Additional subtle blobs */}
      <div className="absolute w-[60vw] h-[60vw] top-[0%] right-[-25%] bg-green-600 filter blur-3xl opacity-30 animate-blob2 rounded-full"></div>
      <div className="absolute w-[65vw] h-[65vw] bottom-[-20%] right-[0%] bg-emerald-800 filter blur-3xl opacity-30 animate-blob3 rounded-full"></div>

      {/* Slightly vibrant green accents */}
      <div className="absolute w-[50vw] h-[50vw] top-[30%] right-[20%] bg-lime-500 filter blur-2xl opacity-25 animate-blob1 rounded-full"></div>
      <div className="absolute w-[55vw] h-[55vw] top-[60%] left-[30%] bg-green-400 filter blur-2xl opacity-25 animate-blob2 rounded-full"></div>
    </div>
  );
};
