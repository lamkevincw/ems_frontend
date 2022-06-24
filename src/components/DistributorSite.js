import { useEffect, useState } from "react";
import { Accordion, Container, Row, Table } from "react-bootstrap";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";

function DistributorSite(props) {
    const headerNames = ["Reading Date", "ChemTotal (L)", "Flow (L/min)", "P1 (psi)", "P2 (psi)", "Temp (C)",
        "Voltage (V)", "Alarm Status"];
    const headers = headerNames.map(name => (
        <th key={name}>{name}</th>
    ));

    const [cells, setCells] = useState();

    function setCellColor(rowIndex, colIndex, date, cellValue) {
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

        if (rowIndex === 0) {
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
        // }
    }

    function populateCells() {
        if (props.data === undefined) {
            return;
        }
        // console.log(props.siteName);
        var distData = props.data.slice(1);
        var cell = [];
        var cell = distData.map((row, index) => {
            return <tr style={{
                fontSize: "14px",
                // fontWeight: "bold"
            }}
            id={props.siteName + index + "distRow"}
            key={props.siteName + index + "distRow"}>
                {row.map((col, coldex) => (
                    <td style={{ backgroundColor: setCellColor(index, coldex, row[0], col) }}>{col}</td>
                ))}
            </tr>
        });
        // console.log(cell);
        setCells(cell);
    }

    async function scrollToAnchor(e) {
        if (e.target.textContent !== undefined) {
            await new Promise(r => setTimeout(r, 500));
            var anchor = document.getElementById(e.target.textContent + "Distributor");
            anchor.scrollIntoView();
        }
        // console.log(e.target.textContent);
    }

    useEffect(() => {
        populateCells();
    }, []);
    
    return (
        <Accordion.Item eventKey={props.accordianIndex}>
            <a className="anchor" id={props.siteName + "Distributor"} />
            <Accordion.Header id={"accordianButton" + props.accordianIndex} onClick={scrollToAnchor}>{props.siteName}</Accordion.Header>
            {/* <Col className="align-self-end text-end">
                <a href="#topDistributor">Top</a>
            </Col> */}
            <Accordion.Body>
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
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default DistributorSite;