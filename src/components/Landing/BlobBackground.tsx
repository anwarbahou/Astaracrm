import AuraBackground from "./Assets/Auta-1.jpg";

export const BlobBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url(${AuraBackground})`,
        }}
      />
      
      {/* Black Gradient Overlay - 100% to 40% opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/40" />
    </div>
  );
};
