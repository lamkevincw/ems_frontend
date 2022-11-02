import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

const debug_testing = true;

function LoginModal(props) {
    const [show, setShow] = useState(false);
    const [failedAttempt, setFailedAttempt] = useState(false);
    const [credentials, setCredentials] = useState("");
    const [loginProps, setLoginProps] = useState({});

    const handleClose = () => props.autheticated ? props.setActive(false) : null;

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData.entries());
        // console.log(formProps);

        let login = formProps;
        login["debug_testing"] = debug_testing;
        setLoginProps(login);
        setCredentials(btoa(formProps.username + ":" + formProps.password));
    }

    function checkResponse(ok) {
        if (ok) {
            setFailedAttempt(false);
            props.setAuthenticated(true);
            props.setActive(false);
            props.setCredentials(credentials);
        } else {
            setFailedAttempt(true);
        }
    }

    function checkJSONResponse(json) {
        if (json.message === "Success") {
            setFailedAttempt(false);
            props.setAuthenticated(true);
            props.setActive(false);
            props.setToken(json.token);
        } else {
            setFailedAttempt(true);
        }
    }

    async function attemptLogin() {
        const headers = {
            // 'Authorization': 'Basic ' + credentials,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
        }

        await fetch("https://data-api.ems-inc.ca/login/",
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(loginProps)
            })
            .then(response => response.json())
            .then(json => checkJSONResponse(json))
            // .then(ok => checkResponse(ok));
    }

    useEffect(() => {
        setShow(props.active);
    }, [props.active]);

    useEffect(() => {
        if (credentials !== "") {
            attemptLogin();
        }
    }, [credentials]);

    return (
        <Modal show={show} backdrop="static" onHide={handleClose} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="loginForm" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="loginForm.Username">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="name@example.com"
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginForm.Password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {failedAttempt ?
                    <Form.Label
                        className="me-2"
                        style={{ color: "red" }}
                    >
                        Wrong username/password. Please try again.
                    </Form.Label> : null}
                <Button variant="primary" type="submit" form="loginForm">
                    Login
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginModal;