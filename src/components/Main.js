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
import LoginModal from "./LoginModal/LoginModal";

function Main(props) {
    const [activeTab, setActiveTab] = useState("reporting");
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshTime, setRefreshTime] = useState((new Date()).toLocaleTimeString("en-US", { timeZone: "America/Regina" }));
    const [quantifierLoaded, setQuantifierLoaded] = useState(false);
    var refreshTimeout;

    const [loginActive, setLoginActive] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [token, setToken] = useState("");
    const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PATCH,OPTIONS'
    }

    const NAV_ITEMS = {
        // "timeseries": <Timeseries rawData={raw} />,
        // "map": <Map />,
        "reporting": <Reporting setLoaded={setQuantifierLoaded} token={token}
            headers={headers} />,
        "distributor": <Distributor quantifierLoaded={quantifierLoaded} token={token}
            headers={headers} />,
        "recentChanges": <RecentChanges />,
        "toDo": <ToDo />,
        // "colourTest": <ColourTest />
    };
    const navNames = Object.keys(NAV_ITEMS);

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
        if (token !== "") {
            localStorage.setItem("apiToken", token);
        }
    }, [token]);

    useEffect(() => {
        if (localStorage.getItem("autoRefresh") == null) {
            localStorage.setItem("autoRefresh", "false");
        } else {
            setAutoRefresh(localStorage.getItem("autoRefresh") === "true");
        }
        if (localStorage.getItem("apiToken") == null) {
            setLoginActive(true);
        } else {
            setLoginActive(false);
            setToken(localStorage.getItem("apiToken"));
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
            <LoginModal
                active={loginActive}
                setActive={setLoginActive}
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
                setToken={setToken}
            />
        </Container>
    );
}

export default Main;