import { useEffect, useState } from "react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { DashCircleFill, ExclamationCircleFill, ExclamationOctagonFill, ExclamationTriangleFill, Wifi, Wifi1, Wifi2, WifiOff } from "react-bootstrap-icons";

const onOffLabel = (value) => value == true ? "On" : "Off";
const autoManual = (value) => value == 0 ? "Manual" : "Auto";

function getWifiSymbol(onOff, cellSignal) {
    if (onOff == true) {
        switch (cellSignal) {
            case 0:
                return <WifiOff className="ms-2" color="#e15759" />;
            case 1:
                return <Wifi1 className="ms-2" color="#e15759" />;
            case 2:
            case 3:
                return <Wifi2 className="ms-2" color="#edc949" />;
            case 4:
            case 5:
                return <Wifi className="ms-2" color="#59a14f" />;
        }
    } else {
        return <WifiOff className="ms-2" color="#e15759" />;
    }
}

function getAlertSymbol(value) {
    if (value == true) {
        return <ExclamationCircleFill className="ms-2" color="#59a14f" size={24} />;
    } else {
        return <ExclamationOctagonFill className="ms-2" color="#e15759" size={24} />;
    }
}

function getTimeSymbol(datetime) {
    var hoursSinceUpdate = Math.abs(datetime - (new Date()).getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate < 24) {
        return <ExclamationCircleFill className="ms-2" color="#59a14f" size={24} />;
    } else if (hoursSinceUpdate < 168) {
        return <ExclamationTriangleFill className="ms-2" color="#edc949" size={24} />;
    } else if (hoursSinceUpdate < 730) {
        return <ExclamationOctagonFill className="ms-2" color="#e15759" size={24} />;
    } else {
        return <DashCircleFill className="ms-2" color="#bab0ab" size={24} />;
    }
}

