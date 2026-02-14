const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  size = "20rem", // customizable size
  opacity = 0.25, // customizable intensity
}) => {
  return (
    <div
      className="pointer-events-none absolute -z-50 rounded-full blur-3xl float-glow"
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(0,229,195,${opacity}) 0%, rgba(0,229,195,0.05) 40%, transparent 70%)`,
      }}
    />
  );
};

export default BlurCircle;
