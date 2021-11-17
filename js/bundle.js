class Factory {

    constructor(name) {
        this.name = name;
        this.money = 0;
        this.multiplier = 1;
        this.level = 1;
        this.multiUpgradePrice = 25;
        this.levelUpgradePrice = 50;
        this.gainAmount = 1;
        this.gainInterval = 100;
        this.speedUpgradePrice = 1e3
        this.isActive = false;
        this.totalCash = 0;
        this.achievements = [

        ]
        this.stats = {
            "name": this.name,
            "money": this.money,
            "multiplier": this.multiplier,
            "level": this.level,
            "gainAmount": this.gainAmount,
            "gainInterval": this.gainInterval,
            "totalCash":this.totalCash,
            "achievements":this.achievements,
            "prices": {
                "level": this.levelUpgradePrice,
                "multiplier": this.multiUpgradePrice,
                "speed": this.speedUpgradePrice
            }
        }
    }


    GainMoney(cash) {
        this.money += cash * this.multiplier
        this.totalCash += cash * this.multiplier
    }

    LooseMoney(cash) {
        this.money -= cash
    }

    UpgradeMultiplier() {
        this.money -= this.multiUpgradePrice
        this.multiplier += 1
        if (this.money < 1e+14) {
            this.multiUpgradePrice *= 4
        }
        if (this.money >= 1e+14) {
            this.multiUpgradePrice *= 8
        }
    }
    UpgradeLevel() {
        this.money -= this.levelUpgradePrice
        this.level += 1
        if (this.gainAmount == 1) {
            this.gainAmount = 2
        }

        if (this.money < 1e9) {
            this.gainAmount **= 1.380
            this.levelUpgradePrice **= 1.21

        } else if (this.money >= 1e12 && this.money < 1e20) {
            this.gainAmount **= 1.3825
            this.levelUpgradePrice **= 1.275
        } else if (this.money >= 1e20) {
            this.gainAmount **= 1.3485
            this.levelUpgradePrice **= 1.315
        } else {
            this.gainAmount **= 1.4
            this.levelUpgradePrice **= 1.275
        }
    }
    UpgradeSpeed() {
        this.money -= this.speedUpgradePrice
        this.speedUpgradePrice **= 1.5
        this.gainInterval /= 1.25

    }
}

