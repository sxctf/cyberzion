document.getElementById("checkCapsuleForm").addEventListener("submit", function(e) {
    checkCapsule(this.getAttribute("method"), this.getAttribute("action"), new FormData(this));
    e.preventDefault();
  });

  window.contentType = 'application/xml';

  function payload(data) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<redservice>';
  
    for(var pair of data.entries()) {
        var key = pair[0];
        var value = pair[1];
  
        xml += '<' + key + '>' + value + '</' + key + '>';
    }
  
    xml += '</redservice>';
    return xml;
  }
  
var obj; 

  function checkCapsule(method, path, data) {
    const retry = (tries) => tries == 0
        ? null
        : fetch(
            path,
            {
                method,
                headers: { 'Content-Type': window.contentType },
                body: payload(data)
            }
          )
          .then(response => response.text())
          .then(data => {
            obj = data;
          })
          

          if (typeof obj !== undefined){
            const jsonItem = obj
            if (jsonItem){
              const data = JSON.parse(jsonItem)
              var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
              
              // insert Row
              console.log(tableRef)
              tableRef.insertRow().innerHTML = 
              "<td>" + data.Id + "</td>" + 
              "<td>" +data.Name+ "</td>"+
              "<td>" +data.Frequency+ "</td>"+
              "<td>" +data.SecretCode+ "</td>";
          

            }
          };
          
      
    retry(3);
  }