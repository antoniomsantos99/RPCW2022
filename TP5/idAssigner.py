import json

with open("arq-son-EVO.json") as f:
    fich = json.load(f)


for index,value in enumerate(fich["musicas"]):
    print(value)
    value["id"] = index+1

with open("arq-son.json",'w',encoding="utf-8") as f:
    json.dump(fich,f)