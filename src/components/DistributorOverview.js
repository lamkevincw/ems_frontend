import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';

function DistributorOverview(props) {
    const [distributors, setDistributors] = useState(props.data);
    const tableRows = [
        {
            "key": "distOverviewReadingDate",
            "index": 0,
            "label": "Reading Date"
        },
        {
            "key": "distOverviewChemTotal",
            "index": 1,
            "label": "Chem Total (L)"
        },
        {
            "key": "distOverviewFlowRate",
            "index": 2,
            "label": "Flow Rate (L/min)"
        },
        {
            "key": "distOverviewP1Pressure",
            "index": 3,
            "label": "P1 Pressure (psi)"
        },
        {
            "key": "distOverviewP2Pressure",
            "index": 4,
            "label": "P1 Pressure (psi)"
        },
        {
            "key": "distOverviewTemperature",
            "index": 5,
            "label": "Temperature (C)"
        },
        {
            "key": "distOverviewVoltage",
            "index": 6,
            "label": "Voltage (V)"
        },
        {
            "key": "distOverviewAlarm",
            "index": 7,
            "label": "Alarm Status"
        }
    ];
    // console.log(props.data);
    // console.log(props.devices);
    // console.log(props.data[props.devices[5].queryID])

    function setCellColor(colIndex, date, cellValue) {
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

        var hoursSinceUpdate = Math.abs((new Date(date).getTime()) - (new Date().getTime())) / (1000 * 60 * 60);
        if (hoursSinceUpdate > 24) {
            if (hoursSinceUpdate > 168) {
                if (hoursSinceUpdate > 730 && colours[8] !== "") {
                    return colours[8];
                } else if (colours[7] !== "") {
                    return colours[7];
                }
            } else if (colours[6] !== "") {
                return colours[6];
            }
        }
        else {
            switch (colIndex) {
                case 0: // Reading Date
                    return colours[1];
                    break;
                case 1: // Chem Total
                    if (parseFloat(cellValue) > 1.0) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                    break;
                case 2: // Flow rate
                    if (parseFloat(cellValue) > 0.0) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                    break;
                case 3: // P1 pressure
                case 4: // P2 pressure
                    if (parseFloat(cellValue) > 0.0) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                    break;
                case 5: // Temperature
                    if (parseFloat(cellValue) > 4.0) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                    break;
                case 6: // Voltage
                    if (parseFloat(cellValue) > 3.0) {
                        return colours[1];
                    } else {
                        return colours[0];
                    }
                    break;
                case 7: // Alarm status
                    switch (cellValue) {
                        case "Good":
                            return colours[1];
                            break;
                        case "P1 Fail":
                        case "P2 Fail":
                        case "P1 Fail, P2 Fail":
                            return colours[0];
                            break;
                        case "Water Low":
                            return colours[6];
                            break;
                    }
                    break;
            }
        }
    }

    function jumpToAnchor(e) {
        console.log(e.target.dataset.tip.split("<br />")[0].slice(6));
        if (e.target.dataset.tip !== undefined) {
            var siteName = e.target.dataset.tip.split("<br />")[0].slice(6);
            for (var i = 0; i < props.devices.length; i++) {
                if (siteName === props.devices[i].siteName) {
                    var accButton = document.getElementById("accordianButton" + (props.devices[i].queryID - 1)).firstChild;
                    if (accButton.className === "accordion-button collapsed") {
                        accButton.click();
                    }
                }
            }
        }
    }

    return (
        <Container>
            <ReactTooltip html={true} />
            <Table responsive bordered hover size="sm" key="distOverviewTable"
                style={{ overflow: "hidden" }}
            onClick={jumpToAnchor}
            >
                <thead>
                    <tr style={{
                        fontSize: "12px"
                    }} key="distOverviewHeader">
                        {props.devices.map(device => {
                            return <th
                                key={device.siteName + "distOverviewHeader"}
                            >
                                {device.siteName}
                            </th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map(row => (
                        <tr style={{
                            fontSize: "14px"
                        }} key={row.key + distributors.length}>

                            {Object.keys(distributors).map((distKey, index) => {
                                for (var i = 0; i < props.devices.length; i++) {
                                    if (parseInt(distKey) === props.devices[i].queryID) {
                                        return <td
                                            style={{
                                                backgroundColor: setCellColor(row.index, distributors[distKey][1][0], distributors[distKey][1][row.index]),
                                                cursor: "pointer"
                                            }}
                                            data-tip={"Site: " + props.devices[i].siteName.split("_").join(" ") +
                                                "<br />" + row.label + ": " + distributors[distKey][1][row.index]}
                                        >
                                        </td>
                                    }
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default DistributorOverview;