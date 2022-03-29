import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";

function ReportingSite(props) {
    const headerNames = ["Name", "Last Reported", "Battery Voltage", "Sensor1 Reporting", "Sensor2 Reporting", "Sensor3 Reporting",
        "Sensor1 All Zeroes", "Sensor2 All Zeroes", "Sensor3 All Zeroes", "Sensor1 Too Small", "Sensor2 Too Small", "Sensor3 Too Small"];
    const headers = headerNames.map(name => (
        <th key={name}>{name}</th>
    ));
    const [cells, setCells] = useState();
    // var fullReport = props.report;

    function setCellColor(quantifier, cellID, bool) {
        const allIDs = ["lastReport", "batteryVoltage", "sensor1Reporting", "sensor2Reporting", "sensor3Reporting",
            "sensor1Zero", "sensor2Zero", "sensor3Zero", "sensor1Small", "sensor2Small", "sensor3Small"];

        if (bool === "N/A") {
            return "#e15759"; // Red
        } else if (((cellID === "sensor1Zero" || cellID === "sensor1Small")
            && !props.fullReport[quantifier].q_sensor1)
            || ((cellID === "sensor2Zero" || cellID === "sensor2Small")
                && !props.fullReport[quantifier].q_sensor2)
            || ((cellID === "sensor3Zero" || cellID === "sensor3Small")
                && !props.fullReport[quantifier].q_sensor3)) {
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



    function populateCells() {
        if (props.quantifiers === undefined) {
            return;
        }

        var cell = [];
        var cell = props.allQuantifiers.map(quantifier => {
            return <tr style={{
                fontSize: "14px",
                fontWeight: "bold"
            }} key={props.siteName + quantifier + "reportRow"}>
                <td>{quantifier}</td>
                <td id={props.siteName + quantifier + "lastReported"}
                    style={{ backgroundColor: setCellColor(quantifier, "lastReport", props.fullReport[quantifier].q_reporting) }}>
                    {props.fullReport[quantifier].q_last_reported}</td>
                <td id={props.siteName + quantifier + "batteryVoltage"}
                    style={{ backgroundColor: setCellColor(quantifier, "batteryVoltage", !props.fullReport[quantifier].q_voltage_low) }}>
                    {props.fullReport[quantifier].q_voltage}</td>
                <td id={props.siteName + quantifier + "sensor1Reporting"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor1Reporting", props.fullReport[quantifier].q_sensor1) }}>
                    {String(props.fullReport[quantifier].q_sensor1)}</td>
                <td id={props.siteName + quantifier + "sensor2Reporting"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor2Reporting", props.fullReport[quantifier].q_sensor2) }}>
                    {String(props.fullReport[quantifier].q_sensor2)}</td>
                <td id={props.siteName + quantifier + "sensor3Reporting"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor3Reporting", props.fullReport[quantifier].q_sensor3) }}>
                    {String(props.fullReport[quantifier].q_sensor3)}</td>
                <td id={props.siteName + quantifier + "sensor1Zero"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor1Zero", !props.fullReport[quantifier].q_sensor1_0s) }}>
                    {String(props.fullReport[quantifier].q_sensor1_0s)}</td>
                <td id={props.siteName + quantifier + "sensor2Zero"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor2Zero", !props.fullReport[quantifier].q_sensor2_0s) }}>
                    {String(props.fullReport[quantifier].q_sensor2_0s)}</td>
                <td id={props.siteName + quantifier + "sensor3Zero"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor3Zero", !props.fullReport[quantifier].q_sensor3_0s) }}>
                    {String(props.fullReport[quantifier].q_sensor3_0s)}</td>
                <td id={props.siteName + quantifier + "sensor1Small"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor1Small", !props.fullReport[quantifier].q_sensor1_too_small) }}>
                    {String(props.fullReport[quantifier].q_sensor1_too_small)}</td>
                <td id={props.siteName + quantifier + "sensor2Small"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor2Small", !props.fullReport[quantifier].q_sensor2_too_small) }}>
                    {String(props.fullReport[quantifier].q_sensor2_too_small)}</td>
                <td id={props.siteName + quantifier + "sensor3Small"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor3Small", !props.fullReport[quantifier].q_sensor3_too_small) }}>
                    {String(props.fullReport[quantifier].q_sensor3_too_small)}</td>
            </tr>
        });
        // console.log(cell);
        setCells(cell);
    }

    useEffect(() => {
        // fillMissingQuantifierRows();
        populateCells();
    }, []);

    return (
        <Row>
            <a className="anchor" id={props.siteName + "Anchor"} />
            <Col>
                <h3>{props.siteName}</h3>
            </Col>
            <Col className="align-self-end text-end">
                <a href="#top">Top</a>
            </Col>
            <Table responsive bordered hover size="sm" key="reportingTable">
                <thead style={{ "fontSize": "12px" }} key="rHeader">
                    <tr key="reportingHeader">
                        {headers}
                    </tr>
                </thead>
                <tbody style={{ "fontSize": "12px" }}>
                    {cells}
                </tbody>
            </Table>
        </Row>
    );
}

export default ReportingSite;