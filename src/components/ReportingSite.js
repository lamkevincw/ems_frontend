import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";

const setText = (str) => str === null ? "No Data" : (str ? "T": "F");

const formatTime = (time) => time === null ? "No Data" : (new Date(time)).toLocaleDateString("en-US", { timeZone: "America/Regina" }) + ", " + (new Date(time)).toLocaleTimeString("en-US", { timeZone: "America/Regina" });
const formatBattery = (voltage) => voltage === null ? "No Data" : voltage;

function ReportingSite(props) {
    const headerNames = ["Name", "Last Reported", "Battery Voltage", "Sensor1 Reporting", "Sensor2 Reporting", "Sensor3 Reporting",
        "Sensor1 All Zeroes", "Sensor2 All Zeroes", "Sensor3 All Zeroes", "Sensor1 Too Small", "Sensor2 Too Small", "Sensor3 Too Small"];
    const headers = headerNames.map(name => (
        <th key={name}>{name}</th>
    ));
    const [cells, setCells] = useState();

    function setCellColor(index, cellID, bool, date) {
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

        if (bool === null) {
            return colours[2];
        }
        var hoursSinceUpdate = Math.abs(date - (new Date().getTime())) / (1000 * 60 * 60);
        // console.log(hoursSinceUpdate);
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
                else if (bool > props.voltageThreshold) {
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
                    if (props.report[index].battery_voltage <= 10 && colours[5] !== "") {
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
                } else if (props.report[index].voltage <= 10 && colours[5] !== "") {
                    return colours[5];
                }
                else if (props.report[index].board_1_is_reporting) {
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
                } else if (props.report[index].voltage <= 10 && colours[5] !== "") {
                    return colours[5];
                }
                else if (props.report[index].board_2_is_reporting) {
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
                } else if (props.report[index].voltage <= 10 && colours[5] !== "") {
                    return colours[5];
                }
                else if (props.report[index].board_3_is_reporting) {
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
    }

    function populateCells() {
        var cell = [];
        var cell = props.quantifiers.map((quantifier, index) => {
            var latestDate = props.report[index].tcm_last_reported;
            // console.log((new Date(latestDate)).getTime());
            return <tr style={{
                fontSize: "14px",
                fontWeight: "normal"
            }} key={props.siteName + quantifier + "reportRow"}>
                <td
                style={{ "color": "black", fontWeight: "bolder" }}
                >{quantifier}</td>
                <td id={props.siteName + quantifier + "lastReported"}
                    style={{ backgroundColor: setCellColor(index, "lastReported", props.report[index].tcm_last_reported, latestDate) }}>
                    {formatTime(props.report[index].tcm_last_reported)}</td>
                <td id={props.siteName + quantifier + "batteryVoltage"}
                    style={{ backgroundColor: setCellColor(index, "batteryVoltage", props.report[index].battery_voltage, latestDate) }}>
                    {formatBattery(props.report[index].battery_voltage)}</td>
                <td id={props.siteName + quantifier + "sensor1Reporting"}
                    style={{ backgroundColor: setCellColor(index, "sensor1Reporting", props.report[index].board_1_is_reporting, latestDate) }}>
                    {setText(props.report[index].board_1_is_reporting)}</td>
                <td id={props.siteName + quantifier + "sensor2Reporting"}
                    style={{ backgroundColor: setCellColor(index, "sensor2Reporting", props.report[index].board_2_is_reporting, latestDate) }}>
                    {setText(props.report[index].board_2_is_reporting)}</td>
                <td id={props.siteName + quantifier + "sensor3Reporting"}
                    style={{ backgroundColor: setCellColor(index, "sensor3Reporting", props.report[index].board_3_is_reporting, latestDate) }}>
                    {setText(props.report[index].board_3_is_reporting)}</td>
                <td id={props.siteName + quantifier + "sensor1Zero"}
                    style={{ backgroundColor: setCellColor(index, "sensor1Zero", props.report[index].board_1_all_zeros, latestDate) }}>
                    {setText(props.report[index].board_1_all_zeros)}</td>
                <td id={props.siteName + quantifier + "sensor2Zero"}
                    style={{ backgroundColor: setCellColor(index, "sensor2Zero", props.report[index].board_2_all_zeros, latestDate) }}>
                    {setText(props.report[index].board_2_all_zeros)}</td>
                <td id={props.siteName + quantifier + "sensor3Zero"}
                    style={{ backgroundColor: setCellColor(index, "sensor3Zero", props.report[index].board_3_all_zeros, latestDate) }}>
                    {setText(props.report[index].board_3_all_zeros)}</td>
                <td id={props.siteName + quantifier + "sensor1Small"}
                    style={{ backgroundColor: setCellColor(index, "sensor1Small", props.report[index].board_1_too_small, latestDate) }}>
                    {setText(props.report[index].board_1_too_small)}</td>
                <td id={props.siteName + quantifier + "sensor2Small"}
                    style={{ backgroundColor: setCellColor(index, "sensor2Small", props.report[index].board_2_too_small, latestDate) }}>
                    {setText(props.report[index].board_2_too_small)}</td>
                <td id={props.siteName + quantifier + "sensor3Small"}
                    style={{ backgroundColor: setCellColor(index, "sensor3Small", props.report[index].board_3_too_small, latestDate) }}>
                    {setText(props.report[index].board_3_too_small)}</td>
            </tr>
        });
        // console.log(cell);
        setCells(cell);
    }

    useEffect(() => {
        populateCells();
    }, []);

    return (
        <Row>
            <a className="anchor" id={props.siteName + "Anchor"} />
            <Col>
                <h3>{props.siteName.split("_").join(" ")}</h3>
            </Col>
            <Col className="align-self-end text-end">
                <a href="#topQuantifier">Top</a>
            </Col>
            <Table responsive bordered hover size="sm" key="reportingTable">
                <thead style={{ "fontSize": "12px" }} key="rHeader">
                    <tr key="reportingHeader">
                        {headers}
                    </tr>
                </thead>
                <tbody className="text-center text-capitalize" style={{ "fontSize": "12px", "color": "white" }}>
                    {cells}
                </tbody>
            </Table>
        </Row>
    );
}

export default ReportingSite;