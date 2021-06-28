URL = window.URL || window.webkitURL;

var gumStream;                      //stream from getUserMedia()
var rec;                            //Recorder.js object
var input;                          //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record



//buttons-breathshallow

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var uploadButton = document.getElementById("uploadButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    console.log("recordButton clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true
    });
}

function pauseRecording(){
    console.log("pauseButton clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pauseButton.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pauseButton.innerHTML="Pause";

    }
}

function stopRecording() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;
    uploadButton.disabled = false;

    //reset button just in case the recording is stopped while paused
    pauseButton.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var breathshallow = document.getElementById('breathshallow')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " breatheshallow " +".wav "))

    //upload link
    var upload = document.getElementById('uploadButton');
    upload.href="#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    uploadButton.innerHTML=upload.innerHTML//add the upload link to button
    
    //add the li element to the ol
    breathshallow.innerHTML=li.innerHTML;
}


//buttons-breathdeep



var record2Button = document.getElementById("record2Button");
var stop2Button = document.getElementById("stop2Button");
var pause2Button = document.getElementById("pause2Button");
var upload2Button = document.getElementById("upload2Button");

//add events to those 2 buttons
record2Button.addEventListener("click", startRecording2);
stop2Button.addEventListener("click", stopRecording2);
pause2Button.addEventListener("click", pauseRecording2);

function startRecording2() {
    console.log("record2Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record2Button.disabled = true;
    stop2Button.disabled = false;
    pause2Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record2Button.disabled = false;
        stop2Button.disabled = true;
        pause2Button.disabled = true
    });
}

function pauseRecording2(){
    console.log("pause2Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause2Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause2Button.innerHTML="Pause";

    }
}

function stopRecording2() {
    console.log("stop2Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop2Button.disabled = true;
    record2Button.disabled = false;
    pause2Button.disabled = true;
    upload2Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause2Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink2);
}

function createDownloadLink2(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var breathdeep = document.getElementById('breathdeep')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " breathdeep " +".wav "))

    //upload link
    var upload2 = document.getElementById('upload2Button');
    upload2.href="#";
    upload2.innerHTML = "Upload";
    upload2.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload2Button.innerHTML=upload2.innerHTML//add the upload link to button
    
    //add the li element to the ol
    breathdeep.innerHTML=li.innerHTML;
}


//buttons-coughshallow


var record3Button = document.getElementById("record3Button");
var stop3Button = document.getElementById("stop3Button");
var pause3Button = document.getElementById("pause3Button");
var upload3Button = document.getElementById("upload3Button");

//add events to those 3 buttons
record3Button.addEventListener("click", startRecording3);
stop3Button.addEventListener("click", stopRecording3);
pause3Button.addEventListener("click", pauseRecording3);

function startRecording3() {
    console.log("record3Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record3Button.disabled = true;
    stop3Button.disabled = false;
    pause3Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 3 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record3Button.disabled = false;
        stop3Button.disabled = true;
        pause3Button.disabled = true
    });
}

function pauseRecording3(){
    console.log("pause3Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause3Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause3Button.innerHTML="Pause";

    }
}

function stopRecording3() {
    console.log("stop3Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop3Button.disabled = true;
    record3Button.disabled = false;
    pause3Button.disabled = true;
    upload3Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause3Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink3);
}

function createDownloadLink3(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var coughshallow = document.getElementById('coughshallow')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename + " coughshallow " +".wav "))

    //upload link
    var upload3 = document.getElementById('upload3Button');
    upload3.href="#";
    upload3.innerHTML = "Upload";
    upload3.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload3Button.innerHTML=upload3.innerHTML//add the upload link to button
    
    //add the li element to the ol
    coughshallow.innerHTML=li.innerHTML;
}



//buttons - coughheavy


var record4Button = document.getElementById("record4Button");
var stop4Button = document.getElementById("stop4Button");
var pause4Button = document.getElementById("pause4Button");
var upload4Button = document.getElementById("upload4Button");

//add events to those 4 buttons
record4Button.addEventListener("click", startRecording4);
stop4Button.addEventListener("click", stopRecording4);
pause4Button.addEventListener("click", pauseRecording4);

