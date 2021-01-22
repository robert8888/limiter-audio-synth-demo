var pulseCurve=new Float32Array(256);
for(var i=0;i<128;i++) {
  pulseCurve[i]= -1;
  pulseCurve[i+128]=1;
}
var constantOneCurve=new Float32Array(2);
constantOneCurve[0]=1;
constantOneCurve[1]=1;

AudioContext.prototype.createPulseShaper=function(){
  var sawtoothOsc = this.createOscillator()
  sawtoothOsc.type = "sawtooth";
  sawtoothOsc.frequency.value = 440;
  sawtoothOsc.start(this.currentTime);

  const input = this.createGain(); 
  const output = this.createGain();

  const input$connect = input.connect
  const input$disconnect = input.disconnect

  const pulseShaper = this.createWaveShaper();
  pulseShaper.curve = pulseCurve;
  input$connect.call(input, pulseShaper);

  const widthGain = this.createGain();
//  widthGain.gain.value=.6; 
  input.width = widthGain.gain;
  widthGain.connect(pulseShaper);

  const constantOneShaper = this.createWaveShaper();
  constantOneShaper.curve = constantOneCurve;
  input$connect.call(input,constantOneShaper);
  constantOneShaper.connect(widthGain);

  let bypassed = true;
  input$connect.call(input, output)

  Object.defineProperty(input, 'bypass', {
      enumerable: false,
      set: (value) => {
          if(value === bypassed) return;
          if(!value){
              pulseShaper.connect(output);

              input$disconnect.call(input, output)
              console.log("connecting wave")
          } else {
              pulseShaper.disconnect(output);

             input$connect.call(input, output)
          }
          bypassed = value;
      },
      get: () =>{
        return bypassed
      }
  })

  input.connect=function() {
    output.connect.apply(output, arguments);
  }
  input.disconnect=function() {
    output.disconnect.apply(output, arguments);
  }

  return input;
}