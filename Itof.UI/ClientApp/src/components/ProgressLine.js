import React from "react";
import "./ProgressLine.css";

export default function ProgressLine({ percentage = 0 }) {
    const width = `${percentage * 100}%`;

    return (<div className="progress-line" title={width}>
        <div className="total-progress" style={{width}}></div>
    </div>);
}