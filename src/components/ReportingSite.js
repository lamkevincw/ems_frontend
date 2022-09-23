import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { GeoAltFill } from "react-bootstrap-icons";

const setText = (str) => str === null ? "No Data" : (str ? "" : "");

const formatTime = (time) => time === null ? "No Data" : (new Date(time)).toLocaleDateString("en-US", { timeZone: "America/Regina" }) + ", " + (new Date(time)).toLocaleTimeString("en-US", { timeZone: "America/Regina" });
const formatBattery = (voltage) => voltage === null ? "No Data" : voltage;

function ReportingSite(props) {
    const topHeaderNames = ["Name", "TCM", "Board 1", "Board 2", "Board 3"];
    const bottomHeaderNames = ["Reporting", "Battery Voltage", "Reporting", "Detector", "Light Source",
        "Reporting", "Detector", "Light Source", "Reporting", "Detector", "Light Source"];
    const bottomHeaders = bottomHeaderNames.map((name, index) => (
        <th key={index + "" + name}>{name}</th>
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
            case "tcmLastReported":
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
            case "board1Reporting":
            case "board2Reporting":
            case "board3Reporting":
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
            case "board1Detector":
            case "board1Light":
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
            case "board2Detector":
            case "board2Light":
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
            case "board3Detector":
            case "board3Light":
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
                fontWeight: "normal",
                verticalAlign: "middle"
            }} key={props.siteName + quantifier + "reportRow"}>
                <td
                    style={{ "color": "black", fontWeight: "bolder" }}
                >{quantifier}</td>
                <td id={props.siteName + quantifier + "tcmLastReported"}
                    style={{ backgroundColor: setCellColor(index, "tcmLastReported", props.report[index].tcm_last_reported, latestDate) }}>
                    {formatTime(props.report[index].tcm_last_reported)}</td>
                <td id={props.siteName + quantifier + "batteryVoltage"}
                    style={{ backgroundColor: setCellColor(index, "batteryVoltage", props.report[index].battery_voltage, latestDate) }}>
                    {formatBattery(props.report[index].battery_voltage)}</td>
                <td id={props.siteName + quantifier + "board1Reporting"}
                    style={{ backgroundColor: setCellColor(index, "board1Reporting", props.report[index].board_1_is_reporting, latestDate), fontSize: "10px" }}>
                    {formatTime(props.report[index].board_1_last_reported)}</td>
                <td id={props.siteName + quantifier + "board1Detector"}
                    style={{ backgroundColor: setCellColor(index, "board1Detector", props.report[index].board_1_all_zeros, latestDate) }}>
                    {setText(props.report[index].board_1_all_zeros)}</td>
                <td id={props.siteName + quantifier + "board1Light"}
                    style={{ backgroundColor: setCellColor(index, "board1Light", props.report[index].board_1_too_small, latestDate) }}>
                    {setText(props.report[index].board_1_too_small)}</td>
                <td id={props.siteName + quantifier + "board2Reporting"}
                    style={{ backgroundColor: setCellColor(index, "board2Reporting", props.report[index].board_2_is_reporting, latestDate), fontSize: "10px" }}>
                    {formatTime(props.report[index].board_2_last_reported)}</td>
                <td id={props.siteName + quantifier + "board2Detector"}
                    style={{ backgroundColor: setCellColor(index, "board2Detector", props.report[index].board_2_all_zeros, latestDate) }}>
                    {setText(props.report[index].board_2_all_zeros)}</td>
                <td id={props.siteName + quantifier + "board2Light"}
                    style={{ backgroundColor: setCellColor(index, "board2Light", props.report[index].board_2_too_small, latestDate) }}>
                    {setText(props.report[index].board_2_too_small)}</td>
                <td id={props.siteName + quantifier + "board3Reporting"}
                    style={{ backgroundColor: setCellColor(index, "board3Reporting", props.report[index].board_3_is_reporting, latestDate), fontSize: "10px" }}>
                    {formatTime(props.report[index].board_3_last_reported)}</td>
                <td id={props.siteName + quantifier + "board3Detector"}
                    style={{ backgroundColor: setCellColor(index, "board3Detector", props.report[index].board_3_all_zeros, latestDate) }}>
                    {setText(props.report[index].board_3_all_zeros)}</td>
                <td id={props.siteName + quantifier + "board3Light"}
                    style={{ backgroundColor: setCellColor(index, "board3Light", props.report[index].board_3_too_small, latestDate) }}>
                    {setText(props.report[index].board_3_too_small)}</td>
            </tr>
        });
        // console.log(cell);
        setCells(cell);
    }

    useEffect(() => {
        populateCells();
    }, []);

    useEffect(() => {
        // console.log(props)
    }, [props])

    return (
        <Row>
            <a className="anchor" id={props.siteName + "Anchor"} />
            <Col>
                <h3>
                    {props.fullName}
                    <a href={"https://www.google.com/maps/dir/?api=1&destination=760+West+Genesee+Street+Syracuse+NY+13204&layer=t"} target="_blank"><GeoAltFill className="ms-2 mb-1" color="#1e81b0" size={24} /></a>
                </h3>
            </Col>
            <Col className="align-self-end text-end">
                <a href="#topQuantifier">Top</a>
            </Col>
            <Table responsive bordered hover size="sm" key="reportingTable">
                <thead style={{ "fontSize": "12px", textAlign: "center", verticalAlign: "middle" }} key="rHeader">
                    <tr key="reportingTopHeader">
                        <th rowSpan={2}>Name</th>
                        <th colSpan={2}>TCM</th>
                        <th colSpan={3}>Board 1</th>
                        <th colSpan={3}>Board 2</th>
                        <th colSpan={3}>Board 3</th>
                    </tr>
                    <tr key="reportingBottomHeader">
                        {bottomHeaders}
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