function startRecording4() {
    console.log("record4Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record4Button.disabled = true;
    stop4Button.disabled = false;
    pause4Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 4 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record4Button.disabled = false;
        stop4Button.disabled = true;
        pause4Button.disabled = true
    });
}

function pauseRecording4(){
    console.log("pause4Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause4Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause4Button.innerHTML="Pause";

    }
}

function stopRecording4() {
    console.log("stop4Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop4Button.disabled = true;
    record4Button.disabled = false;
    pause4Button.disabled = true;
    upload4Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause4Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink4);
}

function createDownloadLink4(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var coughheavy = document.getElementById('coughheavy')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " coughheavy " +".wav "))

    //upload link
    var upload4 = document.getElementById('upload4Button');
    upload4.href="#";
    upload4.innerHTML = "Upload";
    upload4.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload4Button.innerHTML=upload4.innerHTML//add the upload link to button
    
    //add the li element to the ol
    coughheavy.innerHTML=li.innerHTML;
}

//buttons - vowel a


var record5Button = document.getElementById("record5Button");
var stop5Button = document.getElementById("stop5Button");
var pause5Button = document.getElementById("pause5Button");
var upload5Button = document.getElementById("upload5Button");

//add events to those 5 buttons
record5Button.addEventListener("click", startRecording5);
stop5Button.addEventListener("click", stopRecording5);
pause5Button.addEventListener("click", pauseRecording5);

function startRecording5() {
    console.log("record5Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record5Button.disabled = true;
    stop5Button.disabled = false;
    pause5Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 5 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record5Button.disabled = false;
        stop5Button.disabled = true;
        pause5Button.disabled = true
    });
}

function pauseRecording5(){
    console.log("pause5Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause5Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause5Button.innerHTML="Pause";

    }
}

function stopRecording5() {
    console.log("stop5Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop5Button.disabled = true;
    record5Button.disabled = false;
    pause5Button.disabled = true;
    upload5Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause5Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink5);
}

function createDownloadLink5(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var vowela = document.getElementById('vowela')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " vowela " +".wav "))

    //upload link
    var upload5 = document.getElementById('upload5Button');
    upload5.href="#";
    upload5.innerHTML = "Upload";
    upload5.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 5) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload5Button.innerHTML=upload5.innerHTML//add the upload link to button
    
    //add the li element to the ol
    vowela.innerHTML=li.innerHTML;
}


//buttons- vowel e


var record6Button = document.getElementById("record6Button");
var stop6Button = document.getElementById("stop6Button");
var pause6Button = document.getElementById("pause6Button");
var upload6Button = document.getElementById("upload6Button");

//add events to those 6 buttons
record6Button.addEventListener("click", startRecording6);
stop6Button.addEventListener("click", stopRecording6);
pause6Button.addEventListener("click", pauseRecording6);

function startRecording6() {
    console.log("record6Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record6Button.disabled = true;
    stop6Button.disabled = false;
    pause6Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 6 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record6Button.disabled = false;
        stop6Button.disabled = true;
        pause6Button.disabled = true
    });
}

function pauseRecording6(){
    console.log("pause6Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause6Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause6Button.innerHTML="Pause";

    }
}

function stopRecording6() {
    console.log("stop6Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop6Button.disabled = true;
    record6Button.disabled = false;
    pause6Button.disabled = true;
    upload6Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause6Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink6);
}

function createDownloadLink6(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var vowele = document.getElementById('vowele')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " vowel-e " +".wav "))

    //upload link
    var upload6 = document.getElementById('upload6Button');
    upload6.href="#";
    upload6.innerHTML = "Upload";
    upload6.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 6) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload6Button.innerHTML=upload6.innerHTML//add the upload link to button
    
    //add the li element to the ol
    vowele.innerHTML=li.innerHTML;
}


//buttons - vowel o 


var record7Button = document.getElementById("record7Button");
var stop7Button = document.getElementById("stop7Button");
var pause7Button = document.getElementById("pause7Button");
var upload7Button = document.getElementById("upload7Button");

//add events to those 7 buttons
record7Button.addEventListener("click", startRecording7);
stop7Button.addEventListener("click", stopRecording7);
pause7Button.addEventListener("click", pauseRecording7);

