import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';

function DistributorOverviewNew(props) {
    const [siteElements, setSiteElements] = useState(props.sites);
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

        if (cellID != "doseMode" && date === 0) {
            return colours[3];
        }
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
                if (bool == 4 || bool == 5) {
                    return colours[1];
                } else if (bool == 2 || bool == 3) {
                    return colours[2];
                } else {
                    return colours[0];
                }
        }
    }

    function setSiteBorder(sites, index) {
        if (sites.length !== (index + 1)) {
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
                return value > 3 ? "Strong" : value < 2 ? "Weak" : "Average";
            case 2:
                return (new Date(value)).toLocaleDateString("en-US", { timeZone: "America/Regina" })
                    + ", " + (new Date(value)).toLocaleTimeString("en-US", { timeZone: "America/Regina" });
            case 6:
                return value == 0 ? "Manual" : "Auto";
        }
    }

    function jumpToAnchor(e) {
        if (e.target.dataset.tip !== undefined) {
            var siteName = e.target.dataset.tip.split("<br />")[0].slice(5);
            var anchor = document.getElementById(siteName.slice(1) + "DistributorAnchor");
            anchor.scrollIntoView();
        }
    }

    useEffect(() => {
        ReactTooltip.rebuild()
    });

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
                        {props.sites.map((site, index) => (
                            <th
                                key={site.Name + site.num + "overviewHeader"}
                            >
                                {headerLabel(site.Name) + (site.multiple ? "-" + (site.num + 1) : "")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row, index) => (
                        <tr style={{
                            fontSize: "14px"
                        }} key={row.key}>
                            {props.data.map((site, jndex) => {
                                var siteData = site == null ? props.nullData : site;
                                // console.log(site)
                                return (
                                    <td
                                        key={props.sites[jndex].Name + props.sites[jndex].num + row.key}
                                        className="tableCell"
                                        style={{
                                            backgroundColor: setCellColor(row.cellID, siteData[row.prop], siteData.datetime),
                                            borderRight: setSiteBorder(props.sites, jndex),
                                            cursor: "pointer",
                                            textAlign: "center"
                                        }}
                                        data-tip={"Site: " + props.sites[jndex].fullName +
                                            "<br />" + row.label + ": " + formatDatatip(siteData[row.prop], index)}
                                    >
                                        {index == 6 ? <span style={{ fontSize: "12px" }}>{siteData[row.prop] == 0 ? "M" : "A"}</span> : null}
                                    </td>
                                )
                            })} 
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default DistributorOverviewNew;