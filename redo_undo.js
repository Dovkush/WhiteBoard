let undobtn = document.querySelector(".undo");
let redobtn = document.querySelector(".do");
undobtn.addEventListener("click", Undo);

function drawPaths(paths, action) {
    if (action == "undo") {
        tool.clearRect(0, 0, board.width, board.height);
    }
    if (action == "redo") {
        pathsry.push(paths[0]);
    }
    if(penColor=="white"){
        tool.strokeStyle=prevColor;
    }
    // draw all the paths in the paths array
    paths.forEach(path => {
       tool.strokeStyle=path[0].penColor;
        tool.beginPath();
        tool.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            tool.lineTo(path[i].x, path[i].y);
        }
        tool.stroke();

    })

}

function Undo() {
    // remove the last path from the paths array

    console.log(pathsry);
    let redopoints = pathsry.splice(-1, 1);

    console.log(pathsry);

    let redo = redopoints[0];
    //console.log(redo);
    redopathsry.push(redo);

    drawPaths(pathsry, "undo");
}

redobtn.addEventListener("click", function () {
    let redolast = redopathsry.pop();
    //let redo=redolast[0];
    console.log([redolast]);
    drawPaths([redolast], "redo");
})