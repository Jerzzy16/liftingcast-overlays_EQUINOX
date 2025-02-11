import "./PlaceChange.css";
import { MeetApiResponse } from "../../types";

export const PlaceChange = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  return (
    <div className="place-change">
      <PlaceChangeInner data={data} platformId={platformId} />
    </div>
  );
};

const PlaceChangeInner = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  const platform = data?.platforms?.[platformId];
  const currentAttempt = platform?.currentAttempt;
  if (!currentAttempt) {
    return null;
  }
  const currentLifterId = currentAttempt?.lifter.id;

  const divisions = data.lifters?.[currentLifterId]?.divisions;
  if (!divisions || !divisions.length) {
    return null;
  }

  const firstDivision = divisions[0];
  const firstDivisionId = firstDivision?.divisionId;
  if (!firstDivisionId) {
    return null;
  }

  const currentPlace = firstDivision?.place;
  if (!currentPlace) {
    return null;
  }

  const possiblePlace = currentAttempt.ifSuccessfulPlaces
    ? currentAttempt.ifSuccessfulPlaces[firstDivisionId]
    : null;

  if (!possiblePlace) {
    return <div>{currentPlace}</div>;
  }

  return (
    <div className="place-change-inner">
      <span className="current-place">{currentPlace}</span>
      <svg
        className="icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
      >
        <path d="M12 2L22 12L12 22V16H2V8H12V2Z" fill="white" />
      </svg>
      <span className="possible-place">{possiblePlace}</span>
    </div>
  );
  
  
};