var name_factory_input = prompt("What is the name of your factory?").slice(0, 25)
//name_factory_input = name_factory_input[0].toUpperCase() + name_factory_input.slice(1);
let factory = new Factory(`${name_factory_input}`);
//let factory = new Factory("Goose's Factory");
async function createFactory() {
    var factory_name_txt = document.getElementById("factory-name");
    var title = document.getElementsByTagName("title")[0];
    factory_name_txt.textContent = factory.name

    title.textContent = `${factory.name} | GFG`
    factory.isActive = true;
    if (!("hello-world-achievement" in factory.achievements))  {
        factory.achievements.push("hello-world-achievement")
    }
    while (factory.isActive) {
        factory.GainMoney(factory.stats.gainAmount)
        factory.stats = {
            "name": factory.name,
            "money": factory.money,
            "multiplier": factory.multiplier,
            "level": factory.level,
            "gainAmount": factory.gainAmount,
            "gainInterval": factory.gainInterval,
            "totalCash":factory.totalCash,
            "achievements":factory.achievements,
            "prices": {
                "level": factory.levelUpgradePrice,
                "multiplier": factory.multiUpgradePrice,
                "speed": factory.speedUpgradePrice
            }
        }
        var prog = document.getElementById("upgrade-progress")
        var money_txt = document.getElementsByClassName("money-count-text")[0];
        var progtext = `Next Level: ${factory.level+1}<br>Money: \$${String(toNumberName(Math.round(factory.money), "default", true, 1)).replace(" ", "").toLowerCase()}/\$${String(toNumberName(Math.round(factory.levelUpgradePrice), "default", true, 1)).replace(" ", "").toLowerCase()}<br><br>Next Multiplier: ${factory.multiplier+1}<br>Money: \$${String(toNumberName(Math.round(factory.money), "default", true, 1)).replace(" ", "").toLowerCase()}/\$${String(toNumberName(Math.round(factory.multiUpgradePrice), "default", true, 1)).replace(" ", "").toLowerCase()}`
        if (Math.round(factory.money) < 1e+21) {
            money_txt.textContent = `\$${toNumberName(Math.round(factory.money), "default", false, 2).toLowerCase()}`
            prog.innerHTML = progtext
        } else {
            //var progtext = `Next Level: ${factory.level+1}<br>Money: \$${numeral(Math.round(factory.money)).format('0.0a')}/\$${numeral(Math.round(factory.levelUpgradePrice)).format('0.0a')}<br><br>Next Multiplier: ${factory.multiplier+1}<br>Money: \$${numeral(Math.round(factory.money)).format('0.0a')}/\$${numeral(Math.round(factory.multiUpgradePrice)).format('0.0a')}`
            money_txt.textContent = `\$${toNumberName(Math.round(factory.money), "default", false, 2).toLowerCase()}`
            prog.innerHTML = progtext
        }
        if (document.getElementById("factory-create-button") != null) {
            document.getElementById("factory-create-button").remove();
        }
        var btns = document.getElementsByTagName("button")
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].id == "multi-upgrade-button") {
                if (factory.money < factory.multiUpgradePrice) {
                    btns[i].className = "expensive";
                }
                if (factory.money >= factory.multiUpgradePrice) {
                    btns[i].className = "purchaseable";
                }
            }
            if (btns[i].id == "level-upgrade-button") {
                if (factory.money < factory.levelUpgradePrice) {
                    btns[i].className = "expensive";
                }
                if (factory.money >= factory.levelUpgradePrice) {
                    btns[i].className = "purchaseable";
                }
            }
            if (btns[i].id == "speed-upgrade-button") {
                if (factory.money < factory.speedUpgradePrice) {
                    btns[i].className = "expensive";
                }
                if (factory.money >= factory.speedUpgradePrice) {
                    btns[i].className = "purchaseable";
                }
            }
        }
        let rndNum = getRndInteger(0, 1000);
        let notifier = document.getElementsByClassName("notifier")[0];
        if (rndNum >= 995) {
            notifier.id = "gain15%"
            notifier.children[0].innerHTML = "Gain 15% of current money?"
        }
        else if (rndNum == 500) {
            notifier.id = "gain50%"
            notifier.children[0].innerHTML = "Gain 50% of current money?"
        }
        if (!("monopoly-man-achievement" in factory.achievements)) {
            if (factory.totalCash >= 1e9) {
                factory.achievements.push("monopoly-man-achievement")
            } 
        }
        if (!("infinity-achievement" in factory.achievements)) {
            if (factory.money > 1e308) {
                factory.achievements.push("infinity-achievement")
            } 
        }
        await new Promise(resolve => setTimeout(resolve, factory.gainInterval));

    }
}

