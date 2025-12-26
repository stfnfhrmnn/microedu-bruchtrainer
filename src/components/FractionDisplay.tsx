import React from "react";

type FractionDisplayProps = {
  numerator: string;
  denominator: string;
  className?: string;
};

const FractionDisplay: React.FC<FractionDisplayProps> = ({
  numerator,
  denominator,
  className,
}) => {
  return (
    <span className={className ? `fraction ${className}` : "fraction"}>
      <span className="numerator">{numerator}</span>
      <span className="denominator">{denominator}</span>
    </span>
  );
};

export default FractionDisplay;
