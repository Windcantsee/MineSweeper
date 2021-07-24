var MineLength=30;
var MineWidth = 16;
var MineNumber =99;
if(!confirm("是否使用默认配置")) {
    putinLength = Number(prompt('请输入长度：', ''));
    putinWidth = Number(prompt('请输入宽度：', ''));
    putinNumber = Number(prompt('请输入雷数：', ''));
    MineLength = (putinLength >= 10 && putinLength <= 40) ? putinLength : 30;
    MineWidth = ( putinWidth >= 10 && putinWidth <= 30) ? putinWidth : 16;
    MineNumber = (putinNumber >= 10 && putinNumber <= MineLength * MineWidth) ? putinNumber : Math.round(MineLength * MineWidth * 0.206);
}
var mineArr = new Array(MineWidth);
var mineNum = MineNumber;
var freeMine = MineNumber;

//设置区
document.write("<div id='mine' class='mineWindow'>");
for(var i = 0 ;i<MineWidth;i++){
    mineArr[i]=new Array(MineLength);
    document.write("<div id='in"+i+"' class='mineLine'>");
    for(var j=0;j<MineLength;j++)
        setMine(i,j);
    document.write("</div>");
}
document.write("</div>");

document.write("<div id='image' class='mineWindow'>");
for(var i = 0 ;i<MineWidth;i++){
    document.write("<div id='i"+i+"' class='mineLine'>");
    for(var j=0;j<MineLength;j++){
        document.write("<a class='j"+j+"' onmousedown='whichButton(event,"+i+","+j+")' onmouseup='action(event,"+i+","+j+")'>"+"</a>");
        setNum(i,j);
    }
    document.write("</div>");
}
document.write("</div>");

/**
 * 设置雷数
 */


function setMine(i, j) {
    var flag = Math.random() > mineNum / (MineLength * MineWidth - (i * MineLength + j));
    if (flag) {
        document.write("<span class='j" + j + "'></span>");
        mineArr[i][j] = 0;
    } else {
        document.write("<span class='j" + j + "' style='background-image: url(Image/mine.png)'></span>");
        mineNum--;
        mineArr[i][j] = -1;
    }
}
/**
 * 设置非雷数字
 */
function setNum(i, j) {
    if (mineArr[i][j] == -1) return;
    for (m = i - 1; m <= i + 1; m++)
        for (n = j - 1; n <= j + 1; n++) {
            if (m < 0 || n < 0 || m >= mineArr.length || n >= mineArr[m].length)
                continue;
            if (mineArr[m][n] == -1)
                mineArr[i][j]++;
        }
    if (mineArr[i][j] == 0)
        return;
    $("#in" + i + ">.j" + j)[0].innerHTML = mineArr[i][j];
}

Left_Flag = false;
Right_Flag = false;
RL_Flag = false;

function whichButton(event,i,j) {
    var btnNum = event.button;
    if (btnNum == 2) //右键
        Right_Flag = true;
    else if (btnNum == 0) //左键
        Left_Flag = true;
    if (Right_Flag && Left_Flag) {
        if ($("#i" + i + ">.j" + j)[0].style.opacity != "0")
            return;
        for (var m = i - 1; m <= i + 1; m++)
            for (var n = j - 1; n <= j + 1; n++) {
                if (m < 0 || n < 0 || m >= mineArr.length || n >= mineArr[0].length)
                    continue;
                if ((i != m || j != n) && $("#i" + m + ">.j" + n)[0].innerHTML == "")
                    $("#i" + m + ">.j" + n).css("background", "url('Image/T.png')")
            }
    }
}
function action(event, i, j) {
    if (Left_Flag && Right_Flag && !RL_Flag) {
        LRclick(i, j);
        RL_Flag = true;
        return;
    }
    if (RL_Flag) {
        Right_Flag = false;
        Left_Flag = false;
        RL_Flag = false;
        return;
    }
    var btnNum = event.button;
    if (btnNum == 2) {//右键
        putFlag(i, j);
        Right_Flag = false;
    }
    else if (btnNum == 0) {//左键
        click(i, j);
        Left_Flag = false;
    }
    for (var m = i - 1; m <= i + 1; m++)
        for (var n = j - 1; n <= j + 1; n++) {
            if (m < 0 || n < 0 || m >= mineArr.length || n >= mineArr[0].length)
                continue;
            if (i == m && n == j) continue;
            if ($("#i" + m + ">.j" + n)[0].innerHTML == ""&&$("#i" + m + ">.j" + n)[0].background!="url('Image/Z.png')")
                $("#i" + m + ">.j" + n).css("background", "url('Image/Z.png')");
        }
}


