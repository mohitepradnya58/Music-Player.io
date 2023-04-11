let allMusic = [
    {
    name: "Music-1",
    img: "img1",
    src: "music-1"
},
{
    name: "Music-2",
    img: "img2",
    src: "music-2"
},
{
    name: "Music-3",
    img: "img3",
    src: "music-3"
},
{
    name: "Music-4",
    img: "img4",
    src: "music-4"
},
{
    name: "Music-5",
    img: "img5",
    src: "music-5"
}
]

 wraper = document.querySelector(".wraper"),
 image = wraper.querySelector(".img img"),
 songName = wraper.querySelector(".names .songName"),
 mainAudio = wraper.querySelector("#main-audio"),
 playPause = wraper.querySelector(".play-pause"),
 backward = wraper.querySelector("#backward"),
 forward = wraper.querySelector("#forward"),
 musicList = wraper.querySelector(".music-list"), 
 showMoreBtn = wraper.querySelector("#more-music"),
 hideMusicBtn = musicList.querySelector("#close"),

 musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();
});
function loadMusic(indexNumb){
    songName.innerText = allMusic[indexNumb - 1].name;
    image.src = `img/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic(){
    wraper.classList.add("paused");
    playPause.querySelector("i").innerText = "pause";
    mainAudio.play();
}
function pauseMusic(){
    wraper.classList.remove("paused");
    playPause.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
//play-pause icon change
playPause.addEventListener("click", ()=>{
    const isMusicPaused = wraper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingSong();
});
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
function  prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
//next Music
forward.addEventListener('click', ()=>{
    nextMusic();
});
//prev music
backward.addEventListener('click', ()=>{
    prevMusic();
});

//repeat
const repeat = wraper.querySelector("#repeat");
repeat.addEventListener("click", ()=>{
let getText = repeat.innerText;
switch(getText){
    case "repeat":
    repeat.innerText = "repeat_one";
    repeat.setAttribute("title", "Song looped")
    break;
    case "repeat_one":
    repeat.innerText = "shuffle";
    repeat.setAttribute("title", "Playback shuffle")  
    break;
    case "shuffle":
    repeat.innerText = "repeat";  
    repeat.setAttribute("title", "Playlist looped")
    break;
}
});

mainAudio.addEventListener('ended', ()=>{
    let getText = repeat.innerText;
    switch(getText){
        case "repeat":
        nextMusic();
        break;
        case "repeat_one":
        mainAudio.currentTime = 0;
        loadMusic(musicIndex); 
        playMusic();
        break;
        case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        do{
            randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        break;
    }
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

//Add to favorite
const fav = wraper.querySelector("#favorite");
fav.addEventListener("click", ()=>{
    let text = fav.innerText;
    switch(text){
        case "favorite_border":
            fav.innerText = "favorite";
            fav.setAttribute("title", "Added to Favorite");
            fav.style.color = 'deeppink';
            break;
            case "favorite":
            fav.innerText = "favorite_border";
            fav.setAttribute("title", "Removed from Favorite");
            break;
    }
});
//volume On off
const vol = wraper.querySelector("#volume");
vol.addEventListener("click", ()=>{
 let textVol = vol.innerText;
 if (mainAudio.muted === false) {    
    mainAudio.muted = true;
}

else {
 mainAudio.muted = false;
}
switch(textVol){
    case "volume_up":
        vol.innerText = "volume_off";
        vol.setAttribute("title", "Mute");
        break;
        case "volume_off":
            vol.innerText = "volume_up";
            vol.setAttribute("title", "Unmute");
            break;
} 
});

//progressbar
let progress = document.getElementById("progress");
 mainAudio.onloadedmetadata = function(){
    progress.max = mainAudio.duration;
    progress.value = mainAudio.currentTime;
}

if( mainAudio.play()){
    setInterval(()=>{
        progress.value = mainAudio.currentTime;
    }, 500);
}

progress.onchange = function(){
    mainAudio.play();
    mainAudio.currentTime = progress.value;
    playPause.classList.remove("play_arrow");
    playPause.classList.add("pause");
} 

 
// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //getting playing song currentTime
    const duration = e.target.duration; //getting playing song total duration
    //let progressWidth = (currentTime / duration) * 100;
    //progress.style.width = `${progressWidth}%`;
  
    let musicCurrentTime = wraper.querySelector(".current-time"),
    musicDuartion = wraper.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", ()=>{
      // update song total duration
      let mainAdDuration = mainAudio.duration;
      let totalMin = Math.floor(mainAdDuration / 60);
      let totalSec = Math.floor(mainAdDuration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      }
      musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //if sec is less than 10 then add 0 before it
      currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
  });
  
  // update playing song currentTime on according to the progress bar width
  progressArea = wraper.querySelector(".progress-area"),
  progressArea.addEventListener("click", (e)=>{
    let progressWidth = progressArea.clientWidth; 
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; 
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
  });

  
  const ulTag = wraper.querySelector("ul");
  // let create li tags according to array length for list
  for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li id="sList" li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
  
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }
  
  //play particular song from the list onclick of li tag
  function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");
      
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
  
      //if the li tag index is equal to the musicIndex then add playing class in it
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
  
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
  }
  
  //particular li clicked function
  function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
  }
  