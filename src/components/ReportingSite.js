import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
// import "../styles/App.css";

function ReportingSite(props) {
    const headerNames = ["Name", "Last Reported", "Battery Voltage", "Sensor1 Reporting", "Sensor2 Reporting", "Sensor3 Reporting",
        "Sensor1 All Zeroes", "Sensor2 All Zeroes", "Sensor3 All Zeroes", "Sensor1 Too Small", "Sensor2 Too Small", "Sensor3 Too Small"];
    const headers = headerNames.map(name => (
        <th key={name}>{name}</th>
    ));
    const trueIsGreen = (bool) => {
        return bool === "N/A" ? "red" : bool ? "lightgreen" : "red";
    };
    const [cells, setCells] = useState();
    var fullReport = props.report;

    function setCellColor(quantifier, cellID, bool) {
        if (bool === "N/A") {
            return "red";
        } else if (((cellID === "sensor1Zero" || cellID === "sensor1Small")
                && !fullReport[quantifier].q_sensor1)
            || ((cellID === "sensor2Zero" || cellID === "sensor2Small")
                && !fullReport[quantifier].q_sensor2)
            || ((cellID === "sensor3Zero" || cellID === "sensor3Small")
                && !fullReport[quantifier].q_sensor3)) {
            // console.log("true");
            return "lightcoral";
        }
        // || cellID === "sensor2Zero" || cellID === "sensor2Small"
        // || cellID === "sensor3Zero" || cellID === "sensor3Small")
        // if (fullReport[quantifier])
        else if (bool) {
            return "lightgreen";
        } else {
            return "red";
        }
    }

    function fillMissingQuantifierRows() {
        var arr1 = props.quantifiers;
        var arr2 = props.allQuantifiers;
        if (arr1.length > arr2.length) {
            throw ("UPDATE SITE_METADATA");
        }
        var diff = arr2.filter(x => arr1.indexOf(x) === -1);
        // console.log(diff);
        for (var i = 0; i < diff.length; i++) {
            fullReport[diff[i]] = {
                "q_reporting": false,
                "q_last_reported": "N/A",
                "q_voltage": "N/A",
                "q_voltage_low": true,
                "q_sensor1": "N/A",
                "q_sensor2": "N/A",
                "q_sensor3": "N/A",
                "q_sensor1_0s": "N/A",
                "q_sensor2_0s": "N/A",
                "q_sensor3_0s": "N/A",
                "q_sensor1_too_small": "N/A",
                "q_sensor2_too_small": "N/A",
                "q_sensor3_too_small": "N/A",
            };
        }
        // console.log(fullReport);
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
                    style={{ backgroundColor: setCellColor(quantifier, "lastReport", fullReport[quantifier].q_reporting) }}>
                    {fullReport[quantifier].q_last_reported}</td>
                <td id={props.siteName + quantifier + "batteryVoltage"}
                    style={{ backgroundColor: setCellColor(quantifier, "batteryVoltage", !fullReport[quantifier].q_voltage_low) }}>
                    {fullReport[quantifier].q_voltage}</td>
                <td id={props.siteName + quantifier + "sensor1Reporting"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor1Reporting", fullReport[quantifier].q_sensor1) }}>
                    {String(fullReport[quantifier].q_sensor1)}</td>
                <td id={props.siteName + quantifier + "sensor2Reporting"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor2Reporting", fullReport[quantifier].q_sensor2) }}>
                    {String(fullReport[quantifier].q_sensor2)}</td>
                <td id={props.siteName + quantifier + "sensor3Reporting"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor3Reporting", fullReport[quantifier].q_sensor3) }}>
                    {String(fullReport[quantifier].q_sensor3)}</td>
                <td id={props.siteName + quantifier + "sensor1Zero"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor1Zero", !fullReport[quantifier].q_sensor1_0s) }}>
                    {String(fullReport[quantifier].q_sensor1_0s)}</td>
                <td id={props.siteName + quantifier + "sensor2Zero"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor2Zero", !fullReport[quantifier].q_sensor2_0s) }}>
                    {String(fullReport[quantifier].q_sensor2_0s)}</td>
                <td id={props.siteName + quantifier + "sensor3Zero"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor3Zero", !fullReport[quantifier].q_sensor3_0s) }}>
                    {String(fullReport[quantifier].q_sensor3_0s)}</td>
                <td id={props.siteName + quantifier + "sensor1Small"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor1Small", !fullReport[quantifier].q_sensor1_too_small) }}>
                    {String(fullReport[quantifier].q_sensor1_too_small)}</td>
                <td id={props.siteName + quantifier + "sensor2Small"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor2Small", !fullReport[quantifier].q_sensor2_too_small) }}>
                    {String(fullReport[quantifier].q_sensor2_too_small)}</td>
                <td id={props.siteName + quantifier + "sensor3Small"}
                    style={{ backgroundColor: setCellColor(quantifier, "sensor3Small", !fullReport[quantifier].q_sensor3_too_small) }}>
                    {String(fullReport[quantifier].q_sensor3_too_small)}</td>
            </tr>
        });
        // console.log(cell);
        setCells(cell);
    }

    function setWarningCells() {
        // If a sensor is not reporting, all cells related to that sensor are set
        for (var i = 0; i < props.quantifiers.length; i++) {
            for (var j = 0; j < 3; j++) {
                // console.log(props.report[props.quantifiers[i]]["q_sensor" + (1)]);
                if (!props.report[props.quantifiers[i]]["q_sensor" + (j + 1)]) {
                    var ele = document.getElementById(props.siteName + props.quantifiers[i] + "sensor" + (j + 1) + "Zero");
                    ele.className = "report-warning";
                }
            }
        }
    }

    useEffect(() => {
        fillMissingQuantifierRows();
        populateCells();//.then((value) => {
        // setWarningCells();
        // });

        // console.log(props.siteName);
    }, []);

    return (
        <Container>
            <h3>{props.siteName}</h3>
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
        </Container>
    );
}

export default ReportingSite;