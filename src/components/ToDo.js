import { Table } from "react-bootstrap"
import todos from "../files/toDo.json"

const statusColour = {
    "Complete": "#59a14f",
    "In-progress": "#edc949",
    "Not started": "#ff9da7"
};

function ToDo(props) {
    const cells = todos.map(cell => (
        <tr key={cell.todo}>
            <td>{cell.todo}</td>
            <td style={{ backgroundColor: statusColour[cell.status] }}>{cell.status}</td>
        </tr>
    ));

    return (
        <Table responsive striped bordered hover size="sm" key="todoTable">
            <thead key="tHeader">
                <tr key="todoTableHeader">
                    <th>To-Do Items</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {cells}
            </tbody>
        </Table>
    );
}

export default ToDo;