main_button=true;
/**
 * 点击
 */
function click(i, j) {
    if ($("#i" + i + ">.j" + j)[0].innerHTML != "")
        return;
    if (mineArr[i][j] == -1) {
        alert("you lose!!");
        for (var i = 0; i < MineWidth; i++)
            for (var j = 0; j < MineLength; j++)
                $("#i" + i + ">.j" + j).css("opacity", "0");
        main_button=false;
        return
    }
    aclick(i, j);
    var searchNumber = 0;
    for (var i = 0; i < MineWidth; i++)
        for (var j = 0; j < MineLength; j++)
            if ($("#i" + i + ">.j" + j)[0].style.opacity != "0")
                searchNumber++;
    if (searchNumber == MineNumber) {
        alert("you win!!!")
        main_button=false;
    }
}

/**
 *单击
 */
function aclick(i, j) {
    if (mineArr[i][j] == 0)
        for (var m = i - 1; m <= i + 1; m++)
            for (var n = j - 1; n <= j + 1; n++) {
                if (m < 0 || n < 0 || m >= mineArr.length || n >= mineArr[0].length)
                    continue;
                if ($("#i" + m + ">.j" + n)[0].style.opacity != "0")
                    if ((m != i || n != j) && mineArr[m][n] == 0)
                        aclick(m, n);
                $("#i" + m + ">.j" + n).css("opacity", "0");
            }
    else
        $("#i" + i + ">.j" + j).css("opacity", "0");
}

/**
 *  双击
 */
function LRclick(i, j) {
    if ($("#i" + i + ">.j" + j)[0].style.opacity != "0")
        return;
    var num = 0;
    for (var m = i - 1; m <= i + 1; m++)
        for (var n = j - 1; n <= j + 1; n++) {
            if (m < 0 || n < 0 || m >= mineArr.length || n >= mineArr[0].length)
                continue;
            if (i == m && n == j) continue;
            if ($("#i" + m + ">.j" + n)[0].innerHTML != "")
                num++;
            else
                $("#i" + m + ">.j" + n).css("background", "url('Image/Z.png')");
        }
    if (num == mineArr[i][j])
        for (var m = i - 1; m <= i + 1; m++)
            for (var n = j - 1; n <= j + 1; n++) {
                if (m < 0 || n < 0 || m >= mineArr.length || n >= mineArr[0].length)
                    continue;
                if ((i != m || j != n) && $("#i" + m + ">.j" + n)[0].innerHTML == ""&&main_button)
                    click(m, n);
            }
}





/**
 * 插旗
 */
function putFlag(i, j) {
    var $stl = $("#i" + i + ">.j" + j);
    if ($stl[0].style.opacity == "0")
        return;
    if ($stl[0].innerHTML == "") {
        $stl[0].innerHTML = "<div class='flag' ></div>";
        $("#mineNumber")[0].innerHTML="剩余雷数："+ --freeMine;
    } else {
        $stl[0].innerHTML = "";
        $("#mineNumber")[0].innerHTML = "剩余雷数：" + ++freeMine;
    }
}
$(document).ready(function () {
    $("#mineNumber")[0].innerHTML = "剩余雷数：" +freeMine;
})
function stop(){
    return false
}
$(".mineWindow")[0].oncontextmenu=stop;
$(".mineWindow")[1].oncontextmenu=stop;