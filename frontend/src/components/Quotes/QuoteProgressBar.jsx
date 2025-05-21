import React from "react";

const stepColors = [
  "bg-pink-400 border-pink-400 text-white", // Paso 1
  "bg-orange-400 border-orange-400 text-white", // Paso 2
  "bg-yellow-400 border-yellow-400 text-white", // Paso 3
  "bg-teal-400 border-teal-400 text-white", // Paso 4
  "bg-blue-400 border-blue-400 text-white", // Paso 5
  // Agrega más colores si tienes más pasos
];

const barColors = [
  "bg-pink-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-teal-400",
  "bg-blue-400",
];

const labelColors = [
  "text-pink-400",
  "text-orange-400",
  "text-yellow-400",
  "text-teal-400",
  "text-blue-400",
];

export const QuoteProgressBar = ({ steps, currentStep }) => (
  <div className="flex items-center mb-8 font-regular-text">
    {steps.map((step, idx) => (
      <React.Fragment key={step.label}>
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 transition-all duration-300
              ${
                idx <= currentStep
                  ? stepColors[idx % stepColors.length]
                  : "border-gray-300 bg-white text-gray-400"
              }
            `}
          >
            {idx + 1}
          </div>
          <span
            className={`text-xs mt-2 w-24 text-center transition-all duration-300
              ${
                idx <= currentStep
                  ? labelColors[idx % labelColors.length] + " font-bold"
                  : "text-gray-400"
              }
            `}
          >
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div
            className={`flex-1 h-1 mx-2 transition-all duration-300
              ${
                idx < currentStep
                  ? barColors[idx % barColors.length]
                  : "bg-gray-300"
              }
            `}
          ></div>
        )}
      </React.Fragment>
    ))}
  </div>
);
