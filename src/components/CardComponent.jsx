// SearchResultCard.tsx
import React from "react";
import "./CardComponent.css";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ display_mode, title, identifier, org }) => {
  const navigate = useNavigate(); // Use the useNavigate hook to navigate

  const handleClick = () => {
    // Navigate to the details page with the id as a query parameter
    navigate(`/details?id=${identifier}`);
  };

  return (
    <div
      className={`search-result-card${
        display_mode == "list" ? "" : "-grid-view"
      }`}
      onClick={handleClick}
    >
      {/* <div className={`thumbnail${display_mode == "list" ? "" : "-grid"}`}>
        <img src={image} alt="Thumbnail" />
      </div> */}
      <div className={`content${display_mode == "list" ? "" : "-grid"}`}>
        <div className="top-row">
          <div className="institution">
            {org[0] + (org[1] != "" ? " | " + org[1] : "")}
          </div>
        </div>
        <div className="middle-row">
          <strong className="title">{title ? title : "[ohne Titel]"}</strong>
        </div>
        {/* <div className="bottom-row">
          {contributor?.length > 0 && (
            <div className="contributor-info">
              {contributor.map((agent, index) => (
                <React.Fragment key={index}>
                  {agent["name"] +
                    (agent["role"].length > 0 ? " | " + agent["role"] : "") +
                    (index < contributor.length - 1 ? "; " : "")}
                </React.Fragment>
              ))}
            </div>
          )}
          {date?.length > 0 && (
            <div className="date-info">
              {date.map((datum, index) => (
                <React.Fragment key={index}>
                  {datum["value"] +
                    (datum["type"].length > 0 ? " | " + datum["type"] : "") +
                    (index < date.length - 1 ? "; " : "")}
                </React.Fragment>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default CardComponent;
