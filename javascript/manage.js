// init variables
let mainData = null;
let mainSaveData = null;

// set limit
let limit = read('limit');
if (limit === null){limit = 10;}
document.getElementById('limit').value = limit;

// checks id data exists
if (read('song_data') === null)
{
    // creates object // all song will be stored in this objects
    mainData = {};
}
else
{
    // fetch and parse song data
    mainData = JSON.parse(read('song_data'));
    // look for user search
    let songSearch = window.location.search.split('=')[1];
    // is user searching something?
    if (songSearch === undefined || songSearch === '')
    {
        // no? -> add all songs to html page
        keys = Object.keys(mainData);
        keys = keys.reverse();
        for (key of keys)
        {
            if (limit > 0)
            {
                addSongToPage(key, mainData[key][0]);
                limit--;
            }
            else
            {
                addSongToPage(key, mainData[key][0], false);
            }
        }
    }
    else
    {
        // yes? -> only add songs with search key word in its name.
        songSearch = songSearch.toLowerCase().decodeURI();
        keys = Object.keys(mainData);
        keys = keys.reverse();
        for (key of keys)
        {
            if (key.toLowerCase().includes(songSearch))
            {
                if (limit > 0)
                {
                    addSongToPage(key, mainData[key][0]);
                    limit--;
                }
                else
                {
                    addSongToPage(key, mainData[key][0], false);
                }
            }
        }
        // put in searched item
        document.getElementById('search').value = songSearch;
    }
}

// local storage functions
function read(key)
{
    return localStorage.getItem(key);
}
function replace(key, data)
{
    localStorage.removeItem(key);
    localStorage.setItem(key, data);
}

// add song to page
function addSong()
{
    // get song info
    let name = document.getElementById('song_name').value;
    let url = document.getElementById('song_url').value;
    // check if name exists / is undefined
    if (name in mainData || name === '')
    {
        // assign new name
        name = 'unnamed '
        let i = 1
        while ((name + i) in mainData)
        {
            i++
        }
        name = name+i;
    }
    // check if song is in player version
    if (!(url.includes('/player/#')))
    {
        // only some mods support player versions
        // for now only beepbox and jummbus songs will be converted to their player versions.
        if (url.includes('beepbox.io/') || url.includes('jummbus.bitbucket.io/'))
        {
            // convert url to player version
            const urlSplit = url.split('/#');
            url =  urlSplit[0] + '/player/#song=' + urlSplit[1];
        }
    }
    // save song data
    mainData[name] = [url]
    mainSaveData = JSON.stringify(mainData)
    replace('song_data', mainSaveData);
    location.reload();
}

// adds song to page
function addSongToPage(name, url, loadIframe = true)
{
    // create a div with song name...
    let div = "<div class='song' id='song_" + name + "'><h3>" + name + "</h3>";
    // check for preformance mode...
    if (loadIframe)
    {
        // add iframe with song contents to div...
        div += "<iframe src='" + url + "'></iframe>";
    }
    else
    {
        // add div...
        div += "<div class='frame' onclick='frame(\"" + name + "\")' id='frame_" + name + "' ></div>";
    }
    // add "versions" button to div...
    div += "<a class='ver' href='pages/versions.html?song=" + name + "'>versions</a>"
    // add "move to top" button to div...
    div += "<p class='mov' onclick='move(\"" + name + "\")'>move top</p>";
    // add "copy link" button to div...
    div += "<p class='cop' onclick='copy(\"" + name + "\")'>copy link</p>";
    // add "delete" button to div...
    div += "<p class='del' onclick='removeFromPage(\"" + name + "\")'>delete</p>";
    // close div and put on html page
    div += "</div>";
    document.getElementById('art').innerHTML += div;
}

// deletes song from page but also from song data
function removeFromPage(name)
{
    // confirm deletion
    const confirmChoice = confirm('are you sure you want to delete "' + name + '"?\nThis cannot be undone.');
    if (confirmChoice)
    {
        // delete from page
        const element = document.getElementById('song_'+name);
        element.remove();
        // delete from song data
        delete mainData[name];
        // save results
        mainSaveData = JSON.stringify(mainData)
        replace('song_data', mainSaveData);
    }
}

