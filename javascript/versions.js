// TODO: write more comments lol

// init variables
let songName = window.location.search.split('=')[1];
songName = songName.replace('%20', ' ');
let mainData = JSON.parse(read('song_data'));
let mainSaveData = null;
let currentData = mainData[songName]
let i = 0;

for (url of currentData)
{
    addSongToPage(i, url);
    i++
}

function read(key)
{
    return localStorage.getItem(key);
}
function replace(key, data)
{
    localStorage.removeItem(key);
    localStorage.setItem(key, data);
}

function addSongToPage(version, url)
{
    let div = "<div class='song' id='song_" + version + "'><h3>" + songName + "</h3>";
    div += "<iframe src='" + url + "''></iframe>";
    div += "<p class='cop' onclick='copy(\"" + version + "\")'>copy link</p>";
    div += "<p class='del' onclick='removeFromPage(\"" + version + "\")'>delete</p>";
    div += "</div>";
    document.getElementById('art').innerHTML += div;
}

function addSong()
{
    let url = document.getElementById('song_url').value;

    // set url
    if (!(url.includes('/player/#')))
    {
        // convert url to player version
        const urlSplit = url.split('/#');
        url =  urlSplit[0] + '/player/#song=' + urlSplit[1];
    }
    
    currentData.unshift(url);
    mainData[songName] = currentData;

    // save results
    mainSaveData = JSON.stringify(mainData)
    replace('song_data', mainSaveData);
    location.reload();
}

function removeFromPage(item)
{
    // confirm deletion
    const confirmChoice = confirm('are you sure you want to delete this version?\nThis cannot be undone.');
    if (confirmChoice === true)
    {
        const newData = [];
        for (let i = 0; i<currentData.length; i++)
        {
            if (!(item == i))
            {
                newData.push(currentData[i])
            }
        }
        // save results
        mainData[songName] = newData;
        mainSaveData = JSON.stringify(mainData)
        replace('song_data', mainSaveData);
        location.reload();
    }
}

function copy(version)
{
    const copyText = mainData[songName][version];
    navigator.clipboard.writeText(copyText);
}