function startRecording7() {
    console.log("record7Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record7Button.disabled = true;
    stop7Button.disabled = false;
    pause7Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 7 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record7Button.disabled = false;
        stop7Button.disabled = true;
        pause7Button.disabled = true
    });
}

function pauseRecording7(){
    console.log("pause7Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause7Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause7Button.innerHTML="Pause";

    }
}

function stopRecording7() {
    console.log("stop7Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop7Button.disabled = true;
    record7Button.disabled = false;
    pause7Button.disabled = true;
    upload7Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause7Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink7);
}

function createDownloadLink7(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var vowelo = document.getElementById('vowelo')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " vowel-o " +".wav "))

    //upload link
    var upload7 = document.getElementById('upload7Button');
    upload7.href="#";
    upload7.innerHTML = "Upload";
    upload7.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 7) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload7Button.innerHTML=upload7.innerHTML//add the upload link to button
    
    //add the li element to the ol
    vowelo.innerHTML=li.innerHTML;
}


//buttons - count normal



var record8Button = document.getElementById("record8Button");
var stop8Button = document.getElementById("stop8Button");
var pause8Button = document.getElementById("pause8Button");
var upload8Button = document.getElementById("upload8Button");

//add events to those 8 buttons
record8Button.addEventListener("click", startRecording8);
stop8Button.addEventListener("click", stopRecording8);
pause8Button.addEventListener("click", pauseRecording8);

function startRecording8() {
    console.log("record8Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record8Button.disabled = true;
    stop8Button.disabled = false;
    pause8Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 8 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record8Button.disabled = false;
        stop8Button.disabled = true;
        pause8Button.disabled = true
    });
}

function pauseRecording8(){
    console.log("pause8Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause8Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause8Button.innerHTML="Pause";

    }
}

function stopRecording8() {
    console.log("stop8Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop8Button.disabled = true;
    record8Button.disabled = false;
    pause8Button.disabled = true;
    upload8Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause8Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink8);
}

function createDownloadLink8(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var countnormal = document.getElementById('countnormal')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " countnormal " +".wav "))

    //upload link
    var upload8 = document.getElementById('upload8Button');
    upload8.href="#";
    upload8.innerHTML = "Upload";
    upload8.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 8) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload8Button.innerHTML=upload8.innerHTML//add the upload link to button
    
    //add the li element to the ol
    countnormal.innerHTML=li.innerHTML;
}




//buttons - count fast



var record9Button = document.getElementById("record9Button");
var stop9Button = document.getElementById("stop9Button");
var pause9Button = document.getElementById("pause9Button");
var upload9Button = document.getElementById("upload9Button");

//add events to those 9 buttons
record9Button.addEventListener("click", startRecording9);
stop9Button.addEventListener("click", stopRecording9);
pause9Button.addEventListener("click", pauseRecording9);

function startRecording9() {
    console.log("record9Button clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    record9Button.disabled = true;
    stop9Button.disabled = false;
    pause9Button.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 9 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        record9Button.disabled = false;
        stop9Button.disabled = true;
        pause9Button.disabled = true
    });
}

function pauseRecording9(){
    console.log("pause9Button clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pause9Button.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pause9Button.innerHTML="Pause";

    }
}

function stopRecording9() {
    console.log("stop9Button clicked");

    //disable the stop button, enable the record too allow for new recordings
    stop9Button.disabled = true;
    record9Button.disabled = false;
    pause9Button.disabled = true;
    upload9Button.disabled = false;

    //reset button just in case the recording is stopped while paused
    pause9Button.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink9);
}

function createDownloadLink9(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    var countfast = document.getElementById('countfast')
    var br = document.createElement("br");
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.prepend(document.createTextNode(filename+ " countfast " +".wav "))

    //upload link
    var upload9 = document.getElementById('upload9Button');
    upload9.href="#";
    upload9.innerHTML = "Upload";
    upload9.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 9) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.prepend(br)
    li.appendChild(document.createTextNode (" "))//add a space in between
    upload9Button.innerHTML=upload9.innerHTML//add the upload link to button
    
    //add the li element to the ol
    countfast.innerHTML=li.innerHTML;
}