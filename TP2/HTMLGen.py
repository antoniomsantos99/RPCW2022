import json
import os

#Item separator porque os f-strings não suportam backslashes
nl = "\n\t\t"

for pasta in ["filmes","atores","categorias"]:
    if not os.path.exists(pasta):
        os.makedirs(pasta)

with open("cinemaATP.json",'r',encoding="utf8") as f:
    filmes = json.load(f)

atores = {}
categorias = {}

for indice in range(len(filmes)):
    filme = filmes[indice]

    #Popular estruturas de dados auxiliares
    for ator in filme["cast"]:
        if ator not in atores:
            atores[ator] = [indice]
        else:
            atores[ator].append(indice)
    
    for categoria in filme["genres"]:
        if categoria not in categorias:
            categorias[categoria] = [indice]
        else:
             categorias[categoria].append(indice)
    
    #Criação da pagina filme
    with open(f"filmes/f{indice}.html",'w+',encoding="utf8") as f:
        page=f'''<head>
    <title>{filme["title"]}</title>
    <link rel="stylesheet" type="text/css" href="../TP2.css">
 </head>
 <body>
    <div id="container">
        <h1>{filme["title"]} ({filme["year"]})</h2>
       <div>
          <h2>Elenco</h2>
          <ul class="lista">{"".join([f'{nl}<li class="textos">{ator}</li>' for ator in filme["cast"]])}
          </ul>
       </div>
       <div>
        <h2>Categorias</h2>
        <ul class="lista">{"".join([f'{nl}<li class="textos">{categoria}</li>' for categoria in filme["genres"]])}
        </ul>
       </div>
 </body>'''
        f.write(page)

print(page)