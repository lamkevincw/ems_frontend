import { useEffect, useState } from "react";
import { Row, Table } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';

function ReportOverview(props) {
    const [siteElements, setSiteElements] = useState(props.allSiteElements);
    const tableRows = [
        {
            "key": "overviewRowReporting",
            "cellID": "lastReported",
            "boolSign": true,
            "prop": "q_last_reported",
            "label": "Last Reported"
        },
        {
            "key": "overviewRowBattery",
            "cellID": "batteryVoltage",
            "boolSign": true,
            "prop": "q_voltage",
            "label": "Battery Voltage"
        },
        {
            "key": "overviewRowS1Reporting",
            "cellID": "sensor1Reporting",
            "boolSign": true,
            "prop": "q_sensor1",
            "label": "Sensor 1 Reporting"
        },
        {
            "key": "overviewRowS2Reporting",
            "cellID": "sensor2Reporting",
            "boolSign": true,
            "prop": "q_sensor2",
            "label": "Sensor 2 Reporting"
        },
        {
            "key": "overviewRowS3Reporting",
            "cellID": "sensor3Reporting",
            "boolSign": true,
            "prop": "q_sensor3",
            "label": "Sensor 3 Reporting"
        },
        {
            "key": "overviewRowS1Zero",
            "cellID": "sensor1Zero",
            "boolSign": true,
            "prop": "q_sensor1_0s",
            "label": "Sensor 1 All Zeroes"
        },
        {
            "key": "overviewRowS2Zero",
            "cellID": "sensor2Zero",
            "boolSign": true,
            "prop": "q_sensor2_0s",
            "label": "Sensor 2 All Zeroes"
        },
        {
            "key": "overviewRowS3Zero",
            "cellID": "sensor3Zero",
            "boolSign": true,
            "prop": "q_sensor3_0s",
            "label": "Sensor 3 All Zeroes"
        },
        {
            "key": "OverviewS1Small",
            "cellID": "sensor1Small",
            "boolSign": true,
            "prop": "q_sensor1_too_small",
            "label": "Sensor 1 Too Small"
        },
        {
            "key": "OverviewS2Small",
            "cellID": "sensor2Small",
            "boolSign": true,
            "prop": "q_sensor2_too_small",
            "label": "Sensor 2 Too Small"
        },
        {
            "key": "OverviewS3Small",
            "cellID": "sensor3Small",
            "boolSign": true,
            "prop": "q_sensor3_too_small",
            "label": "Sensor 3 Too Small"
        }
    ];
    // console.log(siteElements);
    // console.log(props.fullReport);
    // console.log(props.allQuantifiers);

    function setCellColor(quantifier, cellID, index, bool, date) {
        const colours = [
            "#e15759", // Red // False
            "#59a14f", // Green // True
            "#bab0ab", // Grey // N/A
            "#e15759", // Red // Small/Zeroes
            "#e15759", // Red // Reporting is offline
            "", // Ignore // Low voltage
            "#edc949", // Yellow // Reporting offline 1 day
            "#e15759", // Red // Reporting offline 1 week
            "#666666", // Dark grey // Reporting offline 1 month
        ];

        if (bool === "N/A") {
            return colours[2];
        }
        // console.log(props.fullReport[index][quantifier].q_last_reported);
        // console.log(props.voltageThreshold[index]);
        var hoursSinceUpdate = Math.abs(date - (new Date().getTime())) / (1000 * 60 * 60);
        switch (cellID) {
            case "lastReported":
                // console.log((new Date(bool)).getTime());
                if (hoursSinceUpdate < 730) {
                    if (hoursSinceUpdate < 168) {
                        if (hoursSinceUpdate < 24) {
                            return colours[1];
                        } else {
                            if (colours[6] !== "") {
                                return colours[6];
                            } else {
                                return colours[0];
                            }
                        }
                    } else {
                        if (colours[7] !== "") {
                            return colours[7];
                        } else {
                            return colours[0];
                        }
                    }
                } else {
                    if (colours[8] !== "") {
                        return colours[8];
                    } else {
                        return colours[0];
                    }
                }
                break;
            case "batteryVoltage":
                if (hoursSinceUpdate >= 730 && colours[8] !== "") {
                    return colours[8];
                } else if (hoursSinceUpdate >= 168 && colours[7] !== "") {
                    return colours[7];
                } else if (hoursSinceUpdate >= 24 && colours[6] !== "") {
                    return colours[6];
                } else if (hoursSinceUpdate >= 24 && colours[4] !== "") {
                    return colours[4];
                }
                else if (bool > props.voltageThreshold[index]) {
                    // console.log(bool + " " + props.voltageThreshold[index]);
                    return colours[1];
                } else {
                    return colours[0];
                }
                break;
            case "sensor1Reporting":
            case "sensor2Reporting":
            case "sensor3Reporting":
                if (hoursSinceUpdate >= 730 && colours[8] !== "") {
                    return colours[8];
                } else if (hoursSinceUpdate >= 168 && colours[7] !== "") {
                    return colours[7];
                } else if (hoursSinceUpdate >= 24 && colours[6] !== "") {
                    return colours[6];
                } else if (hoursSinceUpdate >= 24 && colours[4] !== "") {
                    return colours[4];
                }
                else if (bool) {
                    if (props.fullReport[index][quantifier].q_voltage <= 10 && colours[5] !== "") {
                        return colours[5]
                    } else {
                        return colours[1];
                    }
                } else {
                    return colours[0];
                }
                break;
            case "sensor1Zero":
            case "sensor1Small":
                if (hoursSinceUpdate >= 730 && colours[8] !== "") {
                    return colours[8];
                } else if (hoursSinceUpdate >= 168 && colours[7] !== "") {
                    return colours[7];
                } else if (hoursSinceUpdate >= 24 && colours[6] !== "") {
                    return colours[6];
                } else if (hoursSinceUpdate >= 24 && colours[4] !== "") {
                    return colours[4];
                } else if (props.fullReport[index][quantifier].q_voltage <= 10 && colours[5] !== "") {
                    return colours[5];
                }
                else if (props.fullReport[index][quantifier].q_sensor1) {
                    if (!bool) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                } else {
                    return colours[3];
                }
                break;
            case "sensor2Zero":
            case "sensor2Small":
                if (hoursSinceUpdate >= 730 && colours[8] !== "") {
                    return colours[8];
                } else if (hoursSinceUpdate >= 168 && colours[7] !== "") {
                    return colours[7];
                } else if (hoursSinceUpdate >= 24 && colours[6] !== "") {
                    return colours[6];
                } else if (hoursSinceUpdate >= 24 && colours[4] !== "") {
                    return colours[4];
                } else if (props.fullReport[index][quantifier].q_voltage <= 10 && colours[5] !== "") {
                    return colours[5];
                }
                else if (props.fullReport[index][quantifier].q_sensor2) {
                    if (!bool) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                } else {
                    return colours[3];
                }
                break;
            case "sensor3Zero":
            case "sensor3Small":
                if (hoursSinceUpdate >= 730 && colours[8] !== "") {
                    return colours[8];
                } else if (hoursSinceUpdate >= 168 && colours[7] !== "") {
                    return colours[7];
                } else if (hoursSinceUpdate >= 24 && colours[6] !== "") {
                    return colours[6];
                } else if (hoursSinceUpdate >= 24 && colours[4] !== "") {
                    return colours[4];
                } else if (props.fullReport[index][quantifier].q_voltage <= 10 && colours[5] !== "") {
                    return colours[5];
                }
                else if (props.fullReport[index][quantifier].q_sensor3) {
                    if (!bool) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                } else {
                    return colours[3];
                }
                break;
        }
        // if (bool === "N/A") {
        //     return "#e15759"; // Red
        // } else if (((cellID === "sensor1Zero" || cellID === "sensor1Small")
        //     && !props.fullReport[index][quantifier].q_sensor1)
        //     || ((cellID === "sensor2Zero" || cellID === "sensor2Small")
        //         && !props.fullReport[index][quantifier].q_sensor2)
        //     || ((cellID === "sensor3Zero" || cellID === "sensor3Small")
        //         && !props.fullReport[index][quantifier].q_sensor3)) {
        //     // console.log("true");
        //     return "#ff9da7"; // Pink
        //     //["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1",,"#9c755f","#bab0ab"]
        // }
        // else if (bool) {
        //     return "#59a14f"; // Green
        // } else {
        //     return "#e15759"; // Red
        // }
    }

    function setSiteBorder(quantifier, index) {
        if (props.allQuantifiers[index][props.allQuantifiers[index].length - 1] === quantifier && props.allQuantifiers.length !== (index + 1)) {
            return "2px solid black";
        }
    }

    function headerLabel(site, index) {
        if (site.siteName.length > 3 * props.allQuantifiers[index].length) {
            return "";
        } else {
            return site.siteName.split("_").join(" ");
        }
    }

    function jumpToAnchor(e) {
        if (e.target.dataset.tip !== undefined) {
            var siteName = e.target.dataset.tip.split("<br />")[0].slice(5);
            var anchor = document.getElementById(siteName.split(" ").join("_").slice(1) + "Anchor");
            // console.log(siteName.split(" ").join("_").slice(1));
            anchor.scrollIntoView();
        }
    }

    return (
        <div>
            <ReactTooltip html={true} />
            <Table responsive bordered hover size="sm" key="overviewTable"
                style={{ overflow: "hidden" }}
                onClick={jumpToAnchor}
            >
                <thead>
                    <tr style={{
                        fontSize: "12px"
                    }} key="overviewHeader">
                        {siteElements.map((site, index) => (
                            <th
                                key={site.siteName + "overviewHeader"}
                                colSpan={props.allQuantifiers[index].length}
                            >
                                {headerLabel(site, index)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* <tr style={{ // Name
                    fontSize: "6px"
                }} key={"overviewRowName"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td key={site.siteName + quantifier + "OverviewName"}>{site.siteName} {quantifier}</td>
                        ))
                    ))}
                </tr> */}

                    {tableRows.map(row => (
                        <tr style={{
                            fontSize: "14px"
                        }} key={row.key}>
                            {siteElements.map((site, index) => {
                                return ([
                                    props.allQuantifiers[index].map((quantifier, jndex) => (
                                        <td
                                            key={site.siteName + quantifier + row.key}
                                            className="tableCell"
                                            style={{
                                                backgroundColor: setCellColor(quantifier, row.cellID, index, (row.boolSign ? props.fullReport[index][quantifier][row.prop] : !props.fullReport[index][quantifier][row.prop]), (new Date(props.fullReport[index][quantifier].q_last_reported).getTime())),
                                                borderRight: setSiteBorder(quantifier, index),
                                                cursor: "pointer"
                                            }}
                                            data-tip={"Site: " + site.siteName.split("_").join(" ") +
                                                "<br />Quantifier: " + quantifier +
                                                "<br />" + row.label + ": " + props.fullReport[index][quantifier][row.prop]}
                                        >
                                        </td>
                                    ))//,
                                    // <td style={{width: "0.1px"}}></td>
                                ])
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default ReportOverview;