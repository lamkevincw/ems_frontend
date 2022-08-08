import { Container, Nav, Navbar, Tab, NavDropdown, Form, FormControl, Button } from "react-bootstrap"

function Navibar(props) {
    
    function handleSelect(e) {
        props.setActiveTab(e);
        console.log(props.activeTab);
    }

    function handleToggle(e) {
        localStorage.setItem("autoRefresh", !props.autoRefresh + "");
        props.setAutoRefresh(!props.autoRefresh);
    }

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#">EMS Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Tab.Container id="nav-tabs" defaultActiveKey={props.activeTab}>
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                            onSelect={handleSelect}
                        >
                            {/* <Nav.Link eventKey="timeseries">Timeseries</Nav.Link> */}
                            <Nav.Link eventKey="map">Map</Nav.Link>
                            <Nav.Link eventKey="reporting">Quantifiers</Nav.Link>
                            <Nav.Link eventKey="distributor">Distributors</Nav.Link>
                            <Nav.Link eventKey="recentChanges">Recent Changes</Nav.Link>
                            <Nav.Link eventKey="toDo">To-do List</Nav.Link>
                            {/* <Nav.Link eventKey="colourTest">Colour Test</Nav.Link> */}
                            {/* <NavDropdown bg="dark" title="Link" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">
                                Something else here
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" disabled>
                            Link
                        </Nav.Link> */}
                        </Nav>
                    </Tab.Container>
                    <Form className="d-flex">
                        <Form.Label className="me-2 my-1" style={{ color: "white", fontSize: "13px" }}>Last Updated at {props.refreshTime}</Form.Label>
                        <Form.Check
                            type="switch"
                            id="autoRefreshSwitch"
                            label={<span style={{ color: "white" }}>Auto-Refresh</span>}
                            defaultChecked={localStorage.getItem("autoRefresh") === "true"}
                            onChange={handleToggle}
                        />
                        {/* <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button> */}
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navibar;