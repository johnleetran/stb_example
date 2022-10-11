importScripts("app.js");

async function stbInit(){
    FS.mkdir(rootDir);
    FS.mount(IDBFS, {}, rootDir)
    FS.syncfs(true, (err)=>{
        if(err){
            console.error(err)
        }else{
            console.log("fs loaded")
        }
    });
}

async function workerHandleFileInput(event){
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {

        let bits = e.target.result;
        let inputFileName = rootDir + '/input.psd';
        let outputFileName = rootDir + '/output.png';
        console.log("handleFileInput: ", inputFileName);
        startTime = new Date();
        let stream = FS.open(inputFileName, 'w');
        let array = new Int8Array(bits);
        FS.write(stream, array, 0, array.length, 0);
        FS.close(stream);
        FS.syncfs(false, (err) => {
            if(err){
                console.error("error:", err);
            }else{
                generate_rendition(inputFileName, outputFileName);
            }
        })
    }
}

async function generate_rendition(inputFileName, outputFileName){
    let r = await Module.generate_rendition_using_idb(inputFileName, outputFileName);
    let width = await Module.get_width();
    let height = await Module.get_height();

    endTime = new Date();
    let duration = endTime - startTime;
    console.log("width: ", width, " height: ", height);
    console.log("duration: ", duration, " milliseconds");
    FS.syncfs(false, async (err) => {
        if(err){
            console.error("err:", err);
        }else{
            let renditionSrc = await createURLForRendition(outputFileName, 'image/png');
            let img = document.getElementById("rendition");
            img.src = renditionSrc;
        }
    })
}

async function createURLForRendition(filename, mime){
    mime = mime || "application/octet-stream";
    let content = await FS.readFile(filename);
    return URL.createObjectURL(new Blob([content], { type: mime }));
}

self.onmessage = async (evt) => {
    let now = new Date().valueOf();
    if( !(e && e.data)){
      return;
    }
  

    let jobType = e.data.jobType;
    let response = { jobType: jobType };
    if(jobType == "stbInit"){
        await stbInit();
    } else if (jobType == "workerHandleFileInput") {
        
    }
    self.postMessage(response);
};