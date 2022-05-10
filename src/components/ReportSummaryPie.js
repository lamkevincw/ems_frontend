import { Col } from "react-bootstrap"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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

function ReportSummaryPie(props) {
    const numOfQuantifiers = props.allQuantifiers.length;
    const numOfAllSensors = props.allQuantifiers.length * 3;
    const numOfAllErroring = numOfAllSensors * 2;
    var numOfAllGreen = 0;
    var numOfUpdated = 0;
    var numOfReportingSensors = 0;
    var numOfErroring = 0;

    for (var q = 0; q < props.quantifiers.length; q++) {
        var lastReported = (new Date(props.report[props.quantifiers[q]]["q_last_reported"])).getTime();
        var hoursSinceUpdate = Math.abs(lastReported - (new Date()).getTime()) / (1000 * 60 * 60);

        var s1 = props.report[props.quantifiers[q]]["q_sensor1"];
        var s2 = props.report[props.quantifiers[q]]["q_sensor2"];
        var s3 = props.report[props.quantifiers[q]]["q_sensor3"];
        var s1Z = props.report[props.quantifiers[q]]["q_sensor1_0s"];
        var s2Z = props.report[props.quantifiers[q]]["q_sensor2_0s"];
        var s3Z = props.report[props.quantifiers[q]]["q_sensor3_0s"];
        var s1S = props.report[props.quantifiers[q]]["q_sensor1_too_small"];
        var s2S = props.report[props.quantifiers[q]]["q_sensor2_too_small"];
        var s3S = props.report[props.quantifiers[q]]["q_sensor3_too_small"];

        if (hoursSinceUpdate < 24) {
            if (s1 !== "N/A" && s1 && !s1Z && !s1S &&
                s2 !== "N/A" && s2 && !s2Z && !s2S &&
                s3 !== "N/A" && s3 && !s3Z && !s3S) {
                numOfAllGreen++;
            }
            if (s1 !== "N/A" && s1 && !s1Z && !s1S) {
                numOfReportingSensors++;
            }
            if (s2 !== "N/A" && s2 && !s2Z && !s2S) {
                numOfReportingSensors++;
            }
            if (s3 !== "N/A" && s3 && !s3Z && !s3S) {
                numOfReportingSensors++;
            }
            numOfUpdated++
        }
    }
    // console.log(props.missingQuantifiers);
    // numOfErroring = numOfErroring + (props.missingQuantifiers[props.siteName].length * 6);

    // var reportingPieData = [
    //     { name: "Online Quantifiers", value: numOfReporting },
    //     { name: "Offline Quantifiers", value: numOfAllSensors - numOfReporting }
    // ]
    // var reportingPieData2 = [
    //     { name: "Functioning Sensors", value: numOfAllErroring - numOfErroring },
    //     { name: "Erroring Sensors", value: numOfErroring }
    // ]

    var chartData = [
        {
            name: "Quantifiers",
            Operational: numOfAllGreen / numOfQuantifiers * 100,
            Erroring: (numOfQuantifiers - numOfAllGreen) / numOfQuantifiers * 100
        },
        {
            name: "Up-to-Date",
            Operational: numOfUpdated / numOfQuantifiers * 100,
            Erroring: (numOfQuantifiers - numOfUpdated) / numOfQuantifiers * 100
        },
        {
            name: "Sensors",
            Operational: numOfReportingSensors / numOfAllSensors * 100,
            Erroring: (numOfAllSensors - numOfReportingSensors) / numOfAllSensors * 100
        }
    ];

    var tooltip;
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !tooltip) {
            return null;
        }
        for (var i = 0; i < payload.length; i++) {
            if (payload[i].dataKey === tooltip) {
                return (
                    <div className="quantifierTooltip">
                        {tooltipLabel(label, payload[i].name)}
                        <br />
                        {payload[i].value.toFixed(0) + "%"}
                    </div>
                );
            }
        }
        return null
    }

    function tooltipLabel(rowName, barName) {
        switch (rowName) {
            case "Quantifiers":
                if (barName === "Operational") {
                    return "Operational Quantifiers";
                } else {
                    return "Non-functional Quantifiers";
                }
                break;
            case "Up-to-Date":
                if (barName === "Operational") {
                    return "Up-to-Date Quantifiers";
                } else {
                    return "Non-reporting Quantifiers";
                }
                break;
            case "Sensors":
                if (barName === "Operational") {
                    return "Operational Sensors";
                } else {
                    return "Non-functional Sensors";
                }
                break;
        }
    }

    return (
        <Col xs="2" className="mb-2">
            <a href={"#" + props.siteName + "Anchor"} className="summaryLink">
                <h1 className="text-center" style={{ fontSize: "17px", textAlign: "center" }}>{props.siteName}</h1>
            </a>
            {/* <p className="text-center mb-0" style={{ fontSize: "12px" }}>Fully Operational: {Math.round(numOfAllGreen / numOfQuantifiers * 100)}%</p>
            <p className="text-center mb-0" style={{ fontSize: "12px" }}>Up-to-Date: {Math.round(numOfUpdated / numOfQuantifiers * 100)}%</p>
            <p className="text-center mb-0" style={{ fontSize: "12px" }}>Sensors: {Math.round(numOfReportingSensors / numOfAllSensors * 100)}%</p> */}

            <ResponsiveContainer width="100%" height={100}>
                <BarChart
                    layout="vertical"
                    data={chartData}
                >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" hide />
                    <Tooltip content={<CustomTooltip />} />
                    {/* <Tooltip /> */}
                    <Bar dataKey="Operational" stackId="a" fill="#59a14f" name="Operational" onMouseOver={() => tooltip = "Operational"} />
                    <Bar dataKey="Erroring" stackId="a" fill="#e15759" name="Erroring" onMouseOver={() => tooltip = "Erroring"} />
                </BarChart>
            </ResponsiveContainer>
        </Col>
    );
}

export default ReportSummaryPie;