function upgradeFactory(btn) {
    var stats = document.getElementById("stat-tracker");
    var warning = document.getElementById("warning-message");
    var cashinterval = document.getElementById("cash-interval");
    if (btn.id == "multi-upgrade-button") {
        if (factory.money < factory.multiUpgradePrice) {
            //alert(`Not enough money! You need ${Math.round(factory.multiUpgradePrice - factory.money)} more dollars!`)
            warning.style.display = "block"
        }
        if (factory.money >= factory.multiUpgradePrice) {
            factory.UpgradeMultiplier()
        }
    }
    if (btn.id == "level-upgrade-button") {
        if (factory.money < factory.levelUpgradePrice) {
            //alert(`Not enough money! You need ${Math.round(factory.levelUpgradePrice - factory.money)} more dollars!`)
            warning.style.display = "block"
        }
        if (factory.money >= factory.levelUpgradePrice) {
            factory.UpgradeLevel()
        }

    }
    if (btn.id == "speed-upgrade-button") {
        if (factory.money < factory.speedUpgradePrice) {
            //alert(`Not enough money! You need ${Math.round(factory.levelUpgradePrice - factory.money)} more dollars!`)
            warning.style.display = "block"
        }
        if (factory.money >= factory.speedUpgradePrice) {
            factory.UpgradeSpeed()
        }

    }
    stats.textContent = `Level: ${factory.level} Multiplier: ${factory.multiplier}`
    cashinterval.textContent = `Cash Per Interval: \$${toNumberName(Math.round(factory.gainAmount * factory.multiplier), "default", true, 1).replace(" ", "")}/${Math.round(factory.gainInterval)}ms`
    if (factory.level == 42) {
        if (!("the-answer-achievement" in factory.achievements)) {
            factory.achievements.push("the-answer-achievement")
        }
    }
}

async function removeWarning(warning) {
    warning.parentElement.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 600));
    warning.parentElement.style.display = 'none';
    warning.parentElement.style.opacity = '1';
}

async function exportStats(parent) {
    var statFile = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(factory.stats));
    var downloadLink = parent.children[0];
    downloadLink.href = statFile;
    var d = new Date()
    downloadLink.download = `${factory.name}factoryStats-${d}.json`;
    downloadLink.innerHTML = 'Export Stats (Raw JSON)';

}



const getJsonUpload = () =>
  new Promise(resolve => {
    const inputFileElement = document.createElement('input')
    inputFileElement.setAttribute('type', 'file')
    inputFileElement.setAttribute('multiple', 'true')
    inputFileElement.setAttribute('accept', '.json')
    
    inputFileElement.addEventListener(
      'change',
      async (event) => {
        const { files } = event.target
        if (!files) {
          return
        }

        const filePromises = [...files].map(file => file.text())

        resolve(await Promise.all(filePromises))
      },
      false,
    )
    inputFileElement.click()
})




async function uploadJson() {
    const jsonFiles = await getJsonUpload()
    const jsonStats = JSON.parse(jsonFiles[0])
    factory.stats = jsonStats
    factory.name =  jsonStats["name"]
    factory.money = jsonStats["money"]
    factory.level = jsonStats["level"]
    factory.multiplier = jsonStats["multiplier"]
    factory.gainAmount = jsonStats["gainAmount"]
    factory.gainInterval = jsonStats["gainInterval"]
    factory.levelUpgradePrice = jsonStats["prices"]["level"]
    factory.multiUpgradePrice = jsonStats["prices"]["multiplier"]
    factory.speedUpgradePrice = jsonStats["prices"]["speed"]
    var factory_name_txt = document.getElementById("factory-name");
    var title = document.getElementsByTagName("title")[0];
    factory_name_txt.textContent = factory.name
    title.textContent = `${factory.name} | GFG`
}

async function changeTheme(theme) {
    const themes = {
        "festive":{
            "background":"festive-bg",
            "box":"festive-box"
        },
        "default":{
            "background":"default",
            "box":"default-box"
        },
        "spooky":{
            "background":"spooky-bg",
            "box":"spooky-box"
        }
    }
    const themeBackground = document.getElementsByClassName("theme-background")[0];
    const themeBox = document.getElementById("theme-box");
    themeBackground.id = themes[theme]["background"]
    themeBox.className = themes[theme]["box"]
    if (theme == "festive") {
        particlesjs = document.createElement("div");
        document.body.insertBefore(particlesjs, themeBackground);
        themeBackground.style.display = "none";
        particlesjs.id = "particles-js";
        var s1 = document.createElement("script");
        s1.src = "./js/particles.js"
        var s2 = document.createElement("script");
        s2.src = "./js/app.js"
        document.body.appendChild(s1)
        document.body.appendChild(s2)
    }
    else if (theme != "festive") {
        const particlesjs = document.getElementById("particles-js")
        if (particlesjs != null) {
            particlesjs.remove()
            document.body.removeChild(document.body.lastElementChild)
            document.body.removeChild(document.body.lastElementChild)
        }
        if (theme == "default") {
            document.body.style = "background: linear-gradient(343deg, rgba(0,0,0,1) 0%, rgba(0, 0, 0, 1) 65%);"
        }
        else if (theme == "spooky") {
            document.body.style= "background: linear-gradient(343deg, rgba(0,0,0,1) 0%, rgba(93,22,16,0.9304096638655462) 65%);"
        }
    }
    
}

