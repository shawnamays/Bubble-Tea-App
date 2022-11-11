



function completeMyOrder(_id){
  console.log(_id)
        fetch('/customerOrders', {
      
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
           '_id': _id
        
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          //reloading the page after every thumbs up
          window.location.reload(true)
        })
      }



      function deleteMyOrder (_id){
        console.log(_id)
              fetch('/customerOrders', {
            
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                 '_id': _id  
           
                })
              })
              .then(response => {
                if (response.ok) return response.json()
              })
              .then(data => {
                console.log(data)
                //reloading the page
                window.location.reload(true)
              })
            }









