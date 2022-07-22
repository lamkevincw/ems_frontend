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
    const numOfQuantifiers = props.quantifiers.length;
    const numOfAllSensors = props.quantifiers.length * 3;
    // const numOfAllErroring = numOfAllSensors * 2;
    var numOfNA = 0;
    var numOfAllGreen = 0;
    var numOfUpdated = 0;
    var numOfOffWeek = 0;
    var numOfOffMonth = 0;
    var numOfOffForever = 0;
    var numOfReportingSensors = 0;
    var numOfNoData = 0;
    // var numOfErroring = 0;

    var activeQuantifiers = 0;
    for (var a = 0; a < props.quantifiers.length; a++) {
        for (var q = 0; q < props.quantifiers.length; q++) {
            if (props.quantifiers[a] == props.quantifiers[q]) {
                activeQuantifiers++;
            }
        }
    }

    for (var q = 0; q < props.quantifiers.length; q++) {
        console.log(props.report)
        if (props.report[q]["tcm_last_reported"] === null) {
            numOfNoData++;
        } else {
            var lastReported = (new Date(props.report[q]["tcm_last_reported"])).getTime();
            var hoursSinceUpdate = Math.abs(lastReported - (new Date()).getTime()) / (1000 * 60 * 60);

            var s1 = props.report[q]["board_1_is_reporting"];
            var s2 = props.report[q]["board_2_is_reporting"];
            var s3 = props.report[q]["board_3_is_reporting"];
            var s1Z = props.report[q]["board_1_all_zeros"];
            var s2Z = props.report[q]["board_2_all_zeros"];
            var s3Z = props.report[q]["board_3_all_zeros"];
            var s1S = props.report[q]["board_1_too_small"];
            var s2S = props.report[q]["board_2_too_small"];
            var s3S = props.report[q]["board_3_too_small"];


            if (hoursSinceUpdate < 24) {
                if (s1 !== null && s1 && !s1Z && !s1S &&
                    s2 !== null && s2 && !s2Z && !s2S &&
                    s3 !== null && s3 && !s3Z && !s3S) {
                    numOfAllGreen++;
                }
                if (s1 !== null && s1 && !s1Z && !s1S) {
                    numOfReportingSensors++;
                }
                if (s2 !== null && s2 && !s2Z && !s2S) {
                    numOfReportingSensors++;
                }
                if (s3 !== null && s3 && !s3Z && !s3S) {
                    numOfReportingSensors++;
                }
                numOfUpdated++;
            } else if (hoursSinceUpdate < 168) {
                numOfOffWeek++;
            } else if (hoursSinceUpdate < 730) {
                numOfOffMonth++;
            } else {
                numOfOffForever++;
            }
        }
    }

    var chartData = [
        {
            name: "Quantifiers",
            Operational: numOfAllGreen / numOfQuantifiers * 100,
            Erroring: (numOfQuantifiers - numOfAllGreen) / numOfQuantifiers * 100
        },
        {
            name: "Up-to-Date",
            Operational: numOfUpdated / numOfQuantifiers * 100,
            // Erroring: (numOfQuantifiers - numOfUpdated) / numOfQuantifiers * 100,
            OffWeek: numOfOffWeek / numOfQuantifiers * 100,
            OffMonth: numOfOffMonth / numOfQuantifiers * 100,
            OffForever: numOfOffForever / numOfQuantifiers * 100,
            NA: (numOfQuantifiers - activeQuantifiers) / numOfQuantifiers * 100,
            NoData: numOfNoData / numOfQuantifiers * 100
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
                    return "All-Green Quantifiers";
                } else {
                    return "Problematic Quantifiers";
                }
                break;
            case "Up-to-Date":
                switch (barName) {
                    case "Operational":
                        return "Up-to-Date Quantifiers";
                    case "OffWeek":
                        return "Non-reporting (1 Week)";
                    case "OffMonth":
                        return "Non-reporting (1 Month)";
                    case "OffForever":
                        return "Non-reporting (Offline)";
                    case "NoData":
                        return "No Reports Within 35 Days";
                    case "NA":
                        return "N/A";
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
        <Col md="4" xs="12" lg="3" className="mb-2">
            <a href={"#" + props.siteName + "Anchor"} className="summaryLink">
                <h1 className="text-center" style={{ fontSize: "17px", textAlign: "center" }}>{props.fullName}</h1>
            </a>

            <ResponsiveContainer width="100%" height={100}>
                <BarChart
                    layout="vertical"
                    data={chartData}
                >
                    <XAxis type="number" hide />
                    <YAxis style={{ fontSize: "12px" }} width={75} dataKey="name" type="category" />
                    <Tooltip content={<CustomTooltip />} />
                    {/* <Tooltip /> */}
                    <Bar dataKey="Operational" stackId="a" fill="#59a14f" name="Operational" onMouseOver={() => tooltip = "Operational"} />
                    <Bar dataKey="OffWeek" stackId="a" fill="#edc949" name="OffWeek" onMouseOver={() => tooltip = "OffWeek"} />
                    <Bar dataKey="OffMonth" stackId="a" fill="#e15759" name="OffMonth" onMouseOver={() => tooltip = "OffMonth"} />
                    <Bar dataKey="OffForever" stackId="a" fill="#666666" name="OffForever" onMouseOver={() => tooltip = "OffForever"} />
                    <Bar dataKey="Erroring" stackId="a" fill="#e15759" name="Erroring" onMouseOver={() => tooltip = "Erroring"} />
                    <Bar dataKey="NoData" stackId="a" fill="#bab0ab" name="NoData" onMouseOver={() => tooltip = "NoData"} />
                    {/* <Bar dataKey="NA" stackId="a" fill="#bab0ab" name="NA" onMouseOver={() => tooltip = "NA"} /> */}
                </BarChart>
            </ResponsiveContainer>
        </Col>
    );
}

export default ReportSummaryPie;