// moves song at top of the page
function move(item)
{
    // search for song data
    const sectionData = mainData[item];
    // delete that data
    delete mainData[item];
    // add song data to maindata
    mainData[item] = sectionData;
    // save result
    mainSaveData = JSON.stringify(mainData)
    replace('song_data', mainSaveData);
    // reload page
    location.reload();
}

// copy song link to clipboard
function copy(item)
{
    // get link
    const copyText = mainData[item][0];
    // copy to clipboard
    navigator.clipboard.writeText(copyText);
}

// searches for song
function searchBar()
{
    // get search
    const search = document.getElementById('search').value;
    // check if search is empty
    if (search === '')
    {
        // if it is, dont and GET
        window.location.href = 'index.html';
        return;
    }
    // if search is not empty, reload page but with GET data.
    window.location.href = 'index.html?search=' + search;
}

// console function - returns song's JSON data
function getJSONData()
{
    mainSaveData = JSON.stringify(mainData);
    console.log(mainSaveData);
}

// console function - input JSON data (will replace song data!)
function inputJSONData(newData)
{
    newData = mainData = JSON.parse(newData);
    const count = Object.keys(newData).length;
    const confirmChoice = confirm('are you sure you want to replace current data with new data? (' + count + ' songs)');
    if (confirmChoice)
    {
        // save results
        mainSaveData = JSON.stringify(newData)
        replace('song_data', mainSaveData);
        location.reload();
    }
}

// Downloads file
function download(filename, text)
{
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}


// Create string for download
function downloadBackup()
{
    // songText will be the text in the textfile
    let songText = '';
    keys = Object.keys(mainData);
    keys = keys.reverse();
    // loop throught keys
    for (key of keys)
    {
        songText += key + '\n';
        // loop through song versions
        for (link of mainData[key])
        {
            // add song to songText
            songText += link + '\n\n';
        }
    }
    songText = songText.slice(0, -4);
    download('ManageBox_backup', songText);
}

// Shows iframe when clicking empty song
function frame(frameName)
{
    document.getElementById('frame_' + frameName).innerHTML="<iframe src='" + mainData[frameName][0] + "'></iframe>";
}

// updates "limit" setting
function updateLoaded()
{
    limit = document.getElementById('limit').value;
    replace('limit', limit);
    location.reload();
}

function inputText()
{
    const input = prompt('Copy + pase song data in here. Make sure each song has a name, and all names + links are separated with line breaks. After that, the uploaded songs will be added.');
    const textArray = input.split('\n');
    const inputSongData = {};
    let inputSongName = '';
    let inputSongs = [];
    let nr = 0;
    let urlSplit = null;
    for (text of textArray)
    {
        if (text !== '')
        {
            if (text.includes('https://'))
            {
                // is link
                if (!(text.includes('/player/#')))
                {
                    // only some mods support player versions
                    // for now only beepbox and jummbus songs will be converted to their player versions.
                    if (text.includes('beepbox.io/') || text.includes('jummbus.bitbucket.io/'))
                    {
                        // convert url to player version
                        urlSplit = text.split('/#');
                        text =  urlSplit[0] + '/player/#song=' + urlSplit[1];
                    }
                }
                inputSongs.push(text);
            }
            else
            {
                // is name
                text = text.replace(/(\r\n|\n|\r)/gm, "");
                if (inputSongName !== '')
                {
                    inputSongData[inputSongName] = inputSongs;
                    inputSongs = [];
                }
                inputSongName = text;
                // Check if name exists
                if (text in mainData || text in inputSongData || text === '')
                {
                    // assign new name
                    text = 'unnamed '
                    nr = 1
                    while ((text + nr) in mainData || (text+nr) in inputSongData)
                    {
                        nr++
                    }
                    inputSongName = text+nr;
                }
            }
        }
    }
    let confirmString = 'Do you want to add these songs to your current list of songs? (songs with matching names have been renamed to "unnamed"\n\n'
    inputSongData[inputSongName] = inputSongs;
    items = Object.keys(inputSongData);
    for (item of items)
    {
        confirmString += item + ' (' + inputSongData[item].length + ' versions)' + '\n';
    }
    const confirmAdd = confirm(confirmString);
    if (confirmAdd)
    {
        items = Object.keys(inputSongData);
        for (item of items)
        {
            // save song data
            mainData[item] = inputSongData[item];
        }
        mainSaveData = JSON.stringify(mainData);
        replace('song_data', mainSaveData);
        location.reload();
    }
}