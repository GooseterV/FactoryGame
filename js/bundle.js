// noinspection SpellCheckingInspection,JSUnresolvedFunction

class Factory {

    constructor(name) {
        this.name = name;
        this.money = ExpantaNum(0);
        this.multiplier = 1;
        this.level = 1;
        this.multiUpgradePrice = ExpantaNum(25);
        this.levelUpgradePrice = ExpantaNum(50);
        this.gainAmount = ExpantaNum(1);
        this.gainInterval = 100;
        this.speedUpgradePrice = ExpantaNum(1000);
        this.isActive = false;
        this.totalCash = ExpantaNum(0);
        this.achievements = [];
        this.stats = {
            "name": this.name,
            "money": this.money,
            "multiplier": this.multiplier,
            "level": this.level,
            "gainAmount": this.gainAmount,
            "gainInterval": this.gainInterval,
            "totalCash": this.totalCash,
            "achievements": this.achievements,
            "prices": {
                "level": this.levelUpgradePrice,
                "multiplier": this.multiUpgradePrice,
                "speed": this.speedUpgradePrice
            }
        }
    }


    GainMoney(cash) {
        this.money = this.money.add(cash.mul(this.multiplier));
        this.totalCash = this.totalCash.add(cash.mul(this.multiplier));
    }

    UpgradeMultiplier() {
        this.money = this.money.sub(this.multiUpgradePrice);
        this.multiplier++;
        if (this.money.gte(1e14)) {
            this.multiUpgradePrice = this.multiUpgradePrice.mul(8);
        } else {
            this.multiUpgradePrice = this.multiUpgradePrice.mul(4);
        }
    }

    UpgradeLevel() {
        this.money = this.money.sub(this.levelUpgradePrice);
        this.level++;
        if (this.gainAmount.eq(1)) {
            this.gainAmount = ExpantaNum(2);
        }
        this.gainAmount = this.gainAmount.pow(1.2);
        // this.gainAmount = this.gainAmount.pow(ExpantaNum(0.4).div(this.money.slog(10).div(200).add(1)).add(1));
        this.levelUpgradePrice = this.levelUpgradePrice.pow(1.21);
    }

    UpgradeSpeed() {
        this.money = this.money.sub(this.speedUpgradePrice);
        this.speedUpgradePrice = this.speedUpgradePrice.pow(1.5);
        this.gainInterval /= 1.25;
    }
}

let name_factory_input = prompt("What is the name of your factory?");
if (name_factory_input.length > 27) name_factory_input = `${name_factory_input.slice(0, 25)}...`;
let factory = new Factory(String(name_factory_input));

