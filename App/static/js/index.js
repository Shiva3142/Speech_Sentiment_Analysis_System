console.log("Audio Based Emotion Analysis");
const emotion_images = {
	anger: "https://play-lh.googleusercontent.com/G4PFUhWRDby0PDKCzNQU8H6uCngprpDGfz_LSDpKdCXVlAj5qM-Kq6TAvlgWemtbnlA",
	sad: "https://www.cambridge.org/elt/blog/wp-content/uploads/2019/07/Sad-Face-Emoji.png",
	fear: "https://i.pinimg.com/474x/cb/58/6e/cb586eff7d8927dcc89e475149877f1e.jpg",
	happy: "https://i.guim.co.uk/img/media/a1b7129c950433c9919f5670c92ef83aa1c682d9/55_344_1971_1183/master/1971.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=f28ed28c5f7ba517e826fbcbcbe09557",
	surprise:
		"https://media.istockphoto.com/id/840934838/vector/cute-surprised-emoticon-on-white-background.jpg?s=612x612&w=0&k=20&c=6Yny3NkIgML2h-dSFca33M3GRqKC4w7ALa-LkdxKjMg=",
	disgust:
		"https://www.pngitem.com/pimgs/m/103-1031488_disgusted-emoji-267-decal-sarcastic-emoji-hd-png.png",
};


function updateFileName(event) {
    console.log("file changed");
    let file=document.getElementById('file').files[0];
    let file_name=document.getElementById("file_name")
    if (!!file) {
        file_name.innerHTML=file.name;
    }else{
        file_name.innerHTML="Select Audio";
    }
    console.log(file);
}

async function SubmitTheFile(event) {
    event.preventDefault();
    const InputContainer=document.getElementById("InputContainer")
    const OutputContainer=document.getElementById("OutputContainer")
    const output=document.getElementById("output")
    const loader=document.getElementById("loader")
    let file = document.getElementById("file").files[0];
    if (!!file) {
        console.log(file);
        console.log(file.name);
        let extension = file.name.split(".")[file.name.split(".").length - 1];
        console.log(extension);
        if (
            extension.toLowerCase() == "wav" ||
            extension.toLowerCase() == "mp3"
        ) {
            console.log("extension accepted");
            if (file.size < 100000000) {
                try {
                    let formData = new FormData();
                    formData.append("file", file ? file : "");
                    let response = await fetch("/upload_file", {
                        method: "POST",
                        body: formData,
                    });
                    console.log(response);
                    let data = await response.json();
                    // console.log(data);
                    if (!!data.audio_path) {
                        console.log(data.audio_path);
                        loader.style.display='flex';
                        InputContainer.style.display='none'
                        OutputContainer.style.display='grid'
                        document.getElementById('audio').innerHTML=`
                        <audio controls >
                                <source id="audio2"
                                    src="${data.audio_path}"
                                    type="audio/wav"
                                />
                                Your browser does not support the audio element.
                                </audio>
                        `
                        try {
                            let outputResponse= await fetch('/get_audio_prediction',{
                                method:"POST"
                            });
                            console.log(outputResponse);
                            let result=await outputResponse.json();
                            console.log(result);
                            loader.style.display='none';
                            output.style.display='flex'
                            output.innerHTML=`
                            <img src="${emotion_images[result.emotion]}" alt="" >
                        <h2 >Predicted Emotion: <span style="color: royalblue;">${result.emotion}</span></h2>
                                            `
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        window.alert("some error occurred")
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                window.alert("more than 10 mb is mot allowed");
            }
        } else {
            window.alert("extension not allowed");
        }
    } else {
        window.alert("Please Select File First");
    }
}



