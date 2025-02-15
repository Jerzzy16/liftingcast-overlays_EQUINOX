import classNames from "classnames";
import React from "react";
import { useMeetData } from "../../lib/useMeetData";
import { CurrentLifterBanner } from "../CurrentLifterBanner/CurrentLifterBanner";
import { Standings } from "../Standings/Standings";
// import { UpcomingLifters } from "../UpcomingLifters/UpcomingLifters";
import "./Dashboard.css";
// import { Clock } from "../Clock/Clock"; ; moved to banner
// import { Flag } from "../Flag/Flag"; moved to banner
// import { PlaceChange } from "../PlaceChange/PlaceChange";
import { Forecasted } from "../Forecasted/Forecasted";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import { Standing } from "../Standing/Standing";

export const Dashboard = ({
  meetId,
  password,
  apiKey,
  apiBaseUrl,
}: {
  meetId: string;
  password: string;
  apiKey: string;
  apiBaseUrl: string;
}) => {
  const [updating, setUpdating] = React.useState(false);
  const { data, status, error, wait, latency } = useMeetData({
    meetId,
    password,
    apiKey,
    apiBaseUrl,
  });

  React.useEffect(() => {
    setUpdating(true);
    const timer = setTimeout(() => {
      setUpdating(false);
    }, 500);

    return () => timer && clearTimeout(timer);
  }, [updating]); // Updated dependency

  const round = (num: number) => Math.round(num * 100) / 100;

  return (
    <>
    
      <div className="dashboard">
        <div>
          <div className="connection-info">
            <div className="connection-info-first-row">
              <div>
                STATUS: {status}{" "}
                {status === "RECONNECTING" &&
                  wait &&
                  ` after ${wait / 1000} second wait.`}
              </div>
              <div
                className={classNames(
                  "sync-indicator",
                  status === "CONNECTED" && "sync-indicator-connected",
                  updating && "sync-indicator-updating"
                )}
              ></div>
              Latency: {round(latency)}ms
              <div>{meetId}</div>
            </div>
            <div>{error}</div>
          </div>
          {data &&
            data.platforms &&
            Object.values(data.platforms).map((platform) => {
              return (
                <div key={platform.id} className="platform-wrapper">
                  <div className="platform-column-one">
                    <div className="platform-name">{platform.name}</div>
                    <CurrentLifterBanner
                      data={data}
                      platformId={platform.id}
                      latency={latency}
                    />
                    <div className="secondary-banner">
                      {/* Secondary banner content */}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div>
            <ImageCarousel />
          </div>
        {data && (
          <div>
            <Standings data={data} />
            <Standing data={data} />
          </div>
        )}
        {data && (
          <div>
            <Forecasted data={data} />
          </div>
        )}
      </div>
      
    </>
  );
};
