importScripts("stb.js");
let STB = null;
let FS = null;
let IDBFS = null;

async function initWorker(mountDir){
    let App = {
        locateFile: (file) => file,
        mainScriptUrlOrBlob: "stb.js",
    };
    STB = await STB_MODULE(App);
    FS = STB.FS;
    IDBFS = STB.IDBFS;

    FS.mkdir(mountDir);
    FS.mount(IDBFS, {}, mountDir)
    FS.syncfs(true, (err)=>{
        if(err){
            console.error(err)
        }else{
            console.log("fs loaded")
        }
    });
}

function runDummyThreadWorker(f){
    STB.my_async();
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

function load_image(e, input_type){
    return new Promise((resolve, reject) => {
      let inputFileName = e.data.inputFileName;
      let bits = e.data.bits;
      let stream = FS.open(inputFileName, 'w');
      var array = new Int8Array(bits);
      FS.write(stream, array, 0, array.length, 0);
      FS.close(stream);
  
      FS.syncfs(false, async (err) => {
        if(err){
          console.error("error:", err)
        }else{
            resolve(inputFileName);
        }
      });
    });
}

async function generateRendition(data){
    return new Promise(async (resolve, reject) => {
        let inputFileName = data.inputFileName;
        let outputFileName = data.outputFileName;
    
        await STB.generate_rendition_using_idb(inputFileName, outputFileName);
        FS.syncfs(false, async (err) => {
            if(err){
                reject(err);
            }else{
                let url = await createURLForRendition(outputFileName, 'image/png');
                resolve(url);
            }
        })
    })

}

async function createURLForRendition(filename, mime){
    mime = mime || "application/octet-stream";
    let content = await FS.readFile(filename);
    return URL.createObjectURL(new Blob([content], { type: mime }));
}

self.onmessage = async (e) => {
    if( !(e && e.data)){
      return;
    }

    let jobType = e.data.jobType;
    let response = { jobType: jobType };
    if(jobType == "initWorker"){
        await initWorker("/persistent");
    } else if (jobType == "handleFileInput") {
        await load_image(e, )
        let url = await generateRendition(e.data);
        response['renditionUrl'] = url;
    } else if(jobType == "runDummyThread"){
        runDummyThreadWorker();
    }
    self.postMessage(response);
};