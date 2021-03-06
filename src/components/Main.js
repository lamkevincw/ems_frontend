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
    
    const navTabs = navNames.map(tab => (
        <NavTab
            name={tab}
            id={tab}
            key={tab}
            component={NAV_ITEMS[tab]}
            activeTab={activeTab}
        />
    ));

    return (
        <Container>
            <Navibar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <Tab.Content>
                
                
                {navTabs}
            </Tab.Content>
        </Container>
    );
}

export default Main;