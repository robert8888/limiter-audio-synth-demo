export function getLevelMeter(sampleBuffer){
        let sumOfSquares = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
            sumOfSquares += sampleBuffer[i] ** 2;
        }

        const avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

        let peakPower = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
            const power = sampleBuffer[i] ** 2;
            peakPower = (power > peakPower) ? power : peakPower;
        }
        const peakPowerDecibels = 10 * Math.log10(peakPower);

        return {
            avg: avgPowerDecibels,
            peak: peakPowerDecibels,
        }
}