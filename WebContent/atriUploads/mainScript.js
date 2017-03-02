var gearEXP, rosterCount=2;
var op="",z,y;
var temp = "";

/*------Start of JSON file------*/
/* This needs to be moved to the Json File */

var wList = [];

bList = [
	{
		"bossName": "Vale Guardian",
		"totalBuilds": 1,
		"build": [[30,62,00,70,90,31,60,01,70,90]]
		},
	{
		"bossName": "Gorseval",
		"totalBuilds": 2,
		"build":[[30,62,01,41,64,31,61,01,64,70],[30,60,01,90,92,31,60,01,90,92]]
		},
	{
		"bossName": "Sabetha",
		"totalBuilds": 1,
		"build": [[31,62,01,90,92,31,60,01,90,92]]
		},

	{
		"bossName": "Slothasor",
		"totalBuilds": 1,
		"build": [[31,62,01,50,92,31,61,01,50,92]]
		},
	{
		"bossName": "Bandit Trio",
		"totalBuilds": 1,
		"build": [[31,62,01,50,92,31,62,01,50,92]]
		},
	{
		"bossName": "Matthias",
		"totalBuilds": 1,
		"build":	[[31,60,01,50,90,31,60,01,50,90]]
		},

	{
		"bossName": "Seigeing the Castle",
		"totalBuilds": 1,
		"build": [[31,63,00,01,92,31,62,01,90,90]]
		},
	{
		"bossName": "Keep Construct",
		"totalBuilds": 1,
		"build": [[30,61,00,41,41,31,61,00,41,93]]
		},
	{
		"bossName": "Xera",
		"totalBuilds": 1,
		"build": [[30,60,01,90,92,31,60,01,90,92]]
		},
	{
		"bossName":"Cairn",
		"totalBuilds": 1,
		"build": [[31,60,01,92,92,31,60,01,92,42]]
		},
	{
		"bossName":"Overseer",
		"totalBuilds": 1,
		"build": [[31,60,01,50,92,31,60,01,50,92]]
		},
	{
		"bossName":"Samarog",
		"totalBuilds": 1,
		"build": [[31,60,01,90,92,31,60,01,90,92]]
		},
	{
		"bossName":"Deimos",
		"totalBuilds": 1,
		"build": [[30,60,01,92,92,31,60,01,92,20]]
		}
];

gearExp = {
	"nameList": [
		{
			"personName":	"Atri",
			"gearedBuilds": {
			"00": 4,
			"01": 4,
			"02": 0,
			"10": 4,
			"11": 4,
			"12": 4,
			"13": 4,
			"20": 3,
			"21": 4,
			"30": 3,
			"31": 4,
			"32": 0,
			"40": 4,
			"41": 4,
			"42": 3,
			"50": 4,
			"60": 4,
			"61": 4,
			"62": 4,
			"63": 4,
			"64": 4,
			"70": 3,
			"71": 4,
			"80": 3,
			"81": 0
			}
		},
		{
			"personName": "Toby",
			"gearedBuilds": {
			"00": 4,
			"01": 4,
			"02": 4,
			"10": 4,
			"11": 4,
			"12": 4,
			"13": 4,
			"20": 4,
			"21": 4,
			"30": 2,
			"31": 2,
			"32": 2,
			"40": 2,
			"41": 2,
			"42": 2,
			"50": 0,
			"60": 0,
			"61": 4,
			"62": 0,
			"63": 4,
			"64": 2,
			"70": 0,
			"71": 0,
			"80": 0,
			"81": 4
			}
		}
	]
}


/*------End of Json File------*/

function getProfession(p1){
	switch(p1){
		case 00:
		case "00":	return("Berserker Power PS");

		case 01:
		case "01":	return("Berserker Condition PS");
		case 02:
		case "02":	return("Berserker Condition DPS");

		case 10:
		case "10":	return("Dragonhunter Scepter + GS (Radiance)");
		case 11:
		case "11":	return("Dragonhunter Scepter + GS (Virtues)");
		case 12:
		case "12":	return("Dragonhunter Scepter (Honor)");
		case 13:
		case "13":  	return("Dragonhunter Hammer");

		case 20:
		case "20":	return("Herald Healer");
		case 21:
		case "21":	return("Herald Power");

		case 30:
		case "30":	return("ChronoTank");
		case 31:
		case "31":	return("ChronoDPS");
		case 32:
		case "32":	return("Mesmer Condition");

		case 40:
		case "40":	return("Tempest Fresh Air Dagger");
		case 41:
		case "41":	return("Tempest Traditional Staff");
		case 42:
		case "42":	return("Tempest Healer");

		case 50:
		case "50":	return("Reaper Condition");

		case 60:
		case "60":	return("Druid Healer (N)");
		case 61:
		case "61":	return("Druid Healer (M)");
		case 62:
		case "62":	return("Druid Condition");
		case 63:
		case "63":	return("Druid Berserker");
		case 64:
		case "64":	return("Ranger Condition");

		case 70:
		case "70":	return("Engineer Condition");
		case 71:
		case "71":	return("Engineer Power");

		case 80:
		case "80":	return("Daredevil Power Staff");
		case 81:
		case "81":	return("Daredevil Condition Dagger");

		case 90:
		case "90": return("Open DPS")
		case 91:
		case "91": return("Open Power DPS")
		case 92:
		case "92": return("Open Condi DPS")
		case 93:
		case "93": return("KC Orb Pusher")
		default: return("Stop making stuff up!");
	}
}

function getExperience(p2){
	switch(p2){
		case 0: return("Not Geared");
		case 1: return("Geared without Experience");
		case 2: return("Learning");
		case 3: return("Experienced");
		case 4: return("Mastered");
		default: return("Wrong Shit Yo!");
	}
}


/* ---Outputs each person, the builds and experience--- */
/*
for (z=0; z< rosterCount;z++){
	op +="<h1>" + gearExp.nameList[z].personName + "</h1>";
	for (y in gearExp.nameList[z].gearedBuilds){
		op += getProfession(y) + ": " + getExperience(gearExp.nameList[z].gearedBuilds[y]) + "<br/>";
	}
}
*/

/* ---Outputs each boss, various compositions per boss ---*/

for (z=0; z< bList.length; z++){
	temp="";
	op+= "<h1>" + bList[z].bossName + "</h1>";
	for(y=0; y<bList[z].totalBuilds;y++){
		temp = "build" + y;
		op+="<h2>" + "Build " + (y+1) + "</h2>";
		for(w=0; w<10; w++){
			op+= getProfession(bList[z].build[y][w]) + "<br/>";
		}
	}
}

document.getElementById("demo").innerHTML = op;
