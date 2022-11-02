import { useEffect, useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import DistributorOverview from "./DistributorOverview";
import DistributorSite from "./DistributorSite";
import DistributorSiteNew from "./DistributorSiteNew";
import DistributorOverviewNew from "./DistributorOverviewNew";

import distData from "../files/device-1196-5-1-2022-08-10T11_01_02-0600-data.json";

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

const tempFullName = "Wandering River 2 Distributor 1";
const tempShortName = "WR2 D1";

function setupDistributors(dist) {
    var distributors = [];
    for (var i = 0; i < dist.length; i++) {
        for (var j = 0; j < dist[i].Number_of_distributers; j++) {
            distributors.push({
                "_id": dist[i]._id,
                "Name": dist[i].Name,
                "fullName": dist[i].fullName + (dist[i].Number_of_distributers > 1 ? " - " + (j + 1) : ""),
                "multiple": dist[i].Number_of_distributers > 1 ? true : false,
                "num": j
            });
        }
    }
    console.log(distributors)
    return distributors;
}

function Distributor(props) {
    const [siteData, setSiteData] = useState([]);
    const [distributors, setDistributors] = useState([]);

    const nullData = {
        datetime: (new Date(0)).getTime(),
        onOff: 0,
        cellSignal: 0,
        motorState: 0,
        motorSpeed: null,
        p0Pressure: null,
        p0Alarm: 1,
        p1Pressure: null,
        p1Alarm: 1,
        totalChemical: null,
        totalWater: null,
        doseMode: 0,
        doseRatio: null,
        doseManualSetPoint: null,
        doseAutoSetPoint: null,
        chemicalFlowrate: null,
        waterFlowrate: null,
        fanRunTime: null,
        ambientTemp: null
    };

    async function getSites() {
        await fetch("http://data-api.ems-inc.ca/sites/distributor",
            {
                method: 'GET',
                headers: props.headers
            })
            .then(response => response.json())
            .then(json => setDistributors(setupDistributors(json)));
    }

    async function getData() {
        var data = [];

        for (var i = 0; i < distributors.length; i++) {
            await fetch("http://data-api.ems-inc.ca/distributor/" + distributors[i].Name,
                {
                    method: 'GET',
                    headers: props.headers
                })
                .then(response => response.json())
                .then(json => { data.push(json[distributors[i].num]) })
                .then(new Promise(resolve => setTimeout(resolve, 500)));
        }
        // console.log(data)
        setSiteData(data);
    }

    function setupData() {
        var row = distData[0];
        setSiteData(
            {
                datetime: (new Date(row["Reading Date"])).getTime(),
                onOff: row["OnOff System State"],
                cellSignal: row["Cell Signal"],
                motorState: row["Motor State"],
                motorSpeed: row["Motor Speed"],
                p0Pressure: row["P0 Pressure"],
                p0Alarm: row["Alarm Low P0 Pressure"],
                p1Pressure: row["P1 Pressure"],
                p1Alarm: row["Alarm Low P1 Pressure"],
                totalChemical: row["Total Chemical"],
                totalWater: row["Total Water"],
                doseMode: row["Dose Auto Mode"],
                doseRatio: row["Dose Ratio"],
                doseManualSetPoint: row["Dose Manual Setpoint"],
                doseAutoSetPoint: row["Dose Auto Target Ratio Setpoint"],
                chemicalFlowrate: row["Chemical Flow"],
                waterFlowrate: row["Water Flowrate"],
                fanRunTime: row["Fan Run Time"],
                ambientTemp: row["Ambient Temperature"]
            }
        );
    }

    useEffect(() => {
        getData();
    }, [distributors]);

    // useEffect(() => {
    //     if (props.quantifierLoaded) {
    //         getSites();
    //     }
    // }, [props.quantifierLoaded]);
    useEffect(() => {
        if (props.token !== "" && props.quantifierLoaded) {
            getSites();
        }
    }, [props.quantifierLoaded]);

    useEffect(() => {
        console.log(siteData)
    }, [siteData]);

    // Runs the setup function once on load
    useEffect(() => {
        // getSites();
        // setupData();
    }, []);

    return (
        <Container>
            <a className="anchor" id="topDistributor" />
            <h2>Distributor Status</h2>
            {/* <Row className="mt-3">
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
            </Accordion> */}
            <Row className="mt-3">
                <DistributorOverviewNew
                    key={"DistributorOverview"}
                    data={siteData}
                    sites={distributors}
                    fullName={tempFullName}
                    nullData={nullData}
                />
            </Row>
            {distributors.map((d, index) => (
                <DistributorSiteNew
                    key={d.Name + d.num + "DistributorSiteRow"}
                    data={siteData[index] == null ? nullData : siteData[index]}
                    id={d.fullName}
                    fullName={d.fullName}
                />
            ))}
            {/* <DistributorSiteNew
                 data={siteData}
                 fullName={tempFullName}
            /> */}
        </Container>
    );
}

export default Distributor;