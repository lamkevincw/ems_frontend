import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function ReportOverview(props) {
    const [siteElements, setSiteElements] = useState(props.allSiteElements);
    const tableRows = [
        {
            "key": "overviewRowReporting",
            "cellID": "lastReport",
            "boolSign": true,
            "prop": "q_reporting"
        },
        {
            "key": "overviewRowBattery",
            "cellID": "batteryVoltage",
            "boolSign": false,
            "prop": "q_voltage_low"
        },
        {
            "key": "overviewRowS1Reporting",
            "cellID": "sensor1Reporting",
            "boolSign": true,
            "prop": "q_sensor1"
        },
        {
            "key": "overviewRowS2Reporting",
            "cellID": "sensor2Reporting",
            "boolSign": true,
            "prop": "q_sensor2"
        },
        {
            "key": "overviewRowS3Reporting",
            "cellID": "sensor3Reporting",
            "boolSign": true,
            "prop": "q_sensor3"
        },
        {
            "key": "overviewRowS1Zero",
            "cellID": "sensor1Zero",
            "boolSign": false,
            "prop": "q_sensor1_0s"
        },
        {
            "key": "overviewRowS2Zero",
            "cellID": "sensor2Zero",
            "boolSign": false,
            "prop": "q_sensor2_0s"
        },
        {
            "key": "overviewRowS3Zero",
            "cellID": "sensor3Zero",
            "boolSign": false,
            "prop": "q_sensor3_0s"
        },
        {
            "key": "OverviewS1Small",
            "cellID": "sensor1Small",
            "boolSign": false,
            "prop": "q_sensor1_too_small"
        },
        {
            "key": "OverviewS2Small",
            "cellID": "sensor2Small",
            "boolSign": false,
            "prop": "q_sensor2_too_small"
        },
        {
            "key": "OverviewS3Small",
            "cellID": "sensor3Small",
            "boolSign": false,
            "prop": "q_sensor3_too_small"
        }
    ];
    // console.log(siteElements);
    // console.log(props.fullReport);
    // console.log(props.allQuantifiers);

    function setCellColor(quantifier, cellID, index, bool) {
        if (bool === "N/A") {
            return "#e15759"; // Red
        } else if (((cellID === "sensor1Zero" || cellID === "sensor1Small")
            && !props.fullReport[index][quantifier].q_sensor1)
            || ((cellID === "sensor2Zero" || cellID === "sensor2Small")
                && !props.fullReport[index][quantifier].q_sensor2)
            || ((cellID === "sensor3Zero" || cellID === "sensor3Small")
                && !props.fullReport[index][quantifier].q_sensor3)) {
            // console.log("true");
            return "#ff9da7"; // Pink
            //["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1",,"#9c755f","#bab0ab"]
        }
        else if (bool) {
            return "#59a14f"; // Green
        } else {
            return "#e15759"; // Red
        }
    }

    return (
        <Table responsive bordered hover size="sm" key="overviewTable">
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
                        fontSize: "6px"
                    }} key={row.key}>
                        {siteElements.map((site, index) => (
                            props.allQuantifiers[index].map(quantifier => (
                                <td
                                    key={site.siteName + quantifier + row.key}
                                    style={{ backgroundColor: setCellColor(quantifier, row.cellID, index, (row.boolSign ? props.fullReport[index][quantifier][row.prop] : !props.fullReport[index][quantifier][row.prop])) }}
                                ></td>
                            ))
                        ))}
                    </tr>
                ))}
                {/* <tr style={{ // Reporting
                    fontSize: "6px"
                }} key={"overviewRowReporting"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewReporting"}
                                style={{ backgroundColor: setCellColor(quantifier, "lastReport", index, props.fullReport[index][quantifier].q_reporting) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Battery
                    fontSize: "6px"
                }} key={"overviewRowBattery"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewBattery"}
                                style={{ backgroundColor: setCellColor(quantifier, "batteryVoltage", index, !props.fullReport[index][quantifier].q_voltage_low) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 1 Reporting
                    fontSize: "6px"
                }} key={"overviewRowS1Reporting"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS1Reporting"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor1Reporting", index, props.fullReport[index][quantifier].q_sensor1) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 2 Reporting
                    fontSize: "6px"
                }} key={"overviewRowS2Reporting"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS2Reporting"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor2Reporting", index, props.fullReport[index][quantifier].q_sensor2) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 3 Reporting
                    fontSize: "6px"
                }} key={"overviewRowS3Reporting"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS3Reporting"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor3Reporting", index, props.fullReport[index][quantifier].q_sensor3) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 1 Zero
                    fontSize: "6px"
                }} key={"overviewRowS1Zero"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS1Zero"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor1Zero", index, !props.fullReport[index][quantifier].q_sensor1_0s) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 2 Zero
                    fontSize: "6px"
                }} key={"overviewRowS2Zero"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS2Zero"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor2Zero", index, !props.fullReport[index][quantifier].q_sensor2_0s) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 3 Zero
                    fontSize: "6px"
                }} key={"overviewRowS3Zero"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS3Zero"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor3Zero", index, !props.fullReport[index][quantifier].q_sensor3_0s) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 1 Small
                    fontSize: "6px"
                }} key={"overviewRowS1Small"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS1Small"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor1Small", index, !props.fullReport[index][quantifier].q_sensor1_too_small) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 2 Small
                    fontSize: "6px"
                }} key={"overviewRowS2Small"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS2Small"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor2Small", index, !props.fullReport[index][quantifier].q_sensor2_too_small) }}
                            ></td>
                        ))
                    ))}
                </tr>
                <tr style={{ // Sensor 3 Small
                    fontSize: "6px"
                }} key={"overviewRowS3Small"}>
                    {siteElements.map((site, index) => (
                        props.allQuantifiers[index].map(quantifier => (
                            <td
                                key={site.siteName + quantifier + "OverviewS3Small"}
                                style={{ backgroundColor: setCellColor(quantifier, "sensor3Small", index, !props.fullReport[index][quantifier].q_sensor3_too_small) }}
                            ></td>
                        ))
                    ))}
                </tr> */}
            </tbody>
        </Table>
    );
}

export default ReportOverview;