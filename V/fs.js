if (window.addEventListener) { window.addEventListener('load', initialize, false); } else if (window.attachEvent) { window.attachEvent('onload', initialize); }
class Directory {
    constructor(content, name) {
        if (content == null) {content = [];}
        if (name == null) {name = "new";}
        this.Content = content;
        this.Name = name;
        this.type = "Directory";
    }
    
    static Create(path) {
        if (!path.startsWith("/")) { path = "/" + path }
        var tmp = DirectoryRoot;
        var tmp2 = "";
        path.split("/").forEach(function(element) {
            tmp2 += element;
            if (element != null && element != "") {
                if (findWithAttr(tmp.Content, 'Name', element) == -1) {
                    tmp.Content.push(new Directory([], element));
                }
                if (tmp.Content[findWithAttr(tmp.Content, 'Name', element)].type == "Directory") {
                    tmp = tmp.Content[findWithAttr(tmp.Content, 'Name', element)];
                } else {
                    throw "Path contains Filename!";
                }
            }
        });
        sortDir(tmp);
    }
    
    static Remove(path) {
        var tmp = Directory.fromPath(path);
        tmp[1].Content.splice(tmp[1].Content.indexOf(tmp[0]));
    }
    
    static fromPath(path) {
        if (!path.startsWith("/")) { path = "/" + path }
        var tmp = DirectoryRoot;
        var tmp2 = "";
        var tmp3;
        path.split("/").forEach(function(element) {
            tmp2 += "/" + element;
            if (element != null && element != "") {
                if (findWithAttr(tmp.Content, 'Name', element) != -1 && tmp.Content[findWithAttr(tmp.Content, 'Name', element)].type == "Directory") {
                    tmp3 = tmp;
                    tmp = tmp.Content[findWithAttr(tmp.Content, 'Name', element)];
                } else {
                    throw "Invalid Directory!";
                }
            }
        });
        return [tmp, tmp3];
    }
}

class File {
    constructor(content, name) {
        this.Content = content;
        this.Name = name;
        this.type = "File";
    }
    
    static Create(path, name) {
        if (path == null) {path = "/";}
        if (name == null) {name = "new";}
        var tmp = Directory.fromPath(path);
        if (findWithAttr(tmp[0].Content, 'Name', name) == -1) {
            tmp[0].Content.push(new File("", name));
            sortDir(tmp[0]);
        } else {
            console.log('Already exists!');
            throw "Already exists!";
        }
    }

    static Read(path, name) {
        if (path == null) {path = "/";}
        if (name == null) {name = "new";}
        var tmp = Directory.fromPath(path);
        if (findWithAttr(tmp[0].Content, 'Name', name) == -1) {
            console.log('Not existant!');
            throw 'Not existant!';
        } else {
            return JSON.parse(tmp[0].Content[findWithAttr(tmp[0].Content, 'Name', name)].Content);
        }
    }

    static Write(path, name, content) {
        if (path == null) {path = "/";}
        if (name == null) {name = "new";}
        if (content == null) {content = "new";}
        var tmp = Directory.fromPath(path);
        if (findWithAttr(tmp[0].Content, 'Name', name) == -1) {
            console.log('Not existant!');
            throw 'Not existant!';
        } else {
            tmp[0].Content[findWithAttr(tmp[0].Content, 'Name', name)].Content = JSON.stringify(content);
        }
    }

    static Remove(path, name) {
        if (path == null) {path = "/";}
        if (name == null) {name = "new";}
        var tmp = Directory.fromPath(path);
        if (findWithAttr(tmp[0].Content, 'Name', name) == -1) {
            console.log('Not existant!');
            throw 'Not existant!';
        } else {
            tmp[0].Content.splice(findWithAttr(tmp[0], 'Name', name), 1);
        }
    }
}

var DirectoryRoot;

function initialize() {
    if (localStorage.getItem('setup') != "1") {
        Setup();
    } else {
        DirectoryRoot = JSON.parse(localStorage.getItem('fileSystem'));
    }
}

function Setup() {
    DirectoryRoot = new Directory([], "");
    Save();
    localStorage.setItem('setup', '1');
}

function Save() {
    localStorage.setItem('fileSystem', JSON.stringify(DirectoryRoot));
}

function Reset() {
    localStorage.clear();
    Setup();
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function sortDir(directory) {
    directory.Content.sort(function(a, b){
        if (a.Name == null || b.Name == null) {return 0;}
        return a.Name.localCompare(b.Name);
    });
}
