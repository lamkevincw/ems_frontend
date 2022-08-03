import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReportingSite from "./ReportingSite";
import ReportOverview from "./ReportOverview";
import ReportSummary from "./ReportSummary";

const site_metadata = {
    "Kerrobert": {
        "quantifiers": [
            // "Above_Ground", 
            "Q01", "Q03", "Q06", "Q07", "Q08", "Q10",
            "Q11", "Q12", "Q13", "Q14", "Q15", "Q17"],
        "voltage_threshold": 10
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
    },
    "P_33rd": {
        "quantifiers": ["Q01", "Q02", "Q03", "Q04"],
        "voltage_threshold": 9
    }
};
const sites = [
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Annaheim",
        "fullName": "Annaheim"
    },
    {
        "version": "GroundPollutionSensor",
        "fileType": "up",
        "name": "Arrowwood",
        "fullName": "Arrowwood"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Cremona",
        "fullName": "Cremona"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Drumheller",
        "fullName": "Drumheller"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Gull_Lake",
        "fullName": "Gull Lake"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Hoosier",
        "fullName": "Hoosier"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Kerrobert",
        "fullName": "Kerrobert"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Meadow_Lake",
        "fullName": "Meadow Lake"
    },
    {
        "version": "Quantifier-3_0",
        "fileType": "up",
        "name": "P_33rd",
        "fullName": "Avenue P & 33rd"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Stony_Plains",
        "fullName": "Stony Plain"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "WR2",
        "fullName": "Wandering River 2"
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

function formatSiteList(sites) {
    var siteList = [];
    for (var i = 0; i < sites.length; i++) {
        siteList.push({
            "name": sites[i].Name,
            "fullName": sites[i].Name
        });
    }
    siteList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    return siteList;
}

function formatSiteData(name, fullName, report) {
    return ({
        "siteName": name,
        "fullName": fullName,
        "quantifiers": report.map((q) => (q.quantifier)),
        "report": report
    });
}

function Reporting(props) {
    const [allSites, setAllSites] = useState([]);
    const [siteElements, setSiteElements] = useState([]);

    async function getData() {
        const timeRange = 30;
        var credentials = btoa("Frontend:&3r%V3R3rmWtpeBr");
        var headers = {
            'Authorization': 'Basic ' + credentials,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PATCH,OPTIONS'
        }
        var currentSiteList = allSites;

        await fetch("https://data-api.ems-inc.ca/sites/",
            {
                method: 'GET',
                headers: headers
            })
            .then(response => response.json())
            .then(json => setAllSites(formatSiteList(json)));
    }

    async function getSiteData() {
        var credentials = btoa("Frontend:&3r%V3R3rmWtpeBr");
        var headers = {
            'Authorization': 'Basic ' + credentials,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PATCH,OPTIONS'
        }

        for (var i = 0; i < allSites.length; i++) {
            await fetch("https://data-api.ems-inc.ca/internal-dashboard/" + allSites[i].name + "/35",
                {
                    method: 'GET',
                    headers: headers
                })
                .then(response => response.json())
                .then(json => setSiteElements(siteElements => [...siteElements, (formatSiteData(allSites[i].name, allSites[i].fullName, json))]));
        }
    }

    useEffect(() => {
        getSiteData();
    }, [allSites]);

    // Runs the setup function once on load
    useEffect(() => {
        getData();
    }, []);

    // useEffect(() => {
    //     console.log(siteElements)
    // }, [siteElements]);

    return (
        <Container>
            <a className="anchor" id="topQuantifier" />
            <h2>Quantifier Status</h2>
            <Row>
                {siteElements.map(element => (
                    <ReportSummary
                        key={element.siteName + "SummaryCharts"}
                        siteName={element.siteName}
                        fullName={element.fullName}
                        quantifiers={element.quantifiers}
                        report={element.report}
                    />
                ))}
            </Row>
            <Row className="mt-3">
                <ReportOverview
                    key={siteElements.length + "OverviewUpdate"}
                    allSiteElements={siteElements}
                    // allQuantifiers={siteElements.map(element => (site_metadata[element.siteName].quantifiers))}
                    voltageThreshold={siteElements.map(element => (site_metadata[element.siteName].voltage_threshold))}
                    report={siteElements.map(element => (element.report))}
                />
            </Row>
            <Row className="" style={{ fontSize: "12px" }}>
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
                    <p className="d-inline-block" >No Reports within 35 Days</p>
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
                    fullName={element.fullName}
                    quantifiers={element.quantifiers}
                    voltageThreshold={site_metadata[element.siteName].voltage_threshold}
                    report={element.report}
                />
            ))}
        </Container>
    );
}

export default Reporting;