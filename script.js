
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models')
]).then(initVideo);
function initVideo(){
    navigator.mediaDevices.getUserMedia({  //to open video
        video:true,
        video:{
           
            width:450,
            height:520
    }
    })
    .then(function(stream){
        video.srcObject=stream; 
    })
    .catch((error)=>{
        console.log(error);
    });
}

video.addEventListener('play',function(){
   
    const canvas=faceapi.createCanvasFromMedia(video);
    document.querySelector('.testing').prepend(canvas);
    const displaySize = {width: video.width, height: video.height};
    setInterval(async function(){
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        console.log(detections);
        const resizeDetection = faceapi.resizeResults(detections,displaySize);
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        faceapi.draw.drawDetections(canvas,resizeDetection );
        faceapi.draw.drawFaceLandmarks(canvas,resizeDetection );
        const minProbability = 0.05;

        faceapi.draw.drawFaceExpressions(canvas, resizeDetection, minProbability);
        resizeDetection.forEach( detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
            drawBox.draw(canvas);
          });

    },10);
   
})
