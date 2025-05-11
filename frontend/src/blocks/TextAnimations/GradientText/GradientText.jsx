import "./GradientText.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#4eedd5", "#ffb96e", "#fca4d3", "#ffb96e", "#4eedd5"],
  animationSpeed = 8,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "200% 100%",
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className="animated-gradient-text">
      <div className={`text-content ${className}`} style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
