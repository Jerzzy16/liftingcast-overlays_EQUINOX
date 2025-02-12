import {
  Attempt,
  AttemptNumber,
  LiftName,
  Lifter,
  MeetApiResponse,
  RefLight,
  RefLights,
} from "../../types";
import { every, first } from "lodash";
import classNames from "classnames";
import "./CurrentLifterBanner.css";
import React from "react";
import logo from "/logo.svg";

//inputed from dashboard
import { Flag } from "../Flag/Flag"; 
import { Clock } from "../Clock/Clock"; 
import { PlaceChange } from "../PlaceChange/PlaceChange";

// @ts-expect-error types are not working for react-fitty
import { ReactFitty } from "react-fitty";

export const CurrentLifterBanner = ({
  data,
  platformId,
  latency, // clock
}: {
  data: MeetApiResponse;
  platformId: string;
  latency: number;
}) => {
  const platform = data?.platforms?.[platformId];
  const lifters = data.lifters;
  const divisions = data.divisions;

  if (!platform || !lifters || !divisions) {
    return null;
  }

  const currentAttempt = platform.currentAttempt ?? null;
  const currentLifterId = currentAttempt?.lifter.id;
  const currentLifter =
    currentLifterId && lifters[currentLifterId]
      ? lifters[currentLifterId] ?? null
      : null;
  const firstLifterDivision = first(currentLifter?.divisions);
  const firstDivisionId = firstLifterDivision?.divisionId;
  const firstDivision =
    firstDivisionId && divisions ? divisions[firstDivisionId] : null;
  const firstWeightClassId = firstLifterDivision?.weightClassId;
  const firstWeightClass = firstWeightClassId
    ? firstDivision?.weightClasses[firstWeightClassId]
    : null;

  return (
    <>
      {/* Top Dashboard */}
      <div className="banner-container">

        <div className="top-lifter-banner"> {/* flag+lifter info */}
          <Flag data={data} platformId={platform.id} />
            <div className="top-lifter-banner-column">
              <AutoSize>
                <span className="name"> {currentLifter?.name} </span>
              </AutoSize>
              <AutoSize>
                <span className="team"> {currentLifter?.team} </span>
              </AutoSize>
            </div>
          {firstDivision && firstWeightClass && (
              <div className="top-lifter-banner-weight">
                <AutoSize>
                  {/* {firstDivision?.name} |  will not be used */}
                  <span className="weight">{firstWeightClass?.name} kg </span>
                </AutoSize>
              </div>
            )}
        </div>

      </div>
  

      {/* Bottom Dashboard */}
      <div className="bottom-banner-row">

        <div className="logo">
          <img src={logo} className="logo" alt="logo" />
        </div>

        <div className="current-lifter-banner">
          <div className="current-lifter-banner-attempts">
            <Attempts currentAttempt={currentAttempt} lifter={currentLifter} />
          </div>
          <div className="timer-lift-column"> {/* to combine both into a column */}
            <Clock data={data} platformId={platform.id} latency={latency} />
            <div className="current-lifter-banner-lift-name">
              {currentAttempt?.liftName === "dead" ? "deadlift" : currentAttempt?.liftName}
            </div>
          </div>
        </div>

        <Lights refLights={platform.refLights} />

      </div>

      {/* Rank Dashboard */}
      <div className="new-banner-container">

        <div className="rank">
          <div className="info-row">
            <span className="info-label">Rank:</span>
              <div className="data-label">
                <PlaceChange data={data} platformId={platform.id} />
              </div>
          </div>
        </div>

      </div>
    </>
  );
};

const AutoSize = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactFitty minSize={8} maxSize={16} wrapText={false}>
      {children}
    </ReactFitty>
  );
};

const AttemptCell = ({
  liftName,
  attemptNumber,
  isCurrent,
  lifter,
}: {
  liftName: LiftName | undefined;
  attemptNumber: AttemptNumber | undefined;
  isCurrent: boolean;
  lifter: Lifter | null;
}) => {
  const attempt =
    lifter && liftName && attemptNumber
      ? lifter.lifts[liftName][attemptNumber]
      : null;
  return (
    <div
      className={classNames(
        "current-lifter-banner-attempt",
        isCurrent && "current-lifter-banner-attempt-current",
        attempt?.result === "good" && "current-lifter-banner-attempt-good",
        attempt?.result === "bad" && "current-lifter-banner-attempt-bad"
      )}
    >
      {attempt?.weight}
    </div>
  );
};

const Attempts = ({
  currentAttempt,
  lifter,
}: {
  currentAttempt: Attempt | null;
  lifter: Lifter | null;
}) => {
  return (
    <>
      <AttemptCell
        isCurrent={currentAttempt?.attemptNumber === "1"}
        liftName={currentAttempt?.liftName}
        attemptNumber="1"
        lifter={lifter}
      />
      <AttemptCell
        isCurrent={currentAttempt?.attemptNumber === "2"}
        liftName={currentAttempt?.liftName}
        attemptNumber="2"
        lifter={lifter}
      />
      <AttemptCell
        isCurrent={currentAttempt?.attemptNumber === "3"}
        liftName={currentAttempt?.liftName}
        attemptNumber="3"
        lifter={lifter}
      />
    </>
  );
};

// Optional delay when turning lights off so they stay on long enough to read.
const lightsOffDelaySeconds = import.meta.env
  .VITE_LIFTINGCAST_LIGHTS_OFF_DELAY_SECONDS as string | undefined;

const Lights = ({ refLights }: { refLights: RefLights }) => {
const [refLightsInternal, setRefLightsInternal] = React.useState<RefLights>(refLights);

React.useEffect(() => {
  const allSelectedCurrent = every(
    refLights,
    (rl) => rl.decision === "good" || rl.decision === "bad"
  );

  const allSelectedPrevious = every(
    refLightsInternal,
    (rl) => rl.decision === "good" || rl.decision === "bad"
  );

  if (allSelectedPrevious && !allSelectedCurrent) {
    setTimeout(
      () => setRefLightsInternal(refLights),
      Number(lightsOffDelaySeconds ?? "0") * 1000
    );
  } else {
    setRefLightsInternal(refLights);
  }
}, [refLights, refLightsInternal]);

const allSelected = every(
  refLightsInternal,
  (rl) => rl.decision === "good" || rl.decision === "bad"
);

return (
  <div className="current-lifter-banner-lights">
    <Light refLight={refLightsInternal.left} allSelected={allSelected} />
    <Light refLight={refLightsInternal.head} allSelected={allSelected} />
    <Light refLight={refLightsInternal.right} allSelected={allSelected} />
  </div>
);
};

const Light = ({
refLight,
allSelected,
}: {
refLight: RefLight;
allSelected: boolean;
}) => {
return (
  <div
    className={classNames(
      "current-lifter-banner-light",
      allSelected &&
        refLight.decision === "bad" &&
        "current-lifter-banner-light-red",
      allSelected &&
        refLight.decision === "good" &&
        "current-lifter-banner-light-white"
    )}
  >
    <div className="card-slits">
      {refLight.cards?.red && <div className="card-indicator red-card"></div>}
      {refLight.cards?.blue && <div className="card-indicator blue-card"></div>}
      {refLight.cards?.yellow && <div className="card-indicator yellow-card"></div>}
    </div>
  </div>
);
};
