// Forest Pet Adopt 森林萌宠领养中心
// Scriptable 萌宠养成小游戏
let fm = FileManager.local()
let path = fm.joinPath(fm.documentsDirectory(), "forestPetSave.json")

let saveData
if(fm.fileExists(path)){
  saveData = JSON.parse(fm.readString(path))
}else{
  saveData = {
    adopted: false,
    petType: "",
    petName: "",
    hunger: 80,
    love: 50,
    lastTime: Date.now()
  }
}

// 饥饿度随时间下降
let gap = (Date.now() - saveData.lastTime) / 1000 / 60
saveData.hunger = Math.max(0, saveData.hunger - gap * 0.3)
saveData.lastTime = Date.now()

function save(){
  fm.writeString(path, JSON.stringify(saveData, null, 2))
}

let alert = new Alert()
alert.title = "🌲 森林萌宠领养中心"
if(!saveData.adopted){
  alert.message = "欢迎来到森林！选一只小动物领养吧"
  alert.addAction("🐰 小兔子")
  alert.addAction("🐱 小猫咪")
  alert.addAction("🐶 小狗")
  alert.addCancelAction("离开")
  let sel = await alert.present()
  if(sel === -1) return
  const types = ["rabbit","cat","dog"]
  saveData.petType = types[sel]
  let nameAlert = new Alert()
  nameAlert.title = "给你的宠物起名字"
  nameAlert.addTextField("名字")
  nameAlert.addAction("确定")
  await nameAlert.present()
  saveData.petName = nameAlert.textFieldValue(0) || "小可爱"
  saveData.adopted = true
  save()
}

while(true){
  const emoji = {rabbit:"🐰",cat:"🐱",dog:"🐶"}[saveData.petType]
  alert = new Alert()
  alert.title = `${emoji} ${saveData.petName}`
  alert.message = `饱食度：${Math.round(saveData.hunger)}%\n好感度：${Math.round(saveData.love)}%`
  alert.addAction("🥕 喂食 +15饱食")
  alert.addAction("✋ 抚摸 +10好感")
  alert.addAction("📝 修改名字")
  alert.addAction("🚪 退出游戏")
  let op = await alert.present()
  if(op === 0){
    saveData.hunger = Math.min(100, saveData.hunger + 15)
  }else if(op === 1){
    saveData.love = Math.min(100, saveData.love + 10)
  }else if(op === 2){
    let renameAlert = new Alert()
    renameAlert.title = "重新起名"
    renameAlert.addTextField("新名字", saveData.petName)
    renameAlert.addAction("确认")
    await renameAlert.present()
    saveData.petName = renameAlert.textFieldValue(0) || saveData.petName
  }else if(op === 3){
    save()
    break
  }
  save()
}