function DistributorSiteNew(props) {
    const headerNames = ["On/Off", "Last Reported", "Cell Signal", "Motor State", "Motor Speed", "P0 Pressure", "P0 Alarm",
        "P1 Pressure", "P1 Alarm", "Total Chemical", "Total Water", "Dose Mode", "Dose Ratio", "Manual Setpoint", "Auto Setpoint",
        "Chemical Flowrate", "Water Flowrate", "Fan Run Time", "Ambient Temperature"];
    const headers = headerNames.map(name => (
        <th key={name}>{name}</th>
    ));
    const [cells, setCells] = useState();

    function populateCells() {
        setCells(
            <tr style={{
                fontSize: "14px",
                fontWeight: "normal"
            }} key={props.fullName + "reportDistRow"}>
                <td id={props.fullName + "onOff"}
                    style={{ "color": "black" }}>
                    {props.data.onOff}</td>
                <td id={props.fullName + "lastReported"}
                    style={{}}>
                    {props.data.datetime}</td>
                <td id={props.fullName + "signal"}
                    style={{}}>
                    {props.data.cellSignal}</td>
                <td id={props.fullName + "motorState"}
                    style={{}}>
                    {props.data.motorState}</td>
                <td id={props.fullName + "motorSpeed"}
                    style={{}}>
                    {props.data.motorSpeed}</td>
                <td id={props.fullName + "p0Pressure"}
                    style={{}}>
                    {props.data.p0Pressure}</td>
                <td id={props.fullName + "p0Alarm"}
                    style={{}}>
                    {props.data.p0Alarm}</td>
                <td id={props.fullName + "p1Pressure"}
                    style={{}}>
                    {props.data.p1Pressure}</td>
                <td id={props.fullName + "p1Alarm"}
                    style={{}}>
                    {props.data.p1Alarm}</td>
                <td id={props.fullName + "totalChem"}
                    style={{}}>
                    {props.data.totalChemical}</td>
                <td id={props.fullName + "totalWater"}
                    style={{}}>
                    {props.data.totalWater}</td>
                <td id={props.fullName + "doseMode"}
                    style={{}}>
                    {props.data.doseMode}</td>
                <td id={props.fullName + "doseRatio"}
                    style={{}}>
                    {props.data.doseRatio}</td>
                <td id={props.fullName + "manualSetPoint"}
                    style={{}}>
                    {props.data.doseManualSetPoint}</td>
                <td id={props.fullName + "autoSetPoint"}
                    style={{}}>
                    {props.data.doseAutoSetPoint}</td>
                <td id={props.fullName + "chemFlow"}
                    style={{}}>
                    {props.data.chemicalFlowrate}</td>
                <td id={props.fullName + "WaterFlow"}
                    style={{}}>
                    {props.data.waterFlowrate}</td>
                <td id={props.fullName + "fanRunTime"}
                    style={{}}>
                    {props.data.fanRunTime}</td>
                <td id={props.fullName + "ambientTemp"}
                    style={{}}>
                    {props.data.ambientTemp}</td>
            </tr>
        );
    }

    useEffect(() => {
        // console.log(props.data)
        populateCells();
    }, [props.data]);

    useEffect(() => {

    }, []);

    return (
        <Row className="my-2">
            <a className="anchor" id={props.id + "DistributorAnchor"} />
            <Col className="col-8 d-flex align-items-center">
                <h3>
                    {props.fullName}
                    <Badge className="ms-2" bg={props.data.onOff == true ? "success" : "danger"}>{onOffLabel(props.data.onOff)}</Badge>
                    {getWifiSymbol(props.data.onOff, props.data.cellSignal)}
                </h3>
            </Col>

            <Col className="align-self-end text-end">
                <a href="#topDistributor">Top</a>
            </Col>
            {/* <Table responsive bordered hover size="sm" key="reportingTable">
                <thead style={{ "fontSize": "12px" }} key="rHeader">
                    <tr key="reportingHeader">
                        {headers}
                    </tr>
                </thead>
                <tbody className="text-center text-capitalize" style={{ "fontSize": "12px", "color": "black" }}>
                    {cells}
                </tbody>
            </Table> */}
            <Card>
                <Row className="mx-2 mt-3">
                    <h6>
                        Last Reported: {(new Date(props.data.datetime)).toLocaleDateString("en-US", { timeZone: "America/Regina" })
                            + ", " + (new Date(props.data.datetime)).toLocaleTimeString("en-US", { timeZone: "America/Regina" })}
                        {getTimeSymbol(props.data.datetime)}
                    </h6>
                </Row>
                <Row className="m-2">
                    <Col>
                        <Row>
                            <h5>Chemicals</h5>
                        </Row>
                        <Row>
                            <ListGroup horizontal>
                                <ListGroup.Item>Total</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.totalChemical * 100) / 100 + " L"}</ListGroup.Item>
                                <ListGroup.Item>Flow Rate</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.chemicalFlowrate * 100) / 100 + " L/min"}</ListGroup.Item>
                            </ListGroup>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <h5>Water</h5>
                        </Row>
                        <Row>
                            <ListGroup horizontal>
                                <ListGroup.Item>Total</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.totalWater * 100) / 100 + " L"}</ListGroup.Item>
                                <ListGroup.Item>Flow Rate</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.waterFlowrate * 100) / 100 + " L/min"}</ListGroup.Item>
                            </ListGroup>
                        </Row>
                    </Col>
                </Row>
                <Row className="m-2">
                    <Row>
                        <h5>Pump Motor</h5>
                    </Row>
                    <Row>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Motor Speed</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.motorSpeed * 1000) / 10 + "%"}</ListGroup.Item>
                            </ListGroup>
                            {getAlertSymbol(props.data.motorState)}
                        </Col>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>P0 Pressure</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.p0Pressure * 1000) / 1000 + " psi"}</ListGroup.Item>
                            </ListGroup>
                            {getAlertSymbol(!props.data.p0Alarm)}
                        </Col>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>P1 Pressure</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.p1Pressure * 1000) / 1000 + " psi"}</ListGroup.Item>
                            </ListGroup>
                            {getAlertSymbol(!props.data.p1Alarm)}
                        </Col>
                    </Row>
                </Row>
                <Row className="mx-2 mt-2">
                    <Row>
                        <h5>Dose Settings</h5>
                    </Row>
                    <Row>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Mode</ListGroup.Item>
                                <ListGroup.Item>{autoManual(props.data.doseMode)}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Ratio</ListGroup.Item>
                                <ListGroup.Item>{(props.data.doseRatio) + " L of Water/L of Chemical"}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Row>
                <Row className="mx-2">
                    <Row>
                        <h6 className="mt-1">Setpoints</h6>
                    </Row>
                    <Row>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Manual Setpoint</ListGroup.Item>
                                <ListGroup.Item>{(props.data.doseManualSetPoint) + " mL/min"}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Auto Ratio Setpoint</ListGroup.Item>
                                <ListGroup.Item>{(props.data.doseAutoSetPoint) + " L of Water/L of Chemical"}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Row>
                <Row className="m-2 mb-3">
                    <Row>
                        <h5>Miscellaneous</h5>
                    </Row>
                    <Row>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Ambient Temperature</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.ambientTemp * 10) / 10 + " °C"}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col className="ps-0 d-flex align-items-center">
                            <ListGroup horizontal>
                                <ListGroup.Item>Fan Run Time</ListGroup.Item>
                                <ListGroup.Item>{Math.round(props.data.fanRunTime * 100) / 100 + " min"}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Row>
            </Card>
        </Row>
    );
}

export default DistributorSiteNew;