export default function humanFileSize(bytes, decimalPoints = 1) {
    const threshold = 1024;

    if (Math.abs(bytes) < threshold) {
        return bytes + ' B';
    }

    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10 ** decimalPoints;

    do {
        bytes /= threshold;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= threshold && u < units.length - 1);


    return bytes.toFixed(decimalPoints) + ' ' + units[u];
}