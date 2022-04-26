var currentId = -1

$(function() {
    var i=1
    $.get('http://localhost:3050/paragrafos', function(data){
        data.forEach(function(data) {
            var editButton = $("<button>Edit</button>");
            editButton.click(function() {
                currentId = data._id;
                $("#Paragrafo").val(data.paragrafo);
                $("#modo").text(`Editing ${data._id}`);
            });

            var deleteButton = $("<button>Remove</button>");
            deleteButton.click(function() {
                $.ajax({
                    url: 'http://localhost:3050/paragrafos/remove/' + data._id,
                    type: 'DELETE',
                    success: function(response) {
                        alert("Elemento apagado")
                        location.reload()

            }});
        })
            
            $('Table').append("<tr>"+`<td>${data.data}</td>`+`<td>${data.paragrafo}`+`<td id=e${i}></td>`+`<td id=d${i}></td>`+"</tr>")
            editButton.appendTo("#e"+i)
            deleteButton.appendTo("#d"+i)
            i+=1
        })
    })

    $("form").submit(function(event) {
        event.preventDefault()
        if(currentId != -1) {
            $.ajax({
                url: 'http://localhost:3050/paragrafos/edit/' + currentId,
                type: 'PUT',
                data: $("form").serialize(),
                success: function(response) {
                    alert("Elemento editado")
                    currentId = -1
                    location.reload(false)
                    $("#Paragrafo").val("");
                    $("form p").text("Adicionar")
                }
            });
        }

        else {
            $.post('http://localhost:3050/paragrafos', $("form").serialize(), function(data) {
                alert("Elemento Inserido")
                location.reload(false)
            })
        }

        $("#Paragrafo").val("");
        $("form p").text("Adicionar")
    })

    $("#reset").click(function(event) {
        $("#Paragrafo").val("");
        currentId = -1;
        $("form p").text("Adicionar")
    })
})