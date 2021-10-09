
class Factory {

    constructor(name) {
        this.name = name;
        this.money = 0;
        this.multiplier = 1;
        this.level = 1;
        this.multiUpgradePrice = 25;
        this.levelUpgradePrice = 50;
        this.gainAmount = 1;
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
        this.multiUpgradePrice *= 4
    }
    UpgradeLevel() {
        this.money -= this.levelUpgradePrice
        this.level += 1
        if (this.gainAmount == 1) {
            this.gainAmount = 2
        }
        this.gainAmount **= 1.4 //+= this.gainAmount / 100 * 75
        this.levelUpgradePrice *= 3.75
        
    }
}
var name_factory_input = prompt("What is your name?")
name_factory_input = name_factory_input[0].toUpperCase() + name_factory_input.slice(1);
let factory = new Factory(`${name_factory_input}'s Factory`);
//let factory = new Factory("Goose's Factory");
async function createFactory() {
    var factory_name_txt = document.getElementById("factory-name");
    var title = document.getElementsByTagName("title")[0];
    factory_name_txt.textContent = factory.name
    title.textContent = `${factory.name} | GFG`
    
    while (factory.money >= 0) {
        
        factory.GainMoney(factory.gainAmount)
        var prog = document.getElementById("upgrade-progress")
        var money_txt = document.getElementsByClassName("money-count-text")[0];
        var progtext = `Next Level: ${factory.level+1}<br>Money: \$${numeral(Math.round(factory.money)).format('0.0a')}/\$${numeral(Math.round(factory.levelUpgradePrice)).format('0.0a')}<br><br>Next Multiplier: ${factory.multiplier+1}<br>Money: \$${numeral(Math.round(factory.money)).format('0.0a')}/\$${numeral(Math.round(factory.multiUpgradePrice)).format('0.0a')}`
        if (Math.round(factory.money) < 1e+21) {
            money_txt.textContent = `\$${Math.round(factory.money).toLocaleString()}`
            prog.innerHTML = progtext
        } else {
            money_txt.textContent = `\$${Math.round(factory.money)}`
            prog.innerHTML = progtext
        }
        if (document.getElementsByClassName("factory-create-button").length >= 1) {
            document.getElementById("factory-create-button").remove();
        }
        await new Promise(resolve => setTimeout(resolve, 100));

        //process.stdout.write(`\r\$${factory.money}`)
    }
}

function upgradeFactory(btn) {
    var stats = document.getElementById("stat-tracker");
    var warning = document.getElementById("warning-message");
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
}

async function removeWarning(warning) {
    warning.parentElement.style.opacity='0';
    await new Promise(resolve => setTimeout(resolve, 600));
    warning.parentElement.style.display='none';
    warning.parentElement.style.opacity='1';
}