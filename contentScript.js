(() => {
    let ytControlPanel, ytPlayer
    let currentVideo = ""
    let currentVideoBookmarks = []

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

        return formattedTime;
    }

    const addNewBookmarkEventHandler = () => {
        const currentTimeInSeconds = ytPlayer.currentTime
        const formattedTime = formatTime(currentTimeInSeconds)
        const newBookmark = {
            time: formattedTime,
            desc: "Time " + formattedTime
        }

        console.log(newBookmark)

        // save to chrome storage
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a,b) => a.time - b.time))
        })
    }

    const handleNewVideos = () => {
        const bookmarkbtnExists = document.getElementsByClassName("bookmark-btn")[0]

        if(!bookmarkbtnExists) {
            const bookmarkBtn = document.createElement("img")
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png")
            bookmarkBtn.className = "yt-btn" + "bookmark-btn"
            bookmarkBtn.title = "Click to bookmark current timestamp"

            // manipulate DOM elements from Youtube
            ytControlPanel = document.getElementsByClassName("ytp-left-controls")[0]
            ytPlayer = document.getElementsByClassName("video-stream")[0]

                // Check if elements exist before manipulating them
            if (ytControlPanel && ytPlayer) {
                ytControlPanel.appendChild(bookmarkBtn);
                bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
            } else {
                console.error("ytControlPanel or ytPlayer is not defined.");
            }

        }
    }

    // listen to background.js code
    chrome.runtime.onMessage.addListener((obj, sender) => {
        const {type, value, videoId} = obj
        if (type === "NEW") {
            currentVideo = videoId
            newVideoLoaded()
        }
    })

    // Call function anytime contentScript matches "youtube.com"
    handleNewVideos()
})()