import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';

function DistributorOverviewNew(props) {
    const [siteElements, setSiteElements] = useState(props.allSiteElements);
    const tableRows = [
        {
            "key": "distOverviewRowOnOff",
            "cellID": "onOff",
            "prop": "onOff",
            "label": "On/Off"
        },
        {
            "key": "distOverviewRowSignal",
            "cellID": "cellSignal",
            "prop": "cellSignal",
            "label": "Cell Signal"
        },
        {
            "key": "distOverviewRowReporting",
            "cellID": "lastReported",
            "prop": "datetime",
            "label": "Last Reported"
        },
        {
            "key": "distOverviewRowMotorSpeedAlarm",
            "cellID": "motorAlarm",
            "prop": "motorState",
            "label": "Motor State"
        },
        {
            "key": "distOverviewRowP0Alarm",
            "cellID": "p0Alarm",
            "prop": "p0Alarm",
            "label": "P0 Alarm"
        },
        {
            "key": "distOverviewRowP1Alarm",
            "cellID": "p1Alarm",
            "prop": "p1Alarm",
            "label": "P1 Alarm"
        },
        {
            "key": "distOverviewRowDoseMode",
            "cellID": "doseMode",
            "prop": "doseMode",
            "label": "Dose Mode"
        }
    ];

    function setCellColor(cellID, bool, date) {
        const colours = [
            "#e15759", // Red // False / Reporting offline 1 week
            "#59a14f", // Green // True
            "#edc949", // Yellow // Reporting offline 1 day
            "#bab0ab" // Grey // Reporting offline
        ];

        var hoursSinceUpdate = Math.abs(date - (new Date().getTime())) / (1000 * 60 * 60);
        // if (hoursSinceUpdate > 730) {
        //     return colours[3];
        // } else if (hoursSinceUpdate > 168) {
        //     return colours[0];
        // } else if (hoursSinceUpdate > 24) {
        //     return colours[2];
        // }
        switch (cellID) {
            case "lastReported":
                if (hoursSinceUpdate > 730) {
                    return colours[3];
                } else if (hoursSinceUpdate > 168) {
                    return colours[0];
                } else if (hoursSinceUpdate > 24) {
                    return colours[2];
                } else {
                    return colours[1];
                }
            case "onOff":
            case "motorAlarm":
                return bool == true ? colours[1] : colours[0];
            case "p0Alarm":
            case "p1Alarm":
                return bool == false ? colours[1] : colours[0];
            case "cellSignal":
                if (bool == 2) {
                    return colours[1];
                } else if (bool == 1) {
                    return colours[2];
                } else {
                    return colours[0];
                }
        }
    }

    function setSiteBorder(site, quantifier, index) {
        if (site.quantifiers[site.quantifiers.length - 1] === quantifier && siteElements.length !== (index + 1)) {
            return "2px solid black";
        }
    }

    function headerLabel(site) {
        // if (site.length > 3 * site.quantifiers.length) {
        //     return "";
        // } else {
        return site;
        // }
    }

    function formatDatatip(value, index) {
        switch (index) {
            case 0:
            case 3:
            case 4:
            case 5:
                return value == true ? "True" : "False";
            case 1:
                return value == 2 ? "Strong" : value == 1 ? "Average" : "Weak";
            case 2:
                return (new Date(props.data.datetime)).toLocaleDateString("en-US", { timeZone: "America/Regina" })
                    + ", " + (new Date(props.data.datetime)).toLocaleTimeString("en-US", { timeZone: "America/Regina" });
            case 6:
                return value == 0 ? "Manual" : "Auto";
        }
    }

    function jumpToAnchor(e) {
        if (e.target.dataset.tip !== undefined) {
            var siteName = e.target.dataset.tip.split("<br />")[0].slice(5);
            var anchor = document.getElementById(siteName.split(" ").join("_").slice(1) + "Anchor");
            anchor.scrollIntoView();
        }
    }

    useEffect(() => {
        ReactTooltip.rebuild()
    });

    // console.log(props.allSiteElements)
    // console.log(props.report)

    return (
        <div>
            <ReactTooltip html={true} />
            <Table responsive bordered hover size="sm" key="distOverviewTable"
                style={{ overflow: "hidden" }}
                onClick={jumpToAnchor}
            >
                <thead>
                    <tr style={{
                        fontSize: "12px"
                    }} key="distOverviewHeader">
                        {/* {siteElements.map((site, index) => ( */}
                        <th
                            key={props.sites + "overviewHeader"}
                        >
                            {headerLabel(props.sites)}
                        </th>
                        {/* ))} */}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row, index) => (
                        <tr style={{
                            fontSize: "14px"
                        }} key={Math.random()}>
                            {/* {siteElements.map((site, index) => {
                                // console.log(site)
                                return ([
                                    site.quantifiers.map((quantifier, jndex) => {
                                        // console.log(quantifier) */}
                            <td
                                key={props.sites + row.key}
                                className="tableCell d-flex justify-content-center"
                                style={{
                                    backgroundColor: setCellColor(row.cellID, props.data[row.prop], props.data.datetime),
                                    borderRight: "2px solid black",
                                    cursor: "pointer"
                                }}
                                data-tip={"Site: " + props.fullName +
                                    "<br />" + row.label + ": " + formatDatatip(props.data[row.prop], index)}
                            >
                                {index == 6 ? <span style={{ fontSize: "12px" }}>{props.data[row.prop] == 0 ? "M" : "A"}</span> : null}
                            </td>
                            {/*         })//,
                                    // <td style={{width: "0.1px"}}></td>
                                ])
                            })} */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default DistributorOverviewNew;