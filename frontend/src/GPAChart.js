import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import Loader from "./Loader";

Chart.register(annotationPlugin);

const COLORS = ["rgb(140, 214, 16)", "rgb(239, 198, 0)", "rgb(231, 24, 49)"];
const MAX_GPA = 4;

const GPAChart = ({ cumulativeGPA }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const getGPAIndex = (gpa) => {
    return gpa >= 3.5 ? 0 : gpa >= 2.5 ? 1 : 2; 
  };

  useEffect(() => {
    // Reset loading state when GPA changes
    setLoading(true);
    const ctx = chartRef.current.getContext("2d");

    const annotation = {
      type: "doughnutLabel",
      content: ({ chart }) => [
        `${(chart.data.datasets[0].data[0] / 25).toFixed(2)}`,
      ],
      drawTime: "beforeDraw",
      position: {
        y: "-50%",
      },
      font: [
        { size: 150, weight: "bold" },
      ],
      color: ({ chart }) => [
        COLORS[getGPAIndex(cumulativeGPA)],
        "white",
      ],
    };

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [
              (cumulativeGPA / MAX_GPA) * 100, 
              100 - (cumulativeGPA / MAX_GPA) * 100, 
            ],
            backgroundColor: [
              COLORS[getGPAIndex(cumulativeGPA)],
              "rgb(234, 234, 234)",
            ],
          },
        ],
      },
      options: {
        aspectRatio: 2,
        circumference: 180,
        rotation: -90,
        animation: {
          onComplete: () => {
            setLoading(false);
          },
        },
        plugins: {
          annotation: {
            annotations: {
              annotation,
            },
          },
          tooltip: {
            callbacks: {
              label: () => { 
                const value = (cumulativeGPA / MAX_GPA) * 100;
                if (value >= 85) return "Excellent job! Keep it up!";
                else if (value >= 70) return "Good work, but aim higher!";
                else return "Try harder!";
              },
            },
            title: () => "Your GPA Perfomance",
            backgroundColor: "#f39c12",
            titleFont: { size: 16, weight: "bold" },
            bodyFont: { size: 14 },
            displayColors: false,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [cumulativeGPA]);

  return (
    <div className="gpa-chart">
      <div className="chart-container" style={{ position: "relative" }}>
        <h3>Cumulative GPA</h3>
        <canvas ref={chartRef}></canvas>
        {loading && (
          <div
            className="chart-loader"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default GPAChart;