//let factory = new Factory("Goose's Factory");
async function createFactory() {
    const factory_name_txt = document.getElementById("factory-name");
    const title = document.getElementsByTagName("title")[0];
    factory_name_txt.textContent = factory.name;

    title.textContent = `${factory.name} | GFG`;
    factory.isActive = true;
    if (!("hello-world-achievement" in factory.achievements)) {
        factory.achievements.push("hello-world-achievement");
    }
    while (factory.isActive) {
        factory.GainMoney(factory.stats.gainAmount);
        factory.stats = {
            "name": factory.name,
            "money": factory.money,
            "multiplier": factory.multiplier,
            "level": factory.level,
            "gainAmount": factory.gainAmount,
            "gainInterval": factory.gainInterval,
            "totalCash": factory.totalCash,
            "achievements": factory.achievements,
            "prices": {
                "level": factory.levelUpgradePrice,
                "multiplier": factory.multiUpgradePrice,
                "speed": factory.speedUpgradePrice
            }
        }
		
        document.getElementsByClassName("money-count-text")[0].textContent = `$${numberName(factory.money, false, true, 2).toLowerCase()}`;

        document.getElementById("upgrade-progress").innerHTML = `Next Level: ${factory.level + 1}<br>Money: $${String(numberName(factory.money, true, true, 1)).replace(" ", "").toLowerCase()}/$${String(numberName(factory.levelUpgradePrice, true, true, 1)).replace(" ", "").toLowerCase()} (${timeUntilUpgrade('level')})<br><br>Next Multiplier: ${factory.multiplier + 1}<br>Money: $${String(numberName(factory.money, true, true, 1)).replace(" ", "").toLowerCase()}/$${String(numberName(factory.multiUpgradePrice, true, true, 1)).replace(" ", "").toLowerCase()} (${timeUntilUpgrade('multiplier')})<br><br>Next Speed: ${Math.round(factory.gainInterval / 1.25) !== 0 ? Math.round(factory.gainInterval / 1.25) : "<1"}ms<br>Money: $${String(numberName(factory.money, true, true, 1)).replace(" ", "").toLowerCase()}/$${String(numberName(factory.speedUpgradePrice, true, true, 1)).replace(" ", "").toLowerCase()} (${timeUntilUpgrade('speed')})`;
		
        if (document.getElementById("factory-create-button") != null) {
            document.getElementById("factory-create-button").remove();
        }
        const btns = document.getElementsByTagName("button");
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].id === "multi-upgrade-button") {
                if (factory.money.lt(factory.multiUpgradePrice)) {
                    btns[i].className = "expensive";
                } else {
                    btns[i].className = "purchaseable";
                }
            }
            if (btns[i].id === "level-upgrade-button") {
                if (factory.money.lt(factory.levelUpgradePrice)) {
                    btns[i].className = "expensive";
                } else {
                    btns[i].className = "purchaseable";
                }
            }
            if (btns[i].id === "speed-upgrade-button") {
                if (factory.money.lt(factory.speedUpgradePrice)) {
                    btns[i].className = "expensive";
                } else {
                    btns[i].className = "purchaseable";
                }
            }
        }
        let rndNum = getRndInteger(0, 1000);
        let notifier = document.getElementsByClassName("notifier")[0];
        if (rndNum >= 995) {
            notifier.id = "gain15%";
            notifier.children[0].innerHTML = "Gain 15% of current money?";
        } else if (rndNum === 500) {
            notifier.id = "gain50%";
            notifier.children[0].innerHTML = "Gain 50% of current money?";
        }
        if (!("monopoly-man-achievement" in factory.achievements)) {
            if (factory.totalCash.gte(1e9)) {
                factory.achievements.push("monopoly-man-achievement");
            }
        }
        if (!("infinity-achievement" in factory.achievements)) {
            if (factory.money.gt(1e308)) {
                factory.achievements.push("infinity-achievement");
            }
        }
        await new Promise(resolve => setTimeout(resolve, factory.gainInterval));

    }
}

function upgradeFactory(btn) {
    const stats = document.getElementById("stat-tracker");
    const warning = document.getElementById("warning-message");
    const cashinterval = document.getElementById("cash-interval");
    if (btn.id === "multi-upgrade-button") {
        if (factory.money.lt(factory.multiUpgradePrice)) {
            //alert(`Not enough money! You need ${Math.round(factory.multiUpgradePrice - factory.money)} more dollars!`)
            //warning.style.display = "block"
        } else {
            factory.UpgradeMultiplier();
        }
    }
    if (btn.id === "level-upgrade-button") {
        if (factory.money.lt(factory.levelUpgradePrice)) {
            //alert(`Not enough money! You need ${Math.round(factory.levelUpgradePrice - factory.money)} more dollars!`)
            //warning.style.display = "block"
        } else {
            factory.UpgradeLevel();
        }

    }
    if (btn.id === "speed-upgrade-button") {
        if (factory.money.lt(factory.speedUpgradePrice)) {
            //alert(`Not enough money! You need ${Math.round(factory.levelUpgradePrice - factory.money)} more dollars!`)
            //warning.style.display = "block"
        } else {
            factory.UpgradeSpeed();
        }

    }
    stats.textContent = `Level: ${factory.level} Multiplier: ${factory.multiplier}`;
    cashinterval.textContent = `Cash Per Interval: $${numberName(factory.gainAmount.mul(factory.multiplier), true, true, 1).replace(" ", "").toLowerCase()}/${Math.round(factory.gainInterval) !== 0 ? Math.round(factory.gainInterval) : "<1"}ms`;
    if (factory.level === 42) {
        if (!("the-answer-achievement" in factory.achievements)) {
            factory.achievements.push("the-answer-achievement");
        }
    }
}

