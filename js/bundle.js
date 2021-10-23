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
        this.isActive = false;
    }


    GainMoney(cash) {
        this.money += cash * this.multiplier
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

        }
        else if (this.money >= 1e+14) {
            this.gainAmount **= 1.375
            this.levelUpgradePrice **= 1.30
        }
        else if (this.money >= 1e+20) {
            this.gainAmount **= 1.370
            this.levelUpgradePrice **= 1.35
        }
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
    while (factory.money >= 0) {

        factory.GainMoney(factory.gainAmount)
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
        }
        await new Promise(resolve => setTimeout(resolve, factory.gainInterval));

        //process.stdout.write(`\r\$${factory.money}`)
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
    stats.textContent = `Level: ${factory.level} Multiplier: ${factory.multiplier}`
    cashinterval.textContent = `Cash Per Interval: \$${toNumberName(Math.round(factory.gainAmount * factory.multiplier), "default", true, 1).replace(" ", "")}/${factory.gainInterval}ms`
}

async function removeWarning(warning) {
    warning.parentElement.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 600));
    warning.parentElement.style.display = 'none';
    warning.parentElement.style.opacity = '1';
}