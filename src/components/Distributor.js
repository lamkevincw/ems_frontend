import { useEffect, useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import DistributorOverview from "./DistributorOverview";
import DistributorSite from "./DistributorSite";

const devices = [
    {
        "dID": "200039001851353338363036",
        "queryID": 1,
        "wcIdentifier": "UCS2",
        "serialNumber": "19092441B-2",
        "siteName": "Vonda"
    },
    {
        "dID": "430050001951343334363036",
        "queryID": 2,
        "wcIdentifier": "UCS3",
        "serialNumber": "19092441B-12",
        "siteName": "Big River"
    },
    {
        "dID": "510030001951343334363036",
        "queryID": 3,
        "wcIdentifier": "UCS4",
        "serialNumber": "19092441B-3",
        "siteName": "Dubuc"
    },
    {
        "dID": "32005b001851353338363036",
        "queryID": 4,
        "wcIdentifier": "UCS5",
        "serialNumber": "",
        "siteName": "Colonsay"
    },
    {
        "dID": "1953de26f2c04a5d920d7007",
        "queryID": 8,
        "wcIdentifier": "UCS9",
        "serialNumber": "19092441B-7",
        "siteName": "Annaheim"
    },
    {
        "dID": "2647a5043d8443eab7361c83",
        "queryID": 9,
        "wcIdentifier": "UCS10",
        "serialNumber": "19092441B-8",
        "siteName": "33rd & Ave P"
    },
    {
        "dID": "58014e95abd84e1a9dfccb5b",
        "queryID": 10,
        "wcIdentifier": "UCS11",
        "serialNumber": "19092441B-9",
        "siteName": "Tisdale"
    },
    {
        "dID": "4c1aceefe90744488f711d0e",
        "queryID": 11,
        "wcIdentifier": "UCS12",
        "serialNumber": "",
        "siteName": "Drumheller"
    },
    {
        "dID": "d3bd1b92e6ae4e389cccfb9c",
        "queryID": 12,
        "wcIdentifier": "UCS13",
        "serialNumber": "19092441B-11",
        "siteName": "Naicam"
    }
];

const colours = {
    "false": "#e15759", // Red // False
    "true": "#59a14f", // Green // True
    "na": "#bab0ab", // Grey // N/A
    "small": "#e15759", // Red // Small/Zeroes
    "offline": "#e15759", // Red // Reporting is offline
    "lowVoltage": "", // Ignore // Low voltage
    "offWeek": "#edc949", // Yellow // Reporting offline within 1 week
    "offMonth": "#e15759", // Red // Reporting offline within 1 month
    "offLong": "#666666", // Dark grey // Reporting offline over 1 month
};

var response = [];

function Distributor(props) {
    const [distributors, setDistributors] = useState({});
    let server = "http://ec2-3-98-120-217.ca-central-1.compute.amazonaws.com:8000";
    let devServer = "http://localhost:8000";

    async function callAPI() {
        response = [];
        setDistributors({});
        await fetch(server + "/distributorAPI/")
            .then((res) => {
                if (!res.ok) throw new Error(res.status);
                else return res.text();
            })
            .then((data) => {
                // response = response.concat(JSON.parse(data));
                response = JSON.parse(data);
                // console.log(response);
                setDistributors(response);
                // console.log(distributors);
            });
    }

    // Runs the setup function once on load
    useEffect(() => {
        // callAPI();
    }, []);

    return (
        <Container>
            <a className="anchor" id="topDistributor" />
            <h2>Distributor Status</h2>
            <Row className="mt-3">
                <DistributorOverview
                    key={[...Object.keys(distributors)] + "DistributorOverview"}
                    data={distributors}
                    devices={devices}
                />
            </Row>
            <Row className="" style={{ fontSize:"12px" }}>
                <Col>
                    <div style={{ height: "15px", width: "15px", backgroundColor: colours.true }} className="me-2 d-inline-block align-top" />
                    <p className="d-inline-block" >Working as Intended</p>
                </Col>
                <Col>
                    <div style={{ height: "15px", width: "15px", backgroundColor: colours.offWeek }} className="me-2 d-inline-block align-top" />
                    <p className="d-inline-block" >No Reports within 1 Week</p>
                </Col>
                <Col>
                    <div style={{ height: "15px", width: "15px", backgroundColor: colours.false }} className="me-2 d-inline-block align-top" />
                    <p className="d-inline-block" >Not Working<br />No Reports within 1 Month</p>
                </Col>
                <Col>
                    <div style={{ height: "15px", width: "15px", backgroundColor: colours.offLong }} className="me-2 d-inline-block align-top" />
                    <p className="d-inline-block" >No Reports for over 1 Month</p>
                </Col>
                <Col>
                    <div style={{ height: "15px", width: "15px", backgroundColor: colours.na }} className="me-2 d-inline-block align-top" />
                    <p className="d-inline-block" >No Data for Quantifier</p>
                </Col>
            </Row>
            <Accordion>
                {Object.keys(distributors).map((distKey, index) => {
                    for (var i = 0; i < devices.length; i++) {
                        if (parseInt(distKey) === devices[i].queryID) {
                            return <DistributorSite
                                key={distKey + "DistributorRow"}
                                data={distributors[distKey]}
                                siteName={devices[i].siteName}
                                accordianIndex={index}
                            />;
                        }
                    }
                })}
            </Accordion>
        </Container>
    );
}

export default Distributor;