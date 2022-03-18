import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import ReportingSite from "./ReportingSite";

const site_metadata = {
    "Kerrobert": {
        "quantifiers": ["Above_Ground", "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10",
            "Q11", "Q12", "Q13", "Q14", "Q15", "Q16", "Q17"],
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
    }
};
const sites = [
    {
        "version": "GroundPollutionSensor",
        "fileType": "up",
        "name": "Arrowwood"
    },
    {
        "version": "Quantifier",
        "fileType": "up",
        "name": "Annaheim"
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

var response = [];

function checkMissingQuantifiers(activeSites) {
    var missingSites = {};
    for (var i = 0; i < activeSites.length; i++) {
        var arr1 = activeSites[i].quantifiers;
        var arr2 = site_metadata[activeSites[i].siteName].quantifiers;
        if (arr1.length > arr2.length) {
            throw("UPDATE SITE_METADATA");
        }
        var diff = arr2.filter(x => arr1.indexOf(x) === -1);
        missingSites[activeSites[i].siteName] = diff;
    }
    // console.log(missingSites);

    return missingSites;
}

function Reporting(props) {
    const [siteElements, setSiteElements] = useState([]);
    const [missingQuantifiers, setMissingQuantifiers] = useState([]);

    async function callAPI() {
        response = [];
        setSiteElements([]);
        for (var i = 0; i < sites.length; i++) {
            await fetch("http://localhost:8000/reportAPI/?id=" + sites[i].name)
                .then((res) => {
                    if (!res.ok) throw new Error(res.status);
                    else return res.text();
                })
                .then((data) => {
                    response = response.concat(JSON.parse(data));
                    // setAPIResponse(response);
                    // console.log(response);
                    setSiteElements(response);
                    setMissingQuantifiers(checkMissingQuantifiers(response));
                    // console.log(activeQuantifiers);
                });
        }
    }

    // Runs the setup function once on load
    useEffect(() => {
        callAPI();
    }, []);

    return (
        <Container>
            {siteElements.map(element => (
                <ReportingSite
                    key={element.siteName + "ReportRow"}
                    siteName={element.siteName}
                    quantifiers={element.quantifiers}
                    missingQuantifiers={missingQuantifiers}
                    allQuantifiers={site_metadata[element.siteName].quantifiers}
                    report={element.report}
                />
            ))}
        </Container>
    );
}

export default Reporting;