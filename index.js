import express from "express"; 
import axios from "axios"; 
import bodyParser from "body-parser"
import fs from "fs"; 
import fetch from "node-fetch"; 
import client from "https"; 
import download from "image-downloader";

const app = express(); 
const port = 3000; 

var key = "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"; 

const config = {
    headers: { Authorization: `Bearer ${key}` },
};

app.use(express.static("public")); 

app.use(bodyParser.urlencoded({extended:true})); 

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    next();
  });

app.listen(port, () => 
{
    console.log("listening on port 3000."); 
})

app.get("/", (req,res) => {
    res.render("index.ejs"); 
}); 

app.post("/res", async (req,res) => {
    const user_input = req.body.uinp; 
    const res_type = req.body.utype; 


    if(res_type == "text")
    {

        const request = {
         model: "gpt-3.5-turbo",
         messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: user_input}],
        }

        // const text_fn -> to set text filename 

        const response = await axios.post("https://api.openai.com/v1/chat/completions", request, config); 
        const message =  response.data.choices[0].message.content; 
        console.log(message); 
        fs.writeFile("public/text/response.txt", message, (err) => {
            if(err) throw err; 
            console.log("Response file saved."); 
        }); 
        res.render("index.ejs", {resp: message }); 

    }
    else 
    {
        // const img_fun -> to set img filename

        const request = {
            prompt: user_input,
            n: 1,
            size: "512x512",
        }

        const response = await axios.post("https://api.openai.com/v1/images/generations", request, config);
        const img_url = response.data.data[0].url;
          
        await downloadImage(img_url, `/Users/theluminousfirefly/Desktop/Passions/Coding_Projects/Web_Development/Back-End/Capstone Project 2/public/images/${user_input}.jpg`); 
        res.render("index.ejs", {imgurl: img_url, inp: user_input}); 
    }

}); 

async function downloadImage(url, filepath) {
    await download.image({
       url,
       dest: filepath 
    });
}













