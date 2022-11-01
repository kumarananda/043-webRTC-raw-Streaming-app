
const camaraToggle = document.getElementById('cam_toggle')
const micToggle = document.getElementById('mic_toggle')

const create_offer = document.getElementById('create_offer')
const create_Answer = document.getElementById('create_Answer')
const add_Answer = document.getElementById('add_Answer')

const offer_sdp = document.getElementById('offer_sdp')
const answer_sdp = document.getElementById('answer_sdp')
const add_answer_sdp = document.getElementById('add_answer_sdp')



console.log(add_answer_sdp.value);

let peerConnection;
let localStream;
let remoteStream;
let servers = {
    iceServers : [
        {
            urls : [ 'stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
};


// create local stream
const localStreamInit = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
    document.getElementById('screen-02').srcObject = localStream; 
    localStream.getAudioTracks()[0].enabled = false

}

localStreamInit();

// camara toggle
let camaraStatus = true;
camaraToggle.onclick = ( ) => {
    camaraStatus = !camaraStatus;
    localStream.getVideoTracks()[0].enabled = camaraStatus;
    camaraToggle.classList.toggle('active');
    document.getElementById('screen-02').classList.toggle('d-none')

}

// camara toggle
let mic_Status = false;
micToggle.onclick = ( ) => {
    mic_Status = !mic_Status;
    localStream.getAudioTracks()[0].enabled = mic_Status;
    micToggle.classList.toggle('active');
}




// create offer
const createOffer = async () => {
    
    // create a peerConnection
    peerConnection = new RTCPeerConnection(servers);

    // get remote stream 
    remoteStream = new MediaStream();
    document.getElementById('screen-01').srcObject = remoteStream; 

    localStream.getTracks().forEach(track  => {
        peerConnection.addTrack(track, localStream)
    });

    peerConnection.ontrack = async (evant) => {
        evant.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
        })
    }

    // check ice candidate 
    peerConnection.onicecandidate = async (evant) => {
        if(evant.candidate){
            // console.log(peerConnection.localDescription);
            offer_sdp.value = JSON.stringify(peerConnection.localDescription)
        }
    }
    let offer = await peerConnection.createOffer();
    offer_sdp.value = JSON.stringify(offer);
    await peerConnection.setLocalDescription(offer)

    console.log(offer);
};


// 
// create offer
const createAnswer = async () => {
    
    // create a peerConnection
    peerConnection = new RTCPeerConnection(servers);

    // get remote stream 
    remoteStream = new MediaStream();
    document.getElementById('screen-01').srcObject = remoteStream; 

    localStream.getTracks().forEach(track  => {
        peerConnection.addTrack(track, localStream)
    });

    peerConnection.ontrack = async (evant) => {
        evant.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
        })
    }

    // check ice candidate 
    peerConnection.onicecandidate = async (evant) => {
        if(evant.candidate){
            offer_sdp.value = JSON.stringify(peerConnection.localDescription);
        }
    }

    // recive offer  
    let offer = offer_sdp.value;
    offer = JSON.parse( offer)
    await peerConnection.setRemoteDescription(offer)

    // create answer 
    let answer = await peerConnection.createAnswer();
    answer_sdp.value = JSON.stringify(answer);
    await peerConnection.setLocalDescription(answer)


    console.log(answer);


};

// add answer
const addAnswer = async () => {
    
    let answer = add_answer_sdp.value;
    answer = JSON.parse(answer);
    await peerConnection.setRemoteDescription(answer)

    console.log(answer);
}

create_offer.onclick = () => {  createOffer()   }
create_Answer.onclick = () => { createAnswer() }
add_Answer.onclick = () => { addAnswer() }

