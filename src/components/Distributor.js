import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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
    }
];

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
        callAPI();
    }, []);

    return (
        <Container>
            <a className="anchor" id="topDistributor" />
            <h2>Distributor Status</h2>
            {Object.keys(distributors).map(distKey => {
                for (var i = 0; i < devices.length; i++) {
                    if (parseInt(distKey) === devices[i].queryID) {
                        return <DistributorSite
                            key={distKey + "DistributorRow"}
                            // activeDevices={devices}
                            data={distributors[distKey]}
                            siteName={devices[i].siteName}
                        />;
                    }
                }
            })}
        </Container>
    );
}

export default Distributor;