import json
import os
import re

#Item separator porque os f-strings não suportam backslashes
nl = "\n\t\t"
pattern = r"\w+"

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
        if re.match(r"\w+",ator):
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
    <meta charset="UTF-8">
 </head>
 <body>
    <div id="container">
        <h1>{filme["title"]} ({filme["year"]})</h2>
       <div>
          <h2>Elenco</h2>
           <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="../atores/{ator.split(" ")[0]+(ator.split(" ")[-1] if ator.count(" ")>0 else "")}">{ator}</a></li>' for ator in filme["cast"] if re.match(pattern,ator)])}
          </ul>
       </div>
       <div>
        <h2>Categorias</h2>
        <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="../categorias/{categoria.replace(" ","")}">{categoria}</a></li>' for categoria in filme["genres"]])}
        </ul>
        <a href="../../">Voltar</a>
       </div>
    </div>
 </body>'''
        f.write(page)

#Criação da pagina ator
for key,value in atores.items():
    names=key.replace('"','').split(" ")
    with open(f'atores/{names[0]}{names[-1] if len(names)>1 else ""}.html',"w+",encoding="utf8") as f:
        page=f'''<head>
    <title>{key}</title>
    <link rel="stylesheet" type="text/css" href="../TP2.css">
    <meta charset="UTF-8">
    </head>
    <body>
    <div id="container">
        <h1>{key}</h2>
        <div>
            <h2>Cinematografia</h2>
            <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="../filmes/{indice}">{filmes[indice]["title"]}</a></li>' for indice in value])}
            </ul>
            <a href="../../">Voltar</a>
        </div>
    </div>
    </body>'''
        f.write(page)

#Criação da pagina categoria
for key,value in categorias.items():
    with open(f'categorias/{key.replace(" ","")}.html',"w+",encoding="utf8") as f:
        page=f'''<head>
    <title>{key}</title>
    <link rel="stylesheet" type="text/css" href="../TP2.css">
    <meta charset="UTF-8">
    </head>
    <body>
    <div id="container">
        <div>
            <h1>Filmes na categoria: {key}</h1>
            <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="../filmes/{indice}">{filmes[indice]["title"]}</a></li>' for indice in value])}
            </ul>
            <a href="../../">Voltar</a>
        </div>
    </body>'''
        f.write(page)

#Criação do Index.html
    with open("index.html","w+",encoding="utf8") as f:
        page=f'''<head>
    <title>TPC 2</title>
    <link rel="stylesheet" type="text/css" href="../TP2.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a id="inicio">TPC 2</a></h1>
    <div class="menu">
    <div id="left">
    <h2><a href=#categorias>Categorias</a></h2>
    </div>

        <div id="center">
    <h2><a href=#filmes>Filmes</a></h2>
    </div>

    <div id="right">
    <h2><a href=#atores>Atores</a></h2>
    </div>
    </div>
    <div id="container">
        <div>
            <h1><a id="filmes">Filmes</a></h1>
            <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="filmes/{indice}">{filmes[indice]["title"]}</a></li>' for indice in range(len(filmes))])}
            </ul>
            <a href="#inicio">Voltar</a>
        </div>

        <div>
            <h1><a id="atores">Atores</a></h1>
            <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="atores/{ator.split(" ")[0]+(ator.split(" ")[-1] if ator.count(" ")>0 else "")}">{ator}</a></li>' for ator in sorted(atores.keys()) if re.match(pattern,ator)])}
            </ul>
            <a href="#inicio">Voltar</a>
        </div>

        <div>
            <h1><a id="categorias">Categorias</a></h1>
            <ul class="lista">{"".join([f'{nl}<li class="textos"><a href="../categorias/{categoria.replace(" ","")}">{categoria}</a></li>' for categoria in sorted(categorias.keys())])}
            </ul>
            <a href="#inicio">Voltar</a>
        </div>

    </div>
    </body>'''
        f.write(page)