import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import * as d3 from "d3";
import "./MainPage.css";
import CardComponent from "./CardComponent";
import GraphContainer from "./GraphContainer";
// import axios from "axios";

const transformToGraph = (data) => {
  const nodesObj = {};
  const nodeList = []
  const linkList = [];
 
  data.forEach((obj) => {
    nodesObj[obj["Nummer"]] = {
      id: obj["Nummer"],
      appellation: obj["Titel"],
      type: "Object",
    };
    for (const [key, value] of Object.entries(obj)) {
      if (key.match(/Schlagwörter_\d/)) {
        if (value !== "") {
          nodesObj[value] = {
            id: "keyword_" + value,
            appellation: value,
            type: "Subject",
          };
          linkList.push({
            id: "keyword_" + value + "_" + obj["Nummer"],
            source: "keyword_" + value,
            target: obj["Nummer"],
            type: "Schlagwort"
          })
        }
      }
      if (key.match(/Werktitel_\d/)) {
        if (value !== "") {
          let index = key.match(/\d+/);
          nodesObj[obj[`Werktitel_GND_${index}`]] = {
            id: obj[`Werktitel_GND_${index}`],
            appellation: value,
            type: "Work",
          };
          linkList.push({id: obj[`Werktitel_GND_${index}`] + "-" +  obj["Nummer"], "source": obj[`Werktitel_GND_${index}`], "target": obj["Nummer"], "type": obj[`Beziehung_${index}`]})

        }
      }
      if (key.match(/Person_Name_\d/)) {
        if (value !== "") {
          let index = key.match(/\d+/);
          nodesObj[obj[`Person_GND_${index}`]] = {
            id: obj[`Person_GND_${index}`],
            appellation: value,
            type: "Person",
          };
          linkList.push({"source": obj[`Person_GND_${index}`], "target": obj["Nummer"], "type": obj[`Person_Rolle_${index}`]})
        }
      }
      if (key.match(/Ort_Name_\d/)) {
        if (value !== "") {
          let index = key.match(/\d+/);
          nodesObj[value] = {
            id: value,
            appellation: value,
            type: "Place",
          };
          linkList.push({
            id: value + "_" + obj["Nummer"],
            source: value,
            target: obj["Nummer"],
            type: "Ort"
          })
        }
        }
      if (key.match(/Beziehung_Objekt_\d/)) {
        if (value !== "") {
          let index = key.match(/\d+/);
          linkList.push({
            id: obj["Nummer"] + "_" + obj[`Objekt_Freitext_${index}`],
            source: obj["Nummer"],
            target: obj[`Objekt_Freitext_${index}`],
            type: value
          })
        }
      }
    
    }
  });
  for (const [key, value] of Object.entries(nodesObj)) {nodeList.push(value)}
  let graph = {nodes: nodeList, links: linkList}
  //console.log(nodeList);
  //console.log(linkList)
  return graph
  
};

const MainPage = () => {
  const [data, setData] = useState([]);
  const [graph, setGraph] = useState({nodes:[], links:[]})

  useEffect(() => {
    // axios.get("./data/farbenlehre.csv")
    // .then((res) => {console.log(res); setGraph(transformToGraph(res.data));
    //   setData(res.data)} )
    // .catch(err=>console.log(err))
    d3.csv("./data/farbenlehre.csv").then((data) => {
      setGraph(transformToGraph(data));
      setData(data);
    });
  }, []);

  return (
    <>
      <div className="maincontainer">
        <div className="catalogue">
          {data.map((d) => (
            // <div>{d["Titel"]}</div>
            <CardComponent
            key={d["Nummer"]}
              display_mode="list"
              title={d["Titel"]}
              id={d["Nummer"]}
              org={[d["Haltende_Einrichtung_1"], d["Haltende_Einrichtung_2"]]}
            ></CardComponent>
          ))}
        </div>
        <div className="graph">
          <GraphContainer graph={graph}/>
        </div>
      </div>
    </>
  );
};

export default MainPage;