async function removeWarning(warning) {
    warning.parentElement.style.opacity = "0";
    await new Promise(resolve => setTimeout(resolve, 600));
    warning.parentElement.style.display = "none";
    warning.parentElement.style.opacity = "1";
}

async function exportStats(parent) {
    const statFile = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(factory.stats))}`;
    const downloadLink = parent.children[0];
    downloadLink.href = statFile;
    const d = new Date();
    downloadLink.download = `${factory.name}factoryStats-${d}.json`;
    downloadLink.innerHTML = "Export Stats (Raw JSON)";

}


const getJsonUpload = () =>
    new Promise(resolve => {
        const inputFileElement = document.createElement('input');
        inputFileElement.setAttribute('type', 'file');
        inputFileElement.setAttribute('multiple', 'true');
        inputFileElement.setAttribute('accept', '.json');

        inputFileElement.addEventListener(
            'change',
            async event => {
                const {files} = event.target;
                if (!files) {
                    return;
                }

                const filePromises = [...files].map(file => file.text());

                resolve(await Promise.all(filePromises));
            },
            false
        )
        inputFileElement.click();
    })


async function uploadJson() {
    const jsonFiles = await getJsonUpload();
    const jsonStats = JSON.parse(jsonFiles[0]);
    factory.stats = jsonStats;
    factory.name = jsonStats.name;
    factory.money = ExpantaNum(jsonStats.money);
    factory.level = jsonStats.level;
    factory.multiplier = jsonStats.multiplier;
    factory.gainAmount = ExpantaNum(jsonStats.gainAmount);
    factory.gainInterval = jsonStats.gainInterval;
    factory.levelUpgradePrice = ExpantaNum(jsonStats.prices.level);
    factory.multiUpgradePrice = ExpantaNum(jsonStats.prices.multiplier);
    factory.speedUpgradePrice = ExpantaNum(jsonStats.prices.speed);
    const factory_name_txt = document.getElementById("factory-name");
    const title = document.getElementsByTagName("title")[0];
    factory_name_txt.textContent = factory.name;
    title.textContent = `${factory.name} | GFG`;
}

async function changeTheme(theme) {
    const themes = {
        "festive": {
            "background": "festive-bg",
            "box": "festive-box"
        },
        "default": {
            "background": "default",
            "box": "default-box"
        },
        "spooky": {
            "background": "spooky-bg",
            "box": "spooky-box"
        }
    }
    const themeBackground = document.getElementsByClassName("theme-background")[0];
    const themeBox = document.getElementById("theme-box");
    themeBackground.id = themes[theme]["background"];
    themeBox.className = themes[theme]["box"];
    if (theme === "festive") {
        particlesjs = document.createElement("div");
        document.body.insertBefore(particlesjs, themeBackground);
        themeBackground.style.display = "none";
        particlesjs.id = "particles-js";
        const s1 = document.createElement("script");
        s1.src = "./js/particles.js";
        const s2 = document.createElement("script");
        s2.src = "./js/app.js";
        document.body.appendChild(s1);
        document.body.appendChild(s2);
    } else if (theme !== "festive") {
        const particlesjs = document.getElementById("particles-js");
        if (particlesjs != null) {
            particlesjs.remove();
            document.body.removeChild(document.body.lastElementChild);
            document.body.removeChild(document.body.lastElementChild);
        }
        if (theme === "default") {
            document.body.style.background = "linear-gradient(343deg, rgba(0,0,0,1) 0%, rgba(0, 0, 0, 1) 65%)";
        } else if (theme === "spooky") {
            document.body.style.background = "linear-gradient(343deg, rgba(0,0,0,1) 0%, rgba(93,22,16,0.9304096638655462) 65%)";
        }
    }

}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function claimRewards(reward) {
    const notifier = document.getElementsByClassName("notifier")[0];
    if (reward === "gain15%") {
        factory.totalCash = factory.totalCash.add(factory.money.mul(0.15));
        factory.money = factory.money.mul(1.15);
        notifier.children[0].innerHTML = "No new alerts";
        notifier.id = "";
    } else if (reward === "gain50%") {
        factory.totalCash = factory.totalCash.add(factory.money.mul(0.5));
        factory.money = factory.money.mul(1.5);
        notifier.children[0].innerHTML = "No new alerts";
        notifier.id = "";
    } else if (reward === "") {
        // pass
    }
}

function changeTab(selectedTab) {
    document.getElementById("theme-box");
    let factoryTab = document.getElementById("factory-tab");
    let achievementTab = document.getElementById("achievements-tab");
    let creditsTab = document.getElementById("credits-tab");
    let factoryButtons = document.getElementById("factory-buttons");
    let achievementsButton = document.getElementById("achievements-button");
    let sAchievementsButton = document.getElementById("save-achievements-button");
    let warning2 = document.getElementById("notification-friendly");
    let warning = document.getElementById("warning-message");
    if (selectedTab === "factory") {
        factoryTab.style.display = "block";
        creditsTab.style.display = "none";
        achievementTab.style.display = "none";
        factoryButtons.style.display = "block";
        achievementsButton.style.display = "none";
        sAchievementsButton.style.display = "none";
    } else if (selectedTab === "achievements") {
        factoryTab.style.display = "none";
        creditsTab.style.display = "none";
        achievementTab.style.display = "block";
        factoryButtons.style.display = "none";
        achievementsButton.style.display = "inline";
        sAchievementsButton.style.display = "inline";
        warning.style.display = "none";
        warning2.style.display = "none";

    } else if (selectedTab === "credits") {
        factoryTab.style.display = "none";
        achievementTab.style.display = "none";
        creditsTab.style.display = "block";
        factoryButtons.style.display = "none";
        achievementsButton.style.display = "none";
        sAchievementsButton.style.display = "none";
        warning.style.display = "none";
        warning2.style.display = "none";
    }
}

function timeUntilUpgrade(upgrade) {
	// 0.75
    let amountPerSecond = factory.gainAmount.mul(1000).mul(factory.multiplier).div(factory.gainInterval);
    let amountRemaining = factory.stats.prices[upgrade].sub(factory.money);
    let timeRemaining = amountRemaining.div(amountPerSecond);
	let count = 0;
	if (timeRemaining.lt(0)) timeRemaining = ExpantaNum(0);
	if (upgrade === "multiplier") {
		let total = 0;
		let arr = [1, 1.25, 1.3125, 1.328125, 1 / 0.75];
		count = factory.money.div(factory.multiUpgradePrice).logBase(4).add(1);
	}
	const x = timeRemaining <= 0 ? "ready" : timeRemaining <= 1 ? "<1 sec" : convertTime(timeRemaining);
    return (x[x.length - 1] === " " ? x.slice(0, x.length - 1) : x).toLowerCase();
}

async function alertTime() {
    const friendlyNotice = document.getElementById("notification-friendly");
    friendlyNotice.style.display = "block";
    friendlyNotice.innerHTML = `<span class="closebtn" onclick="removeWarning(this)">&times;</span> ${timeUntilUpgrade('level')} until level upgrade, ${timeUntilUpgrade('multiplier')} until multiplier upgrade and ${timeUntilUpgrade('speed')} until speed upgrade`;
}

async function loadAchievements() {
    factory.achievements = JSON.parse(localStorage.achievements);
    for (let achievementNum in factory.achievements) {
        const achievementId = factory.achievements[achievementNum];
        const achievement = document.getElementById(achievementId);
        achievement.className = "achievement-unlocked";
    }
}

async function saveAchievements() {
    localStorage.achievements = JSON.stringify(factory.achievements);
}

function convertTime(time) {
	if (time === Infinity) {
		return "Forever";
	} else if (time >= 2 ** 53) {
		return `${numberName(time / 31536000, false, true)} yr`;
	} else if (time >= 31536000) {
		return `${Math.floor(time / 31536000)} yr ${convertTime(time % 31536000)}`;
	} else if (time >= 86400) {
		return `${Math.floor(time / 86400)} d ${convertTime(time % 86400)}`;
	} else if (time >= 3600) {
		return `${Math.floor(time / 3600)} hr ${convertTime(time % 3600)}`;
	} else if (time >= 60) {
		return `${Math.floor(time / 60)} min ${convertTime(time % 60)}`;
	} else if (time >= 1) {
		return `${Math.floor(time)} sec ${convertTime(time % 1)}`;
	} else {
		return "";
	}
}