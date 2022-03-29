import { Container, Col } from "react-bootstrap"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

const COLORS = ["#59a14f", "#e15759"];


const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index
}) => {
    // console.log("handling label?");
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 0.75;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.2;

    return (
        <text
            x={x}
            y={y}
            fill="black"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {value}
        </text>
    );
}

function ReportSummary(props) {
    const numOfAllSensors = props.allQuantifiers.length * 3;
    const numOfAllErroring = numOfAllSensors * 2;
    var numOfReporting = 0;
    var numOfErroring = 0;

    for (var q = 0; q < props.quantifiers.length; q++) {
        var s1 = props.report[props.quantifiers[q]]["q_sensor1"];
        var s2 = props.report[props.quantifiers[q]]["q_sensor2"];
        var s3 = props.report[props.quantifiers[q]]["q_sensor3"];
        if (s1 !== "N/A" && s1) {
            numOfReporting++;
        }
        if (s2 !== "N/A" && s2) {
            numOfReporting++;
        }
        if (s3 !== "N/A" && s3) {
            numOfReporting++;
        }

        var s1Z = props.report[props.quantifiers[q]]["q_sensor1_0s"];
        var s2Z = props.report[props.quantifiers[q]]["q_sensor2_0s"];
        var s3Z = props.report[props.quantifiers[q]]["q_sensor3_0s"];
        var s1S = props.report[props.quantifiers[q]]["q_sensor1_too_small"];
        var s2S = props.report[props.quantifiers[q]]["q_sensor2_too_small"];
        var s3S = props.report[props.quantifiers[q]]["q_sensor3_too_small"];
        if (s1 === "N/A" || !s1) {
            numOfErroring = numOfErroring + 2;
        } else {
            if (s1Z) {
                numOfErroring++;
            }
            if (s1S) {
                numOfErroring++;
            }
        }
        if (s2 === "N/A" || !s2) {
            numOfErroring = numOfErroring + 2;
        } else {
            if (s2Z) {
                numOfErroring++;
            }
            if (s2S) {
                numOfErroring++;
            }
        }
        if (s3 === "N/A" || !s3) {
            numOfErroring = numOfErroring + 2;
        } else {
            if (s3Z) {
                numOfErroring++;
            }
            if (s3S) {
                numOfErroring++;
            }
        }
    }
    console.log(props.missingQuantifiers);
    numOfErroring = numOfErroring + (props.missingQuantifiers[props.siteName].length * 6);

    var reportingPieData = [
        { name: "Online Quantifiers", value: numOfReporting },
        { name: "Offline Quantifiers", value: numOfAllSensors - numOfReporting }
    ]
    var reportingPieData2 = [
        { name: "Functioning Sensors", value: numOfAllErroring - numOfErroring },
        { name: "Erroring Sensors", value: numOfErroring }
    ]

    return (
        <Container>
            

        </Container>
    );
}

export default ReportSummary;