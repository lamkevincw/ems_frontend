import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";

function DistributorSite(props) {
    const headerNames = ["Reading Date", "ChemTotal (L)", "Flow (L/min)", "P1 (psi)", "P2 (psi)", "Temp (C)",
        "Voltage (V)", "Alarm Status"];
    const headers = headerNames.map(name => (
        <th key={name}>{name}</th>
    ));

    const [cells, setCells] = useState();

    function populateCells() {
        if (props.data === undefined) {
            return;
        }
        console.log(props.data);
        var distData = props.data.slice(1);
        var cell = [];
        var cell = distData.map((row, index) => {
            return <tr style={{
                fontSize: "14px",
                // fontWeight: "bold"
            }} key={props.siteName + index + "distRow"}>
                {row.map(col => (
                    <td>{col}</td>
                ))}
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
            <a className="anchor" id={props.siteName + "Distributor"} />
            <Col>
                <h3>{props.siteName}</h3>
            </Col>
            <Col className="align-self-end text-end">
                <a href="#topDistributor">Top</a>
            </Col>
            <Table responsive bordered hover size="sm" key="distributorTable">
                <thead style={{ "fontSize": "12px" }} key="rHeader">
                    <tr key="distributorHeader">
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

export default DistributorSite;