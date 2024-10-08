const addMenu = (event) => {
    event.preventDefault();
   
    const form = document.getElementById("add-menu")
    const formData = new FormData(form);
    const imageinput = document.getElementById("image").files[0];
    const categorySelect = document.getElementById("category");
    const categoryName = categorySelect.value;
    const token = localStorage.getItem("token");
    console.log(formData)
  
    const imageFormData = new FormData();
    imageFormData.append('image', imageinput);
    
    // First, upload the image to imgbb
    fetch("https://api.imgbb.com/1/upload?key=8d5311e77df04acf766601c0030c098b",
      { method:"POST",
        body: imageFormData
  
  })
     .then(response => response.json())
     .then(data =>{
      console.log(data)
  
      const imageUrl = data.data.url;
      formData.delete('image');
      formData.append("image", imageUrl);  
      formData.append("category", categoryName);  
    
  
      // Now send the image URL to backend
      fetch(`https://fooddelivery-lyart.vercel.app/food/food-items/${categoryName}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert("Menu item added successfully!");
          
          form.reset();
        })
        .catch((error) => {
          console.error("Error adding menu:", error);
       
        });
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    });
  
    
};