import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import "./GraphContainer.css";
import _ from 'lodash';


const GraphContainer = ({graph}) => {
  //console.log(graph)
  const [dimensions, setDimensions] = useState({ width: 30, height: 30 });
  const [renderStatus, setRenderStatus] = useState("loading")
  const divRef = useRef(null);
  const svgRef = useRef(null);
  const graphRef = useRef(null)
  const markerRef = useRef(null)
  const links = useRef(null)
  const nodes = useRef(null)
  const toolref = useRef(null)
  const radius = "fixed"
  const  color = {
    Work: "#e41a1c",
    Person: "#377eb8",
    Place: "#4daf4a",
    Subject: "#984ea3",
    Object: "#ff7f00",
  }

  useLayoutEffect(() => {
    let timeout;
    const handleResize = () => {
      console.log("resize");
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const { current } = divRef;
        // console.log(current);
        const boundingRect = current.getBoundingClientRect();
        const { width, height } = boundingRect;
        setDimensions({ width: Math.round(width), height: Math.round(height) });
        const svg = d3.select(svgRef.current)
       
            const g = d3.select(graphRef.current);
            let zoom = d3.zoom();
            let zoom_handler = zoom.on("zoom", zoom_actions);

            zoom_handler(svg);

            let bounds = g.node().getBBox();
            console.log("layout")
            console.log(bounds)
            let reZoomScale =
              0.90 /
              Math.max(bounds.width / (width - 30), bounds.height / (height - 30));
            let translate = [
              width / 2 - reZoomScale * (bounds.x + bounds.width / 2),
              height / 2 - reZoomScale * (bounds.y + bounds.height / 2),
            ];
            console.log(reZoomScale);
            console.log(translate);
            svg
              .transition()
              .duration(500)
              .call(
                zoom.transform,
                d3.zoomIdentity
                  .translate(translate[0], translate[1])
                  .scale(reZoomScale)
              );

            function zoom_actions(event) {
              g.attr("transform", event.transform);
            }
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (divRef.current) {

      const { current } = divRef;
      const boundingRect = current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setDimensions({ width: Math.round(width), height: Math.round(height) });
      console.log(width)
      console.log(height)
      const svg = d3.select(svgRef.current)
   
      console.log(svgRef.current)
      const g = d3.select(graphRef.current);
      let zoom = d3.zoom();
      let zoom_handler = zoom.on("zoom", zoom_actions);

      zoom_handler(svg);
      function zoom_actions(event) {
        g.attr("transform", event.transform);
      }

      if (graph.nodes.length > 0 ){
     
    let  node = d3.select(nodes.current).selectAll(".node");
    let link = d3.select(links.current).selectAll(".link");
    let marker = d3.select(markerRef.current).selectAll(".marker");

    const toolDiv = d3
      .select(toolref.current)
      .append("div")
      .style("visibility", "hidden")
      .style("background-color", "grey")
      .style("opacity", 0.7)
      .style("position", "absolute")
      .style("padding", "5px");

    let simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d) => d.id)
          .distance(20)
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => -50)
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

    node = node.data(graph.nodes, function (d) {
     
      return d.id;
    });

    node.exit().remove();

    const newNode = node
      .enter()
      .append("circle")
      .attr("class", "node")
      // .attr("key", function (d) {
      //   return d.id;
      // })
      .attr("r", function (d) {
        if (radius === "fixed") {
          return 3;
        } else if (radius === "dynamic") {
          return nodeRadius(d.connections);
        }
      })
      .attr("fill", function (d) {
        return color[d.type]
        // if (
        //   _.findIndex(filterarr, function (o) {
        //     return o == d.id;
        //   }) > -1
        // ) {
        //   return "white";
        // } else {
        //   return color[d.typename];
        // }
      })
      .on("mouseover", function (event, d) {
        toolDiv.style("visibility", "visible").text(d.appellation);
      })
      .on("mousemove", (e, d) => {
        toolDiv
          .style("top", e.offsetY - 50 + "px")
          .style("left", e.offsetX + 50 + "px");
      })
      .on("mouseleave", function (event, d) {
        toolDiv.style("visibility", "hidden");
      })
      .on("click", function (event, d) {
        resultMark(d.id);
      });

    node = node.merge(newNode);

    marker = marker.data(graph.links, function (d, i) {
      return i;
    });

    marker.exit().remove();

    var newMarker = marker
      .enter()
      .append("marker")
      .attr("class", "marker")
      .attr("id", function (d, i) {
        return "arrow" + i;
      })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "white")
      .attr("d", "M0,-5L10,0L0,5");

    marker = marker.merge(newMarker);

    link = link.data(graph.links, function (d, i) {
      return i;
    });

    link.exit().remove();

    var newLink = link
      .enter()
      .append("line")
      .attr("class", "link")
      // .attr("key", function (d, i) {
      //   return i;
      // })
      .attr("stroke", "black")
      .attr("stroke-opacity", function (d) {
        return 1
        // if (relationFilter.length == 0) {
        //   return 0.3;
        // } else if (relationFilter.includes("")) {
        //   return 0.3;
        // } else if (
        //   _.findIndex(relationFilter, function (o) {
        //     return o == d.type;
        //   }) > -1
        // ) {
        //   return 1;
        // } else {
        //   return 0.1;
        // }
      })
      // .attr("marker-end", function (d, i) {
      //   if (relationFilter.length == 0) {
      //     return "url(none)";
      //   } else if (
      //     _.findIndex(relationFilter, function (o) {
      //       return o == d.type;
      //     }) > -1
      //   ) {
      //     return "url(#arrow" + i + ")";
      //   } else {
      //     return "url(none)";
      //   }
      // });

    link = link.merge(newLink);

    simulation.nodes(graph.nodes).on("tick", tickActions);

    simulation.force("link").links(graph.links);

    simulation.alpha(1).alphaMin(0.1).restart();

    function tickActions() {
      if (simulation.alpha() < 0.1) {
        setRenderStatus("done")
       

      //update circle positions each tick of the simulation
      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });

      //update link positions
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });
        fitToBox()
      }
    }
    
  }
    }
  }, [ graph]);

  const fitToBox = () => {
    let g = d3.select(graphRef.current);
    var bounds = g.node().getBBox();
    var parent = g.node().parentElement;
    var fullWidth = parent.clientWidth,
      fullHeight = parent.clientHeight;
    var newWidth = bounds.width,
      newHeight = bounds.height;
    var midX = bounds.x + newWidth / 2,
      midY = bounds.y + newHeight / 2;

    var reZoomScale =
      0.95 / Math.max(newWidth / fullWidth, newHeight / fullHeight);
    console.log(reZoomScale);
    var translate = [
      fullWidth / 2 - reZoomScale * midX,
      fullHeight / 2 - reZoomScale * midY,
    ];
    // g.transition()
    //   .duration(500)
    g.attr(
      "transform",
      "translate(" + translate + ")" + "scale(" + reZoomScale + ")"
    );
  };

  console.log(renderStatus)

  return (
    <>
    <div style={renderStatus == "loading" ? {visibility: "visible"} : {visibility:"hidden"}}>loading</div>
    <div className="graphcontainer" ref={divRef} style={renderStatus == "loading" ? {visibility: "hidden"} : {visibility:"visible"}}>
      <div ref={toolref} id="tooDiv" key="toolDiv"></div>
      <svg ref={svgRef}
      width={dimensions.width - 30}
      height={dimensions.height - 30}
      style={{ margin: "10px" }}
      >
      <defs ref={markerRef} key="marker"></defs>
          <g ref={graphRef} key="g">
            <g ref={links} key="links"></g>
            <g ref={nodes} key="nodes"></g>
          </g>
          </svg>
    </div>
    </>
  );
};

export default GraphContainer;
