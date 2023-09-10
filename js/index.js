const wrapper=document.querySelector('.wrapper'),
musicImg=wrapper.querySelector(".img-area img"),
musicName=wrapper.querySelector(".song-details .name"),
musicArtist=wrapper.querySelector(".song-details .artist");
mainAudio=wrapper.querySelector("#main-audio"),
playPauseBtn=wrapper.querySelector(".play-pause"),
prevBtn=wrapper.querySelector("#prev"),
nextBtn=wrapper.querySelector("#next"),
progressArea=wrapper.querySelector(".progress-area"),
progressBar=progressArea.querySelector(".progress-bar");
musicList=wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more-music"),
hideMoreBtn=musicList.querySelector("#close");


let musicIndex=Math.floor((Math.random()*allMusic.length)+1);
isMusicPaused=true;
window.addEventListener("load",()=>{
loadMusic(musicIndex);
playingSong();
})

function loadMusic(indexNumb){
    musicName.innerText=allMusic[indexNumb-1].name;
    musicArtist.innerText=allMusic[indexNumb-1].artist;
    musicImg.src=`public/photos/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src=`public/songs/${allMusic[indexNumb-1].src}.mp3`;

}
 function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
 }
 function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
 }
 function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
 }
 function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
 }

playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused=wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic():playMusic();
    playingSong();
});
nextBtn.addEventListener("click",()=>{
    nextMusic();
})

prevBtn.addEventListener("click",()=>{
    prevMusic();
})
mainAudio.addEventListener("timeupdate",(e)=>{
const currentTime=e.target.currentTime; //getting current time of song
const duration = e.target.duration; // getting total duration of song
let progressWidth=(currentTime/duration)*100;
progressBar.style.width=`${progressWidth}%`;

let musicCurrentTime=wrapper.querySelector(".current");
let musicDuration=wrapper.querySelector(".duration");

mainAudio.addEventListener("loadeddata",()=>{
   
    let audioDuration = mainAudio.duration;
    let minutes=Math.floor(audioDuration/60);
    let seconds=Math.floor(audioDuration%60);
    if(seconds<10){
        seconds=`0${seconds}`;
    }
    musicDuration.innerText=`${minutes}:${seconds}`;
});

    let Currentminutes=Math.floor(currentTime/60);
    let Currentseconds=Math.floor(currentTime%60);
    if(Currentseconds<10){
        Currentseconds=`0${Currentseconds}`;
    }
    musicCurrentTime.innerText=`${Currentminutes}:${Currentseconds}`;
})

progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting Offset X value
    let songDuration = mainAudio.duration;

    mainAudio.currentTime=(clickedOffsetX/progressWidthval)*songDuration;
    playMusic();
    playingSong();
})

const repeatBtn=wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener("click",()=>{
    let getText=repeatBtn.innerText;
    switch(getText){
        case "repeat":
            repeatBtn.innerText="repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText="shuffle";
            repeatBtn.setAttribute("title","PlayBack shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText="repeat";
            repeatBtn.setAttribute("title","PlayList looped");
            break;
    }

});

mainAudio.addEventListener("ended",()=>{
    let getText=repeatBtn.innerText;
    switch(getText){
        case "repeat":
        nextMusic();    
        break;
        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex=Math.floor((Math.random()*allMusic.length)+1);
            do{
                randIndex=Math.floor((Math.random()*allMusic.length)+1);
            }while(musicIndex == randIndex);
            musicIndex=randIndex;
           
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})
showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMoreBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="public/songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); 

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; 
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); 
  });
}

function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;   loadMusic(musicIndex);
  playMusic();
  playingSong();
}