function percentage(percent, total) {
    return (percent / 100) * total 
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function claimRewards(reward) {
    var notifier = document.getElementsByClassName("notifier")[0];
    if (reward == "gain15%") {
        factory.money += percentage(15, factory.money)
        factory.totalCash += percentage(15, factory.money)
        notifier.children[0].innerHTML = "No new alerts"
        notifier.id = ""
    }
    else if (reward == "gain50%") {
        factory.money += percentage(50, factory.money)
        factory.totalCash += percentage(50, factory.money)
        notifier.children[0].innerHTML = "No new alerts"
        notifier.id = ""
    }
    else if (reward == "") {
        // pass
    }
}

function changeTab(selectedTab) {
    let mainBox = document.getElementById("theme-box")
    let factoryTab = document.getElementById("factory-tab")
    let achievementTab = document.getElementById("achievements-tab")
    let creditsTab = document.getElementById("credits-tab")
    let factoryButtons = document.getElementById("factory-buttons")
    let achievementsButton = document.getElementById("achievements-button")
    let sAchievementsButton = document.getElementById("save-achievements-button")
    let warning2 = document.getElementById("notification-friendly")
    let warning = document.getElementById("warning-message")
    if (selectedTab == "factory") {
        factoryTab.style.display = "block"
        creditsTab.style.display = "none"
        achievementTab.style.display = "none"
        factoryButtons.style.display = "block"
        achievementsButton.style.display = "none"
        sAchievementsButton.style.display = "none"
    }
    else if (selectedTab == "achievements") {
        factoryTab.style.display = "none"
        creditsTab.style.display = "none"
        achievementTab.style.display = "block"
        factoryButtons.style.display = "none"
        achievementsButton.style.display = "inline"
        sAchievementsButton.style.display = "inline"
        warning.style.display = "none"
        warning2.style.display = "none"

    }
    else if (selectedTab == "credits") {
        factoryTab.style.display = "none"
        achievementTab.style.display = "none"
        creditsTab.style.display = "block"
        factoryButtons.style.display = "none"
        achievementsButton.style.display = "none"
        sAchievementsButton.style.display = "none"
        warning.style.display = "none"
        warning2.style.display = "none"
    }
}

function timeUntilUpgrade(upgrade) {
    let amountPerSecond = (factory.gainAmount * 1000) / factory.gainInterval
    let amountRemaining = factory.stats["prices"][upgrade] - factory.money
    let timeRemaining = amountRemaining / amountPerSecond
    return `${Math.round(timeRemaining)} Seconds`
}

async function alertTime() {
    const friendlyNotice = document.getElementById("notification-friendly")
    friendlyNotice.style.display = "block"
    friendlyNotice.innerHTML = `<span class="closebtn" onclick="removeWarning(this)">&times;</span> ${timeUntilUpgrade('level')} until level upgrade, ${timeUntilUpgrade('multiplier')} until mutliplier upgrade and ${timeUntilUpgrade('speed')} until speed upgrade`
}

async function loadAchievements() {
    factory.achievements = JSON.parse(localStorage.achievements)
    for (let achievementNum in factory.achievements) {
        const achievementId = factory.achievements[achievementNum]
        const achievement = document.getElementById(achievementId)
        achievement.className = "achievement-unlocked"

    }
}

async function saveAchievements() {
    localStorage.achievements = JSON.stringify(factory.achievements)
}