import { BiTrophy } from "react-icons/bi";
import { TbTargetArrow } from "react-icons/tb";
import { formatCompact } from "../../utils/formatCompact";
import { formatCurrencyRounded } from "../../utils/formatCurrency";

function GoalsMetrics({ goal }) {
  const target = goal?.target || 0;

  const achieved = goal?.achieved || 0;

  const metrics = [
    {
      title: "Target Achieved",
      amount: formatCurrencyRounded(achieved),
      icon: BiTrophy,
    },
    {
      title: "Month Target",
      amount: formatCurrencyRounded(target),
      icon: TbTargetArrow,
    },
  ];

  const progress = target === 0 ? 0 : Math.min(achieved / target, 1);
  const offset = 1 - progress;

  const needleAngle = progress * 180;

  const width = 144;
  const height = 72;
  const strokeWidth = 12;
  const rx = (width - strokeWidth) / 2;
  const ry = height - strokeWidth;
  const centerX = width / 2;
  const centerY = height - strokeWidth / 2;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-8 flex-1">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.title} className="flex gap-2">
              <Icon className="w-6 h-6 text-search" />

              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-xs text-card">{metric.title}</p>
                <p className="font-bold text-black">${metric.amount}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="relative">
          <svg viewBox="0 0 144 72" className="w-full">
            <path
              d={`M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 0 1 ${centerX + rx} ${centerY}`}
              fill="none"
              stroke="#E8E8E8"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d={`M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 0 1 ${centerX + rx} ${centerY}`}
              fill="none"
              stroke="#299D91"
              strokeWidth={strokeWidth}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={offset}
              strokeLinecap="round"
            />

            <g
              transform={`translate(${centerX}, ${centerY}) rotate(${needleAngle}) translate(-43, -6)`}
            >
              <path
                d="M37.0969 3.23648C37.3732 2.70407 37.7343 2.20411 38.181 1.75736C40.5241 -0.585785 44.3231 -0.585785 46.6663 1.75736C49.0094 4.10051 49.0094 7.8995 46.6663 10.2426C44.3231 12.5857 40.5241 12.5858 38.181 10.2426C37.597 9.65861 37.1584 8.9841 36.8655 8.26426L-6.21605e-06 6.00138L37.0969 3.23648Z"
                fill="#299D91"
              />
            </g>
          </svg>
        </div>

        <div className="flex items-center justify-between w-full">
          <p className="font-medium text-xs text-previous">$0</p>

          <p className="font-semibold text-black ml-2">
            ${formatCompact(achieved)}
          </p>

          <p className="font-medium text-xs text-previous">
            ${formatCompact(target)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoalsMetrics;
