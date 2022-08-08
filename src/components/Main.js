import { useState, useEffect } from "react";
import { Container, Tab, Row, Col, Nav } from "react-bootstrap"
import RecentChanges from "./RecentChanges";
import Timeseries from "./Timeseries";
import Map from "./Map";
import NavTab from "./NavTab";
import Navibar from "./Navibar";
import Reporting from "./Reporting";
// import raw from "../files/data.json"
import ToDo from "./ToDo";
import Distributor from "./Distributor";
// import ColourTest from "./testing/ColourTest";

const NAV_ITEMS = {
    // "timeseries": <Timeseries rawData={raw} />,
    "map": <Map />,
    "reporting": <Reporting />,
    "distributor": <Distributor />,
    "recentChanges": <RecentChanges />,
    "toDo": <ToDo />,
    // "colourTest": <ColourTest />
};
const navNames = Object.keys(NAV_ITEMS);

function Main(props) {
    const [activeTab, setActiveTab] = useState("reporting");
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshTime, setRefreshTime] = useState((new Date()).toLocaleTimeString("en-US", { timeZone: "America/Regina" }));
    var refreshTimeout;

    const navTabs = navNames.map(tab => (
        <NavTab
            name={tab}
            id={tab}
            key={tab}
            component={NAV_ITEMS[tab]}
            activeTab={activeTab}
        />
    ));

    function refreshPage() {
        if (autoRefresh) {
            window.location.reload();
        }
    }

    useEffect(() => {
        let refreshTimeout = window.setTimeout(refreshPage, 600000); // interval is in milliseconds

        return () => {
            clearTimeout(refreshTimeout);
        };
    }, [autoRefresh]);

    useEffect(() => {
        if (localStorage.getItem("autoRefresh") == null) {
            localStorage.setItem("autoRefresh", "false");
        } else {
            setAutoRefresh(localStorage.getItem("autoRefresh") === "true");
        }
    }, []);

    return (
        <Container>
            <Navibar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                autoRefresh={autoRefresh}
                setAutoRefresh={setAutoRefresh}
                refreshTime={refreshTime}
            />
            <Tab.Content>
                {navTabs}
            </Tab.Content>
        </Container>
    );
}

export default Main;