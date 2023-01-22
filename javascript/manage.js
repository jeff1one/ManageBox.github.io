// init variables
let mainData = null;
let mainSaveData = null;

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
            addSongToPage(key, mainData[key][0]);
        }
    }
    else
    {
        // yes? -> only add songs with search key word in its name.
        songSearch = songSearch.toLowerCase().replace('%20', ' ');
        keys = Object.keys(mainData);
        keys = keys.reverse();
        for (key of keys)
        {
            if (key.toLowerCase().includes(songSearch))
            {
                addSongToPage(key, mainData[key][0]);
            }
        }
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
    else if (!(url.includes('/player/#')))
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
function addSongToPage(name, url)
{
    // create a div with song name...
    let div = "<div class='song' id='song_" + name + "'><h3>" + name + "</h3>";
    // add iframe with song contents to div...
    div += "<iframe src='" + url + "''></iframe>";
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
    if (confirmChoice === true)
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