import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReportingSite from "./ReportingSite";
import ReportOverview from "./ReportOverview";
import ReportSummaryPie from "./ReportSummaryPie";

const site_metadata = {
    "Kerrobert": {
        "quantifiers": ["Above_Ground", "Q01", "Q03", "Q06", "Q07", "Q08", "Q10",
            "Q11", "Q12", "Q13", "Q14", "Q15", "Q17"],
        "voltage_threshold": 10,
        // "raw_data_path": os.path.join("..", "Kerrobert", "data",
        //     "Kerrobert_raw_{}_{}.csv".format(current_time.year,
        //         months[current_time.month - 1]))
    },
    "Hoosier": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10",
            "Q11", "Q12", "Q13", "Q14"],
        "voltage_threshold": 10
    },
    "WR2": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10",
            "Q11", "Q12", "Q13", "Q14"],
        "voltage_threshold": 10
    },
    "Annaheim": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05"],
        "voltage_threshold": 10
    },
    "Stony_Plains": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05"],
        "voltage_threshold": 8.1
    },
    "Meadow_Lake": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08"],
        "voltage_threshold": 8.1
    },
    "Gull_Lake": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07"],
        "voltage_threshold": 8.1
    },
    "Arrowwood": {
        "quantifiers": ["AR01", "AR02", "AR03", "AR04", "AR05"],
        "voltage_threshold": 8.1
    },
    "exsitu_NSZD_Kerrobert_v2": {
        "quantifiers": ["Q08"],
        "voltage_threshold": 10
    },
    "Drumheller": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05"],
        "voltage_threshold": 9
    },
    "Cremona": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04", "Q05"],
        "voltage_threshold": 9
    }
};
const sites = [
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Annaheim"
    },
    {
        "version": "GroundPollutionSensor",
        "fileType": "up",
        "name": "Arrowwood"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Cremona"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Drumheller"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Gull_Lake"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Hoosier"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Kerrobert"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Meadow_Lake"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Stony_Plains"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "WR2"
    },
    {
        "version": "Quantifier-3_0",
        "fileType": "up",
        "name": "exsitu_NSZD_Kerrobert_v2"
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

function checkMissingQuantifiers(activeSites) {
    var missingSites = {};
    for (var i = 0; i < activeSites.length; i++) {
        var arr1 = activeSites[i].quantifiers;
        var arr2 = site_metadata[activeSites[i].siteName].quantifiers;
        if (arr1.length > arr2.length) {
            throw ("UPDATE SITE_METADATA");
        }
        var diff = arr2.filter(x => arr1.indexOf(x) === -1);
        missingSites[activeSites[i].siteName] = diff;
    }
    // console.log(missingSites);

    return missingSites;
}

function fillMissingQuantifierRows(site) {
    var fullReport = site.report;
    var arr1 = site.quantifiers;
    var arr2 = site_metadata[site.siteName].quantifiers;
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
    return fullReport;
}

function Reporting(props) {
    const [siteElements, setSiteElements] = useState([]);
    const [missingQuantifiers, setMissingQuantifiers] = useState([]);
    let server = "http://ec2-3-98-120-217.ca-central-1.compute.amazonaws.com:8000";
    let devServer = "http://localhost:8000";

    async function callAPI() {
        response = [];
        setSiteElements([]);
        for (var i = 0; i < sites.length; i++) {
            await fetch(server + "/reportAPI/?id=" + sites[i].name)
                .then((res) => {
                    if (!res.ok) throw new Error(res.status);
                    else return res.text();
                })
                .then((data) => {
                    response = response.concat(JSON.parse(data));
                    // setAPIResponse(response);
                    console.log(response);
                    setMissingQuantifiers(checkMissingQuantifiers(response));
                    // fillMissingQuantifierRows(response);
                    setSiteElements(response);
                    // console.log(activeQuantifiers);
                });
        }
    }

    const scrollTo = (ref) => {
        if (ref && ref.current /* + other conditions */) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    // Runs the setup function once on load
    useEffect(() => {
        callAPI();
    }, []);

    return (
        <Container>
            <a className="anchor" id="topQuantifier" />
            <h2>Quantifier Status</h2>
            <Row>
                {siteElements.map(element => (
                    <ReportSummaryPie
                        key={element.siteName + "Pie"}
                        siteName={element.siteName}
                        quantifiers={element.quantifiers}
                        missingQuantifiers={missingQuantifiers}
                        allQuantifiers={site_metadata[element.siteName].quantifiers}
                        report={element.report}
                    />
                ))}
            </Row>
            <Row className="mt-3">
                <ReportOverview
                    key={siteElements.length + "OverviewUpdate"}
                    allSiteElements={siteElements}
                    allQuantifiers={siteElements.map(element => (site_metadata[element.siteName].quantifiers))}
                    voltageThreshold={siteElements.map(element => (site_metadata[element.siteName].voltage_threshold))}
                    fullReport={siteElements.map(element => (fillMissingQuantifierRows(element)))}
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
            {siteElements.map(element => (
                <ReportingSite
                    key={element.siteName + "ReportRow"}
                    siteName={element.siteName}
                    quantifiers={element.quantifiers}
                    missingQuantifiers={missingQuantifiers}
                    allQuantifiers={site_metadata[element.siteName].quantifiers}
                    voltageThreshold={site_metadata[element.siteName].voltage_threshold}
                    report={element.report}
                    fullReport={fillMissingQuantifierRows(element)}
                />
            ))}

        </Container>
    );
}

export default Reporting;