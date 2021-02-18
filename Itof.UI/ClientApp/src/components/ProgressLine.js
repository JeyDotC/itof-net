import React from "react";
import "./ProgressLine.css";

export default function ProgressLine({ percentage = 0 }) {
    const width = `${percentage * 100}%`;

    return (<div class="progress-line" title={width}>
        <div class="total-progress" style={{width}}></div>
    </div>);
}