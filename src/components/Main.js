import { useState, useEffect } from "react";
import { Container, Tab, Row, Col, Nav } from "react-bootstrap"
import RecentChanges from "./RecentChanges";
import Timeseries from "./Timeseries";
import Map from "./Map";
import NavTab from "./NavTab";
import Navibar from "./Navibar";
import Reporting from "./Reporting";
import raw from "../files/data.json"

const NAV_ITEMS = {
    "timeseries": <Timeseries rawData={raw} />,
    "map": <Map />,
    "reporting": <Reporting rawData={raw} />,
    "recentChanges": <RecentChanges />,
};
const navNames = Object.keys(NAV_ITEMS);

function Main(props) {
    const [activeTab, setActiveTab] = useState("timeseries");
    const [apiResponse, setAPIResponse] = useState("");
    const navTabs = navNames.map(tab => (
        <NavTab
            name={tab}
            id={tab}
            key={tab}
            component={NAV_ITEMS[tab]}
            activeTab={activeTab}
        />
    ));

    async function callAPI() {
        await fetch("http://localhost:8000/reportAPI")
            .then((res) => {
                if (!res.ok) throw new Error(res.status);
                else return res.json();
            })
            .then((data) => {
                setAPIResponse(data);
                console.log("DATA STORED");
            });
        // .then(res => res.json())
        // .then(res => setAPIResponse(res));
    }

    // useEffect(() => {
    //     callAPI();
    // })

    return (
        <Container>
            <Navibar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <Tab.Content>
                <p className="App-intro">;{JSON.stringify(apiResponse)}</p>
                <button onClick={callAPI}>Get JSON</button>
                {navTabs}
            </Tab.Content>
        </Container>
    );
}

export default Main;